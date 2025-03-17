/**
 * HOW TO TAG SWITCHLIVE EVENTS:
 * 
 * 1.  "Impression" events - configuring data attributes on HTML elements
 *  a.  Create a new switchlive_event.  Make note of the 'id'
 *  b.  Tag the HTML with attributes
 *      i.      data-switchlive=true                                // we track this element
 *      ii.     data-switchlive-impression=true                     // we track impressions of this element
 *      iii.    data-switchlive-impression-id-{{context}}={{id}}    // context can be SL, PL, LLP
 * 
 * 2.  "Action" events - configuring data attributes on HTML elements
 *  a. Create a new switchlive_event.  Make note of the 'id'
 *  b. Tag the HTML with attributes
 *      i.      data-switchlive=true                    // we track this element
 *      ii.     data-switchlive-mode={{auto/custom}}    // use auto handlers (vs a custom handler)
 *      iii.    data-switchlive-id-{{context}}={{id}}   // context can be SL, PL, LLP.  element can have events for more than 1 context
 * 
 * 3.  All Events can also use these metadata attributes:
 *      i.      data-switchlive-product-id
 *      ii.     data-switchlive-upc
 *      iii.    data-switchlive-style 
 *      v.      data-switchlive-company-id
 *      vi.     data-switchlive-store-id
 *      vii.    data-switchlive-store-stock-status
 *      viii.   data-switchlive-store-stock-count
 * 
 * 4.  Data attributes for elements that, when clicked, should cause impressions to be detected and emitted on demand
 *      i.      data-switchlive=true
 *      ii.     data-switchlive-capture-impressions=true
 * 
 * 5.  Data attributes for elements that, when scrolled, may reveal new impressions
 *      i.      data-switchlive=true
 *      ii.     data-switchlive-scroll-watch=true
 */

var lcly = window.lcly || {};

lcly.switchLiveDevModeOn = false;               // must be FALSE for prod
lcly.switchLiveImpressionMarkersOn = false;     // must be FALSE for prod 
lcly.switchLiveLoggingOn = false;               // must be FALSE for prod

lcly.switchLiveState = lcly.switchLiveState || {
    'productId' : window.lcly_switchlive_product_id || '',
    'upc' : window.lcly_switchlive_upc || '',
    'style' : window.lcly_switchlive_style || '',
    'companyId' : window.lcly_switchlive_company_id || '',
    'storeId' : window.lcly_switchlive_store_id || '',
    'storeStockStatus' : window.lcly_switchlive_store_stock_status || '',
    'storeStockCount' : window.lcly_switchlive_store_stock_count || '',
    'localeCode' : window.lcly_switchlive_locale_code || '',
    'utm' : window.lcly_switchlive_utm || '',
    'url' : '',
    'timestamp' : '',
    'dev' : {
        'initialized' : false,
        'context' :  window.lcly_switchlive_context || '',
        'currentEl' : ''
    }
};

/**
 * switchLiveLogger()
 * 
 * if enabled, creates a wrapper around console.log to output pretty SwitchLive messages to the console.
 */
lcly.switchLiveLoggerPrototype = function(){
    this.log = function(){};
};

lcly.switchLiveLogger = {};
lcly.switchLiveLogger.log = function(){};

lcly.initLogging = function(){
    function instanceId() {
        return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    if ( lcly.switchLiveLoggingOn ){
        lcly.switchLiveLoggerPrototype = function(){
            var prefix = "SwitchLive - " + instanceId() + ' - ' + window.lcly_switchlive_context + " - ";
            this.log = console.log.bind( window.console, prefix );
            return this;
        }    
    }
    lcly.switchLiveLogger = new lcly.switchLiveLoggerPrototype();
}

/**
 * initSwitchLive()
 * 
 * 
 * @param {*} parentElement 
 */
lcly.initSwitchLive = function( parentElement ){
    
    // make sure event library is available.  
    // if it's not, switchlive.js may be on a page where SwitchLive has not been initialized. 
    if ( typeof lcly_switchlive_events == 'undefined' ) {
        console.info("Locally SwitchLive - the events library is not available.");
        return;
    }

    if ( window.lcly_switchlive_context == undefined ){

        var newParentElement = lcly.initSwitchLiveParent( parentElement );
        lcly.initSwitchLiveMutationObserver( newParentElement );
        return;
    }

    /* initSwitchLive() function can be called at any time to re-trigger looking for first impressions */
    if ( lcly.switchLiveState.dev.initialized == true ){
        lcly.switchLiveLogger.log( "Already initialized.  Running first impressions handler." );
        var newParentElement = lcly.initSwitchLiveParent( parentElement );
        lcly.switchLiveFirstImpressionsHandler( newParentElement );

        if(newParentElement.tagName == 'DIV' && newParentElement.getAttribute('data-switchlive-intialized') == 'false'){
            newParentElement.setAttribute('data-switchlive-intialized', 'true');
        } else {
            return;
        }
    } 
    lcly.switchLiveState.dev.initialized = true;
    lcly.initLogging();
    lcly.switchLiveLogger.log( "Initializing." );   

    if ( typeof lcly_switchlive_enabled == 'undefined' || lcly_switchlive_enabled != '1' ){
        lcly.switchLiveLogger.log( "SwitchLive tracking not enabled for company_id " + lcly.switchLiveState.companyId + "." );      
    }
    else {
        var newParentElement = lcly.initSwitchLiveParent( parentElement );

        lcly.initSwitchLiveStateData();

        lcly.switchLiveLogger.log( "SwitchLive tracking enabled for company_id " + lcly.switchLiveState.companyId + "." );
        lcly.switchLiveLogger.log("Current context: " + lcly.switchLiveState.dev.context );
        lcly.switchLiveLogger.log("Current company_id: " + lcly.switchLiveState.companyId);

        lcly.switchLiveFirstImpressionsHandler( newParentElement );       

        lcly.initSwitchLiveImpressions( newParentElement );

        lcly.initSwitchLiveActions( newParentElement );

    }  
}
/* This init approach is needed because on the PL 
   where script tags are getting injected, sometimes this script is injected
   after DOMContentLoaded has already ran, and switchlive will never self-init */
var initAttemptIndex = 0;
var locallySwitchLiveInitTimer = setInterval(function(){

    initAttemptIndex++;
    //console.log("trying");
    if ( lcly.switchLiveState.dev.initialized == true || initAttemptIndex > 9 ){
        clearInterval(locallySwitchLiveInitTimer);
    }
    else {
        lcly.initSwitchLive();
    }

}, 1000);

/**
 * 
 * @param {*} parentElement 
 */

 // handle what users see: Impressions
lcly.initSwitchLiveImpressions = function( parentElement ){

    lcly.initSwitchLiveMutationObserver( parentElement );
    lcly.initSwitchLiveResizeObserver( parentElement );
    
    lcly.initSwitchLiveDocumentScrollListener( parentElement );
    lcly.initSwitchLiveScrollListener( parentElement );

    lcly.initImpressionClickHandlers( parentElement );
}

// handle events for what users do: Clicks, Submits, etc.
lcly.initSwitchLiveActions = function( parentElement ){    
    lcly.initGenericListeners( parentElement );
    // lcly.initCustomListeners();  // TODO not in use
}

/**
 * initSwitchLiveParent()
 * 
 * simple function to look at 'document' we are operating on.  if switchlive is running on a page
 * and in an iframe we will have different instances emitting events.
 * 
 * @param {} parentElement 
 */
lcly.initSwitchLiveParent = function( parentElement ){

    // parent element always defaults to the 'body' on the current document
    var switchLiveContainer = parentElement || document.querySelector('body');

    // Switch parentelement if it's new react PL modal
    try {

        if(document.querySelector('#lcly_shadow_root') != null 
        && typeof document.querySelector('#lcly_shadow_root').shadowRoot == 'object'
        && document.querySelector('#lcly_shadow_root').shadowRoot.querySelector('#lcly_pl_modal_parent') != null) 
        {
            switchLiveContainer = document.querySelector('#lcly_shadow_root').shadowRoot.querySelector('#lcly_pl_modal_parent');
        }
        
    } catch (error) { console.log('Unable to find PL Modal inside shadow root')}
    
    lcly.switchLiveLogger.log("My container is: ")
    lcly.switchLiveLogger.log(switchLiveContainer);

    return switchLiveContainer;
}

lcly.initSwitchLiveStateData = function( context ){
    //console.log( lcly_switchlive_context );
    // lcly_switchlive_context needs to be set by parent view before SwitchLive is initialized.  can be SL, PL, LLP     
    if ( typeof lcly_switchlive_context != 'undefined' ){
        lcly.switchLiveState.dev.context = lcly_switchlive_context; 
    }
    // optionally, override context by passing a variable in
    if ( typeof context != 'undefined' && context != null ){
        lcly.switchLiveState.dev.context = context;
    }

    // these values are set in BaseController as 'inline_js' assets on load
    if ( typeof lcly_switchlive_product_id != 'undefined' ){
        lcly.switchLiveState.productId = lcly_switchlive_product_id;
    }
    if ( typeof lcly_switchlive_upc != 'undefined' ){
        lcly.switchLiveState.upc = lcly_switchlive_upc;
    }
    if ( typeof lcly_switchlive_style != 'undefined' ){
        lcly.switchLiveState.style  = lcly_switchlive_style;
    }
    if ( typeof lcly_switchlive_in_stock != 'undefined' ){
        lcly.switchLiveState.inStock = lcly_switchlive_in_stock;
    }
    if ( typeof lcly_switchlive_company_id != 'undefined' ){
        lcly.switchLiveState.companyId = lcly_switchlive_company_id;
    }
    if ( typeof lcly_switchlive_store_id != 'undefined' ){
        lcly.switchLiveState.storeId = lcly_switchlive_store_id;
    }
    if ( typeof lcly_switchlive_store_stock_status != 'undefined' ){
        lcly.switchLiveState.storeStockStatus = lcly_switchlive_store_stock_status;
    }
    if ( typeof lcly_switchlive_store_stock_count != 'undefined' ){
        lcly.switchLiveState.storeStockCount = lcly_switchlive_store_stock_count;
    }
    if ( typeof lcly_switchlive_locale_code != 'undefined' ){
        lcly.switchLiveState.localeCode = lcly_switchlive_locale_code;
    }

    lcly.switchLiveLogger.log( lcly.switchLiveState );
    
}

/**
 * 
 * can be used either during first impression or human ux such as a click
 */
lcly.updateSwitchLiveStateFromUIElement = function( thisElement ){

    /*
    lcly.switchLiveState = {
        'productId' : '',
        'upc' : '',
        'style' : '',
        'inStock' : '',
        'companyId' : '',
        'storeId' : '',
        'storeStockStatus' : '',
        'storeStockCount' : '',
        'url' : '',
        'timestamp' : '',
        'dev' : {
            'currentEl' : ''
        }
    };
    */

    if (typeof thisElement.getAttribute('data-switchlive-product-id') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-product-id') != null ){
        lcly.switchLiveState.productId = thisElement.getAttribute('data-switchlive-product-id');
    }
    else {
        lcly.switchLiveState.productId = "";
    }
    
    if (typeof thisElement.getAttribute('data-switchlive-upc') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-upc') != null ){
        lcly.switchLiveState.upc = thisElement.getAttribute('data-switchlive-upc');
    }
    else {
        lcly.switchLiveState.upc = "";
    }
    
    if (typeof thisElement.getAttribute('data-switchlive-style') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-style') != null ){
        lcly.switchLiveState.style = thisElement.getAttribute('data-switchlive-style');
    }
    else {
        lcly.switchLiveState.style = "";
    }
    if (typeof thisElement.getAttribute('data-switchlive-store-id') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-store-id') != null ){
        lcly.switchLiveState.storeId = thisElement.getAttribute('data-switchlive-store-id');
    }
    else {
        lcly.switchLiveState.storeId = "";
    }
    
    if (typeof thisElement.getAttribute('data-switchlive-store-stock-count') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-store-stock-count') != null ){
        lcly.switchLiveState.storeStockCount = thisElement.getAttribute('data-switchlive-store-stock-count');
    }
    else {
        lcly.switchLiveState.storeStockCount = "";
    }
    
    if (typeof thisElement.getAttribute('data-switchlive-store-stock-status') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-store-stock-status') != null ){
        lcly.switchLiveState.storeStockStatus = thisElement.getAttribute('data-switchlive-store-stock-status');
    }else {
        lcly.switchLiveState.storeStockStatus = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-sale-type') != 'undefined' && 
        thisElement.getAttribute('data-switchlive-sale-type') != null ){
        lcly.switchLiveState.saleType = thisElement.getAttribute('data-switchlive-sale-type');
    }
    else {
        lcly.switchLiveState.saleType = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-cart-hash') != 'undefined' && 
            thisElement.getAttribute('data-switchlive-cart-hash') != null ){
        lcly.switchLiveState.cartHash = thisElement.getAttribute('data-switchlive-cart-hash');
    }else {
        lcly.switchLiveState.cartHash = "";
    }
    
    if (typeof thisElement.getAttribute('data-switchlive-product-price') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-product-price') != null ){
        lcly.switchLiveState.productPrice = thisElement.getAttribute('data-switchlive-product-price');
    }else {
        lcly.switchLiveState.productPrice = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-vendor-id') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-vendor-id') != null ){
        lcly.switchLiveState.vendorId = thisElement.getAttribute('data-switchlive-vendor-id');
    }else {
        lcly.switchLiveState.vendorId = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-store-name') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-store-name') != null ){
        lcly.switchLiveState.storeName = thisElement.getAttribute('data-switchlive-store-name');
    }else {
        lcly.switchLiveState.storeName = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-store-address') != 'undefined' && 
               thisElement.getAttribute('data-switchlive-store-address') != null ){
        lcly.switchLiveState.storeAddress = thisElement.getAttribute('data-switchlive-store-address');
    }else {
        lcly.switchLiveState.storeAddress = "";
    }

    if (typeof thisElement.getAttribute('data-switchlive-affiliate-name') != 'undefined' && 
                thisElement.getAttribute('data-switchlive-affiliate-name') != null ){
        lcly.switchLiveState.affiliateName = thisElement.getAttribute('data-switchlive-affiliate-name');
    }else {
        lcly.switchLiveState.affiliateName = "";
    }

    lcly.switchLiveState.dev.currentEl = thisElement.outerHTML;

    lcly.switchLiveLogger.log( "Updating switchLiveState from DOM element." );
    lcly.switchLiveLogger.log( lcly.switchLiveState );
}

/**
 * 
 * find things with these data attributes, and fire an 'impression' event. 
 * other UI elements don't generate SwitchLive events until they are interacted with.
 * these elements generate an event just by existing.  examples include store links, 
 * product thumbs, etc 
 */
lcly.switchLiveFirstImpressionsHandler = function( parentElement ){

    lcly.switchLiveLogger.log( "Handling first impressions." );

    var impressionEls = parentElement.querySelectorAll('[data-switchlive-impression]');
    var impressionElsArray = Array.prototype.slice.call(impressionEls);   
   
    if ( parentElement.getAttribute('data-switchlive-impression') ){
        impressionElsArray.push( parentElement );
    }

    lcly.switchLiveLogger.log( impressionElsArray.length + " impression elements were found.  Checking them for context and visibility." );
    lcly.switchLiveLogger.log( impressionElsArray );

    impressionElsArray.forEach(function(impressionEl){

        var isVisible = fnIsVisible(impressionEl),
            isInViewport = fnIsInViewport(impressionEl),
            impressionMadeAttrString = "data-switchlive-made-impression",
            alreadyMadeImpression = impressionEl.getAttribute( impressionMadeAttrString );

        //console.info( impressionEl );
        //console.info( "isVisible: " + isVisible );
        //console.info( "isInViewport: " + isInViewport );
        //console.info( alreadyMadeImpression );

        if ( typeof alreadyMadeImpression != "undefined" && alreadyMadeImpression != null && alreadyMadeImpression == 'true' ){
            // TODO with current approach an element may make an impression strictly ONCE so do not reset the 'impression made' attribute
            // impressionEl.removeAttribute( impressionMadeAttrString );
            lcly.switchLiveLogger.log( "Visible impression element found, but it already made an impression.  Not emitting impression event.");
            return;
        }
        
        if ( impressionEl != parentElement && !( isVisible && isInViewport ) ){
            // TODO with current approach an element may make an impression strictly ONCE so do not reset the 'impression made' attribute
            // impressionEl.removeAttribute( impressionMadeAttrString );
            lcly.switchLiveLogger.log( "Invisible impression element found.  Not emitting impression event." );
            return;
        }

        impressionEl.setAttribute( impressionMadeAttrString, 'true' );

        if ( lcly.switchLiveImpressionMarkersOn == true ){            
            impressionEl.style.border = "1px solid #eb5429";
        }

        var currentContext = lcly.switchLiveState.dev.context,
            impressionEventId = 'none';
        
        if ( currentContext == 'PL' ){
            impressionEventId = impressionEl.getAttribute('data-switchlive-impression-id-PL');            
        }
        else if ( currentContext == 'SL' ){
            impressionEventId = impressionEl.getAttribute('data-switchlive-impression-id-SL'); 
        }
        else if ( currentContext == 'LLP' ){
            impressionEventId = impressionEl.getAttribute('data-switchlive-impression-id-LLP'); 
        }
        
        if ( typeof impressionEventId != 'undefined' && impressionEventId != null && impressionEventId != 'none' ){

            lcly.switchLiveLogger.log( "Found visible element with impression event id: " + impressionEventId + "."); 

            lcly.updateSwitchLiveStateFromUIElement( impressionEl );
            lcly.assembleAndEmitSwitchLiveEvent( impressionEventId );

        }
        else {
            lcly.switchLiveLogger.log( "Impression error: impression event id must be defined for context: " + currentContext + ".");
        }

    });
    
}

/**
 * the intention of this function is to relook for new impressions on scroll.
 * impressions are only emitted for 'visible' and 'in viewport' elements so the idea is that if
 * the DOM changes we might need to emit impressions for elements that were not 'visible' or 'in viewport'
 * before but are now.
 * 
 * @param {} parentElement 
 */
lcly.initSwitchLiveDocumentScrollListener = function( parentElement ){
    document.removeEventListener("scroll", switchLiveImpressionCheck);
    document.addEventListener("scroll", switchLiveImpressionCheck, {passive: true});

    function switchLiveImpressionCheck(e){        
        lcly.runOnDOMChange( parentElement );        
    }
}
lcly.initSwitchLiveScrollListener = function( parentElement ){

    lcly.switchLiveLogger.log("Initializing Impression Listeners.");
    
    // grab elements as array, rather than as NodeList
    var elements = document.querySelectorAll("[data-switchlive-scroll-watch]");

    if (elements == null || elements.length == 0){
        return;
    }

    elements = Array.prototype.slice.call(elements);

    // and then make each element do something on scroll
    elements.forEach(function(element) {
        if (element.getAttribute('data-switchlive-scroll-listener') == null){
            element.setAttribute('data-switchlive-scroll-listener', 'true');
            element.removeEventListener("scroll", switchLiveImpressionCheck );
            element.addEventListener("scroll", switchLiveImpressionCheck, {passive: true});
        }
        else {
            return;
        }              
    });
    function switchLiveImpressionCheck(e){
        lcly.runOnDOMChange( parentElement );        
    }
}

lcly.switchLiveDebouncer; 

/**
 * initSwitchLiveMutationObserver()
 * 
 * if new stuff gets inserted into the DOM, re-init (or at least look for any new impressions!)
 * 
 * @param {*} parentElement 
 */
lcly.initSwitchLiveMutationObserver = function( parentElement ){

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if ( mutation.type === 'childList' ){
                var newDOMElements = 'true';
                lcly.runOnDOMChange( parentElement, newDOMElements );
            }
        });
    });
    
    var config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };
    
    observer.observe( parentElement, config );
}

lcly.initSwitchLiveResizeObserver = function( parentElement ){

    var observer = new ResizeObserver( entries => {               
        lcly.runOnDOMChange( parentElement );
    });     
    
    observer.observe( parentElement );
}

/**
 * runOnDOMChange()
 * 
 * this function can be called to re-init switchlive on a DOM change, 
 * such as a resize, mutation (e.g. inserting new childNodes) or a scroll.
 * to keep this from running non-stop and eating resources, it's set up to 'debounce'
 * 
 * @param {*} parentElement 
 * @param {*} newDOMElements
 */
lcly.switchLiveDebouncer;
lcly.runOnDOMChange = function( parentElement, newDOMElements ){
    if ( lcly.switchLiveDebouncer == 'true' ){
        return;
    }

    lcly.switchLiveDebouncer = true;
    lcly.initSwitchLive( parentElement );

    setTimeout(function(){
        lcly.switchLiveDebouncer = false;            
    }, 200);
    setTimeout(function(){
        // run one more time so we always get the last elements that became visible when scrolling or resizing ended
        lcly.initSwitchLive( parentElement );

        // if new DOM nodes were inserted, re-init scroll listeners.  we don't want to do this if we only have a resize 
        if (typeof newDOMElements != 'undefined' && newDOMElements != 'null' && newDOMElements == 'true'){
            lcly.initSwitchLiveScrollListener( parentElement );
        }
    }, 1000); 
}


/**
 * if a click occurs on something with attribute 'data-switchlive-capture-impressions',
 * send impression events again using switchLiveFirstImpressionsHandler();
 */
lcly.initImpressionClickHandlers = function( parentElement ){

    
    parentElement.removeEventListener('click', switchLiveImpressionClickHandler);
    parentElement.addEventListener('click', switchLiveImpressionClickHandler);
    
    function switchLiveImpressionClickHandler(e){       

        var thisEl = e.target,
            thisElTagged = thisEl.getAttribute('data-switchlive-capture-impressions');

        // if thisElTagged is not true, traverse up DOM to find closest el with data-switchlive-capture-impressions=true
        // if there is not one, closestTaggedAncestor will be null and we will stop doing work.
        if ( typeof thisElTagged == 'undefined' || thisElTagged == null ){
            
            var closestTaggedAncestor = lcly.findTaggedAncestor(thisEl, 'data-switchlive-capture-impressions', 'true');
            
            if ( typeof closestTaggedAncestor == 'undefined' || closestTaggedAncestor == null ){
                return;  // exit here if an event occured and we can't find any reference to data-switchlive in the event ancestry
            }            
        }        

        lcly.switchLiveLogger.log( "Impression click handler executing. Re-detecting impressions.");

        // hacky, but sometimes we need to wait for things to happen like drawers sliding open
        setTimeout(function(){
            lcly.switchLiveFirstImpressionsHandler( parentElement );
        }, 400);
    }
}

/** Generic Event Listeners
 * 
 * these listeners are generically bound to listen fo
 * events on elements with the [data-switchlive] attribute
 */ 
lcly.initGenericListeners = function( parentElement ) {

    lcly.switchLiveLogger.log( "Initializing generic event listeners."); 


    parentElement.removeEventListener('click', switchLiveEventHandler);
    parentElement.addEventListener('click', switchLiveEventHandler);

    parentElement.removeEventListener('submit', switchLiveEventHandler);
    parentElement.addEventListener('submit', switchLiveEventHandler);

    parentElement.removeEventListener('dragend', switchLiveEventHandler);
    parentElement.addEventListener('dragend', switchLiveEventHandler);

    parentElement.removeEventListener('change', switchLiveEventHandler);
    parentElement.addEventListener('change', switchLiveEventHandler);

    function switchLiveEventHandler(e){  
                
        var thisEl = e.target,
            thisElTagged = thisEl.getAttribute('data-switchlive'),
            taggedEl = thisEl;

        // if thisElTagged is not true, traverse up DOM to find closest el with data-switchlive and data-switchlive-mode=auto
        // if there is not one, closestTaggedAncestor will be null and we will stop doing work.
        if ( typeof thisElTagged == 'undefined' || thisElTagged == null ){
            
            var closestTaggedAncestor = lcly.findTaggedAncestor(thisEl, 'data-switchlive-mode', 'auto');
            
            if ( typeof closestTaggedAncestor == 'undefined' || closestTaggedAncestor == null ){
                return;  // exit here if an event occured and we can't find any reference to data-switchlive in the event ancestry
            }

            taggedEl = closestTaggedAncestor; 

        }

        // get event mode, confirm it's defined and set to 'auto'. 
        var thisEventMode = taggedEl.getAttribute('data-switchlive-mode');  // should always be 'auto' here
        
        if ( typeof thisEventMode == 'undefined' || thisEventMode == null || thisEventMode != 'auto' ){            
            return;
        }

        // have confirmed we have an element with event attributes tagged and set to 'auto'.
        // get eventId for the current context and emit a switchlive event
        var currentContext = lcly.switchLiveState.dev.context,
            autoEventId = 'none';

        if (currentContext == 'PL'){
            autoEventId = taggedEl.getAttribute('data-switchlive-id-PL'); 
        }
        else if (currentContext == 'SL'){
            autoEventId = taggedEl.getAttribute('data-switchlive-id-SL'); 
        }
        else if (currentContext == 'LLP'){
            autoEventId = taggedEl.getAttribute('data-switchlive-id-LLP'); 
        }

        if ( typeof autoEventId != 'undefined' && autoEventId != null && autoEventId != 'none' ){
            if (e.type == 'click'){
                //console.log("CLICKED");  //TODO do I even care what event type it is? 
            }

            lcly.switchLiveLogger.log( "-------------------------------------------------");
            lcly.switchLiveLogger.log( "Automatically-detected event occured with id: " + autoEventId + "." ); 
            lcly.updateSwitchLiveStateFromUIElement( taggedEl );
            lcly.assembleAndEmitSwitchLiveEvent( autoEventId );

        }
        else {
            lcly.switchLiveLogger.log( "Generic Listener Error: event id must be defined for context " + currentContext + ".");             
        }
    }
}

lcly.findTaggedAncestor = function(el, targetAttr, targetAttrVal){
    while ((el = el.parentElement) && ( el.getAttribute('data-switchlive') != 'true' || el.getAttribute(targetAttr) != targetAttrVal ));
    return el;
}

/** Custom Event Listeners
 * 
 * as needed, custom handlers may be written to emit switchlive events for browser events or user interactions
 * that are not captured by generic [data-switchlive] listeners
 * 
 */
lcly.initCustomListeners = function( parentElement ){

} 

/** Event Payload Assembler
 * 
 * shared payload assembler and event emitter.  Looks up event by eventScope and eventIndex
 * and ultimately emits an event which triggers Brand's custom callback function to be called. 
 */
lcly.assembleAndEmitSwitchLiveEvent = function( eventId ){
    //console.info("eventId: " + eventId);
    var switchLiveEventFromLookup = lcly.lookupSwitchLiveEvent( eventId );

    if ( typeof switchLiveEventFromLookup == 'undefined' ){
        lcly.switchLiveLogger.log( "Event id " + eventId + " not found.  Not emitting event.");         
        return;
    }

    // get timestamp and url at time of event.
    // all other info compiled onto the event is carried in the lcly.switchLiveState object

    var timestamp = Date.now(),            
        url = window.location.href;  // NOTE this is the full URL including all parameters

    /* Assemble standard switchLiveEvent for use by third-parties 
    
        // JS state object that is created to carry around data about current event
        lcly.switchLiveState = lcly.switchLiveState || {
            'productId' : window.lcly_switchlive_product_id || '',
            'upc' : window.lcly_switchlive_upc || '',
            'style' : window.lcly_switchlive_style || '',
            'companyId' : window.lcly_switchlive_company_id || '',
            'storeId' : window.lcly_switchlive_store_id || '',
            'storeStockStatus' : window.lcly_switchlive_store_stock_status || '',
            'storeStockCount' : window.lcly_switchlive_store_stock_count || '',
            'localeCode' : window.lcly_switchlive_locale_code || '',
            'url' : '',
            'timestamp' : '',
            'dev' : {
                'initialized' : false,
                'currentEl' : outerHtml,
                'context' :  window.lcly_switchlive_context || '',
            }
        };

        // prototype of final switchLiveEvent that needs emitted.  
        // this should reflect what is in the documentation!  
        // if you add any properties, update the documentation!
        var switchLiveEvent = {
            'id'  : eventId,            
            'scope' : eventScope,
            'type'  : eventType,                        
            'description' : eventDescr,
            'timestamp' : timestamp,
            'url'   : url,            
            'product_id' : productId,
            'style' : style,
            'upc'   : upc,            
            'store_id' : storeId,
            'store_stock_status' : storeStockStatus,
            'store_stock_count' : storeStockCount,
            'company_id' : companyId,
            'locale_code' : localeCode,
            'dev' : {
                'current_context' : currentContext,
                'current_el' : currentEl  // this is outerHTML string of current element
            }
        };        
    
    */
    var switchLiveEvent = { ...switchLiveEventFromLookup };
    switchLiveEvent.message_type = "switchlive";  // used in postMessage() listener logic
    
    // collected in real-time
    switchLiveEvent.timestamp = timestamp;
    switchLiveEvent.url = url;

    // managed on the lcly.switchLiveState object as user interactions occur
    if(lcly.switchLiveState.productId !== "") switchLiveEvent.product_id                = lcly.switchLiveState.productId;
    if(lcly.switchLiveState.style !== "") switchLiveEvent.style                         = lcly.switchLiveState.style;
    if(lcly.switchLiveState.upc !== "") switchLiveEvent.upc                             = lcly.switchLiveState.upc;
    if(lcly.switchLiveState.storeId !== "") switchLiveEvent.store_id                    = lcly.switchLiveState.storeId;
    if(lcly.switchLiveState.storeStockStatus !== "") switchLiveEvent.store_stock_status = lcly.switchLiveState.storeStockStatus;
    if(lcly.switchLiveState.storeStockCount !== "") switchLiveEvent.store_stock_count   = lcly.switchLiveState.storeStockCount;
    if(lcly.switchLiveState.companyId !== "") switchLiveEvent.company_id                = lcly.switchLiveState.companyId;
    if(lcly.switchLiveState.localeCode !== "") switchLiveEvent.locale_code              = lcly.switchLiveState.localeCode;
    if(lcly.switchLiveState.saleType !== "") switchLiveEvent.sale_type                  = lcly.switchLiveState.saleType;
    if(lcly.switchLiveState.cartHash !== "") switchLiveEvent.cart_hash                  = lcly.switchLiveState.cartHash;
    if(lcly.switchLiveState.productPrice !== "") switchLiveEvent.product_price          = lcly.switchLiveState.productPrice;
    if(lcly.switchLiveState.vendorId !== "") switchLiveEvent.vendor_id                  = lcly.switchLiveState.vendorId;
    if(lcly.switchLiveState.storeName !== "") switchLiveEvent.store_name                = lcly.switchLiveState.storeName;
    if(lcly.switchLiveState.storeAddress !== "") switchLiveEvent.store_address          = lcly.switchLiveState.storeAddress;
    if(lcly.switchLiveState.affiliateName !== "") switchLiveEvent.affiliate_name        = lcly.switchLiveState.affiliateName;

    if(window.lcly_switchlive_utm !== '' || window.lcly_react_switchlive_utm !== ''){
        switchLiveEvent.utm  = window.lcly_switchlive_utm ?? window.lcly_react_switchlive_utm;
    }

    // if dev mode, add dev object to message
    if ( lcly.switchLiveDevModeOn == true ){
        switchLiveEvent.dev = {};
        switchLiveEvent.dev.current_context = lcly.switchLiveState.dev.context;

        if ( switchLiveEvent.dev.current_context != switchLiveEvent.scope ){
            lcly.switchLiveLogger.log('Event "scope" and SwitchLive "context" do not match!');
        }

        switchLiveEvent.dev.current_el = lcly.switchLiveState.dev.currentEl;
    }
    

    // pass fully assembled Event to third-party code, if a switchLiveCallback is defined
    lcly.switchLiveLogger.log( "Emitting fully-assembed event with id " + eventId + "." );
    lcly.triggerExternalEventCallback( switchLiveEvent );                
}

/**
 * triggerExternalEventCallback()
 * 
 * utilizes postMessage to emit events detected in iframe context up to parent window.
 * 
 * @param {} switchLiveEvent 
 */
lcly.triggerExternalEventCallback = function( switchLiveEvent ){               
    try{                    
        lcly.switchLiveLogger.log( "Using postMessage to share event with parent." );
        lcly.switchLiveLogger.log( "-------------------------------------------------");
        window.parent.postMessage( switchLiveEvent, "*" );        
    }
    catch(e){
        //console.log(e);  //TODO - any error handling? 
    }        
}

/** Event looker-upper
 * 
 * uses eventIndex to find the correct event in JS object in /switchlive/switchlive-events.js
 * /switchlive/switchlive-events.js is auto-generated by looping over the 'switchlive_events' table.
 */
lcly.lookupSwitchLiveEvent = function( eventId ){
    
    if ( typeof lcly_switchlive_events == 'undefined' ) {
        lcly.switchLiveLogger.log("Error finding events dictionary. Make sure that /switchlive/switchlive-events.js is loading.");
        return;
    }
    if ( typeof lcly_switchlive_events['event_' + parseInt(eventId)] == 'undefined' ){
        lcly.switchLiveLogger.log("Error finding event id " + eventId + " in events dictionary.  Did you put the correct id in your HTML?");
    }

    return lcly_switchlive_events['event_' + parseInt(eventId)]; 
}    

/* adapted from: https://stackoverflow.com/a/26039199 */
function isElementPartiallyInViewport(el)
{
    // Special bonus for those using jQuery
    if (typeof jQuery !== 'undefined' && el instanceof jQuery) 
        el = el[0];

    var rect = el.getBoundingClientRect();
    // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    var vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}

// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport (el)
{
    // Special bonus for those using jQuery
    if (typeof jQuery !== 'undefined' && el instanceof jQuery) 
        el = el[0];

    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    return (
           (rect.left >= 0)
        && (rect.top >= 0)
        && ((rect.left + rect.width) <= windowWidth)
        && ((rect.top + rect.height) <= windowHeight)
    );
}

function fnIsInViewport(ele)
{
    var inVpFull = isElementInViewport(ele);
    var inVpPartial = isElementPartiallyInViewport(ele);    
   
    // returns 'true' if ele is fully in viewport.  
    return inVpFull;
}

// isVisible borrowed from how jQuery does it.  this allegedly returns false if 
// element is hidden by CSS or display:none 
function fnIsVisible(e) {
    return !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );
}

// emit custom switchlive order placed event for each cart item
function emitOrderPlaceSwitchliveEvent(cartItems){
    try {

        cartItems.each(function(i, obj){
    
        id                                = $(obj).data('switchlive-id-' + (window.lcly_switchlive_context).toLowerCase() );
        lcly.switchLiveState.storeId      = "" + $(obj).data('switchlive-store-id');
        lcly.switchLiveState.storeName    = "" + $(obj).data('switchlive-store-name');
        lcly.switchLiveState.storeAddress = "" + $(obj).data('switchlive-store-address');
        lcly.switchLiveState.vendorId     = "" + $(obj).data('switchlive-vendor-id');
        lcly.switchLiveState.cartHash     = "" + $(obj).data('switchlive-cart-hash');
        lcly.switchLiveState.upc          = "" + $(obj).data('switchlive-upc');
        lcly.switchLiveState.saleType     = "" + $(obj).data('switchlive-sale-type');
        lcly.switchLiveState.productPrice = "" + $(obj).data('switchlive-product-price');

        lcly.assembleAndEmitSwitchLiveEvent(id);

    });
    
    } catch (error) {
    console.log('Unable to emit order placed switchlive event');
    }
}