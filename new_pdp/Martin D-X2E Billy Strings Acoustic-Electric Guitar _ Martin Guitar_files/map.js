var lcly_query_string_0            = 'company_name=Martin+Guitar&button_text=Find+it+Locally&button_id=HTML&company_id=224063&category=dealer&css=4&always_hide_button=1&upc=729789689250&show_location_switcher=1&show_location_prompt=1&lang=en-us&show_dealers=1&n_dealers=3&show_address=1&show_phone=1&link_opens_modal=1&product_id=2147535&zoom=9&dealers_company_id=224063';
var lcly_orig_query_string_0       = 'company_name=Martin+Guitar&button_text=Find+it+Locally&button_id=HTML&company_id=224063&category=dealer&css=4&always_hide_button=1&upc=729789689250&show_location_switcher=1&show_location_prompt=1&lang=en-us&show_dealers=1&n_dealers=3&show_address=1&show_phone=1&link_opens_modal=1&product_id=2147535&zoom=9&dealers_company_id=224063';
var lcly_orig_query_string_obj_0   = {"company_name":"Martin Guitar","button_text":"Find it Locally","button_id":"HTML","company_id":"224063","category":"dealer","css":"4","always_hide_button":"1","upc":"729789689250","show_location_switcher":"1","show_location_prompt":"1","lang":"en-us","show_dealers":"1","n_dealers":"3","show_address":"1","show_phone":"1","link_opens_modal":"1","product_id":"2147535","zoom":"9","dealers_company_id":"224063"};
var lcly_parent_0                  = document.getElementById('lcly-button-0');
var lcly_link_0                    = document.getElementById('lcly-link-0');
var lcly_button_0                  = document.createElement('a');
var lcly_location_switcher_input_0 = null;
var lcly_orig_endpoint_0 	 	   = 'https://www.locally.com/start_conversion?action=convert';
var lcly_orig_modal_title_0        = '';
var lcly_toggle_state_0			   = 'open';
var lcly_launch_pl_v3                      = true;
var lcly_pl_v3_recover_cart                = lcly_launch_pl_v3 && window.location.search.indexOf('__lcly_sc=1') > -1;
var lcly_query_has_product_0       = lcly_orig_query_string_0.indexOf('product_id=') > -1;    
window.__lcly_user_lang					   = `en-us`; 
window.__lcly_headless_pl_strict_upc   = 0 || (window.location.search.indexOf('__lcly_headless_pl_strict_upc=1') > -1 ? 1 : 0);
var lcly_prompt_browser_based_location     = true;
var lcly_is_reload_0               = false;   


if (lcly_launch_pl_v3 && (typeof lcly_pl_retry_count_0 === 'undefined')) {
	var lcly_pl_retry_count_0 = 0;

	// Initially hide the element
	lcly_parent_0.style.display = 'none';

	// Create a loading message element
	var loadingMessageElement_0 = document.createElement('div');
	loadingMessageElement_0.textContent = 'Loading...';
	lcly_parent_0.parentNode.insertBefore(loadingMessageElement_0, lcly_parent_0.nextSibling);

	// Look for the existence of window.lclyInlineModalGlobal, retry every second up to 60 seconds and then give up
	var lcly_pl_interval_0 = setInterval(function () {
		lcly_pl_retry_count_0++;

		if (window.lclyInlineModalGlobal || lcly_pl_retry_count_0 >= 60) {
			clearInterval(lcly_pl_interval_0);

			if (window.lclyInlineModalGlobal) {
				// Remove the loading message element
				lcly_parent_0.parentNode.removeChild(loadingMessageElement_0);
				
				// If available, show the element
				lcly_parent_0.style.display = 'block';

				// If there are queued requests once LCLY is loaded, use the last one and reset the queue.
				if (window.lcly_prem_click_queue_0 && window.lcly_prem_click_queue_0.length > 0 && lcly_reload_0 !== 'undefined') {
					lcly_reload_0(lcly_prem_click_queue_0.pop());
					window.lcly_prem_click_queue_0 = [];
				}
			} else {
				loadingMessageElement_0.textContent = 'Local results not available.';
			}
		}
	}, 1000);
} else if (lcly_parent_0.getAttribute("style") && lcly_parent_0.style.display === 'none') {
	lcly_parent_0.style.display = 'block';
}


var lcly_button_0_className = 'lcly-primary-trigger lcly-with-dealers lcly-w-3-dealers ';
lcly_button_0.className = lcly_button_0_className;
lcly_button_0.setAttribute('title', 'Buy it Locally');
lcly_button_0.setAttribute('data-switchlive', 'true');
lcly_button_0.setAttribute('data-switchlive-mode', 'auto');
lcly_button_0.setAttribute('data-switchlive-id-PL', '6');
lcly_button_0.setAttribute('id', 'lcly-button-buy');
lcly_button_0.setAttribute('tabindex', '0');
lcly_button_0.setAttribute('role', 'button');

lcly_link_0.className 			   = 'lcly-anchor lcly-toggleable-0';
var city_placeholder						= '';

lcly_parent_0.setAttribute('tabindex', '0');
lcly_parent_0.classList.add('lcly-pl-widget-parent');

lcly_parent_0.addEventListener("keydown", function(e) {
	const keyD = e.key !== undefined ? e.key : e.keyCode;
	if (keyD === "Enter" || keyD === 13) {
		e.preventDefault();
		if(document.getElementById('lcly-button-buy') && e.target.id === 'lcly-button-buy'){
			document.getElementById('lcly-button-buy').click();
		}
	}
}); 



function dedup_lcly_child_0 (class_selector) {
	if (lcly_is_reload_0 && typeof lcly_reload_0 !== 'undefined') {
		var lcly_children = lcly_parent_0.getElementsByClassName(class_selector);
		if (lcly_children.length > 0) {
			for (var i = 0; i < lcly_children.length; i++) {
				lcly_parent_0.removeChild(lcly_children[i]);
			}
		}
	}
}

dedup_lcly_child_0(lcly_button_0_className)

lcly_link_0.parentNode.insertBefore(lcly_button_0, lcly_link_0);

lcly_link_0.style.fontFamily		= 'Verdana';
lcly_link_0.style.fontSize			= '11px';
lcly_link_0.style.color				= '#707070';
lcly_link_0.style.textDecoration	= 'none';
lcly_link_0.style.fontWeight		= 'normal';
lcly_link_0.style.marginTop			= '5px';
lcly_link_0.style.display			= 'block';
lcly_link_0.style.lineHeight		= '12px';

	lcly_link_0.innerHTML 		= 'Find D-X2E Billy Strings. Locally.';
	lcly_link_0.setAttribute('href', 'https://www.locally.com//product/2147535/martin-guitar-d-x2e-billy-strings');


	var lcly_css_0 = document.createElement('style');
	lcly_css_0.innerHTML = 'button.lcly-primary-trigger {font-weight: normal;transition: none;}a.lcly-primary-trigger, button.lcly-primary-trigger {float: left;width: 100%;clear: both;margin: 0 0 10px 0;}a.lcly-primary-trigger span, button.lcly-primary-trigger {line-height: 60px;display: block;background: #000;height: 60px;text-align: center;color: #fff;font-size: 23px;}a.lcly-primary-trigger span:hover, button.lcly-primary-trigger:hover {background-color: #eee;color: #000;}.lcly-anchor {display: block;clear: both;text-align: center;margin: 0 0 10px 0;}.lcly-dealers-wrap {float: left;clear: both;width: 100%;box-sizing: border-box;font-size: 12px;margin: 10px 0 0 0;}.lcly-dealer {float: left;width: 100%;box-sizing: border-box;background: #f9f9f9;margin: 0 0 7px 0;padding: 8px 10px 10px 32px;position: relative;text-align: left;}.lcly-dealer .lcly-icon-marker {position: absolute;top: 9px;left: 7px;font-size: 17px;fill: #AFAFAF;width: 15px;height: 15px;}.lcly-dealer-name {font-weight: bold;font-size: 12px;margin: 0 0 5px 0;line-height: 11px;width: 75%;}.lcly-dealer-distance {position: absolute;top: 9px;right: 11px;font-size: 10px;color: #777;}.lcly-dealer:hover {background: #eee;cursor: pointer;}.lcly-dealer-stock {font-size: 10px;line-height: 13px;}.lcly-tabs {background: #A1A1A1;margin: 10px 0 0 0;border-bottom: 5px solid #A1A1A1;height: 26px;}.lcly-tabs a {display: block;color: #fff;font-size: 10px;width: 50%;box-sizing: border-box;float: left;line-height: 26px;text-decoration: none;background-color: #000;padding: 0 0 0 10px;}.lcly-tabs a.active {background: #EEEEEE;color: #000;}.lcly-tabs a:hover {background: #fff;color: #000;}.lcly-tabs a.active:hover {background: #A1A1A1;color: #fff;}.lcly-tab {padding: 0 0 0 10px;}.lcly-related-product {box-sizing: border-box;width: 100%;float: left;clear: both;background: #eee;padding: 6px 8px 6px 8px;margin: 0;}.lcly-related-img {float: left;width: 79px;margin: 0 8px 0 0;}.lcly-related-img img {width: 100%;}.lcly-related-info {text-align: left;font-size: 11px;box-sizing: border-box;margin: 0;line-height: 17px;}.lcly-related-products-wrap {float: left;width: 100%;clear: both;box-sizing: border-box;padding-bottom: 0;background: #eee;margin: 0 0 10px 0;}.lcly-related-name {font-weight: bold;font-size: 12px;}.lcly-related-product:hover {background: #eee;cursor: pointer;}.lcly-related-in-stock-notice i {display: block;float: left;margin: 3px 4px 0 0;}.lcly-related-link a {color: #333;font-weight: bold;text-decoration: none;}.lcly-location-switcher-input {width: 100% !important;height: 32px !important;line-height: 32px !important;box-sizing: border-box !important;padding: 0 6px !important;border: 1px solid #ddd !important;border-width: 1px 0 1px 1px !important;font-size: 16px !important;color: #333 !important;display: block;}.lcly-location-switcher-wrap {width: 100%;box-sizing: border-box;clear: both;margin: 10px 0;height: 32px;overflow: hidden;white-space: nowrap;font-size: 16px;}.lcly-location-switcher-a {float: left;width: 60%;box-sizing: border-box;}.lcly-location-switcher-b {float: right;width: 40%;}.lcly-location-switcher-b input {width: 100%;height: 32px;line-height: 20px;background: #ddd;cursor: pointer;padding: 0;margin: 0;color: #777;font-size: 16px;border: none;}.lcly-location-switcher-b input:hover {background-color: #333;color: #fff;}.lcly-location-prompt {font-size: 11px; color: #666; text-decoration: none; font-weight: normal; margin-top: 10px; line-height: 12px;}.lcly-location-prompt a {color: #000;margin: 0 0 0 10px;text-decoration: underline;}.lcly-icon-check-mark-circle {width: 12px;height: 12px;margin: 3px 4px 0 0;display: block;float: left;}.lcly-icon-check-mark {font-size: 12px;width: 13px;height: 13px;display: block;float: left;margin: 0 4px 10px 0;fill: #71ae2b;}.lcly-no-dealers, .lcly-no-stock {background: #eee;padding: 10px 20px;margin: 0 0 10px 0;}.lcly-no-dealers p, .lcly-no-stock {margin: 11px 0;line-height: 16px;font-size: 11px;display: block;}.lcly-no-stock {margin: 0;background: none;padding: 0px 5px 5px 5px;}.lcly-dealer-directions {float: right;font-size: 11px;}.lcly-product-name {font-size: 20px;}.lcly-dealer-w-stock .lcly-dealer-stock {color: #71ae2b;}svg.icon-locally-outline {height: 22px;width: 22px;fill: #ffffff;background: none;padding: 0;float: none;margin: 0;display: inline-block;}.lcly-autocomplete-suggestions {position: absolute !important;border: 1px solid #ccc !important;background: #ddd !important;overflow: hidden !important;z-index: 9999 !important;font-size: 11px !important;white-space: nowrap !important;width: 220px !important;}.lcly-pl-widget-parent {position: relative;}.lcly-pl-widget-parent .lcly-autocomplete-suggestions {width: 100% !important;}.lcly-autocomplete-suggestion a {width: inherit !important;text-decoration: none !important;color: inherit !important;font-size : 16px !important;}.lcly-autocomplete-suggestion {font-family: Verdana, sans-serif;color: #555 !important;text-align: left !important;overflow: hidden !important;padding: 2px 5px !important;background-color: #fff;border-width: 0 1px !important;margin: -1px 0 0 0 !important;display: block !important;width: 100% !important;height: auto !important;}.lcly-autocomplete-suggestion:hover {background: #F0F0F0 !important;}.lcly-autocomplete-suggestion a:focus {outline: none !important;background: #eee !important;}.lcly-suggestions-ul {padding: 0 !important;margin: 0 !important;}';
	lcly_parent_0.insertBefore(lcly_css_0, lcly_link_0);




	
	var lcly_location_switcher_0_className = 'lcly-location-switcher-outer';
	dedup_lcly_child_0(lcly_location_switcher_0_className)
	var lcly_location_switcher_0 = document.createElement('div');
	lcly_location_switcher_0.className = lcly_location_switcher_0_className;
	lcly_location_switcher_0.innerHTML 	= 

		'<script id="lcly-jsonp-script"></script>'
		+ '<form id="lcly-location-switcher-0" autocomplete="off" class="lcly-location-switcher-wrap" style="display: none;">'
			+ '<div class="lcly-location-switcher-a">'
				+ '<input id="lcly-location-switcher-input-0" class="lcly-location-switcher-input" type="text" onkeyup="lcly_autofill_0(event)" onfocus="this.select()" onclick="this.setAttribute(\'placeholder\', \'\');" placeholder="Easton, PA" aria-labelledby="lcly-location-prompt-link-0">'
					+ '<div id="lcly-suggestions-autocomplete"></div>'
			+ '</div>'
			+ '<div class="lcly-location-switcher-b">'
				+ '<input id="lcly-location-switcher-button-0" class="lcly-location-switcher-button" type="submit" value="Change">'
			+ '</div>'
		+ '</form><div id="lcly-location-prompt-0" class="lcly-location-prompt"><span class="lcly-location-prompt-label">Shop Locally in <span class=\"lcly-city-name\">Easton, PA</span></span> <a id="lcly-location-prompt-link-0" class="lcly-location-prompt-link"data-switchlive="true"data-switchlive-mode="auto"data-switchlive-id-PL="5"href="javascript:;">Change</a></div>';

	lcly_parent_0.insertBefore(lcly_location_switcher_0, lcly_link_0);

	function lcly_jsonp_script_0(str) {
	if(typeof(str) === 'string' && str.trim() === '') {
		return;
	}
	var scriptNew = document.createElement("script");
	var scriptOld = document.getElementById("lcly-jsonp-script");
		scriptNew.id = scriptOld.id;
	scriptNew.type = "text/javascript";
	scriptNew.src = "https://www.locally.com/geo/suggest?query=" + str + "&callback=lcly_get_script_callback_0";
	document.getElementById("lcly-jsonp-script").parentNode.insertBefore(scriptNew, scriptOld);
	document.getElementById("lcly-jsonp-script").parentNode.removeChild(scriptOld);
}

function lcly_get_script_callback_0(response) {
 	var list = document.createElement("ul");
 	list.id = "lcly-suggestions-ul-0";
 	list.className = 'lcly-suggestions-ul';
 	if (response.suggestions != undefined) {
    	response.suggestions.forEach(function(val, i) {
    		var item = document.createElement("li");
    		var anchor = document.createElement("a");
    		anchor.setAttribute("href", "javascript:;");
    		anchor.className = "lcly-autocomplete-anchor";
			anchor.tabIndex = '0';
    		anchor.id = "lcly-autocomplete-a" + i;
    		item.appendChild(anchor);
    		anchor.appendChild(document.createTextNode(val.value));
    		list.appendChild(item);
    		item.className = "lcly-autocomplete-suggestion";
    		item.id = "lcly-suggest" + i;
    	})
 	}
 	//set width to input, if input small set suggestions width fixed
	var lcly_location_switcher_input = document.getElementById("lcly-location-switcher-input-0");
	if (lcly_location_switcher_input) {
		var lcly_input_style = window.getComputedStyle(lcly_location_switcher_input);
		var lcly_width_fix = lcly_input_style.getPropertyValue("width");
		var lcly_raw_width = parseInt(lcly_width_fix.substr(0, lcly_width_fix.indexOf("px")), 10);
		if (lcly_raw_width < 125) {
			document.getElementById("lcly-suggestions-autocomplete").style.width = 225 + "px";
		}
		else {
			document.getElementById("lcly-suggestions-autocomplete").style.width = lcly_width_fix;
		}
		document.getElementById("lcly-suggestions-autocomplete").innerHTML = "";
		document.getElementById("lcly-suggestions-autocomplete").appendChild(list);
		document.getElementById("lcly-suggestions-autocomplete").className = "lcly-autocomplete-suggestions";
	}

     //or querySelectorAll
     var listElems = document.getElementsByClassName("lcly-autocomplete-suggestion");

     //register keydown and mousedown handler for each list item
     for (i = 0; i < listElems.length;i++) {

     	listElems[i].addEventListener('click', function(e) {
			//stopping event(click) propagation.
			e.stopPropagation();
     		document.getElementById("lcly-location-switcher-input-0").value = document.getElementById(this.firstChild.id).innerHTML;

     		//sets actual value, above sets nominal value
     		document.getElementById("lcly-location-switcher-input-0").setAttribute("value", document.getElementById(this.firstChild.id).innerHTML);

     		document.getElementById("lcly-suggestions-ul-0").style.display = "none";
     		document.getElementById("lcly-location-switcher-input-0").focus();

     		document.getElementById("lcly-location-switcher-button-0").click();
     	});
			
			listElems[i].addEventListener("keydown",function(e) {
				e.preventDefault();
				var codeA = e.keyCode ? e.keyCode : e.charCode;
			
			if (codeA === 38 || codeA === 9) {
				var strA = this.firstChild.id;
				var numA = strA.charAt(strA.length - 1);
				if (parseInt(numA, 10) === 0) {
					document.getElementById("lcly-location-switcher-input-0").focus();
					document.getElementById("lcly-location-switcher-input-0").select();
				}
				else {
					var strNew = strA.slice(0, -1);
					var realNumA = parseInt(numA, 10);
					realNumA -= 1;
					strNew += realNumA;
					document.getElementById(strNew).focus();
					document.getElementById("lcly-location-switcher-input-0").value = document.getElementById(strNew).innerHTML;
				}
			}
			
			if (codeA === 40 || codeA === 9) {
				var strA = this.firstChild.id;
				var numA = strA.charAt(strA.length - 1);
				if (parseInt(numA, 10) === listElems.length - 1) {
					document.getElementById("lcly-location-switcher-input-0").focus();
					document.getElementById("lcly-location-switcher-input-0").select();
				}
				else {
					var strNew = strA.slice(0, -1);
					var realNumA = parseInt(numA, 10);
					realNumA += 1;
					strNew += realNumA;
					document.getElementById(strNew).focus();
					document.getElementById("lcly-location-switcher-input-0").value = document.getElementById(strNew).innerHTML;
					}
				
     		}
     		if (codeA === 13) {
     			document.getElementById("lcly-location-switcher-input-0").value = document.getElementById(this.firstChild.id).innerHTML;
     			//sets actual value, above sets nominal value
     			document.getElementById("lcly-location-switcher-input-0").setAttribute("value", document.getElementById(this.firstChild.id).innerHTML);
     			document.getElementById("lcly-suggestions-ul-0").style.display = "none";
     			document.getElementById("lcly-location-switcher-button-0").click();
     		}
		});
	}
}
 
function lcly_autofill_0(e) {
	var inputter = document.getElementById("lcly-location-switcher-input-0");
	var inputText = inputter.value.toString(); 
	lcly_jsonp_script_0(inputText);
};
	function lcly_hide_suggest_0(e) {
		var newTarget = e.relatedTarget;
		if (newTarget !== undefined && newTarget !== null) {
			if(newTarget.className === 'lcly-autocomplete-anchor'
				|| newTarget.className === 'lcly-location-switcher-input'
				) {
				return;
			}
		}
		var list = document.getElementById('lcly-suggestions-autocomplete');
		list.innerHTML = '';
	}

	function lcly_use_my_location_0() {
		navigator.geolocation.getCurrentPosition(function (position) {
			lcly_reload_0({ 'location_change_to_string' : 'coords:' + position.coords.latitude + ',' + position.coords.longitude});
		}, function (error) {
			console.log(error);
			alert('Sorry your browser could not provide a location. You may need to enable location services for this browser. Or try typing the name of your location here instead.');
			document.getElementById('lcly-location-switcher-input-0').value = '';
			document.getElementById('lcly-location-switcher-input-0').focus();
		}, {
			enableHighAccuracy: true
		});
	}

	document.getElementById('lcly-location-switcher-input-0').onfocus = function() {
		var cur_val = document.getElementById('lcly-location-switcher-input-0').value;
		if(cur_val === '') {
			lcly_get_script_callback_0({suggestions: [{value: '⌖ Use My Location'}]});
		} else {
			var suggestions = document.getElementById('lcly-suggestions-autocomplete');
			if(suggestions && (suggestions.innerHMTL === '' || suggestions.innerHMTL === undefined)) {
				lcly_jsonp_script_0(cur_val);
			}
		}
	}

	document.getElementById('lcly-location-switcher-input-0').onblur = lcly_hide_suggest_0;

	
	document.getElementById('lcly-location-switcher-input-0').addEventListener("keydown", function(e) {
		var code = e.keyCode ? e.keyCode : e.charCode;
		if (code === 40 || code === 13) {
			e.preventDefault();
			var target = document.getElementById("lcly-autocomplete-a" + 0);
			if(target) {
				target.focus();
			}
		}
	});

	document.getElementById('lcly-location-switcher-0').onsubmit = function(){
		lcly_city_placeholder = document.getElementById('lcly-location-switcher-input-0').value;
		if (lcly_city_placeholder[0] === '⌖') {
			lcly_use_my_location_0();
			return false;
		}

		document.getElementById('lcly-location-switcher-input-0').placeholder = lcly_city_placeholder;

		lcly_reload_0({ 'location_change_to_string' : document.getElementById('lcly-location-switcher-input-0').value });
		return false;
	};

			document.getElementById('lcly-location-prompt-link-0').onclick = function(){
			document.getElementById('lcly-location-prompt-0').style.display = 'none';
			document.getElementById('lcly-location-switcher-0').style.display = 'block';
			document.getElementById('lcly-location-switcher-input-0').focus();
		}
	

	var lcly_dealers_wrap_0_className = 'lcly-dealers-wrap-outer lcly-toggleable-0';
	dedup_lcly_child_0(lcly_dealers_wrap_0_className);
	var lcly_dealers_wrap_0 = document.createElement('div');
	lcly_dealers_wrap_0.className = lcly_dealers_wrap_0_className;
	lcly_dealers_wrap_0.innerHTML = '<div id="lcly-dealers-0" class="lcly-dealers-wrap lcly-tab-content-0"><svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><symbol id="lcly-icon-marker" viewBox="0 0 512 512"><path d="m257 0c-105 1-179 80-179 189 0 146 162 307 169 314l10 9 10-10c7-7 170-168 170-314 0-108-73-187-180-188z m0 270c-51 0-94-42-94-94 0-52 43-95 94-95 52 0 95 43 95 95 0 52-43 94-95 94z"/></symbol></svg><svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><symbol id="lcly-icon-check-mark" viewBox="0 0 512 512"><path d="m372 269l0 165c0 16-14 30-31 30l-281 0c-16 0-30-14-30-30l0-297c0-16 14-30 30-30l254 0c11-10 23-19 35-29-3-1-5-1-8-1l-281 0c-33 0-60 27-60 60l0 297c0 33 27 60 60 60l281 0c34 0 61-27 61-60l0-206c-11 13-21 27-30 41m128-251c-142 87-244 196-290 251l-113-88-50 40 195 198c34-86 140-254 270-373l-12-28"/></symbol></svg><div id="__dealer_key_0" role="button" tabindex="0" class="lcly-dealer lcly-dealer-n-0 lcly-dealer-0 lcly-dealer-w-stock w-3-dealers lcly-cat-cse lcly-cat-marquis lcly-cat-dealer lcly-cat-service" data-conversion-url="/start_conversion?&product_id=2147535&upc=729789689250&store_id=285997&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-endpoint="https://www.locally.com/start_conversion?" data-query-string="&product_id=2147535&upc=729789689250&store_id=285997&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-switchlive="true"data-switchlive-impression="true"data-switchlive-mode="auto"data-switchlive-id-LLP="78"data-switchlive-impression-id-pl="88"data-switchlive-id-PL="4"data-switchlive-id-SL="77"data-switchlive-store-id="285997"data-switchlive-vendor-id="75166"data-switchlive-store-name="Northeast Music Center Inc"data-switchlive-store-address="713 Scranton Carbondale Hwy, Dickson City, PA, 18519"><svg class="lcly-icon-marker"><use xlink:href="#lcly-icon-marker"></use></svg> <div class="lcly-dealer-name">Northeast Music Center Inc</div><div class="lcly-dealer-distance">57.7 <span>mi</span></div><address class="lcly-dealer-address">713 Scranton Carbondale Hwy<br>   Dickson City, PA 18519   </address><div class="lcly-dealer-phone"><a target="_blank" class="lcly-phone-link-0" href="tel:+15709099216">(570) 909-9216</a></div><div class="lcly-dealer-stock lcly-has-in-stock-0"><svg class="lcly-icon-check-mark"><use xlink:href="#lcly-icon-check-mark"></use></svg><span class="lcly-location-features"><span class="lcly-location-feature-primary">Item Is in Stock!</span><br><span class="lcly-location-feature-secondary">Store Pickup Available</span></span></div></div><div id="__dealer_key_1" role="button" tabindex="0" class="lcly-dealer lcly-dealer-n-1 lcly-dealer-0 lcly-dealer-w-stock w-3-dealers lcly-cat-cse lcly-cat-marquis lcly-cat-dealer" data-conversion-url="/start_conversion?&product_id=2147535&upc=729789689250&store_id=286154&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-endpoint="https://www.locally.com/start_conversion?" data-query-string="&product_id=2147535&upc=729789689250&store_id=286154&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-switchlive="true"data-switchlive-impression="true"data-switchlive-mode="auto"data-switchlive-id-LLP="78"data-switchlive-impression-id-pl="88"data-switchlive-id-PL="4"data-switchlive-id-SL="77"data-switchlive-store-id="286154"data-switchlive-vendor-id="84922"data-switchlive-store-name="Rudy\'s Music Soho"data-switchlive-store-address="461 Broome St, New York, NY, 10013"><svg class="lcly-icon-marker"><use xlink:href="#lcly-icon-marker"></use></svg> <div class="lcly-dealer-name">Rudy\'s Music Soho</div><div class="lcly-dealer-distance">66.4 <span>mi</span></div><address class="lcly-dealer-address">461 Broome St<br>   New York, NY 10013   </address><div class="lcly-dealer-phone"><a target="_blank" class="lcly-phone-link-0" href="tel:+12126252557">(212) 625-2557</a></div><div class="lcly-dealer-stock lcly-has-in-stock-0"><svg class="lcly-icon-check-mark"><use xlink:href="#lcly-icon-check-mark"></use></svg><span class="lcly-location-features"><span class="lcly-location-feature-primary">Item Is in Stock!</span><br><span class="lcly-location-feature-secondary"></span></span></div></div><div id="__dealer_key_2" role="button" tabindex="0" class="lcly-dealer lcly-dealer-n-2 lcly-dealer-0 lcly-dealer-w-stock w-3-dealers lcly-cat-standard lcly-cat-dealer" data-conversion-url="/start_conversion?&product_id=2147535&upc=729789689250&store_id=323189&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-endpoint="https://www.locally.com/start_conversion?" data-query-string="&product_id=2147535&upc=729789689250&store_id=323189&category=dealer&is_isolated=1&dealers_company_id=224063&lang=en-us" data-switchlive="true"data-switchlive-impression="true"data-switchlive-mode="auto"data-switchlive-id-LLP="78"data-switchlive-impression-id-pl="88"data-switchlive-id-PL="4"data-switchlive-id-SL="77"data-switchlive-store-id="323189"data-switchlive-vendor-id="67944"data-switchlive-store-name="Nazareth Music Center"data-switchlive-store-address="162 S Main St, Nazareth, PA, 18064"><svg class="lcly-icon-marker"><use xlink:href="#lcly-icon-marker"></use></svg> <div class="lcly-dealer-name">Nazareth Music Center</div><div class="lcly-dealer-distance">4.6 <span>mi</span></div><address class="lcly-dealer-address">162 S Main St<br>   Nazareth, PA 18064   </address><div class="lcly-dealer-phone"><a target="_blank" class="lcly-phone-link-0" href="tel:+16107593072">(610) 759-3072</a></div><div class="lcly-dealer-stock "><span class="lcly-location-features"><span class="lcly-location-feature-primary">Authorized Martin Guitar Dealer</span><br><span class="lcly-location-feature-secondary"></span></span></div></div></div>';
	lcly_parent_0.insertBefore(lcly_dealers_wrap_0, lcly_link_0);
	
	var lcly_dealers_0 = document.getElementsByClassName('lcly-dealer-0');

					
		for (var i = 0 ; i < lcly_dealers_0.length ; i++){
			lcly_dealers_0[i].onkeydown = function(e) {
				if (e.keyCode == 13 && e.target.id === this.id) { 
					this.click();
					e.stopPropagation();
				}
			}

			lcly_dealers_0[i].onclick  = function(){ 
				
				var conversion_url = this.getAttribute('data-conversion-url');

				if (conversion_url != ''){

					lcly_query_string_0 = '';
					lcly_endpoint_0     = 'https://www.locally.com' + conversion_url;
					lcly_modal_title_0  = lcly_orig_modal_title_0;

				} else {

					lcly_query_string_0 = lcly_orig_query_string_0;
					lcly_endpoint_0     = lcly_orig_endpoint_0;
					lcly_modal_title_0  = lcly_orig_modal_title_0;
				}

				lcly_fixed_width_0 = false;
				lcly_fixed_height_0 = false;
				
									if (conversion_url && conversion_url.indexOf('product_id=') > -1 && lcly_launch_pl_v3) {
						window.lclyInlineModalGlobal('tile', this.getAttribute('data-query-string'), lcly_orig_query_string_obj_0, 0 );
					} else {
						lcly_modal_launch_0();
					}
							};
		}
	




	
	lcly_button_0.onclick = function(){ 
	
		lcly_query_string_0 = lcly_orig_query_string_0;
		lcly_endpoint_0     = lcly_orig_endpoint_0;
		lcly_modal_title_0  = lcly_orig_modal_title_0;	
		
		if (lcly_query_has_product_0 && lcly_launch_pl_v3) {
			window.lclyInlineModalGlobal('button', lcly_query_string_0, lcly_orig_query_string_obj_0, 0)
		} else {
			lcly_modal_launch_0();
		}
	};






	lcly_link_0.innerHTML = 'show all local options';
	lcly_link_0.setAttribute('data-switchlive' , 'true');
	lcly_link_0.setAttribute('data-switchlive-mode' , 'auto');
	lcly_link_0.setAttribute('data-switchlive-id-pl', '6');
	lcly_link_0.onclick = function(event){
		lcly_query_string_0 = lcly_orig_query_string_0;
		lcly_endpoint_0     = lcly_orig_endpoint_0;
		lcly_modal_title_0  = lcly_orig_modal_title_0;	
		if (lcly_query_has_product_0 && lcly_launch_pl_v3) {
			window.lclyInlineModalGlobal('link', lcly_query_string_0, lcly_orig_query_string_obj_0, 0)
		}
		else {
			lcly_modal_launch_0();
		}
		event.preventDefault();
		return false;
	}






	lcly_button_0.style = 'display: none !important;';

var lcly_reload_0 = function(params){

	var cachebuster                 = Math.round(new Date().getTime() / 1000);
	params.v 						= cachebuster;
	params.is_reload 				= 1;
	var old_script                  = document.getElementById('lcly-script-0');
	var new_script                  = document.createElement('script');
	var new_params                  = typeof params.refresh != 'undefined' ? params : lcly_merge_0(lcly_orig_query_string_obj_0, params);

	delete new_params.product_id;
	
	var new_query_string            = lcly_serialize_0(new_params);

	if(old_script !== null && old_script != undefined) {
		if (old_script.parentNode.id.indexOf('lcly-button') > -1){ // script tag is within the container :0 - it's malformed.

			old_script.parentNode.parentNode.insertBefore(new_script, old_script.parentNode);
			old_script.parentNode.removeChild(old_script);
			
		} else { // do the standard reload

			old_script.parentNode.insertBefore(new_script, old_script);
			old_script.parentNode.removeChild(old_script);
		}
	} else {
		// couldn't found our script? insert into head
		console.log('Locally Error: could not locate script tag to update locally script');
		const head_list = document.getElementsByTagName('head');
		if(head_list.length === 1) {
			head_list[0].appendChild(new_script);
			
		} else {
			console.log('Locally Error: could not locate head tag');
		}
	}

	lcly_parent_0.innerHTML = '<a id="lcly-link-0"></a>';
	new_script.setAttribute('src', 'https://martin-guitar.locally.com/stores/map.js?' + new_query_string);
	new_script.setAttribute('id', 'lcly-script-0');
}

var lcly_serialize_0 = function(obj) {

  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var lcly_merge_0 = function(obj, src) {

    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
var lcly_overlay_0       = null;
var lcly_fixed_width_0   = false;
var lcly_fixed_height_0  = false;
var lcly_event_method_0  = window.addEventListener ? "addEventListener" : "attachEvent";
var lcly_eventer_0       = window[lcly_event_method_0];
var lcly_message_event_0 = lcly_event_method_0 == "attachEvent" ? "onmessage" : "message";
var lcly_endpoint_0 	 = 'https://martin-guitar.locally.com/stores/map/embedded?action=convert';
var lcly_modal_title_0   = '';
var lcly_native_viewport 		 = false;
var lcly_min_supported_height	 = 600;
var lcly_body_0 = document.getElementsByTagName('body')[0];

if (typeof window.lcly_orig_scroll_padding_top === 'undefined') {
	window.lcly_orig_scroll_padding_top = '0px';
}

// Polyfill to support CustomEvent in IE11
(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

lcly_eventer_0(lcly_message_event_0, function(e) {
	if (typeof e.data.affiliate_redirect != 'undefined') {
		window.open('https://martin-guitar.locally.com' + e.data.affiliate_redirect, '_blank', 'noopener noreferrer');
	}

	if (typeof e.data.start_conversion_query != 'undefined'){

		lcly_query_string_0 = e.data.start_conversion_query;
		if (e.data.start_conversion_title != '') lcly_modal_title_0 = e.data.start_conversion_title ;
		if (e.data.start_conversion_endpoint != '') lcly_endpoint_0 = e.data.start_conversion_endpoint ;
		if (e.data.start_conversion_query != '') lcly_query_string_0 = e.data.start_conversion_query;
		lcly_modal_launch_0();

	} else if (typeof e.data.requestor != 'undefined' && e.data.requestor == 'widget' && typeof lcly_element_0 != 'undefined' && typeof lcly_body_0 != 'undefined' ) {
		
		lcly_element_0.style.height = (e.data.height + 100) + 'px';

		if(e.data.is_fullscreen != undefined && e.data.is_fullscreen){
			lcly_element_0.style.position = 'fixed';
			lcly_element_0.style.top = '0';
			lcly_element_0.style.bottom = '0';
			lcly_element_0.style.left = '0';
			lcly_element_0.style.right = '0';
			lcly_element_0.style.zIndex = '99999999999999';
			lcly_element_0.style.backgroundColor = '#fff';
			lcly_body_0.style.overflow = 'hidden';

			var iframes = document.getElementsByTagName('iframe');
			var iframesArray = Array.prototype.slice.call(iframes);

			if (iframes != null && typeof iframes != 'undefined' && iframes.length > 0){
				iframesArray.forEach(function(thisFrame){
					if (thisFrame == lcly_element_0){
						return;
					}
					var lcly_orig_opacity = thisFrame.style.opacity;										
					thisFrame.style.opacity = '0';
					thisFrame.setAttribute('lcly_orig_opacity', lcly_orig_opacity);						
				});
			}

		} else{
			lcly_element_0.style.position = '';
			lcly_element_0.style.top = '';
			lcly_element_0.style.bottom = '';
			lcly_element_0.style.left = '';
			lcly_element_0.style.right = '';
			lcly_element_0.style.zIndex = '';
			lcly_element_0.style.backgroundColor = '';
			lcly_body_0.style.overflow = '';

			var iframes = document.getElementsByTagName('iframe');
			var iframesArray = Array.prototype.slice.call(iframes);

			if ( iframes != null && !typeof iframes != 'undefined' && iframes.length > 0 ){				
				iframesArray.forEach(function(thisFrame){
					if (thisFrame == lcly_element_0){
						return;
					}
					var lcly_orig_opacity = thisFrame.getAttribute('lcly_orig_opacity');
					if (typeof lcly_orig_opacity != 'undefined'){
						thisFrame.style.opacity = lcly_orig_opacity;
					}	
				});
			}	
		}

		lcly_element_0.style.height = e.data.height;//debugger;
		if (!e.data.change_url) return false;

		if (e.data.document_path.indexOf('http://') > -1 || e.data.document_path.indexOf('https://') > -1){

			window.open(e.data.document_path);

		} else {

			lcly_element_0.src = 'https://martin-guitar.locally.com' + e.data.document_path;
			window.location = '#' + e.data.document_path;
			window.scroll(0,lcly_find_y_pos(lcly_element_0) - 100);
		}

	} else if (typeof e.data.broadcast != 'undefined') {

		var lcly_event_name = 'LOCALLY_' + e.data.broadcast.name;
		var lcly_broadcast_data = e.data.broadcast.data;
		var lcly_event = new CustomEvent(lcly_event_name, { detail: lcly_broadcast_data } );
		window.dispatchEvent(lcly_event);

	} else if (typeof e.data.geolocate != 'undefined') {

		lcly_geo_locate_0();
	} else if (typeof e.data.scroll_top != 'undefined') {
		setTimeout(function() {
			var scroll_padding_top = document.documentElement.style.scrollPaddingTop;
			if (scroll_padding_top && window.lcly_orig_scroll_padding_top === '0px') {
				window.lcly_orig_scroll_padding_top = scroll_padding_top;
				document.documentElement.style.scrollPaddingTop = '0px';
			}
			
			var modal_frame = document.getElementById("lcly-iframe-outer-0");
			if (modal_frame) {
				setTimeout(function() {
					modal_frame.scrollIntoView();
				}, 0);
			}
		}, 300);
	} else { // it's a state change 

		if (typeof e.data.width != 'undefined') lcly_fixed_width_0 = e.data.width.toString().replace('px', '');
		if (typeof e.data.height != 'undefined' && e.data.height > 100) lcly_fixed_height_0 = e.data.height.toString().replace('px', '');
		lcly_audit_size_0();
	}

}, false);

function lcly_modal_launch_0(){	
	
	
	var lcly_scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

	lcly_overlay_0     = document.createElement('div');
	lcly_overlay_0.id  = 'lcly-overlay-0';

	var lcly_body_0 = document.getElementsByTagName('body')[0],
		lcly_w = window;
	lcly_body_0.appendChild(lcly_overlay_0);

	if (lcly_w.innerHeight > lcly_min_supported_height){
		lcly_body_0.style.overflow = "hidden";
	}
	lcly_add_class_0(lcly_body_0, 'lcly-active');

	lcly_set_viewport_0(false);
	var iframe_query_string = lcly_query_string_0 + '&host_domain=' + document.domain;

	var lcly_html_0 = 

		'<div id="lcly-iframe-outer-0" style="position: absolute; left: 0; z-index: 99999; width: 100%; height: 100%; top: ' + lcly_scrollTop + 'px !important;" onclick="lcly_remove_0()" tabindex="0">'
			+ '<a id="lcly-iframe-closer-0" tabindex="0" '
			+   'title="Close Retailers" '
			+   'aria-label="Close Retailers" '
			+   'href="javascript:;" style="position: absolute; top: 10px; width: 50px; height: 50px; text-indent: -9999px; background: url(https://martin-guitar.locally.com/img/modal-x.png) no-repeat 50% 50%; background-size: 50%; z-index: 99;right: 15px;"></a>'
			+ '<div id="lcly-iframe-0" onclick="lcly_prevent_bubbling_0()" style="width: 70%; height: 80%; margin: 100px auto;">'
			   + '<iframe id="lcly-iframe-inner-0" title="Retailers / Where to Buy" '
			    + 'scrolling="no" frameborder="0" '
				+ 'src="' + lcly_endpoint_0 + '&' + iframe_query_string + '#/?' + iframe_query_string + '" '
				+ 'style="width: 100%; height: 600px; margin: 0 auto;">'
			   + '</iframe>'
			+ '</div>'
		+ '</div>'
		+ '<div class="lcly-screen" style="top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; overflow: hidden; position: fixed; background: #312e2e; opacity: 0.9; filter: alpha(opacity=90);"></div>';

	lcly_overlay_0.innerHTML = lcly_html_0;
	lcly_audit_size_0();

	// initiate accessibility
	var lcly_iframe_outer_0 = document.getElementById('lcly-iframe-outer-0');
	lcly_iframe_outer_0.focus();
}

function lcly_remove_0(){
	lcly_set_viewport_0(true);
	lcly_overlay_0.parentNode.removeChild(lcly_overlay_0);
	var lcly_body_0 = document.getElementsByTagName('body')[0];
	lcly_body_0.style.overflow = "";
	lcly_remove_class_0(lcly_body_0, 'lcly-active');

	if (window.lcly_orig_scroll_padding_top !== '0px') {
		document.documentElement.style.scrollPaddingTop = window.lcly_orig_scroll_padding_top;
		window.lcly_orig_scroll_padding_top = '0px';
	}
}

function lcly_prevent_bubbling_0(e){
	e.stopPropagation();
}

function lcly_set_viewport_0(remove){
	
	var lcly_viewport = document.querySelector("meta[name=viewport]");

	if (remove){

		if (!lcly_viewport) return false;
		lcly_viewport.setAttribute('content', lcly_native_viewport ? lcly_native_viewport : '');

	} else {

		if (lcly_viewport){
			
			lcly_native_viewport = lcly_viewport.getAttribute('content');
			lcly_viewport.setAttribute('content', 'width=device-width initial-scale=1.0 minimum-scale=1.0');
		
		} else {

			var lcly_meta_tag = document.createElement('meta');
			lcly_meta_tag.name = "viewport"
			lcly_meta_tag.content = "width=device-width, initial-scale=1.0"
			document.getElementsByTagName('head')[0].appendChild(lcly_meta_tag);
		}
	}
}

function lcly_audit_size_0(){

	var lcly_w = window,
	    lcly_d = document,
	    lcly_e = lcly_d.documentElement,
	    lcly_g = lcly_d.getElementsByTagName('body')[0],
	    lcly_x = lcly_g.clientWidth,
	    lcly_y = lcly_g.clientHeight;

	var lcly_iframe					= document.getElementById('lcly-iframe-0');
	var lcly_iframe_inner			= document.getElementById('lcly-iframe-inner-0');
	var lcly_embedded_iframe 		= document.getElementById('lcly-embedded-iframe-inner-0');
	var lcly_target_width 			= lcly_w.innerWidth < 960 ? lcly_w.innerWidth - 40 : lcly_w.innerWidth - 160;

	if (lcly_iframe) {

		lcly_width						= lcly_fixed_width_0 ? lcly_fixed_width_0 : lcly_target_width;
		// set lcly_height to min supported height, unless window is bigger than min supported height, then scale window using value from "eventer"
		lcly_height						= lcly_min_supported_height;
		if (lcly_w.innerHeight > lcly_min_supported_height){
			lcly_height					= lcly_fixed_height_0 ? lcly_fixed_height_0 : lcly_w.innerHeight - 140;
		}

		lcly_iframe.style.width			= lcly_width + 'px';
		lcly_iframe.style.height		= lcly_height + 'px';
		lcly_iframe.style.marginTop		= "70px";
		lcly_iframe.style.marginBottom  = "70px";
		lcly_iframe_inner.style.width	= lcly_width + 'px';
		lcly_iframe_inner.style.height	= lcly_height + 'px';
	}

	}

function lcly_has_class_0(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function lcly_add_class_0(ele,cls) {
  if (!lcly_has_class_0(ele,cls)) ele.className += " "+cls;
}

function lcly_remove_class_0(ele,cls) {
  if (lcly_has_class_0(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

window.onresize = function() {

    lcly_audit_size_0();
}

/* GEO-LOCATION METHODS */

function lcly_geo_locate_0(){
	
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(lcly_geo_locate_success_0, lcly_geo_locate_error_0);
  	} else {
  		alert("Sorry, your browser doesn't support geolocation.");
  	}
}

function lcly_geo_locate_success_0(position){

	var lcly_embedded_iframe = document.getElementById('lcly-embedded-iframe-inner-0');
	lcly_embedded_iframe = !lcly_embedded_iframe ? document.getElementById('lcly-iframe-inner-0') : lcly_embedded_iframe;

	lcly_embedded_iframe.contentWindow.postMessage({ lat : position.coords.latitude, lng : position.coords.longitude }, "*");
}

function lcly_geo_locate_error_0(error){

	alert('Sorry your browser could not provide a location. You may need to enable location services for this browser. Or try typing the name of your location here instead.');
}


var lcly_event_data = { 
	id : '0',
	n_items_with_stock : 2,
	n_items_stocking_product : 2,
	n_items_stocking_upc : 2,
	dealers: false,
	product_id: 2147535,
	latitude: 40.68153,
	longitude: -75.26722,
	location_name: 'Easton, PA',
	postal_code: '18045'
};


var lcly_event = new CustomEvent('LOCALLY_data_update', { detail: lcly_event_data } );
window.dispatchEvent(lcly_event);


var lcly_markup_city_tags_0 = document.getElementsByClassName('lcly-city-name');
for (var x = 0 ; x < lcly_markup_city_tags_0.length ; x++){
	lcly_markup_city_tags_0[x].innerHTML = "Easton, PA";
}

	window.lcly_switchlive_context = 'PL';
	/**
 * SwitchLive Message Listener
 */

if (typeof window.receiveSwitchLiveEvent != 'function'){
    window.receiveSwitchLiveEvent = function( eventMessage ){
        if (typeof eventMessage.data.message_type != 'undefined' && eventMessage.data.message_type == 'switchlive'){
            var switchLiveEvent = eventMessage.data;
            switchLiveEventCallback( switchLiveEvent );
        }
    }
}
window.addEventListener("message", window.receiveSwitchLiveEvent, false);

if(typeof switchLiveEventCallback != 'function'){
    window.switchLiveEventCallback = function( switchLiveEvent ){
        /* custom implementation by brand goes in a function with this name. */
        // console.info("Locally SwitchLive is enabled.  No switchLiveEventCallback() function was provided.");
        // console.info( switchLiveEvent );
    };
};

window.lcly_react_switchlive_utm = "";


if (lcly_pl_v3_recover_cart) {
	try {
		var query_params = new URLSearchParams(window.location.search);
		var __lcly_sc_hash = query_params.get('__lcly_sc_jwt');
		var __lcly_sc_kit = query_params.get('__lcly_sc_kit');
		if (__lcly_sc_hash) {
			window.__lcly_pl_api_domain = 'martin-guitar.locally.com';
			window.__lclyAppLaunchPageTrigger = function() {
				var originalLaunchPage = window.__lclyAppLaunchPage;
				window.__lclyAppLaunchPageTrigger = undefined;
				originalLaunchPage('cart',  query_params.get('__lcly_sc_jwt'), __lcly_sc_kit ? 'KIT_MODAL' : 'MODAL', true);
			}
		}
	}
	catch (e) {
		alert('Well. This is embarrassing. We could not recover your cart :(');
	}
}

if (lcly_launch_pl_v3) {
	
        if (!document.getElementById('__lcly_inline_modal')) {
            {
                var lclyEmbedRoot = document.createElement('div');
                lclyEmbedRoot.setAttribute('id', '__lcly_inline_modal');
                document.body.appendChild(lclyEmbedRoot);
            }
        }

        if(typeof includeCss !== 'function') {
            function includeCss(cssFilePath) {
                var head  = document.getElementsByTagName('head')[0];
                var link  = document.createElement('link');
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = cssFilePath;
                link.media = 'all';
                head.appendChild(link);
            }
        }
        
        if(typeof includeJs !== 'function') {
            function includeJs(jsFilePath, id) {
                var __lcly_script = document.getElementById(id);

                if (!__lcly_script) {
                    var js = document.createElement('script');
                    
                    js.id = id;
                    js.type = 'text/javascript';
                    js.src = jsFilePath;
                    js.async = true;
                    /* js.crossOrigin = true; */ /* For debugging ErrorBoundary in dev */
                
                    document.body.appendChild(js);
                }
            }
        }
        
        includeJs('https://frontend2.locally.com/inline_modal/main.js?ver=v1.2.727', '__lcly_script_inline_modal')

        
}

if (typeof(Storage) !== 'undefined') {
	if (lcly_prompt_browser_based_location && !localStorage.getItem('browser_location_shared') ) {

		// try to get browser location
		navigator.geolocation.getCurrentPosition(function (position) {
			if (!lcly_is_reload_0) { // to prevent reload loop. This will make sure browser location loads on initial load only.
				localStorage.setItem('browser_location_shared', true);
				lcly_reload_0({ 'location_change_to_string' : 'coords:' + position.coords.latitude + ',' + position.coords.longitude, 'browser_location_shared': 1});
			}
		}, function (error) {
			if (!lcly_is_reload_0) {
				lcly_reload_0({ 'browser_location_shared': 0});
			}
			console.log(error)
			// no need to do anything. It will fallback to the IP location
		},{
		enableHighAccuracy: true
		});
	}
}

