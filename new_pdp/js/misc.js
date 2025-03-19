'use strict';
var focusHelper = require('base/components/focus');
var abSlider = require('core/components/slider');
var siteIntegrations = require('../integrations/siteIntegrationsUtils');
var toggleObject = siteIntegrations.getIntegrationSettings();
var productListEnhancementsHelpers = require('../productListEnhancements/helpers.js');

/**
 * Retrieves the relevant pid value
 * @param {jquery} $el - DOM container for a given add to cart button
 * @return {string} - value to be used when adding product to cart
 */
function getPidValue($el) {
    var pid;

    if ($('#quickViewModal').hasClass('show') && !$('.product-set').length) {
        pid = $($el).closest('.modal-content').find('.product-quickview').data('pid');
    } else if ($('.product-set-detail').length || $('.product-set').length) {
        pid = $($el).closest('.product-detail').find('.product-id').text();
    } else  if (($el).hasClass('single-variant-quick-add-to-cart')) {
        pid = $($el).data('pid');
    } else  if (($el).parents('.popover').length) {
        pid = $($el).closest('.product-detail.product-quick-add-to-cart').data('pid');
    } else {
        pid = $('.product-detail:not(".bundle-item")').data('pid');
    }

    return pid;
}

/**
 * Retrieve contextual quantity selector
 * @param {jquery} $el - DOM container for the relevant quantity
 * @return {jquery} - quantity selector DOM container
 */
function getQuantitySelector($el) {
    var quantitySelected;
    if ($el && $('.set-items').length) {
        quantitySelected = $($el).closest('.product-detail').find('.quantity-select');
    } else if ($el && $('.product-bundle').length) {
        var quantitySelectedModal = $($el).closest('.modal-footer').find('.quantity-select');
        var quantitySelectedPDP = $($el).closest('.bundle-footer').find('.quantity-select');
        if (quantitySelectedModal.val() === undefined) {
            quantitySelected = quantitySelectedPDP;
        } else {
            quantitySelected = quantitySelectedModal;
        }
    } else {
        quantitySelected = $('.quantity-select');
    }
    return quantitySelected;
}

/**
 * Retrieves the value associated with the Quantity pull-down menu
 * @param {jquery} $el - DOM container for the relevant quantity
 * @return {string} - value found in the quantity input
 */
function getQuantitySelected($el) {
    return this.getQuantitySelector($el).val();
}

/**
 * Process the attribute values for an attribute that has image swatches
 *
 * @param {Object} attr - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {string} attr.values.value - Attribute coded value
 * @param {string} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 * @param {jQuery} $productContainer - DOM container for a given product
 * @param {Object} msgs - object containing resource messages
 */
function processSwatchValues(attr, $productContainer, msgs) {
    if (attr.attributeId == 'color') {
        $productContainer.find('.color-display-value').text(attr.displayValue || '');
    };

    if (attr.attributeId == 'size') {
        $productContainer.find('[data-attr="size"]').find('.non-color-display-value').text(attr.displayValue || '');
    };

    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer.find('[data-attr="' + attr.id + '"] [data-attr-value="' + attrValue.value + '"]');

        var $swatchButton = $attrValue.parent('button');

        if (attrValue.selected) {
            $attrValue.addClass('selected');
            $attrValue.siblings('.selected-assistive-text').text(msgs.assistiveSelectedText);
            $attrValue.attr('selected', 'selected');
        } else {
            $attrValue.removeClass('selected');
            $attrValue.siblings('.selected-assistive-text').empty();
            $attrValue.removeAttr('selected');
        }

        if (attrValue.url) {
            $swatchButton.attr('data-url', attrValue.url);
        } else {
            $swatchButton.removeAttr('data-url');
        }

        // Disable if not selectable
        $attrValue.removeClass('selectable unselectable available unavailable out-of-stock');

        $attrValue.addClass(attrValue.selectable ? 'selectable' : 'unselectable');
        $attrValue.addClass(attrValue.available ? 'available' :  toggleObject.viewOutOfStockItems ? 'out-of-stock' : 'unavailable');

        $attrValue.attr('value', attrValue.url).removeAttr('disabled');
        if (!attrValue.selectable) {
            $attrValue.attr('disabled', true);
        }
    });
}

/**
 * Check to see if the attribute button element can be clicked
 *
 * @param {Object} $attributeButtonElement - Attribute element button
 */
function checkForClickableAttribute($attributeButtonElement) {
    return ($attributeButtonElement.attr('disabled') || $attributeButtonElement.data('url') === null || $attributeButtonElement.find('.unselectable').length || $attributeButtonElement.find('.selected').length);
}


/**
 * Process attribute values associated with an attribute that does not have image swatches
 *
 * @param {Object} attr - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {string} attr.values.value - Attribute coded value
 * @param {string} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 * @param {jQuery} $productContainer - DOM container for a given product
 */
function processNonSwatchValues(attr, $productContainer, msgs) {
    var viewOutOfStockItems = window.CachedData.siteIntegrations.viewOutOfStockItems;
    var $attr = '.custom-select[data-attr="' + attr.id + '"]';
    var $defaultOption = $productContainer.find($attr + '.select-' + attr.id + ' option:first-child');
    $defaultOption.attr('value', attr.resetUrl).attr('disabled', true);

    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer.find($attr + ' [data-attr-value="' + attrValue.value + '"]');
        $attrValue.attr('value', attrValue.url).removeAttr('disabled');
        var currentSelectedOption = $productContainer.find($attr + '.select-' + attr.id + ' option:selected').eq(0);

        if (!viewOutOfStockItems && (!attrValue.selectable || !attrValue.available)) {
            if (!attrValue.selectable) {
                $attrValue.attr('disabled', true);
            }
            //check if selected value is now unavailable, if so select the default option
            if (currentSelectedOption.data('attr-value') == attrValue.value) {
                $attrValue.removeAttr('selected');
                $($attr).prop('selectedIndex', 0);
            }
            // append a msg to option to tell user its not available with selected options
            $attrValue.html(attrValue.displayValue + msgs.unavailableMsg);
        } else {
            $attrValue.html(attrValue.displayValue);
            if (currentSelectedOption.text() == attrValue.displayValue) {
                $(currentSelectedOption).attr('selected', 'selected');
                $productContainer.find($attr).prop('selectedIndex', $(currentSelectedOption).index());
            }
        }
    });
}

/**
 * Routes the handling of attribute processing depending on whether the attribute has image
 *     swatches or not
 *
 * @param {Object} attrs - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {jQuery} $productContainer - DOM element for a given product
 * @param {Object} msgs - object containing resource messages
 */
function updateAttrs(attrs, $productContainer, msgs) {
    var methods = this;

    //Get the available swatchable attribute array ['color','size'] (currently defined as a site pref, and added as a data attribute to the product container element
    var attrsWithSwatches = $productContainer.data('swatchable-attributes');

    attrs.forEach(function (attr) {
        if (attrsWithSwatches && attrsWithSwatches.indexOf(attr.attributeId) > -1) {
            methods.processSwatchValues(attr, $productContainer, msgs);
        } else {
            methods.processNonSwatchValues(attr, $productContainer, msgs);
        }
    });
}

/**
 * Updates the availability status in the Product Detail Page
 *
 * @param {Object} response - Ajax response object after an
 *                            attribute value has been [de]selected
 * @param {jQuery} $productContainer - DOM element for a given product
 */
function updateAvailabilityProcess(response, $productContainer) {
    var availabilityValue = '';
    var availabilityMessages = response.product.availability.messages;
    if (!response.product.readyToOrder) {
        availabilityValue = '<li><div>' + response.resources.info_selectforstock + '</div></li>';
    } else {
        availabilityMessages.forEach(function (message) {
            availabilityValue += '<li><div>' + message + '</div></li>';
        });
    }

    $($productContainer).trigger('product:updateAvailability', {
        product: response.product,
        $productContainer: $productContainer,
        message: availabilityValue,
        resources: response.resources
    });
}

/**
 * Generates html for product attributes section
 *
 * @param {array} attributes - list of attributes
 * @return {string} - Compiled HTML
 */
function getAttributesHtml(attributes) {
    if (!attributes) {
        return '';
    }

    var html = '';

    attributes.forEach(function (attributeGroup) {
        if (attributeGroup.ID === 'mainAttributes') {
            attributeGroup.attributes.forEach(function (attribute) {
                html += '<div class="attribute-values">' + attribute.label + ': '
                    + attribute.value + '</div>';
            });
        }
    });

    return html;
}

/**
 * @typedef UpdatedOptionValue
 * @type Object
 * @property {string} id - Option value ID for look up
 * @property {string} url - Updated option value selection URL
 */

/**
 * @typedef OptionSelectionResponse
 * @type Object
 * @property {string} priceHtml - Updated price HTML code
 * @property {Object} options - Updated Options
 * @property {string} options.id - Option ID
 * @property {UpdatedOptionValue[]} options.values - Option values
 */

/**
 * Updates DOM using post-option selection Ajax response
 *
 * @param {OptionSelectionResponse} optionsHtml - Ajax response optionsHtml from selecting a product option
 * @param {jQuery} $productContainer - DOM element for current product
 */
function updateOptions(optionsHtml, $productContainer) {
	// Update options
    $productContainer.find('.product-options').empty().html(optionsHtml);
}

/**
 * Updates slider for PDP main images and thumbnails from response containing images
 * @param {Object[]} imgs - Array of large product images,along with related information
 * @param {jQuery} $productContainer - DOM element for a given product
 */
function createSlider(images, assets, $productContainer) {
    var $sliderContainers = $productContainer.find('.slider-container');
    var data = images !== null ? {images} : null;
    data.assets = assets || null;

    // Reversing order in which to update sliders so that thumbnails get initialized first
    $($sliderContainers.get().reverse()).each((index, sliderContainer) => {
        var $slider = $(sliderContainer).find('.slider');

        // MARTIN MOD : carry through the no-zoom behavior from the previous variation
        data.zoom = $slider.find('.no-zoom').length === 0;

        $slider.trigger('slider:update', data);
    });
}

/**
 * Parses JSON from Ajax call made whenever an attribute value is [de]selected
 * @param {Object} response - response from Ajax call
 * @param {Object} response.product - Product object
 * @param {string} response.product.id - Product ID
 * @param {Object[]} response.product.variationAttributes - Product attributes
 * @param {Object[]} response.product.images - Product images
 * @param {boolean} response.product.hasRequiredAttrsSelected - Flag as to whether all required
 *     attributes have been selected.  Used partially to
 *     determine whether the Add to Cart button can be enabled
 * @param {jQuery} $productContainer - DOM element for a given product.
 */
function handleVariantResponse(response, $productContainer) {
    var isChoiceOfBonusProducts = $productContainer.parents('.choose-bonus-product-dialog').length > 0;
    var isVariant;
    var isSetItem = $productContainer.hasClass('product-set-item-detail') ? true : false;

    if (response.product.variationAttributes) {
        this.updateAttrs(response.product.variationAttributes, $productContainer, response.resources);
        isVariant = response.product.productType === 'variant';
        if (isChoiceOfBonusProducts && isVariant) {
            $productContainer.parent('.bonus-product-item').data('pid', response.product.id);
            $productContainer.parent('.bonus-product-item').data('ready-to-order', response.product.readyToOrder);
        }
    }

    // Update primary images
    var primaryImages = response.product.images;
    var pdpGalleryAssets = response.product.pdpGalleryAssets;
    var $oldWishlistIcon = $productContainer.find('div.slide .product-list-enhancements-toggle-product').first().clone(true);

    this.createSlider(primaryImages, pdpGalleryAssets, $productContainer);
    // if variant is a product set item, update the sample image
    if (isSetItem) {
        $productContainer
            .find('.product-set-item-main-image')
            .attr('src', primaryImages.large[0].url)
            .attr('alt', primaryImages.large[0].alt);
    }

    // Update pricing
    if (!isChoiceOfBonusProducts) {
        var $priceSelector = $('.prices .price', $productContainer).length
            ? $('.prices .price', $productContainer)
            : $('.prices .price');
        $priceSelector.replaceWith(response.product.price.html);
    }

    // Update promotions
    $productContainer.find('.promotions').empty().html(response.product.promotionsHtml);

    this.updateAvailabilityProcess(response, $productContainer);

    if (isChoiceOfBonusProducts) {
        var $selectButton = $productContainer.find('.select-bonus-product');
        $selectButton.trigger('bonusproduct:updateSelectButton', {
            product: response.product, $productContainer: $productContainer
        });
    } else {
        // Enable "Add to Cart" button if all required attributes have been selected
        $('button.add-to-cart, button.add-to-cart-global, button.update-cart-product-global').trigger('product:updateAddToCart', {
            product: response.product, $productContainer: $productContainer
        }).trigger('product:statusUpdate', response.product);
    }

    // Update attributes
    $productContainer.find('.main-attributes').empty().html(this.getAttributesHtml(response.product.attributes));

    // Update wishlist
    if ($oldWishlistIcon && $oldWishlistIcon.length) {
        var $newWishlistIcon = $oldWishlistIcon;
        $newWishlistIcon.attr('data-wishlistpid', response.product.wishlistpid);

        //Make heart icon accurate
        var wishlist = require('../productListEnhancements/helpers.js');
        wishlist.updateLinkData($newWishlistIcon);

        var $newSliderMainImages = $productContainer.find('div.primary-images-main div.slide img');
        $newSliderMainImages.each((_i, newImage) => {
            var $newImage = $(newImage);
            $newImage.after($newWishlistIcon.clone(true));
        });
    }
}

/**
 * @typespec UpdatedQuantity
 * @type Object
 * @property {boolean} selected - Whether the quantity has been selected
 * @property {string} value - The number of products to purchase
 * @property {string} url - Compiled URL that specifies variation attributes, product ID, options,
 *     etc.
 */

/**
 * Updates the quantity DOM elements post Ajax call
 * @param {UpdatedQuantity[]} quantities -
 * @param {jQuery} $productContainer - DOM container for a given product
 */
function updateQuantities(quantities, $productContainer) {
    if ($productContainer.parent('.bonus-product-item').length <= 0) {
        var optionsHtml = quantities.map(function (quantity) {
            var selected = quantity.selected ? ' selected ' : '';
            return '<option value="' + quantity.value + '"  data-url="' + quantity.url + '"' +
                selected + '>' + quantity.value + '</option>';
        }).join('');
        this.getQuantitySelector($productContainer).empty().html(optionsHtml);
    }
}

/**
 * updates the product view when a product attribute is selected or deselected or when
 *         changing quantity
 * @param {string} selectedValueUrl - the Url for the selected variation value
 * @param {string} selectedValueHtmlUrl - the url to fetch variation html
 * @param {jQuery} $productContainer - DOM element for current product
 */
function attributeSelect(selectedValueUrl, selectedValueHtmlUrl, $productContainer) {
    var methods = this;

    if (selectedValueUrl) {
        $('body').trigger('product:beforeAttributeSelect',
            { url: selectedValueUrl, container: $productContainer });

        $.ajax({
            url: selectedValueUrl,
            method: 'GET',
        })
            .then((data) => {
                methods.handleVariantResponse(data, $productContainer);
                methods.updateOptions(data.product.optionsHtml, $productContainer);
                methods.updateQuantities(data.product.quantities, $productContainer);

                $('body').trigger('product:afterAttributeSelect',
                    { data: data, container: $productContainer });
            })
            .then(() => {
                /**
                 * Fetch html updates for variation -- SFCC struggles to parse waincludes
                 * in json responses so this is a necessary evil.
                 */
                if (selectedValueHtmlUrl && typeof selectedValueHtmlUrl !== 'undefined') {
                    return $.ajax({
                        url: selectedValueHtmlUrl,
                        method: 'GET',
                        dataType: 'html'
                    })
                        .then((html) => {
                            const $html = $(html);
                            const $collapseHtml = $html.find('.main-content-item');
                            const $tabHtml = $html.find('.tabs');

                            if ($collapseHtml.length) {
                                $productContainer.find('.main-content-item').replaceWith($collapseHtml);
                            } else {$productContainer.find('.main-content-item').hide();
                            }

                            if ($tabHtml.length) {
                                $productContainer.find('.tabs').replaceWith($tabHtml);
                            } else {
                                $productContainer.find('.tabs').hide();
                            }
                        });
                }
            })
            .then(() => $.spinner().stop())
            .catch(() => $.spinner().stop());
    }
}

/**
 * Retrieves url to use when adding a product to the cart
 *
 * @return {string} - The provided URL to use when adding a product to the cart
 */
function getAddToCartUrl($productContainer) {
    return $productContainer.find('.add-to-cart-url').val();
}

/**
 * Parses the html for a modal window
 * @param {string} html - representing the body and footer of the modal window
 *
 * @return {Object} - Object with properties body and footer.
 */
function parseHtml(html) {
    var $html = $('<div>').append($.parseHTML(html));
    var body = $html.find('.choice-of-bonus-product');
    var footer = $html.find('.modal-footer').children();

    return { body: body, footer: footer };
}

/**
 * Retrieves url to use when adding a product to the cart
 *
 * @param {Object} data - data object used to fill in dynamic portions of the html
 */
function chooseBonusProducts(data) {
    var methods = this;

    $('.modal-body').spinner().start();

    if ($('#chooseBonusProductModal').length !== 0) {
        $('#chooseBonusProductModal').remove();
    }
    var bonusUrl;
    if (data.bonusChoiceRuleBased) {
        bonusUrl = data.showProductsUrlRuleBased;
    } else {
        bonusUrl = data.showProductsUrlListBased;
    }

    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="chooseBonusProductModal" tabindex="-1" role="dialog">'
        + '<span class="enter-message sr-only" ></span>'
        + '<div class="modal-dialog choose-bonus-product-dialog" '
        + 'data-total-qty="' + data.maxBonusItems + '"'
        + 'data-UUID="' + data.uuid + '"'
        + 'data-pliUUID="' + data.pliUUID + '"'
        + 'data-addToCartUrl="' + data.addToCartUrl + '"'
        + 'data-pageStart="0"'
        + 'data-pageSize="' + data.pageSize + '"'
        + 'data-moreURL="' + data.showProductsUrlRuleBased + '"'
        + 'data-bonusChoiceRuleBased="' + data.bonusChoiceRuleBased + '">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + '    <span class="">' + data.labels.selectprods + '</span>'
        + '    <button type="button" class="close pull-right" data-dismiss="modal">'
        + '        <span aria-hidden="true">&times;</span>'
        + '        <span class="sr-only"> </span>'
        + '    </button>'
        + '</div>'
        + '<div class="modal-body"></div>'
        + '<div class="modal-footer"></div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('body').append(htmlString);
    $('.modal-body').spinner().start();

    $.ajax({
        url: bonusUrl,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            var parsedHtml = methods.parseHtml(response.renderedTemplate);
            $('#chooseBonusProductModal .modal-body').empty();
            $('#chooseBonusProductModal .enter-message').text(response.enterDialogMessage);
            $('#chooseBonusProductModal .modal-header .close .sr-only').text(response.closeButtonText);
            $('#chooseBonusProductModal .modal-body').html(parsedHtml.body);
            $('#chooseBonusProductModal .modal-footer').html(parsedHtml.footer);
            $('#chooseBonusProductModal').modal('show');
            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 * @param {string} response - ajax response from clicking the add to cart button
 */
function handlePostCartAdd(response) {
    // conditional added for response, sometimes it was failing when called on page load
    if (response) {
        $('.minicart').trigger('count:update', response);
        var messageType = response.error ? 'alert-danger' : 'alert-success';
        // show add to cart toast
        if (response.newBonusDiscountLineItem
            && Object.keys(response.newBonusDiscountLineItem).length !== 0) {
            this.chooseBonusProducts(response.newBonusDiscountLineItem);
        } else {
            if ($('.add-to-cart-messages').length === 0) {
                $('body').append(
                    '<div class="add-to-cart-messages"></div>'
                );
            }

            $('.add-to-cart-messages').append(
                '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
                + response.message
                + '</div>'
            );

            setTimeout(function () {
                $('.add-to-basket-alert').remove();
            }, 5000);
        }
    }
}

/**
 * Retrieves the bundle product item ID's for the Controller to replace bundle master product
 * items with their selected variants
 *
 * @return {string[]} - List of selected bundle product item ID's
 */
function getChildProducts() {
    var childProducts = [];
    $('.bundle-item').each(function () {
        childProducts.push({
            pid: $(this).find('.product-id').text(),
            quantity: parseInt($(this).find('label.quantity').data('quantity'), 10)
        });
    });

    return childProducts.length ? JSON.stringify(childProducts) : [];
}

/**
 * Retrieve product options
 *
 * @param {jQuery} $productContainer - DOM element for current product
 * @return {string} - Product options and their selected values
 */
function getOptions($productContainer) {
    var options = $productContainer
        .find('.product-option')
        .map(function () {
            var $elOption = $(this).find('.options-select');
            var urlValue = $elOption.val();
            var selectedValueId = $elOption.find('option[value="' + urlValue + '"]')
                .data('value-id');
            return {
                optionId: $(this).data('option-id'),
                selectedValueId: selectedValueId
            };
        }).toArray();

    return JSON.stringify(options);
}

/**
 * Makes a call to the server to report the event of adding an item to the cart
 *
 * @param {string | boolean} url - a string representing the end point to hit so that the event can be recorded, or false
 */
function miniCartReportingUrl(url) {
    if (url) {
        $.ajax({
            url: url,
            method: 'GET',
            success: function () {
                // reporting urls hit on the server
            },
            error: function () {
                // no reporting urls hit on the server
            }
        });
    }
}

function enableQuantitySteppers($context = $('body')) {
    var scope = this;
    var $steppers = $context.find('.quantity-stepper');
    if ($steppers.length) {
        $steppers.each((index, stepper) => {
            var $stepper = $(stepper);
            scope.methods.updateQuantityStepperDisabledStates($stepper);
            scope.methods.bindQuantityStepperButtons($stepper);
            scope.methods.bindQuantityStepperInput($stepper);
        });
    }
}

function updateQuantityStepperDisabledStates($stepper) {
    var min = parseInt($stepper.attr('data-min'));
    var max = parseInt($stepper.attr('data-max'));
    var $input = $stepper.find('input');
    var $minusButton = $stepper.find('[data-action="decrease"]');
    var $plusButton = $stepper.find('[data-action="increase"]');
    var value = !isNaN(parseInt($input.prop('data-qty'))) ? parseInt($input.prop('data-qty')) : parseInt($input.attr('data-qty'));

    if (value <= min) {
        $minusButton.addClass('disabled');
    } else {
        $minusButton.removeClass('disabled');
    }

    if (value >= max) {
        $plusButton.addClass('disabled');
    } else {
        $plusButton.removeClass('disabled');
    }
}

function bindQuantityStepperButtons($stepper) {
    var methods = this;
    var $select = $stepper.prev('select');
    var min = parseInt($stepper.data('min'));
    var max = parseInt($stepper.data('max'));

    $stepper.find('button').off('click').click(event => {
        var $button = $(event.target);
        var action = $button.data('action');
        var previousValue = parseInt($stepper.find('input').val());
        var newValue = previousValue;

        if (action === 'increase' && (previousValue + 1 <= max)) {
            newValue++;
        }
        if (action === 'decrease' && (previousValue - 1 >= min)) {
            newValue--;
        }
        if (newValue !== previousValue) {
            $select.find('option[value="' + newValue + '"]').prop('selected', true).change();
            $stepper.find('input').prop('value', newValue).prop('data-qty', newValue);
            methods.updateQuantityStepperDisabledStates($stepper);
            $('body').trigger('quantityStepper:change', $stepper);
        }
    });
}

function bindQuantityStepperInput($stepper) {
    var methods = this;

    var $select = $stepper.prev('select');
    var min = parseInt($stepper.data('min'));
    var max = parseInt($stepper.data('max'));

    $stepper.find('input').off('change').change(event => {
        var $input = $(event.target);
        var previousValue = !isNaN(parseInt($input.prop('data-qty'))) ? parseInt($input.prop('data-qty')) : parseInt($input.attr('data-qty'));
        var newValue = parseInt($input.val());

        if (!isNaN(newValue) && newValue <= max && newValue >= min) {
            $select.find('option[value="' + newValue + '"]').prop('selected', true).change();
            $input.prop('value', newValue).prop('data-qty', newValue);
            methods.updateQuantityStepperDisabledStates($stepper);
            $('body').trigger('quantityStepper:change', $stepper);
        } else {
            $input.prop('value', previousValue);
        }
    });
}

/**
 * Preselect Single Swatches if only one variant available and it is a swatch
   *
   * @param {object} $productContainer - DOM element holding attributes
   * @return {array} - The swatch elements that need to be selected - in this case it's just one
*/
function preselectSingleSwatchesInContainer(containerSelector = 'body') {
    var swatches = [];
    if ($(containerSelector) && $(containerSelector).length > 0) {
        var attributes = $(containerSelector).find('.attribute');
        $.each(attributes, function () {
            var disSwatch = $(this).find('.swatch');
            if (disSwatch.length == 1) {
                var firstswatch = $(disSwatch[0]);
                // If the single swatch is already preselected do not add it to the list to be selected (i.e. going straight to a variation's pdp)
                if (!firstswatch.find('span.selectable').hasClass('selected')) {
                    swatches.push(firstswatch);
                }
                //If we want to hide the attribute selection completely when there is only one choice
                //disSwatch.parents('.attribute').addClass('visually-hidden');
            }
        });
        this.methods.selectSwatch(swatches);
    }
}

/**
 * Select Swatches takes an array of swatch dom elements that need to be preselected
   *
   * @param {array} The swatch elements that need to be selected
*/
function selectSwatch(swatches) {
    var methods = this;

    if (swatches.length > 0) {
        // This splice removes the first swatch element from the array, and stores it in the "swatch" variable
        var swatch = swatches.splice(0,1)[0];

        if ($('.product-bundle').length) {
            var $productContainer = $('.bundle-main-product').length ? $(swatch).closest('.bundle-main-product') : $(swatch).closest('.product-bundle');
        } else {
            var $productContainer = $(swatch).closest('.set-item');
        }

        if (!$productContainer.length) {
            $productContainer = $(swatch).closest('.product-detail');
        }

        $productContainer.find('.color-display-value').text($(swatch).data('displayvalue'));

        // This call triggers the selection of the current swatch element, and sends the new array to be passed back to this function afterward.
        methods.attributeSelect($(swatch).attr('data-url'), $(swatch).attr('data-html-url'), $productContainer, function() {
            methods.selectSwatch(swatches);
        });
    }
}

function updateProductListEnhancementsButtons() {
    var $oldProductListEnhancementsIcon;

    $('body')
        .on('product:beforeAttributeSelect', function(e, attrData) {
            $oldProductListEnhancementsIcon = attrData.container.find('div.slide .product-list-enhancements-toggle-product').first().clone(true);
        })
        .on('product:afterAttributeSelect', function(e, attrData) {
            if ($oldProductListEnhancementsIcon && $oldProductListEnhancementsIcon.length) {
                var $newProductListEnhancementsIcon = $oldProductListEnhancementsIcon;
                var $newSliderMainImages = attrData.container.find('div.primary-images-main div.slide img');

                $newProductListEnhancementsIcon.attr('data-wishlistpid', attrData.wishlistpid);
                productListEnhancementsHelpers.updateLinkData($newProductListEnhancementsIcon);

                $newSliderMainImages.each((_i, newImage) => {
                    var $newImage = $(newImage);

                    $newImage.after($newProductListEnhancementsIcon.clone(true));
                });
            }
        });
}

module.exports = {
    methods: {
        attributeSelect: attributeSelect,
        bindQuantityStepperButtons: bindQuantityStepperButtons,
        bindQuantityStepperInput: bindQuantityStepperInput,
        checkForClickableAttribute: checkForClickableAttribute,
        chooseBonusProducts: chooseBonusProducts,
        createSlider: createSlider,
        getAddToCartUrl: getAddToCartUrl,
        getAttributesHtml: getAttributesHtml,
        getChildProducts: getChildProducts,
        getOptions: getOptions,
        getPidValue: getPidValue,
        getQuantitySelected: getQuantitySelected,
        getQuantitySelector: getQuantitySelector,
        handlePostCartAdd: handlePostCartAdd,
        handleVariantResponse: handleVariantResponse,
        miniCartReportingUrl: miniCartReportingUrl,
        parseHtml: parseHtml,
        processNonSwatchValues: processNonSwatchValues,
        processSwatchValues: processSwatchValues,
        selectSwatch: selectSwatch,
        updateAttrs: updateAttrs,
        updateAvailabilityProcess: updateAvailabilityProcess,
        updateOptions: updateOptions,
        updateQuantities: updateQuantities,
        updateQuantityStepperDisabledStates: updateQuantityStepperDisabledStates,
        updateProductListEnhancementsButtons: updateProductListEnhancementsButtons
    },

    /**********
     * shared across QV and PDP
     */
    addToCart: function () {
        var scope = this;

        // if qty stepper input has focus, we need to blur it so product data can update before button click
        $(document).on('mouseenter', 'button.add-to-cart, button.add-to-cart-global', function (event) {
            var $button = $(event.target);
            var $container = $button.closest('.product-detail');
            if (!$container.length) {
                $container = $button.closest('.quick-view-dialog');
            }
            var $qtyStepperInput = $container.find('.quantity-stepper input');

            if ($qtyStepperInput.length && $qtyStepperInput.is(':focus')) {
                $qtyStepperInput.blur();
            }
        });

        $(document).on('click', 'button.add-to-cart, button.add-to-cart-global', function (event) {
            var addToCartUrl;
            var pid;
            var pidsObj;
            var setPids;
            var quantity;

            $('body').trigger('product:beforeAddToCart', this);

            if ($('.set-items').length && $(this).hasClass('add-to-cart-global')) {
                setPids = [];

                var $products = $(this).closest('.product-detail').find('.product-set-item-detail');
                if (!$products.length) {
                    if ($(this).closest('.quick-view-dialog').length) {
                        $products = $(this).closest('.quick-view-dialog').find('.product-set-item-detail');
                    } else {
                        $products = $('.product-detail');  // pagedesigner component 'Add all to cart btn' won't have .product-set-item-detail classes
                    }
                }

                $products.each(function () {
                    if (!$(this).hasClass('product-set-detail')) {
                        setPids.push({
                            pid: $(this).find('.product-id').text(),
                            qty: $(this).find('.quantity-select').val(),
                            options: scope.methods.getOptions($(this))
                        });
                    }
                });
                pidsObj = JSON.stringify(setPids);
            }

            pid = scope.methods.getPidValue($(this));

            quantity = $(this).hasClass('single-variant-quick-add-to-cart') ? 1 : scope.methods.getQuantitySelected($(this));

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                if ($(this).hasClass('single-variant-quick-add-to-cart')) {
                    addToCartUrl = $(this).data('url');
                } else {
                    $productContainer = $(this).closest('.quick-view-dialog').find('.product-detail');
                    var $productModalbody = $(this).closest('.modal-content');
                    addToCartUrl = scope.methods.getAddToCartUrl($productModalbody);
                }
            } else {
                addToCartUrl = scope.methods.getAddToCartUrl($productContainer);
            }

            var form = {
                pid: pid,
                pidsObj: pidsObj,
                childProducts: scope.methods.getChildProducts(),
                quantity: quantity,
                options: scope.methods.getOptions($productContainer)
            };

            $(this).trigger('updateAddToCartFormData', form);
            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        scope.methods.handlePostCartAdd(data);
                        $('body').trigger('product:afterAddToCart', data);
                        $('body').trigger('product:afterAddToCartQuickview', data); //cart page quickview only
                        $.spinner().stop();
                        scope.methods.miniCartReportingUrl(data.reportingURL);
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    },
    quickAddToCart: function () {
        $('body').on('product:singleSelectQuickAddToCart', function (e, response) {
            var addToCartUrl = getAddToCartUrl(response.container);

            var form = {
                pid: response.data.product.id,
                quantity: 1
            };

            $(response.container).trigger('updateAddToCartFormData', form);
            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        handlePostCartAdd(data);
                        $('body').trigger('product:afterAddToCart', data);
                        $.spinner().stop();
                        miniCartReportingUrl(data.reportingURL);
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    },
    updateAvailability: function () {
        $('body').on('product:updateAvailability', function (e, response) {
            var $productContainer = response.$productContainer;
            // bundle individual products
            $productContainer.find('.product-availability')
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available)
                .find('.availability-msg')
                .empty()
                .html(response.message);
            //Quickview
            var $dialog = $productContainer.closest('.quick-view-dialog');
            if ($dialog.length){
                if ($dialog.find('.product-availability').length) {
                    // bundle all products
                    var allAvailable = $dialog.find('.product-availability').toArray()
                        .every(function (item) { return $(item).data('available'); });

                    var allReady = $dialog.find('.product-availability').toArray()
                        .every(function (item) { return $(item).data('ready-to-order'); });

                    $dialog.find('.global-availability')
                        .data('ready-to-order', allReady)
                        .data('available', allAvailable);

                    $dialog.find('.global-availability .availability-msg').empty()
                        .html(allReady ? response.message : response.resources.info_selectforstock);
                } else {
                    // single product
                    $dialog.find('.global-availability')
                        .data('ready-to-order', response.product.readyToOrder)
                        .data('available', response.product.available)
                        .find('.availability-msg')
                        .empty()
                        .html(response.message);
                }
            //main PDP
            } else {
                if ($productContainer.find('.global-availability').length) {
                    var allAvailable = $productContainer.find('.product-availability').toArray()
                        .every(function (item) { return $(item).data('available'); });

                    var allReady = $productContainer.find('.product-availability').toArray()
                        .every(function (item) { return $(item).data('ready-to-order'); });

                    $productContainer.find('.global-availability')
                        .data('ready-to-order', allReady)
                        .data('available', allAvailable);

                    $productContainer.find('.global-availability .availability-msg').empty()
                        .html(allReady ? response.message : response.resources.info_selectforstock);
                }
            }
        });
    },
    availability: function () {
        var scope = this;

        $(document).on('change', '.quantity-select', function (e) {
            e.preventDefault();

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.modal-content').find('.product-quickview');
            }

            if ($('.bundle-items', $productContainer).length === 0) {
                scope.methods.attributeSelect($(e.currentTarget).find('option:selected').data('url'),
                    $(e.currentTarget).find('option:selected').data('htmlUrl'),
                    $productContainer);
            }
        });
    },
    updateSetItemsAvailability: function () {
        var scope = this;

        $(document).on('change', '.product-set-quantity-select', function (e) {
            e.preventDefault();

            var $productContainer = $(this).closest('.product-set-detail').find('.set-items');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.modal-content').find('.set-items');
            }
            var $quantitySelected = $(e.currentTarget).find('option:selected').val();

            $productContainer.find('.product-set-item-detail').each(function () {
                var $setItemQuantity = $(this).find('.quantity-select');
                var qtyStepper = $(this).find('.quantity-stepper');
                $setItemQuantity.val($quantitySelected).find('option').each(function () {
                    if (this.value == $quantitySelected) {
                        $(this).prop('selected','selected');
                        $setItemQuantity.change();
                        if (qtyStepper.length) {
                            qtyStepper.find('input').val($quantitySelected).attr('data-qty',$quantitySelected);
                            scope.methods.updateQuantityStepperDisabledStates(qtyStepper);
                        }
                        return false;
                    }
                })
            });
        });
    },
    updateAddToCart: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            var $productContainer = response.$productContainer;
            // update local add to cart (for sets)
            $productContainer.find('button.add-to-cart').attr('disabled',
                (!response.product.readyToOrder || !response.product.available));
            // update global add to cart (single products, bundles)
            var $dialog = $(response.$productContainer).closest('.quick-view-dialog');
            if ($dialog.length){
                $dialog.find('.add-to-cart-global, .update-cart-product-global').attr('disabled',
                    !$dialog.find('.global-availability').data('ready-to-order')
                    || !$dialog.find('.global-availability').data('available')
                );
            } else {
                var enable = $productContainer.find('.product-availability').toArray().every(function (item) {
                    return $(item).data('available') && $(item).data('ready-to-order');
                });
                $productContainer.find('button.add-to-cart-global').attr('disabled', !enable);
            }
        });
    },
    updateAttribute: function() {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            response.container.find('#sizeChartModal').attr('data-product', response.data.product.id);

            //Quickview
            if ($('.modal.show .product-quickview>.bundle-items').length) {
                $('.modal.show').find(response.container).data('pid', response.data.product.id);
                $('.modal.show').find(response.container).find('.product-id').text(response.data.product.id);
            } else if ($('.set-items').length) {
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.modal.show .product-quickview').length) {
                $('.modal.show .product-quickview').data('pid', response.data.product.id);
                $('.modal.show .full-pdp-link').attr('href', response.data.product.selectedProductUrl);
                $('.modal.show').find(response.container).find('.product-id').text(response.data.product.id);
            //Main PDP
            } else if ($('.product-detail>.bundle-items').length) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.product-set-detail').eq(0)) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
                response.container.find('.add-to-cart').data('pid', response.data.product.id);
            } else {
                $('.product-detail .add-to-cart').data('pid', response.data.product.id);
                $('.product-id').text(response.data.product.id);
                $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
            }
        });
    },
    quickViewLoaded: function() {
        var scope = this;
        $(document).on('quickview:ready', 'body', (event, modal) => {
            scope.enableQuantitySteppers($(modal));
        });
    },
    miniCartLoaded: function() {
        var scope = this;
        $('body').on('minicart:loaded', (event, minicart) => {
            scope.enableQuantitySteppers($(minicart));
        });
    },
    preselectSingleSwatchesInContainer: preselectSingleSwatchesInContainer,
    //Attributes that display as non-color swatches
    nonColorAttribute: function () {
        var scope = this;

        $(document).on('click', 'button.swatch:not(.color-attribute)', function (e) {
            e.preventDefault();

            $('body').trigger('product:swatchClicked', [$(this), toggleObject]); // add trigger for any attribute click use (incl. nonClickable Attrs)
            if (scope.methods.checkForClickableAttribute($(this)) && !toggleObject.viewOutOfStockItems) {
                return;
            }

            if ($('.product-bundle').length) {
                var $productContainer = $('.bundle-main-product').length ? $(this).closest('.bundle-main-product') : $(this).closest('.product-bundle');
            } else {
                var $productContainer = $(this).closest('.set-item');
            }

            if (!$productContainer.length) {
                $productContainer = $(this).closest('.product-detail');
            }

            scope.methods.attributeSelect($(this).attr('data-url'), $(this).attr('data-html-url'), $productContainer);

            $(this).closest('.non-color-attribute-swatches').find('.non-color-display-value').text($(this).find('.swatch-value').data('display-value'));
        });
    },
    //Attributes that display in a select dropdown (default)
    selectAttribute: function () {
        var scope = this;
        $(document).on('change', 'select[class*="select-"], .options-select', function (e) {
            e.preventDefault();

            if ($('.product-bundle').length) {
                var $productContainer = $('.bundle-main-product').length ? $(this).closest('.bundle-main-product') : $(this).closest('.product-bundle');
            } else {
                var $productContainer = $(this).closest('.set-item');
            }

            if (!$productContainer.length) {
                $productContainer = $(this).closest('.product-detail');
            }
            scope.methods.attributeSelect(e.currentTarget.value, $(this).find('option:selected').data('htmlUrl'), $productContainer);
        });
    },
    //Attributes that display as color swatches
    colorAttribute: function () {
        var scope = this;

        $(document).on('click', '[data-attr="color"] button', function (e) {
            e.preventDefault();

            $('body').trigger('product:swatchClicked', [$(this), toggleObject]); // add trigger for any attribute click use (incl. nonClickable Attrs)
            if (scope.methods.checkForClickableAttribute($(this)) && !toggleObject.viewOutOfStockItems) {
                return;
            }

            if ($('.product-bundle').length) {
                var $productContainer = $('.bundle-main-product').length ? $(this).closest('.bundle-main-product') : $(this).closest('.product-bundle');
            } else {
                var $productContainer = $(this).closest('.set-item');
            }

            if (!$productContainer.length) {
                $productContainer = $(this).closest('.product-detail');
            }
            scope.methods.attributeSelect($(this).attr('data-url'), $(this).attr('data-html-url'), $productContainer);

            $productContainer.find('.color-display-value').text($(this).find('.swatch').data('displayvalue'));
        });
    },
    enableQuantitySteppers: enableQuantitySteppers,

    sizeChart: function() {
        $('body').on('click', '.size-chart .size-chart-launcher', event => {
            event.preventDefault();
            var url = $(event.target).attr('href');
            var productId = $(event.target).closest('.product-detail').find('.product-id').html();
            var $sizeChartModal = $('.modal[data-product=' + productId + ']');
            var $modalBody = $sizeChartModal.find('.modal-body');

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'html',
                success: function (data) {
                    $modalBody.html(data);
                }
            });

            //if the sizechart is from a quickview append after all the modal-backdrops
            if ($(event.target).parents('.product-quickview').length) {
                var $sizeChartContainer = $(event.target).closest('.size-chart');

                $sizeChartModal.appendTo('body');
                $sizeChartModal.on('hide.bs.modal', event => {
                    $sizeChartModal.appendTo($sizeChartContainer);
                });
            }
            $sizeChartModal.modal('show');
        });

        $('body').on('click', '#sizeChartModal .close', event =>  {
            $(event.target).closest('#sizeChartModal').modal('hide');
        });
    },

    /**********
     * from cart
     */
    bonusProductEdit: function() {
        var scope = this;

        $('body').on('bonusproduct:edit', (event, data) => {
            scope.methods.chooseBonusProducts(data);
        });
    },
    removeBonusProduct: function () {
        $(document).on('click', '.selected-pid .remove-bonus-product', event => {
            $(event.target).closest('.selected-pid').remove();
            var $selected = $('#chooseBonusProductModal .selected-bonus-products .selected-pid');
            var count = 0;
            if ($selected.length) {
                $selected.each(function () {
                    count += parseInt($(this).data('qty'), 10);
                });
            }

            $('.pre-cart-products').html(count);
            $('.selected-bonus-products .bonus-summary').removeClass('alert-danger');
            $('body').trigger('modal:loaded', $('#chooseBonusProductModal')); // update quickview modal scroll height
        });
    },
    selectBonusProduct: function () {
        $(document).on('click', '.select-bonus-product', function () {
            var $choiceOfBonusProduct = $(this).parents('.choice-of-bonus-product');
            var pid = $(this).data('pid');
            var maxPids = $('.choose-bonus-product-dialog').data('total-qty');
            var submittedQty = parseInt($choiceOfBonusProduct.find('.bonus-quantity-select').val(), 10);
            var totalQty = 0;
            $.each($('#chooseBonusProductModal .selected-bonus-products .selected-pid'), function () {
                totalQty += $(this).data('qty');
            });
            totalQty += submittedQty;
            var optionID = $choiceOfBonusProduct.find('.product-option').data('option-id');
            var valueId = $choiceOfBonusProduct.find('.options-select option:selected').data('valueId');
            if (totalQty <= maxPids) {
                var selectedBonusProductHtml = ''
                + '<div class="selected-pid" '
                + 'data-pid="' + pid + '"'
                + 'data-qty="' + submittedQty + '"'
                + 'data-optionID="' + (optionID || '') + '"'
                + 'data-option-selected-value="' + (valueId || '') + '"'
                + '>'
                + '<div class="bonus-product-name">'
                + $choiceOfBonusProduct.find('.product-name').html()
                + '</div>'
                + '<div class="remove-bonus-product"></div>'
                + '</div>'
                ;
                $('#chooseBonusProductModal .selected-bonus-products .bonus-summary-products-container').append(selectedBonusProductHtml);
                $('.pre-cart-products').html(totalQty);
                $('.selected-bonus-products .bonus-summary').removeClass('alert-danger');
                $('body').trigger('modal:loaded', $('#chooseBonusProductModal')); // update quickview modal scroll height
            } else {
                $('.selected-bonus-products .bonus-summary').addClass('alert-danger');
            }
        });
    },
    enableBonusProductSelection: function () {
        $('body').on('bonusproduct:updateSelectButton', function (e, response) {
            $('button.select-bonus-product', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));
            var pid = response.product.id;
            $('button.select-bonus-product', response.$productContainer).data('pid', pid);
        });
    },
    focusChooseBonusProductModal: function () {
        var scope = this;

        $('body').on('shown.bs.modal', '#chooseBonusProductModal', function() {
            scope.enableQuantitySteppers($(this));
            $('body').trigger('quickview:ready', $('#chooseBonusProductModal'));
            $('#chooseBonusProductModal').siblings().attr('aria-hidden', 'true');
            $('#chooseBonusProductModal .close').focus();
        });
    },
    showMoreBonusProducts: function () {
        var scope = this;

        $(document).on('click', '.show-more-bonus-products', function () {
            var url = $(this).data('url');
            var $modalContent = $(this).closest('.modal').find('.modal-content');
            $modalContent.spinner().start();

            $.ajax({
                url: url,
                method: 'GET',
                success: function (response) {
                    var parsedHtml = scope.methods.parseHtml(response.renderedTemplate);
                    $modalContent.find('.modal-body').append(parsedHtml.body);
                    $modalContent.find('.show-more-bonus-products:first').remove();
                    abSlider.initializeSliders($(parsedHtml.body));
                    scope.enableQuantitySteppers($(parsedHtml.body));
                    $modalContent.spinner().stop();
                },
                error: function () {
                    $modalContent.spinner().stop();
                }
            });
        });
    },
    addBonusProductsToCart: function () {
        $(document).on('click', '.add-bonus-products', function () {
            var $readyToOrderBonusProducts = $('.choose-bonus-product-dialog .selected-pid');
            var queryString = '?pids=';
            var url = $('.choose-bonus-product-dialog').data('addtocarturl');
            var pidsObject = {
                bonusProducts: []
            };

            $.each($readyToOrderBonusProducts, function () {
                var qtyOption =
                    parseInt($(this)
                        .data('qty'), 10);

                var option = null;
                if (qtyOption > 0) {
                    if ($(this).data('optionid') && $(this).data('option-selected-value')) {
                        option = {};
                        option.optionId = $(this).data('optionid');
                        option.productId = $(this).data('pid');
                        option.selectedValueId = $(this).data('option-selected-value');
                    }
                    pidsObject.bonusProducts.push({
                        pid: $(this).data('pid'),
                        qty: qtyOption,
                        options: [option]
                    });
                    pidsObject.totalQty = parseInt($('.pre-cart-products').html(), 10);
                }
            });
            queryString += JSON.stringify(pidsObject);
            queryString = queryString + '&uuid=' + $('.choose-bonus-product-dialog').data('uuid');
            queryString = queryString + '&pliuuid=' + $('.choose-bonus-product-dialog').data('pliuuid');
            $.spinner().start();
            $.ajax({
                url: url + queryString,
                method: 'POST',
                success: function (data) {
                    $.spinner().stop();
                    if (data.error) {
                        $('#chooseBonusProductModal').modal('hide');
                        if ($('.add-to-cart-messages').length === 0) {
                            $('body').append('<div class="add-to-cart-messages"></div>');
                        }
                        $('.add-to-cart-messages').append(
                            '<div class="alert alert-danger add-to-basket-alert text-center"'
                            + ' role="alert">'
                            + data.errorMessage + '</div>'
                        );
                        setTimeout(function () {
                            $('.add-to-basket-alert').remove();
                        }, 3000);
                    } else {
                        $('.configure-bonus-product-attributes').html(data);
                        $('.bonus-products-step2').removeClass('hidden-xl-down');
                        $('#chooseBonusProductModal').modal('hide');

                        if ($('.add-to-cart-messages').length === 0) {
                            $('body').append('<div class="add-to-cart-messages"></div>');
                        }
                        $('.minicart-quantity').html(data.totalQty);
                        $('.add-to-cart-messages').append(
                            '<div class="alert alert-success add-to-basket-alert text-center"'
                            + ' role="alert">'
                            + data.msgSuccess + '</div>'
                        );
                        setTimeout(function () {
                            $('.add-to-basket-alert').remove();
                            if ($('.cart-page').length) {
                                location.reload();
                            }
                        }, 1500);
                    }
                },
                error: function () {
                    $.spinner().stop();
                }
            });
        });
    },
    trapChooseBonusProductModalFocus: function () {
        $('body').on('keydown', '#chooseBonusProductModal', function (e) {
            var focusParams = {
                event: e,
                containerSelector: '#chooseBonusProductModal',
                firstElementSelector: '.close',
                lastElementSelector: '.add-bonus-products'
            };
            focusHelper.setTabNextFocus(focusParams);
        });
    },
    onClosingChooseBonusProductModal: function () {
        $('body').on('hidden.bs.modal', '#chooseBonusProductModal', function () {
            $('#chooseBonusProductModal').siblings().attr('aria-hidden', 'false');
        });
    },
    updateHideShowOutOfStockInStockNotificationForm: function () {
        if (toggleObject.viewOutOfStockItems && toggleObject.viewBackInStockNotificationForm) {
            $('body').on('product:afterAttributeSelect', function(e, attrData) {
                var $qtyCartContainer = attrData.container && attrData.container.find('.qty-cart-container');

                if ($qtyCartContainer) {
                    $qtyCartContainer.each(function () {
                        var $container = $(this);
                        var $addToCartBtn = $container.find('.addtocartbutton');
                        var $qty = $container.find('.quantity');
                        var $bisnForm = $container.find('.bisnform');
                        var product = (attrData.data || {}).product || {};

                        $bisnForm.find('.submit-success').removeClass('submit-success');
                        $bisnForm.find(':input[name="pid"]').val(product.id || '');

                        if (!!product.showBISN) {
                            $addToCartBtn.addClass('d-none');
                            $qty.addClass('d-none');
                            $bisnForm.removeClass('d-none');
                        } else {
                            $addToCartBtn.removeClass('d-none');
                            if (!attrData.data.product.hideQty) {
                                $qty.removeClass('d-none');
                            }
                            $bisnForm.addClass('d-none');
                        }
                    });
                }
            });
        }
    },
    notifyWhenBackInStock: function () {
        $('body').on('submit', '.pdp-bisn-form', function (e) {
            e.preventDefault();
            e.stopPropagation();
            //
            // Submit the Subscribe Form
            //
            var form = this,
                $form = $(form);

            $form.data('$xhr', $.ajax({
                beforeSend: function () {
                    var $xhr = this.data('$xhr');

                    $xhr && $xhr.abort();

                    $form.removeClass('submit-error');

                    return form.checkValidity();
                },
                context: $form,
                data: $form.serialize(),
                method: $form.attr('method'),
                error: function() {
                    // Validate each input
                    this.find(':input').each(function (input) { input.checkValidity(); });

                    console.error(this, arguments);
                    debugger;
                },
                success: function (data) {
                    if (data.success) {
                        $form.addClass('submit-success');

                        $('body').trigger('subscribe:success', data);

                        form.reset();
                    } else if (data.error) {
                        $form.addClass('submit-error');
                        // Hide error after delay
                        setTimeout(function () { $form.removeClass('submit-error'); }, 5000);
                    }
                },
                url: $form.attr('action')
            }));
        });
    }
};




/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                   = 'carousel'
const VERSION                = '4.3.1'
const DATA_KEY               = 'bs.carousel'
const EVENT_KEY              = `.${DATA_KEY}`
const DATA_API_KEY           = '.data-api'
const JQUERY_NO_CONFLICT     = $.fn[NAME]
const ARROW_LEFT_KEYCODE     = 37 // KeyboardEvent.which value for left arrow key
const ARROW_RIGHT_KEYCODE    = 39 // KeyboardEvent.which value for right arrow key
const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch
const SWIPE_THRESHOLD        = 40

const Default = {
  interval : 5000,
  keyboard : true,
  slide    : false,
  pause    : 'hover',
  wrap     : true,
  touch    : true
}

const DefaultType = {
  interval : '(number|boolean)',
  keyboard : 'boolean',
  slide    : '(boolean|string)',
  pause    : '(string|boolean)',
  wrap     : 'boolean',
  touch    : 'boolean'
}

const Direction = {
  NEXT     : 'next',
  PREV     : 'prev',
  LEFT     : 'left',
  RIGHT    : 'right'
}

const Event = {
  SLIDE          : `slide${EVENT_KEY}`,
  SLID           : `slid${EVENT_KEY}`,
  KEYDOWN        : `keydown${EVENT_KEY}`,
  MOUSEENTER     : `mouseenter${EVENT_KEY}`,
  MOUSELEAVE     : `mouseleave${EVENT_KEY}`,
  TOUCHSTART     : `touchstart${EVENT_KEY}`,
  TOUCHMOVE      : `touchmove${EVENT_KEY}`,
  TOUCHEND       : `touchend${EVENT_KEY}`,
  POINTERDOWN    : `pointerdown${EVENT_KEY}`,
  POINTERUP      : `pointerup${EVENT_KEY}`,
  DRAG_START     : `dragstart${EVENT_KEY}`,
  LOAD_DATA_API  : `load${EVENT_KEY}${DATA_API_KEY}`,
  CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  CAROUSEL      : 'carousel',
  ACTIVE        : 'active',
  SLIDE         : 'slide',
  RIGHT         : 'carousel-item-right',
  LEFT          : 'carousel-item-left',
  NEXT          : 'carousel-item-next',
  PREV          : 'carousel-item-prev',
  ITEM          : 'carousel-item',
  POINTER_EVENT : 'pointer-event'
}

const Selector = {
  ACTIVE      : '.active',
  ACTIVE_ITEM : '.active.carousel-item',
  ITEM        : '.carousel-item',
  ITEM_IMG    : '.carousel-item img',
  NEXT_PREV   : '.carousel-item-next, .carousel-item-prev',
  INDICATORS  : '.carousel-indicators',
  DATA_SLIDE  : '[data-slide], [data-slide-to]',
  DATA_RIDE   : '[data-ride="carousel"]'
}

const PointerType = {
  TOUCH : 'touch',
  PEN   : 'pen'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
class Carousel {
  constructor(element, config) {
    this._items         = null
    this._interval      = null
    this._activeElement = null
    this._isPaused      = false
    this._isSliding     = false
    this.touchTimeout   = null
    this.touchStartX    = 0
    this.touchDeltaX    = 0

    this._config            = this._getConfig(config)
    this._element           = element
    this._indicatorsElement = this._element.querySelector(Selector.INDICATORS)
    this._touchSupported    = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
    this._pointerEvent      = Boolean(window.PointerEvent || window.MSPointerEvent)

    this._addEventListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  next() {
    if (!this._isSliding) {
      this._slide(Direction.NEXT)
    }
  }

  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden &&
      ($(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden')) {
      this.next()
    }
  }

  prev() {
    if (!this._isSliding) {
      this._slide(Direction.PREV)
    }
  }

  pause(event) {
    if (!event) {
      this._isPaused = true
    }

    if (this._element.querySelector(Selector.NEXT_PREV)) {
      Util.triggerTransitionEnd(this._element)
      this.cycle(true)
    }

    clearInterval(this._interval)
    this._interval = null
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false
    }

    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }

    if (this._config.interval && !this._isPaused) {
      this._interval = setInterval(
        (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
        this._config.interval
      )
    }
  }

  to(index) {
    this._activeElement = this._element.querySelector(Selector.ACTIVE_ITEM)

    const activeIndex = this._getItemIndex(this._activeElement)

    if (index > this._items.length - 1 || index < 0) {
      return
    }

    if (this._isSliding) {
      $(this._element).one(Event.SLID, () => this.to(index))
      return
    }

    if (activeIndex === index) {
      this.pause()
      this.cycle()
      return
    }

    const direction = index > activeIndex
      ? Direction.NEXT
      : Direction.PREV

    this._slide(direction, this._items[index])
  }

  dispose() {
    $(this._element).off(EVENT_KEY)
    $.removeData(this._element, DATA_KEY)

    this._items             = null
    this._config            = null
    this._element           = null
    this._interval          = null
    this._isPaused          = null
    this._isSliding         = null
    this._activeElement     = null
    this._indicatorsElement = null
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX)

    if (absDeltax <= SWIPE_THRESHOLD) {
      return
    }

    const direction = absDeltax / this.touchDeltaX

    // swipe left
    if (direction > 0) {
      this.prev()
    }

    // swipe right
    if (direction < 0) {
      this.next()
    }
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      $(this._element)
        .on(Event.KEYDOWN, (event) => this._keydown(event))
    }

    if (this._config.pause === 'hover') {
      $(this._element)
        .on(Event.MOUSEENTER, (event) => this.pause(event))
        .on(Event.MOUSELEAVE, (event) => this.cycle(event))
    }

    if (this._config.touch) {
      this._addTouchEventListeners()
    }
  }

  _addTouchEventListeners() {
    if (!this._touchSupported) {
      return
    }

    const start = (event) => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchStartX = event.originalEvent.clientX
      } else if (!this._pointerEvent) {
        this.touchStartX = event.originalEvent.touches[0].clientX
      }
    }

    const move = (event) => {
      // ensure swiping with one touch and not pinching
      if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
        this.touchDeltaX = 0
      } else {
        this.touchDeltaX = event.originalEvent.touches[0].clientX - this.touchStartX
      }
    }

    const end = (event) => {
      if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
        this.touchDeltaX = event.originalEvent.clientX - this.touchStartX
      }

      this._handleSwipe()
      if (this._config.pause === 'hover') {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause()
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout)
        }
        this.touchTimeout = setTimeout((event) => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
      }
    }

    $(this._element.querySelectorAll(Selector.ITEM_IMG)).on(Event.DRAG_START, (e) => e.preventDefault())
    if (this._pointerEvent) {
      $(this._element).on(Event.POINTERDOWN, (event) => start(event))
      $(this._element).on(Event.POINTERUP, (event) => end(event))

      this._element.classList.add(ClassName.POINTER_EVENT)
    } else {
      $(this._element).on(Event.TOUCHSTART, (event) => start(event))
      $(this._element).on(Event.TOUCHMOVE, (event) => move(event))
      $(this._element).on(Event.TOUCHEND, (event) => end(event))
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return
    }

    switch (event.which) {
      case ARROW_LEFT_KEYCODE:
        event.preventDefault()
        this.prev()
        break
      case ARROW_RIGHT_KEYCODE:
        event.preventDefault()
        this.next()
        break
      default:
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode
      ? [].slice.call(element.parentNode.querySelectorAll(Selector.ITEM))
      : []
    return this._items.indexOf(element)
  }

  _getItemByDirection(direction, activeElement) {
    const isNextDirection = direction === Direction.NEXT
    const isPrevDirection = direction === Direction.PREV
    const activeIndex     = this._getItemIndex(activeElement)
    const lastItemIndex   = this._items.length - 1
    const isGoingToWrap   = isPrevDirection && activeIndex === 0 ||
                            isNextDirection && activeIndex === lastItemIndex

    if (isGoingToWrap && !this._config.wrap) {
      return activeElement
    }

    const delta     = direction === Direction.PREV ? -1 : 1
    const itemIndex = (activeIndex + delta) % this._items.length

    return itemIndex === -1
      ? this._items[this._items.length - 1] : this._items[itemIndex]
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget)
    const fromIndex = this._getItemIndex(this._element.querySelector(Selector.ACTIVE_ITEM))
    const slideEvent = $.Event(Event.SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    })

    $(this._element).trigger(slideEvent)

    return slideEvent
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector.ACTIVE))
      $(indicators)
        .removeClass(ClassName.ACTIVE)

      const nextIndicator = this._indicatorsElement.children[
        this._getItemIndex(element)
      ]

      if (nextIndicator) {
        $(nextIndicator).addClass(ClassName.ACTIVE)
      }
    }
  }

  _slide(direction, element) {
    const activeElement = this._element.querySelector(Selector.ACTIVE_ITEM)
    const activeElementIndex = this._getItemIndex(activeElement)
    const nextElement   = element || activeElement &&
      this._getItemByDirection(direction, activeElement)
    const nextElementIndex = this._getItemIndex(nextElement)
    const isCycling = Boolean(this._interval)

    let directionalClassName
    let orderClassName
    let eventDirectionName

    if (direction === Direction.NEXT) {
      directionalClassName = ClassName.LEFT
      orderClassName = ClassName.NEXT
      eventDirectionName = Direction.LEFT
    } else {
      directionalClassName = ClassName.RIGHT
      orderClassName = ClassName.PREV
      eventDirectionName = Direction.RIGHT
    }

    if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
      this._isSliding = false
      return
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
    if (slideEvent.isDefaultPrevented()) {
      return
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return
    }

    this._isSliding = true

    if (isCycling) {
      this.pause()
    }

    this._setActiveIndicatorElement(nextElement)

    const slidEvent = $.Event(Event.SLID, {
      relatedTarget: nextElement,
      direction: eventDirectionName,
      from: activeElementIndex,
      to: nextElementIndex
    })

    if ($(this._element).hasClass(ClassName.SLIDE)) {
      $(nextElement).addClass(orderClassName)

      Util.reflow(nextElement)

      $(activeElement).addClass(directionalClassName)
      $(nextElement).addClass(directionalClassName)

      const nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10)
      if (nextElementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval
        this._config.interval = nextElementInterval
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval
      }

      const transitionDuration = Util.getTransitionDurationFromElement(activeElement)

      $(activeElement)
        .one(Util.TRANSITION_END, () => {
          $(nextElement)
            .removeClass(`${directionalClassName} ${orderClassName}`)
            .addClass(ClassName.ACTIVE)

          $(activeElement).removeClass(`${ClassName.ACTIVE} ${orderClassName} ${directionalClassName}`)

          this._isSliding = false

          setTimeout(() => $(this._element).trigger(slidEvent), 0)
        })
        .emulateTransitionEnd(transitionDuration)
    } else {
      $(activeElement).removeClass(ClassName.ACTIVE)
      $(nextElement).addClass(ClassName.ACTIVE)

      this._isSliding = false
      $(this._element).trigger(slidEvent)
    }

    if (isCycling) {
      this.cycle()
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      let _config = {
        ...Default,
        ...$(this).data()
      }

      if (typeof config === 'object') {
        _config = {
          ..._config,
          ...config
        }
      }

      const action = typeof config === 'string' ? config : _config.slide

      if (!data) {
        data = new Carousel(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'number') {
        data.to(config)
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`)
        }
        data[action]()
      } else if (_config.interval && _config.ride) {
        data.pause()
        data.cycle()
      }
    })
  }

  static _dataApiClickHandler(event) {
    const selector = Util.getSelectorFromElement(this)

    if (!selector) {
      return
    }

    const target = $(selector)[0]

    if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
      return
    }

    const config = {
      ...$(target).data(),
      ...$(this).data()
    }
    const slideIndex = this.getAttribute('data-slide-to')

    if (slideIndex) {
      config.interval = false
    }

    Carousel._jQueryInterface.call($(target), config)

    if (slideIndex) {
      $(target).data(DATA_KEY).to(slideIndex)
    }

    event.preventDefault()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler)

$(window).on(Event.LOAD_DATA_API, () => {
  const carousels = [].slice.call(document.querySelectorAll(Selector.DATA_RIDE))
  for (let i = 0, len = carousels.length; i < len; i++) {
    const $carousel = $(carousels[i])
    Carousel._jQueryInterface.call($carousel, $carousel.data())
  }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Carousel._jQueryInterface
$.fn[NAME].Constructor = Carousel
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Carousel._jQueryInterface
}

export default Carousel


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                     = 'dropdown'
const VERSION                  = '4.3.1'
const DATA_KEY                 = 'bs.dropdown'
const EVENT_KEY                = `.${DATA_KEY}`
const DATA_API_KEY             = '.data-api'
const JQUERY_NO_CONFLICT       = $.fn[NAME]
const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const REGEXP_KEYDOWN           = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const Event = {
  HIDE             : `hide${EVENT_KEY}`,
  HIDDEN           : `hidden${EVENT_KEY}`,
  SHOW             : `show${EVENT_KEY}`,
  SHOWN            : `shown${EVENT_KEY}`,
  CLICK            : `click${EVENT_KEY}`,
  CLICK_DATA_API   : `click${EVENT_KEY}${DATA_API_KEY}`,
  KEYDOWN_DATA_API : `keydown${EVENT_KEY}${DATA_API_KEY}`,
  KEYUP_DATA_API   : `keyup${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  DISABLED        : 'disabled',
  SHOW            : 'show',
  DROPUP          : 'dropup',
  DROPRIGHT       : 'dropright',
  DROPLEFT        : 'dropleft',
  MENURIGHT       : 'dropdown-menu-right',
  MENULEFT        : 'dropdown-menu-left',
  POSITION_STATIC : 'position-static'
}

const Selector = {
  DATA_TOGGLE   : '[data-toggle="dropdown"]',
  FORM_CHILD    : '.dropdown form',
  MENU          : '.dropdown-menu',
  NAVBAR_NAV    : '.navbar-nav',
  VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
}

const AttachmentMap = {
  TOP       : 'top-start',
  TOPEND    : 'top-end',
  BOTTOM    : 'bottom-start',
  BOTTOMEND : 'bottom-end',
  RIGHT     : 'right-start',
  RIGHTEND  : 'right-end',
  LEFT      : 'left-start',
  LEFTEND   : 'left-end'
}

const Default = {
  offset    : 0,
  flip      : true,
  boundary  : 'scrollParent',
  reference : 'toggle',
  display   : 'dynamic'
}

const DefaultType = {
  offset    : '(number|string|function)',
  flip      : 'boolean',
  boundary  : '(string|element)',
  reference : '(string|element)',
  display   : 'string'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown {
  constructor(element, config) {
    this._element  = element
    this._popper   = null
    this._config   = this._getConfig(config)
    this._menu     = this._getMenuElement()
    this._inNavbar = this._detectNavbar()

    this._addEventListeners()
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  // Public

  toggle() {
    if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
      return
    }

    const parent   = Dropdown._getParentFromElement(this._element)
    const isActive = $(this._menu).hasClass(ClassName.SHOW)

    Dropdown._clearMenus()

    if (isActive) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const showEvent = $.Event(Event.SHOW, relatedTarget)

    $(parent).trigger(showEvent)

    if (showEvent.isDefaultPrevented()) {
      return
    }

    // Disable totally Popper.js for Dropdown in Navbar
    if (!this._inNavbar) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)')
      }

      let referenceElement = this._element

      if (this._config.reference === 'parent') {
        referenceElement = parent
      } else if (Util.isElement(this._config.reference)) {
        referenceElement = this._config.reference

        // Check if it's jQuery element
        if (typeof this._config.reference.jquery !== 'undefined') {
          referenceElement = this._config.reference[0]
        }
      }

      // If boundary is not `scrollParent`, then set position to `static`
      // to allow the menu to "escape" the scroll parent's boundaries
      // https://github.com/twbs/bootstrap/issues/24251
      if (this._config.boundary !== 'scrollParent') {
        $(parent).addClass(ClassName.POSITION_STATIC)
      }
      this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig())
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement &&
        $(parent).closest(Selector.NAVBAR_NAV).length === 0) {
      $(document.body).children().on('mouseover', null, $.noop)
    }

    this._element.focus()
    this._element.setAttribute('aria-expanded', true)

    $(this._menu).toggleClass(ClassName.SHOW)
    $(parent)
      .toggleClass(ClassName.SHOW)
      .trigger($.Event(Event.SHOWN, relatedTarget))
  }

  show() {
    if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED) || $(this._menu).hasClass(ClassName.SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const showEvent = $.Event(Event.SHOW, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(showEvent)

    if (showEvent.isDefaultPrevented()) {
      return
    }

    $(this._menu).toggleClass(ClassName.SHOW)
    $(parent)
      .toggleClass(ClassName.SHOW)
      .trigger($.Event(Event.SHOWN, relatedTarget))
  }

  hide() {
    if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED) || !$(this._menu).hasClass(ClassName.SHOW)) {
      return
    }

    const relatedTarget = {
      relatedTarget: this._element
    }
    const hideEvent = $.Event(Event.HIDE, relatedTarget)
    const parent = Dropdown._getParentFromElement(this._element)

    $(parent).trigger(hideEvent)

    if (hideEvent.isDefaultPrevented()) {
      return
    }

    $(this._menu).toggleClass(ClassName.SHOW)
    $(parent)
      .toggleClass(ClassName.SHOW)
      .trigger($.Event(Event.HIDDEN, relatedTarget))
  }

  dispose() {
    $.removeData(this._element, DATA_KEY)
    $(this._element).off(EVENT_KEY)
    this._element = null
    this._menu = null
    if (this._popper !== null) {
      this._popper.destroy()
      this._popper = null
    }
  }

  update() {
    this._inNavbar = this._detectNavbar()
    if (this._popper !== null) {
      this._popper.scheduleUpdate()
    }
  }

  // Private

  _addEventListeners() {
    $(this._element).on(Event.CLICK, (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle()
    })
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...$(this._element).data(),
      ...config
    }

    Util.typeCheckConfig(
      NAME,
      config,
      this.constructor.DefaultType
    )

    return config
  }

  _getMenuElement() {
    if (!this._menu) {
      const parent = Dropdown._getParentFromElement(this._element)

      if (parent) {
        this._menu = parent.querySelector(Selector.MENU)
      }
    }
    return this._menu
  }

  _getPlacement() {
    const $parentDropdown = $(this._element.parentNode)
    let placement = AttachmentMap.BOTTOM

    // Handle dropup
    if ($parentDropdown.hasClass(ClassName.DROPUP)) {
      placement = AttachmentMap.TOP
      if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.TOPEND
      }
    } else if ($parentDropdown.hasClass(ClassName.DROPRIGHT)) {
      placement = AttachmentMap.RIGHT
    } else if ($parentDropdown.hasClass(ClassName.DROPLEFT)) {
      placement = AttachmentMap.LEFT
    } else if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
      placement = AttachmentMap.BOTTOMEND
    }
    return placement
  }

  _detectNavbar() {
    return $(this._element).closest('.navbar').length > 0
  }

  _getOffset() {
    const offset = {}

    if (typeof this._config.offset === 'function') {
      offset.fn = (data) => {
        data.offsets = {
          ...data.offsets,
          ...this._config.offset(data.offsets, this._element) || {}
        }

        return data
      }
    } else {
      offset.offset = this._config.offset
    }

    return offset
  }

  _getPopperConfig() {
    const popperConfig = {
      placement: this._getPlacement(),
      modifiers: {
        offset: this._getOffset(),
        flip: {
          enabled: this._config.flip
        },
        preventOverflow: {
          boundariesElement: this._config.boundary
        }
      }
    }

    // Disable Popper.js if we have a static display
    if (this._config.display === 'static') {
      popperConfig.modifiers.applyStyle = {
        enabled: false
      }
    }

    return popperConfig
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data) {
        data = new Dropdown(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }
        data[config]()
      }
    })
  }

  static _clearMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    const toggles = [].slice.call(document.querySelectorAll(Selector.DATA_TOGGLE))

    for (let i = 0, len = toggles.length; i < len; i++) {
      const parent = Dropdown._getParentFromElement(toggles[i])
      const context = $(toggles[i]).data(DATA_KEY)
      const relatedTarget = {
        relatedTarget: toggles[i]
      }

      if (event && event.type === 'click') {
        relatedTarget.clickEvent = event
      }

      if (!context) {
        continue
      }

      const dropdownMenu = context._menu
      if (!$(parent).hasClass(ClassName.SHOW)) {
        continue
      }

      if (event && (event.type === 'click' &&
          /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
          $.contains(parent, event.target)) {
        continue
      }

      const hideEvent = $.Event(Event.HIDE, relatedTarget)
      $(parent).trigger(hideEvent)
      if (hideEvent.isDefaultPrevented()) {
        continue
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop)
      }

      toggles[i].setAttribute('aria-expanded', 'false')

      $(dropdownMenu).removeClass(ClassName.SHOW)
      $(parent)
        .removeClass(ClassName.SHOW)
        .trigger($.Event(Event.HIDDEN, relatedTarget))
    }
  }

  static _getParentFromElement(element) {
    let parent
    const selector = Util.getSelectorFromElement(element)

    if (selector) {
      parent = document.querySelector(selector)
    }

    return parent || element.parentNode
  }

  // eslint-disable-next-line complexity
  static _dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName)
      ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE &&
      (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
        $(event.target).closest(Selector.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
      return
    }

    const parent   = Dropdown._getParentFromElement(this)
    const isActive = $(parent).hasClass(ClassName.SHOW)

    if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
      if (event.which === ESCAPE_KEYCODE) {
        const toggle = parent.querySelector(Selector.DATA_TOGGLE)
        $(toggle).trigger('focus')
      }

      $(this).trigger('click')
      return
    }

    const items = [].slice.call(parent.querySelectorAll(Selector.VISIBLE_ITEMS))

    if (items.length === 0) {
      return
    }

    let index = items.indexOf(event.target)

    if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
      index--
    }

    if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
      index++
    }

    if (index < 0) {
      index = 0
    }

    items[index].focus()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document)
  .on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler)
  .on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler)
  .on(`${Event.CLICK_DATA_API} ${Event.KEYUP_DATA_API}`, Dropdown._clearMenus)
  .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault()
    event.stopPropagation()
    Dropdown._jQueryInterface.call($(this), 'toggle')
  })
  .on(Event.CLICK_DATA_API, Selector.FORM_CHILD, (e) => {
    e.stopPropagation()
  })

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Dropdown._jQueryInterface
$.fn[NAME].Constructor = Dropdown
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Dropdown._jQueryInterface
}


export default Dropdown


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME               = 'modal'
const VERSION            = '4.3.1'
const DATA_KEY           = 'bs.modal'
const EVENT_KEY          = `.${DATA_KEY}`
const DATA_API_KEY       = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ESCAPE_KEYCODE     = 27 // KeyboardEvent.which value for Escape (Esc) key

const Default = {
  backdrop : true,
  keyboard : true,
  focus    : true,
  show     : true
}

const DefaultType = {
  backdrop : '(boolean|string)',
  keyboard : 'boolean',
  focus    : 'boolean',
  show     : 'boolean'
}

const Event = {
  HIDE              : `hide${EVENT_KEY}`,
  HIDDEN            : `hidden${EVENT_KEY}`,
  SHOW              : `show${EVENT_KEY}`,
  SHOWN             : `shown${EVENT_KEY}`,
  FOCUSIN           : `focusin${EVENT_KEY}`,
  RESIZE            : `resize${EVENT_KEY}`,
  CLICK_DISMISS     : `click.dismiss${EVENT_KEY}`,
  KEYDOWN_DISMISS   : `keydown.dismiss${EVENT_KEY}`,
  MOUSEUP_DISMISS   : `mouseup.dismiss${EVENT_KEY}`,
  MOUSEDOWN_DISMISS : `mousedown.dismiss${EVENT_KEY}`,
  CLICK_DATA_API    : `click${EVENT_KEY}${DATA_API_KEY}`
}

const ClassName = {
  SCROLLABLE         : 'modal-dialog-scrollable',
  SCROLLBAR_MEASURER : 'modal-scrollbar-measure',
  BACKDROP           : 'modal-backdrop',
  OPEN               : 'modal-open',
  FADE               : 'fade',
  SHOW               : 'show'
}

const Selector = {
  DIALOG         : '.modal-dialog',
  MODAL_BODY     : '.modal-body',
  DATA_TOGGLE    : '[data-toggle="modal"]',
  DATA_DISMISS   : '[data-dismiss="modal"]',
  FIXED_CONTENT  : '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  STICKY_CONTENT : '.sticky-top'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal {
  constructor(element, config) {
    this._config              = this._getConfig(config)
    this._element             = element
    this._dialog              = element.querySelector(Selector.DIALOG)
    this._backdrop            = null
    this._isShown             = false
    this._isBodyOverflowing   = false
    this._ignoreBackdropClick = false
    this._isTransitioning     = false
    this._scrollbarWidth      = 0
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }

    if ($(this._element).hasClass(ClassName.FADE)) {
      this._isTransitioning = true
    }

    const showEvent = $.Event(Event.SHOW, {
      relatedTarget
    })

    $(this._element).trigger(showEvent)

    if (this._isShown || showEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = true

    this._checkScrollbar()
    this._setScrollbar()

    this._adjustDialog()

    this._setEscapeEvent()
    this._setResizeEvent()

    $(this._element).on(
      Event.CLICK_DISMISS,
      Selector.DATA_DISMISS,
      (event) => this.hide(event)
    )

    $(this._dialog).on(Event.MOUSEDOWN_DISMISS, () => {
      $(this._element).one(Event.MOUSEUP_DISMISS, (event) => {
        if ($(event.target).is(this._element)) {
          this._ignoreBackdropClick = true
        }
      })
    })

    this._showBackdrop(() => this._showElement(relatedTarget))
  }

  hide(event) {
    if (event) {
      event.preventDefault()
    }

    if (!this._isShown || this._isTransitioning) {
      return
    }

    const hideEvent = $.Event(Event.HIDE)

    $(this._element).trigger(hideEvent)

    if (!this._isShown || hideEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = false
    const transition = $(this._element).hasClass(ClassName.FADE)

    if (transition) {
      this._isTransitioning = true
    }

    this._setEscapeEvent()
    this._setResizeEvent()

    $(document).off(Event.FOCUSIN)

    $(this._element).removeClass(ClassName.SHOW)

    $(this._element).off(Event.CLICK_DISMISS)
    $(this._dialog).off(Event.MOUSEDOWN_DISMISS)


    if (transition) {
      const transitionDuration  = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, (event) => this._hideModal(event))
        .emulateTransitionEnd(transitionDuration)
    } else {
      this._hideModal()
    }
  }

  dispose() {
    [window, this._element, this._dialog]
      .forEach((htmlElement) => $(htmlElement).off(EVENT_KEY))

    /**
     * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
     * Do not move `document` in `htmlElements` array
     * It will remove `Event.CLICK_DATA_API` event that should remain
     */
    $(document).off(Event.FOCUSIN)

    $.removeData(this._element, DATA_KEY)

    this._config              = null
    this._element             = null
    this._dialog              = null
    this._backdrop            = null
    this._isShown             = null
    this._isBodyOverflowing   = null
    this._ignoreBackdropClick = null
    this._isTransitioning     = null
    this._scrollbarWidth      = null
  }

  handleUpdate() {
    this._adjustDialog()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _showElement(relatedTarget) {
    const transition = $(this._element).hasClass(ClassName.FADE)

    if (!this._element.parentNode ||
        this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this._element)
    }

    this._element.style.display = 'block'
    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)

    if ($(this._dialog).hasClass(ClassName.SCROLLABLE)) {
      this._dialog.querySelector(Selector.MODAL_BODY).scrollTop = 0
    } else {
      this._element.scrollTop = 0
    }

    if (transition) {
      Util.reflow(this._element)
    }

    $(this._element).addClass(ClassName.SHOW)

    if (this._config.focus) {
      this._enforceFocus()
    }

    const shownEvent = $.Event(Event.SHOWN, {
      relatedTarget
    })

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.focus()
      }
      this._isTransitioning = false
      $(this._element).trigger(shownEvent)
    }

    if (transition) {
      const transitionDuration  = Util.getTransitionDurationFromElement(this._dialog)

      $(this._dialog)
        .one(Util.TRANSITION_END, transitionComplete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      transitionComplete()
    }
  }

  _enforceFocus() {
    $(document)
      .off(Event.FOCUSIN) // Guard against infinite focus loop
      .on(Event.FOCUSIN, (event) => {
        if (document !== event.target &&
            this._element !== event.target &&
            $(this._element).has(event.target).length === 0) {
          this._element.focus()
        }
      })
  }

  _setEscapeEvent() {
    if (this._isShown && this._config.keyboard) {
      $(this._element).on(Event.KEYDOWN_DISMISS, (event) => {
        if (event.which === ESCAPE_KEYCODE) {
          event.preventDefault()
          this.hide()
        }
      })
    } else if (!this._isShown) {
      $(this._element).off(Event.KEYDOWN_DISMISS)
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      $(window).on(Event.RESIZE, (event) => this.handleUpdate(event))
    } else {
      $(window).off(Event.RESIZE)
    }
  }

  _hideModal() {
    this._element.style.display = 'none'
    this._element.setAttribute('aria-hidden', true)
    this._element.removeAttribute('aria-modal')
    this._isTransitioning = false
    this._showBackdrop(() => {
      $(document.body).removeClass(ClassName.OPEN)
      this._resetAdjustments()
      this._resetScrollbar()
      $(this._element).trigger(Event.HIDDEN)
    })
  }

  _removeBackdrop() {
    if (this._backdrop) {
      $(this._backdrop).remove()
      this._backdrop = null
    }
  }

  _showBackdrop(callback) {
    const animate = $(this._element).hasClass(ClassName.FADE)
      ? ClassName.FADE : ''

    if (this._isShown && this._config.backdrop) {
      this._backdrop = document.createElement('div')
      this._backdrop.className = ClassName.BACKDROP

      if (animate) {
        this._backdrop.classList.add(animate)
      }

      $(this._backdrop).appendTo(document.body)

      $(this._element).on(Event.CLICK_DISMISS, (event) => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false
          return
        }
        if (event.target !== event.currentTarget) {
          return
        }
        if (this._config.backdrop === 'static') {
          this._element.focus()
        } else {
          this.hide()
        }
      })

      if (animate) {
        Util.reflow(this._backdrop)
      }

      $(this._backdrop).addClass(ClassName.SHOW)

      if (!callback) {
        return
      }

      if (!animate) {
        callback()
        return
      }

      const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

      $(this._backdrop)
        .one(Util.TRANSITION_END, callback)
        .emulateTransitionEnd(backdropTransitionDuration)
    } else if (!this._isShown && this._backdrop) {
      $(this._backdrop).removeClass(ClassName.SHOW)

      const callbackRemove = () => {
        this._removeBackdrop()
        if (callback) {
          callback()
        }
      }

      if ($(this._element).hasClass(ClassName.FADE)) {
        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

        $(this._backdrop)
          .one(Util.TRANSITION_END, callbackRemove)
          .emulateTransitionEnd(backdropTransitionDuration)
      } else {
        callbackRemove()
      }
    } else if (callback) {
      callback()
    }
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // todo (fat): these should probably be refactored out of modal.js
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing =
      this._element.scrollHeight > document.documentElement.clientHeight

    if (!this._isBodyOverflowing && isModalOverflowing) {
      this._element.style.paddingLeft = `${this._scrollbarWidth}px`
    }

    if (this._isBodyOverflowing && !isModalOverflowing) {
      this._element.style.paddingRight = `${this._scrollbarWidth}px`
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = ''
    this._element.style.paddingRight = ''
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect()
    this._isBodyOverflowing = rect.left + rect.right < window.innerWidth
    this._scrollbarWidth = this._getScrollbarWidth()
  }

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
      const fixedContent = [].slice.call(document.querySelectorAll(Selector.FIXED_CONTENT))
      const stickyContent = [].slice.call(document.querySelectorAll(Selector.STICKY_CONTENT))

      // Adjust fixed content padding
      $(fixedContent).each((index, element) => {
        const actualPadding = element.style.paddingRight
        const calculatedPadding = $(element).css('padding-right')
        $(element)
          .data('padding-right', actualPadding)
          .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
      })

      // Adjust sticky content margin
      $(stickyContent).each((index, element) => {
        const actualMargin = element.style.marginRight
        const calculatedMargin = $(element).css('margin-right')
        $(element)
          .data('margin-right', actualMargin)
          .css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`)
      })

      // Adjust body padding
      const actualPadding = document.body.style.paddingRight
      const calculatedPadding = $(document.body).css('padding-right')
      $(document.body)
        .data('padding-right', actualPadding)
        .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
    }

    $(document.body).addClass(ClassName.OPEN)
  }

  _resetScrollbar() {
    // Restore fixed content padding
    const fixedContent = [].slice.call(document.querySelectorAll(Selector.FIXED_CONTENT))
    $(fixedContent).each((index, element) => {
      const padding = $(element).data('padding-right')
      $(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })

    // Restore sticky content
    const elements = [].slice.call(document.querySelectorAll(`${Selector.STICKY_CONTENT}`))
    $(elements).each((index, element) => {
      const margin = $(element).data('margin-right')
      if (typeof margin !== 'undefined') {
        $(element).css('margin-right', margin).removeData('margin-right')
      }
    })

    // Restore body padding
    const padding = $(document.body).data('padding-right')
    $(document.body).removeData('padding-right')
    document.body.style.paddingRight = padding ? padding : ''
  }

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div')
    scrollDiv.className = ClassName.SCROLLBAR_MEASURER
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  // Static

  static _jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = {
        ...Default,
        ...$(this).data(),
        ...typeof config === 'object' && config ? config : {}
      }

      if (!data) {
        data = new Modal(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }
        data[config](relatedTarget)
      } else if (_config.show) {
        data.show(relatedTarget)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
  let target
  const selector = Util.getSelectorFromElement(this)

  if (selector) {
    target = document.querySelector(selector)
  }

  const config = $(target).data(DATA_KEY)
    ? 'toggle' : {
      ...$(target).data(),
      ...$(this).data()
    }

  if (this.tagName === 'A' || this.tagName === 'AREA') {
    event.preventDefault()
  }

  const $target = $(target).one(Event.SHOW, (showEvent) => {
    if (showEvent.isDefaultPrevented()) {
      // Only register focus restorer if modal will actually get shown
      return
    }

    $target.one(Event.HIDDEN, () => {
      if ($(this).is(':visible')) {
        this.focus()
      }
    })
  })

  Modal._jQueryInterface.call($(target), config, this)
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Modal._jQueryInterface
$.fn[NAME].Constructor = Modal
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Modal._jQueryInterface
}

export default Modal


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Tooltip from './tooltip'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME                = 'popover'
const VERSION             = '4.3.1'
const DATA_KEY            = 'bs.popover'
const EVENT_KEY           = `.${DATA_KEY}`
const JQUERY_NO_CONFLICT  = $.fn[NAME]
const CLASS_PREFIX        = 'bs-popover'
const BSCLS_PREFIX_REGEX  = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

const Default = {
  ...Tooltip.Default,
  placement : 'right',
  trigger   : 'click',
  content   : '',
  template  : '<div class="popover" role="tooltip">' +
              '<div class="arrow"></div>' +
              '<h3 class="popover-header"></h3>' +
              '<div class="popover-body"></div></div>'
}

const DefaultType = {
  ...Tooltip.DefaultType,
  content : '(string|element|function)'
}

const ClassName = {
  FADE : 'fade',
  SHOW : 'show'
}

const Selector = {
  TITLE   : '.popover-header',
  CONTENT : '.popover-body'
}

const Event = {
  HIDE       : `hide${EVENT_KEY}`,
  HIDDEN     : `hidden${EVENT_KEY}`,
  SHOW       : `show${EVENT_KEY}`,
  SHOWN      : `shown${EVENT_KEY}`,
  INSERTED   : `inserted${EVENT_KEY}`,
  CLICK      : `click${EVENT_KEY}`,
  FOCUSIN    : `focusin${EVENT_KEY}`,
  FOCUSOUT   : `focusout${EVENT_KEY}`,
  MOUSEENTER : `mouseenter${EVENT_KEY}`,
  MOUSELEAVE : `mouseleave${EVENT_KEY}`
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends Tooltip {
  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  static get Event() {
    return Event
  }

  static get EVENT_KEY() {
    return EVENT_KEY
  }

  static get DefaultType() {
    return DefaultType
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent()
  }

  addAttachmentClass(attachment) {
    $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
  }

  getTipElement() {
    this.tip = this.tip || $(this.config.template)[0]
    return this.tip
  }

  setContent() {
    const $tip = $(this.getTipElement())

    // We use append for html objects to maintain js events
    this.setElementContent($tip.find(Selector.TITLE), this.getTitle())
    let content = this._getContent()
    if (typeof content === 'function') {
      content = content.call(this.element)
    }
    this.setElementContent($tip.find(Selector.CONTENT), content)

    $tip.removeClass(`${ClassName.FADE} ${ClassName.SHOW}`)
  }

  // Private

  _getContent() {
    return this.element.getAttribute('data-content') ||
      this.config.content
  }

  _cleanTipClass() {
    const $tip = $(this.getTipElement())
    const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
    if (tabClass !== null && tabClass.length > 0) {
      $tip.removeClass(tabClass.join(''))
    }
  }

  // Static

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = typeof config === 'object' ? config : null

      if (!data && /dispose|hide/.test(config)) {
        return
      }

      if (!data) {
        data = new Popover(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }
        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Popover._jQueryInterface
$.fn[NAME].Constructor = Popover
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Popover._jQueryInterface
}

export default Popover


/* eslint-disable */
var siteIntegrations = require('integrations/integrations/siteIntegrationsUtils');
var toggleObject = siteIntegrations.getIntegrationSettings();

if (toggleObject.cybersourceCartridgeEnabled) {
    var init = {
        initConfig: function () {
            var requestId; var billingAgreementFlag; // A Flag to show whether user has opted for Billing Agreement or not
            var billingAgreementButton; // The Billing Agreement Checkbox
            var billingAgreementID; // Billing Agreement ID
            var isPayPalCredit = false; var
                endPoint = $('#paypal_endpoint').length > 0 ? document.getElementById('paypal_endpoint').value : 'sandbox';
            var config = {
                env: endPoint,
                commit: true,

                validate: function (actions) {
                    // if ($('.paypal-address').length > 0) {
                    //     paypalvalidator.toggleForm(actions);
                    //     paypalvalidator.onChangeForm(function () {
                    //         paypalvalidator.toggleForm(actions);
                    //     });
                    // }
                },
                payment: function () {
                    var CREATE_URL = document.getElementById('paypal_express').value;
                    if (config.paymentOption.credit) {
                        isPayPalCredit = true;
                    } else {
                        isPayPalCredit = false;
                    }
                    billingAgreementButton = document.getElementById('billingAgreementCheckbox');
                    // billingAgreementFlag - This variable is used to indicate if billing agreement creation is requested or not
                    billingAgreementFlag = (billingAgreementButton == null) ? false : billingAgreementButton.checked;
                    // Append a parameter to URL when Billing Agreement is checked
                    if (billingAgreementFlag) {
                        CREATE_URL += '?billingAgreement=true';
                    } else if (isPayPalCredit) {
                    // Append a parameter to URL when PayPal Credit is used
                        CREATE_URL += '?isPayPalCredit=true';
                    }
                    return paypal.request.post(CREATE_URL)
                        .then(function (res) {
                            requestId = res.requestID;
                            return res.processorTransactionID;
                        });
                },
                onAuthorize: function (data, actions) {
                    var data = {
                        requestId: requestId,
                        billingAgreementFlag: billingAgreementFlag,
                        paymentID: data.paymentID,
                        payerID: data.payerID,
                        isPayPalCredit: isPayPalCredit
                    };

                    var paypalcallback = document.getElementById('paypal_callback').value;
                    var form = $('<form action="' + paypalcallback + '" method="post">'
                    + '<input type="hidden" name="requestId" value="' + requestId + '" />'
                    + '<input type="hidden" name="billingAgreementFlag" value="' + billingAgreementFlag + '" />'
                    + '<input type="hidden" name="paymentID" value="' + data.paymentID + '" />'
                    + '<input type="hidden" name="payerID" value="' + data.payerID + '" />'
                    + '<input type="hidden" name="isPayPalCredit" value="' + isPayPalCredit + '" />'
                    + '</form>');
                    $('body').append(form);
                    form.submit();
                }
            };
            return config;
        },

        initPayPalButtons: function () {
            var isPaypalEnabled;
            isPaypalEnabled = !!($('#paypal_enabled').length > 0 && document.getElementById('paypal_enabled').value == 'true');
            var locale = $('#currentLocale').length > 0 ? document.getElementById('currentLocale').value : '';
            var config = init.initConfig();
            config.paymentOption = {
                express: true,
                credit: false
            };
            config.locale = locale;
            if (isPaypalEnabled && $('.paypal-button-container-cart1').length > 0) {
                paypal.Button.render(config, '.paypal-button-container-cart1');
                $('body').trigger('PaymentMethodObserver:iframePresent');
            }
            if (isPaypalEnabled && $('.paypal-button-container-cart2').length > 0) {
                paypal.Button.render(config, '.paypal-button-container-cart2');
                $('body').trigger('PaymentMethodObserver:iframePresent');
            }
            if (isPaypalEnabled && $('#paypal-button-container').length > 0) {
                paypal.Button.render(config, '#paypal-button-container');
                $('body').trigger('PaymentMethodObserver:iframePresent');
            }
            // Settings for PayPal Credit Card Button
            if (isPaypalEnabled && $('#paypal-credit-container').length > 0) {
                var creditConfig = init.initConfig();
                creditConfig.style = {
                    label: 'credit',
                    size: 'small', // small | medium
                    shape: 'rect' // pill | rect
                };
                creditConfig.paymentOption = {
                    express: false,
                    credit: true
                };
                creditConfig.locale = locale;
                paypal.Button.render(creditConfig, '#paypal-credit-container');
                $('body').trigger('PaymentMethodObserver:iframePresent');
            }
        },

        initFunctions: function () {
            $(document).on('click', '.credit_card, .sa_flex', function (e) {
                e.stopImmediatePropagation();
                var payerAuth = $(this).data('payerauth');
                window.location.href = payerAuth;
            });

            $(document).on('click', '.wechat', function (e) {
                e.stopImmediatePropagation();
                var formaction = $(this).attr('data-action');
                setTimeout(function () {
                    window.location.href = formaction;
                }, 500);
            });

            // for Alipay Intermediate
            if ($('body').hasClass('cyb_alipayintermediate')) {
                var loaded = false;
                setTimeout(function () {
                    document.RedirectForm.submit();
                    loaded = true;
                }, 1000);
            }
            // For FingerPrint Unit testing
            if ($('body').hasClass('cyb_testfingerprintRedirect')) {
                var url_loc = document.getElementById('URl_redirect').value;
                setTimeout(function () { location.href = url_loc; }, 1000);
            }
            // For Payerauth during checkout
            if ($('div').hasClass('payerauth')) {
                document.PAInfoForm.submit();
            }
            // For payerauth during  Credit card
            if ($('body').hasClass('cyb_payerauthenticationredirect')) {
                document.RedirectForm.submit();
            }
            // For payerauth during  Unit testing
            if ($('body').hasClass('cyb_unitTest_payerauth')) {
                document.RedirectForm.submit();
            }
            // For payer auth during  Unit testing
            if ($('div').hasClass('cyb_unitTest_payerauthsubmit')) {
                document.PAInfoForm.submit();
            }
            // For Secure Acceptance Redirect
            if ($('body').hasClass('cyb_sa_redirect')) {
                var url_loc = document.getElementById('redirect_url_sa').value;
                window.top.location.replace(url_loc);
            }
            // For Secure Acceptance Iframe
            if ($('div').hasClass('SecureAcceptance_IFRAME')) {
                var url_loc = document.getElementById('sa_iframeURL').value;
                $('.SecureAcceptance_IFRAME').append('<iframe src=' + url_loc + '  name="hss_iframe"  width="85%" height="730px" scrolling="no" />');
            }
            // For Secure Acceptance Iframe
            if ($('body').hasClass('sa_iframe_request_form')) {
                document.form_iframe.submit();
            }
            // For Secure Acceptance
            if ($('body').hasClass('cyb_sa_request_form')) {
                $('#loading').css('display', 'block');
                document.ePayment.submit();
            }

            // FOR POS
            $('#entry-mode-pos_unittest select.input-select').change(function () {
                if (this.value == 'swiped') {
                    $('#card-section, #sample-card-section').css('display', 'none');
                } else if (this.value == 'keyed') {
                    $('#card-section, #sample-card-section').css('display', 'block');
                }
            });

            /*
            * If billing agreement ID already exists in the user profile then a different button
            * is displayed on the the page. This function handles the action of that button.
            * This functions directly calls checkstatusservice
        */
            $(document).on('click', '.billingAgreementExpressCheckout', function (e) {
                e.preventDefault();
                var paypalcallback = document.getElementById('paypal_callback').value;
                var form = $('<form action="' + paypalcallback + '" method="post">'
                        + '</form>');
                $('body').append(form);
                form.submit();
            });

            $(document).on('click', '.sa_silentpost, .sa_redirect, .alipay, .gpy, .eps, .sof, .mch, .idl , .klarna, .wechat', function (e) {
                e.stopImmediatePropagation();
                var CsSaType = $('li[data-method-id="CREDIT_CARD"]').attr('data-sa-type');
                var paymentMethodID = $('input[name=dwfrm_billing_paymentMethod]').val();
                var paymentMethodIds = ['KLARNA', 'ALIPAY', 'GPY', 'EPS', 'SOF', 'IDL', 'MCH', 'WECHAT'];
                var paymentMethod = $.inArray(paymentMethodID, paymentMethodIds) > -1;
                if ((CsSaType != 'CREDIT_CARD' && paymentMethodID == 'CREDIT_CARD') || paymentMethod) {
                    var formaction = $(this).attr('data-action');
                    setTimeout(function () {
                        window.location.href = formaction;
                    }, 500);
                }
            });

            /**
     * @function
     * @description function to Open the secure acceptance page inside Iframe if secure acceptance Iframe is selected
     */
            $(document).on('click', '.sa_iframe', function (e) {
                e.stopImmediatePropagation();
                var creditCardItem = $('li[data-method-id="CREDIT_CARD"]');
                var CsSaType = $(creditCardItem).attr('data-sa-type');
                if (CsSaType == 'SA_IFRAME') {
                    var formaction = $(this).attr('data-action');
                    $.ajax({
                        url: formaction,
                        type: 'POST',
                        success: function (xhr, data) {
                            if (xhr) {
                                if (xhr.error == true) {
                                    $('#saspCardError').html(xhr.errorMsg);
                                    $('#saspCardError').addClass('error');
                                } else {
                                    $('#secureAcceptanceIframe').html(xhr);
                                    document.getElementById('submit-order').classList.add('d-none');
                                }
                            } else {
                                $('#saspCardError').html(xhr.errorMsg);
                                $('#saspCardError').addClass('error');
                            }
                            return true;
                        },
                        error: function () {
                            $('#saspCardError').html(xhr.errorMsg).addClass('error');
                        }
                    });
                } else {
                    return true;
                }
            });

            $('#capturepaymenttype, #authreversalpaymenttype').change(function () {
                if ($(this).val() == 'visacheckout') {
                    $('#orderRequestID').attr('required', 'required');
                    $('.orderRequestID').removeClass('hidden').addClass('show');
                } else {
                    $('#orderRequestID').removeAttr('required');
                    $('.orderRequestID').removeClass('show').addClass('hidden');
                }
            });

            if ($('#checkout-main').attr('data-checkout-stage') === 'placeOrder') {
                var placeOrderBtn = $('#checkout-main').find('#submit-order');
                //only disable the onclick when its not a plain credit card or paypal (standalone or through cybersource) order
                if (!placeOrderBtn.hasClass('place-order') || (!placeOrderBtn.hasClass('credit_card') && !placeOrderBtn.hasClass('PayPal') && !placeOrderBtn.hasClass('PAYPAL') && !placeOrderBtn.hasClass('PAYPAL_CREDIT') && !placeOrderBtn.hasClass('dw_google_pay'))) {
                    $(placeOrderBtn).closest('.row').find('.next-step-button').removeClass('next-step-button');
                }
            }
        }
    };

    var paypalhelper = {
        paypalMini: function () {
            var config = init.initConfig();
            var locale = $('#currentLocale').length > 0 ? document.getElementById('currentLocale').value : '';
            config.paymentOption = {
                express: true,
                credit: false
            };
            config.locale = locale;
            var isPaypalEnabled = false;
            if (document.getElementById('paypal_enabled') != null) {
                isPaypalEnabled = document.getElementById('paypal_enabled').value;
            }
            if (isPaypalEnabled && $('.paypal-button-container-mini').length > 0) {
                paypal.Button.render(config, '.paypal-button-container-mini');
            }
        },
        validateForms: function () {
            var currentForm = $('data-checkout-stage').attr('data-checkout-stage');
            if (currentForm == 'payment') {
                false;
            } return true;
        }
    };

    //AUTOBAHN MOD this is a globally accessed function
    window.paypalhelper = paypalhelper;

    var paypalvalidator = {
        // toggleForm: function (actions) {
        //     if (this.isValid()) { return actions.enable(); }
        //     return actions.disable();
        // },
        // isValid: function () {
        //     var paymentForm = $('#dwfrm_billing').serialize();
        //     var isValidForm = false;

        //     $('body').trigger('checkout:serializeBilling', {
        //         form: $('#dwfrm_billing'),
        //         data: paymentForm,
        //         callback: function (data) { paymentForm = data; }
        //     });
        //     paypalvalidator.validateAddress(function (data) {
        //         isValidForm = !data.error;
        //         if (data.fieldErrors.length) {
        //             data.fieldErrors.forEach(function (error) {
        //                 if (Object.keys(error).length) {
        //                     paypalvalidator.loadFormErrors('.payment-form', error);
        //                 }
        //             });
        //         }
        //     });
        //     return isValidForm;
        // },

        // loadFormErrors: function (parentSelector, fieldErrors) {
        //     $.each(fieldErrors, function (attr) {
        //         $('*[name=' + attr + ']', parentSelector).addClass('is-invalid').siblings('.invalid-feedback').html(fieldErrors[attr]);
        //     });
        // },

        paypalMini: function () {
            var config = init.initConfig();
            var isPaypalEnabled = document.getElementById('paypal_enabled').value;
            if (isPaypalEnabled && $('.paypal-button-container-mini').length > 0) {
                paypal.Button.render(config, '.paypal-button-container-mini');
            }
        },
        // validateAddress: function (callback) {
        //     var paymentForm = $('#dwfrm_billing').serialize();
        //     $.ajax({
        //         method: 'POST',
        //         async: false,
        //         data: paymentForm,
        //         url: $('.paypal-address').attr('action'),
        //         success: function (data) {
        //             callback(data);
        //         },
        //         error: function (err) {
        //         }
        //     });
        // },
        // onChangeForm: function (handler) {
        //     $('.billing-information').on('change', handler);
        // }
    };

    $(document).ready(function () {
        init.initConfig();
        init.initPayPalButtons();
        init.initFunctions();
        if ($('#isGooglePayEnabled').val() == 'true') {
            onGooglePayLoaded();
        }
    });
}
