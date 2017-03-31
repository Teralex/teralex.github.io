// page init

jQuery(function () {

    loaderInit();
    initTabs();
    initInVieport();
    initTouchNav();
    initMobileNav();
    mobileSliderInit('.js-post-slider');
    mobileSliderInit('.js-items-mobile-slider');
    favoritsSliderInit()
    jQuery('nav .drop').parent().addClass('hasDrop');
    jQuery('.hasDrop > a').on('click', function (e) {
        if (jQuery(window).width() < 768) {
            e.preventDefault;
            jQuery(this).siblings().find('.back').addClass('active');
            jQuery(this).hide(50)
                    .siblings().show(50)
                    .parent().siblings().hide(50)
                    .parent().siblings('div').hide(50);
        }
        ;
    });
    jQuery('.drop').on('click', '.back', function (e) {
        e.preventDefault;
        if (jQuery(window).width() < 768) {
            jQuery(this).removeClass('active')
                    .parent().hide(50)
                    .siblings().show(50)
                    .parent().siblings().show(50)
                    .parent().siblings('div').show(50);
        }
    });
    jQuery(window).on('resize orientationchange', function () {
        mobileSliderInit('.js-post-slider');
        mobileSliderInit('.js-items-mobile-slider');
        jQuery('.nav-active').removeClass('nav-active');
        jQuery('.hover').removeClass('hover');
        jQuery('.nav li').removeAttr('style');
        jQuery('.drop .back.active').removeClass('active')
                .parent().removeAttr('style')
                .siblings().removeAttr('style')
                .parent().siblings().removeAttr('style')
                .parent().siblings('div').removeAttr('style');
        if (jQuery(window).width() >= 768) {
            jQuery('.drop').show();
        } else {
            jQuery('.drop').hide();
        }
    });
    jQuery('.js-slider').slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ]
    });
    jQuery('.js-review-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    });
    if (jQuery('.items-holder-brick').length != 0 ) {
        var $grid = jQuery('.items-holder-brick').imagesLoaded(function () {
            $grid.masonry({
                // set itemSelector so .grid-sizer is not used in layout
                itemSelector: '.item',
                // use element for option
                columnWidth: '.item',
                percentPosition: true
            })

        });
    }
    jQuery('.js-base-block-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        //fade: true,
        autoplay: true,
        autoplaySpeed: 3000
    });
    jQuery('.js-more').on('click', function (e) {
        e.preventDefault();
        jQuery(this).closest('.more').hide()
                .closest('.mobile-hidden').removeClass('mobile-hidden');
    });



function loaderInit(){
    $(window).load(function(){
        $('#cover').fadeOut('slow');
        
    });

   $(document).ajaxSend(function() {
         $('#cover').show();
    }).bind("ajaxStop", function() {
        $('#cover').fadeOut('slow');
    }).bind("ajaxError", function() {
       $('#cover').fadeOut('slow');
    });

}

});
jQuery('.js-rank a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().addClass('active')
            .siblings().removeClass('active');
});
function mobileSliderInit(el) {
    var slider = jQuery(el);
    if (slider.length > 0) {
        var working = slider.hasClass('slick-initialized');
        if (jQuery(window).width() < 768) {
            if (!working) {
                slider.slick({
                    slidesToScroll: 1,
                    slidesToShow: 1
                });
            }
        } else {
            if (working) {
                slider.slick('unslick');
            }
        }
    }
}

function favoritsSliderInit() {
    var slider = jQuery('.js-favorits-slider');
    slider.slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ]
    });
}



// content tabs init
function initTabs() {
    jQuery('.tabset').tabset({
        tabLinks: 'a',
        checkHash: true,
        addToParent: true
    });
}

// mobile menu init
function initMobileNav() {
    jQuery('body').mobileNav({
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener'
    });
    jQuery('.column').mobileNav({
        menuActiveClass: 'list-active',
        menuOpener: '.opener'
    });
    jQuery('.js-sb-mobile').mobileNav({
        menuActiveClass: 'sb-open',
        menuOpener: '.sb-opener'
    });
}

// block in viewport init
function initInVieport() {
    jQuery('.js-base').itemInViewport({
        activeClass: 'base-in',
        once: true,
        visibleMode: 3
    });
}

// handle dropdowns on mobile devices
function initTouchNav() {
    jQuery('.nav-first').each(function () {
        new TouchNav({
            navBlock: this,
            menuDrop: '.drop'
        });
    });
}

/*
 * jQuery Tabs plugin
 */

;
(function ($, $win) {
    'use strict';
    function Tabset($holder, options) {
        this.$holder = $holder;
        this.options = options;
        this.init();
    }

    Tabset.prototype = {
        init: function () {
            var self = this;
            this.$tabLinks = this.$holder.find(this.options.tabLinks);
            this.setStartActiveIndex();
            this.setActiveTab();
            if (this.options.autoHeight) {
                this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
            }

            $('.tab-content').on("click", '.back',function(e){
                e.preventDefault();
                self.switchPages(self.options.params.page - 1)
            });

            $('.tab-content').on("click", '.next',function(e){
                    e.preventDefault();
                    self.switchPages(self.options.params.page + 1)
            });
        },
        setStartActiveIndex: function () {
            var $classTargets = this.getClassTarget(this.$tabLinks);
            var $activeLink = $classTargets.filter('.' + this.options.activeClass);
            var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
            var activeIndex;
            if (this.options.checkHash && $hashLink.length) {
                $activeLink = $hashLink;
            }

            activeIndex = $classTargets.index($activeLink);
            this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
            this.switchTabs();
        },
        setActiveTab: function () {
            var self = this;
            this.$tabLinks.each(function (i, link) {
                var $link = $(link);
                var $classTarget = self.getClassTarget($link);
                var $tab = $($link.attr(self.options.attrib));
                if (i !== self.activeTabIndex) {
                    $classTarget.removeClass(self.options.activeClass);
                    $tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
                } else {
                    $classTarget.addClass(self.options.activeClass);
                    $tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
                }

                self.attachTabLink($link, i);
            });
        },
        attachTabLink: function ($link, i) {
            var self = this;
            $link.on(this.options.event + '.tabset', function (e) {
                e.preventDefault();
                if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
                    self.activeTabIndex = i;
                    self.switchTabs();
                }
            });
        },
        resizeHolder: function (height) {
            var self = this;
            if (height) {
                this.$tabHolder.height(height);
                setTimeout(function () {
                    self.$tabHolder.addClass('transition');
                }, 10);
            } else {
                self.$tabHolder.removeClass('transition').height('');
            }
        },
        switchTabs: function () {
            var self = this;
            var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
            var $nextLink = this.$tabLinks.eq(this.activeTabIndex);
            var $prevTab = this.getTab($prevLink);
            var $nextTab = this.getTab($nextLink);
            self.options.params.page = 0;
            $prevTab.removeClass(this.options.activeClass);
            if (self.haveTabHolder()) {
                this.resizeHolder($prevTab.outerHeight());
            }
            $('.tab-content').find('.more strong').children().hide();

            $.ajax({
              url: self.options.link + $nextLink.data('url'),
              data: $.extend({},self.options.params, $nextLink.data('object'))
            }).done(function( response ) {

                console.log(response);
                self.display(response, $nextTab);

                setTimeout(function () {
                    self.getClassTarget($prevLink).removeClass(self.options.activeClass);
                    $prevTab.find('.filter-table tr:not(:first)').remove();
       
                    $prevTab.addClass(self.options.tabHiddenClass);
                    $nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
                    self.getClassTarget($nextLink).addClass(self.options.activeClass);

                    if (self.haveTabHolder()) {
                        self.resizeHolder($nextTab.outerHeight());
                        setTimeout(function () {
                            self.resizeHolder();
                            self.prevTabIndex = self.activeTabIndex;
                        }, self.options.animSpeed);
                    } else {
                        self.prevTabIndex = self.activeTabIndex;
                    }
                }, self.options.autoHeight ? self.options.animSpeed : 1);
              });

        },
        switchPages: function( page ) {
            var self = this;
            var $nextLink = this.$tabLinks.eq(this.activeTabIndex);
            var $nextTab = this.getTab($nextLink);
             $('.tab-content').find('.more strong').children().hide();

             self.options.params.page = page;
             $.ajax({
              url: self.options.link + $nextLink.data('url'),
              data: $.extend({},self.options.params, $nextLink.data('object'))
                }).done(function( response ) {
                    $nextTab.find('.filter-table tr:not(:first)').remove();
                    self.display(response, $nextTab);
              });
        },

        display: function (response, tab) {
            var self = this;
            $.each( response.items, function( key,value ) {

            if (self.getMarket(value.companyMarkets)){
                tab.find('.filter-table').append( 
                        '<tr>' +
                            '<td>' + value.largeLogoName + '</td>' +
                            '<td>' + value.name+ '</td>' +
                            '<td>' + self.getMarket(value.companyMarkets).bonuses.length + '</td>' +
                            '<td>' + self.getMarket(value.companyMarkets).bonuses.length + '</td>' +
                            '<td>' + value.rating + '</td>' +
                        '</tr>'   
                 );
            }
            });

            if ( response.pages > 1 && self.options.params.page != response.pages - 1 ){
                $('.tab-content').find('.next').show();
            };
  
            if ( self.options.params.page != 0){
                $('.tab-content').find('.back').show();
            };            
          },

        getMarket: function (markets) {
            var self = this;
            var market;
            markets.forEach(function(value){
            if (value.market.marketId === self.options.params.marketId){
                   market  = value;
                }  
            });

            return market;

        },
        getClassTarget: function ($link) {
            return this.options.addToParent ? $link.parent() : $link;
        },
        getActiveTab: function () {
            return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
        },
        getTab: function ($link) {
            return $($link.attr(this.options.attrib));
        },
        haveTabHolder: function () {
            //console.log(this.$tabHolder);
            //console.log(this.$tabHolder.length);
            return this.$tabHolder && this.$tabHolder.length;
        },
        destroy: function () {
            var self = this;
            this.$tabLinks.off('.tabset').each(function () {
                var $link = $(this);
                self.getClassTarget($link).removeClass(self.options.activeClass);
                $($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
            });
            this.$holder.removeData('Tabset');
        }
    };
    $.fn.tabset = function (options) {
        options = $.extend({         
            activeClass: 'active',
            addToParent: false,
            autoHeight: false,
            checkHash: false,
            defaultTab: true,
            animSpeed: 500,
            link: 'http://192.168.100.2:8990/services/',
            params: {
                limit: 5,
                page:0,
                marketId: 1
            },
            tabLinks: 'a',
            attrib: 'href',
            event: 'click',
            tabHiddenClass: 'js-tab-hidden'
        }, options);
        options.autoHeight = options.autoHeight && $.support.opacity;
        return this.each(function () {
            var $holder = $(this);
            if (!$holder.data('Tabset')) {
                $holder.data('Tabset', new Tabset($holder, options));
            }
        });
    };
}(jQuery, jQuery(window)));
/*
 * Simple Mobile Navigation
 */
;
(function ($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function () {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function () {
            var self = this;
            if (activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function (e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };
            this.openerClickHandler = function (e) {
                e.preventDefault();
                self.toggle();
            };
            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function () {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function () {
            this.container.addClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function () {
            this.container.removeClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function () {
            if (this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function () {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };
    var activateResizeHandler = function () {
        var win = $(window),
                doc = $('html'),
                resizeClass = 'resize-active',
                flag, timer;
        var removeClassHandler = function () {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function () {
            if (!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };
    $.fn.mobileNav = function (options) {
        return this.each(function () {
            var params = $.extend({}, options, {container: this}),
                    instance = new MobileNav(params);
            $.data(this, 'MobileNav', instance);
        });
    };
}(jQuery));
/*
 * jQuery In Viewport plugin
 */
;
(function ($, $win) {
    'use strict';
    var ScrollDetector = (function () {
        var data = {};
        return {
            init: function () {
                var self = this;
                this.addHolder('win', $win);
                $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function () {
                    $.each(data, function (holderKey, holderData) {
                        self.calcHolderSize(holderData);
                        $.each(holderData.items, function (itemKey, itemData) {
                            self.calcItemSize(itemKey, itemData);
                        });
                    });
                });
            },
            addHolder: function (holderKey, $holder) {
                var self = this;
                var holderData = {
                    holder: $holder,
                    items: {},
                    props: {
                        height: 0,
                        scroll: 0
                    }
                };
                data[holderKey] = holderData;
                $holder.on('scroll.blockInViewport', function () {
                    self.calcHolderScroll(holderData);
                    $.each(holderData.items, function (itemKey, itemData) {
                        self.calcItemScroll(itemKey, itemData);
                    });
                });
                this.calcHolderSize(data[holderKey]);
            },
            calcHolderSize: function (holderData) {
                var holderOffset = holderData.holder.offset();
                holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
                holderData.props.offset = holderOffset ? holderOffset.top : 0;
                this.calcHolderScroll(holderData);
            },
            calcItemSize: function (itemKey, itemData) {
                itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
                itemData.height = itemData.$el.outerHeight();
                this.calcItemScroll(itemKey, itemData);
            },
            calcHolderScroll: function (holderData) {
                holderData.props.scroll = holderData.holder.scrollTop();
            },
            calcItemScroll: function (itemKey, itemData) {
                var itemInViewPortFromUp;
                var itemInViewPortFromDown;
                var itemOutViewPort;
                var holderProps = itemData.holderProps.props;
                switch (itemData.options.visibleMode) {
                    case 1:
                        itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
                        itemInViewPortFromUp = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
                        break;
                    case 2:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                    case 3:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                    default:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                }


                if (itemInViewPortFromUp && itemInViewPortFromDown) {
                    if (!itemData.state) {
                        itemData.state = true;
                        itemData.$el.addClass(itemData.options.activeClass)
                                .trigger('in-viewport', true);
                        if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
                            delete itemData.holderProps.items[itemKey];
                        }
                    }
                } else {
                    itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;
                    if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
                        itemData.state = false;
                        itemData.$el.removeClass(itemData.options.activeClass)
                                .trigger('in-viewport', false);
                    }
                }
            },
            addItem: function (el, options) {
                var itemKey = 'item' + this.getRandomValue();
                var newItem = {
                    $el: $(el),
                    options: options
                };
                var holderKeyDataName = 'in-viewport-holder';
                var $holder = newItem.$el.closest(options.holder);
                var holderKey = $holder.data(holderKeyDataName);
                if (!$holder.length) {
                    holderKey = 'win';
                } else if (!holderKey) {
                    holderKey = 'holder' + this.getRandomValue();
                    $holder.data(holderKeyDataName, holderKey);
                    this.addHolder(holderKey, $holder);
                }

                newItem.holderProps = data[holderKey];
                data[holderKey].items[itemKey] = newItem;
                this.calcItemSize(itemKey, newItem);
            },
            getRandomValue: function () {
                return (Math.random() * 100000).toFixed(0);
            },
            destroy: function () {
                $win.off('.blockInViewport');
                $.each(data, function (key, value) {
                    value.holder.off('.blockInViewport');
                    $.each(value.items, function (key, value) {
                        value.$el.removeClass(value.options.activeClass);
                        value.$el.get(0).itemInViewportAdded = null;
                    });
                });
                data = {};
            }
        };
    }());
    ScrollDetector.init();
    $.fn.itemInViewport = function (options) {
        options = $.extend({
            activeClass: 'in-viewport',
            once: true,
            holder: '',
            visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
        }, options);
        return this.each(function () {
            if (this.itemInViewportAdded) {
                return;
            }

            this.itemInViewportAdded = true;
            ScrollDetector.addItem(this, options);
        });
    };
}(jQuery, jQuery(window)));
// navigation accesibility module
function TouchNav(opt) {
    this.options = {
        hoverClass: 'hover',
        menuItems: 'li',
        menuOpener: 'a',
        menuDrop: 'ul',
        navBlock: null
    };
    for (var p in opt) {
        if (opt.hasOwnProperty(p)) {
            this.options[p] = opt[p];
        }
    }
    this.init();
}
TouchNav.isActiveOn = function (elem) {
    return elem && elem.touchNavActive;
};
TouchNav.prototype = {
    init: function () {
        if (typeof this.options.navBlock === 'string') {
            this.menu = document.getElementById(this.options.navBlock);
        } else if (typeof this.options.navBlock === 'object') {
            this.menu = this.options.navBlock;
        }
        if (this.menu) {
            this.addEvents();
        }
    },
    addEvents: function () {
        // attach event handlers
        var self = this;
        var touchEvent = (navigator.pointerEnabled && 'pointerdown') || (navigator.msPointerEnabled && 'MSPointerDown') || (this.isTouchDevice && 'touchstart');
        this.menuItems = lib.queryElementsBySelector(this.options.menuItems, this.menu);
        var initMenuItem = function (item) {
            var currentDrop = lib.queryElementsBySelector(self.options.menuDrop, item)[0],
                    currentOpener = lib.queryElementsBySelector(self.options.menuOpener, item)[0];
            // only for touch input devices
            if (currentDrop && currentOpener && (self.isTouchDevice || self.isPointerDevice)) {
                lib.event.add(currentOpener, 'click', lib.bind(self.clickHandler, self));
                lib.event.add(currentOpener, 'mousedown', lib.bind(self.mousedownHandler, self));
                lib.event.add(currentOpener, touchEvent, function (e) {
                    if (!self.isTouchPointerEvent(e)) {
                        self.preventCurrentClick = false;
                        return;
                    }
                    self.touchFlag = true;
                    self.currentItem = item;
                    self.currentLink = currentOpener;
                    self.pressHandler.apply(self, arguments);
                });
            }
            // for desktop computers and touch devices
            jQuery(item).bind('mouseenter', function () {
                if (!self.touchFlag) {
                    self.currentItem = item;
                    self.mouseoverHandler();
                }
            });
            jQuery(item).bind('mouseleave', function () {
                if (!self.touchFlag) {
                    self.currentItem = item;
                    self.mouseoutHandler();
                }
            });
            item.touchNavActive = true;
        };
        // addd handlers for all menu items
        for (var i = 0; i < this.menuItems.length; i++) {
            initMenuItem(self.menuItems[i]);
        }

        // hide dropdowns when clicking outside navigation
        if (this.isTouchDevice || this.isPointerDevice) {
            lib.event.add(document.documentElement, 'mousedown', lib.bind(this.clickOutsideHandler, this));
            lib.event.add(document.documentElement, touchEvent, lib.bind(this.clickOutsideHandler, this));
        }
    },
    mousedownHandler: function (e) {
        if (this.touchFlag) {
            e.preventDefault();
            this.touchFlag = false;
            this.preventCurrentClick = false;
        }
    },
    mouseoverHandler: function () {
        lib.addClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem).trigger('itemhover');
    },
    mouseoutHandler: function () {
        lib.removeClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem).trigger('itemleave');
    },
    hideActiveDropdown: function () {
        for (var i = 0; i < this.menuItems.length; i++) {
            if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
                lib.removeClass(this.menuItems[i], this.options.hoverClass);
                jQuery(this.menuItems[i]).trigger('itemleave');
            }
        }
        this.activeParent = null;
    },
    pressHandler: function (e) {
        // hide previous drop (if active)
        if (this.currentItem !== this.activeParent) {
            if (this.activeParent && this.currentItem.parentNode === this.activeParent.parentNode) {
                lib.removeClass(this.activeParent, this.options.hoverClass);
            } else if (!this.isParent(this.activeParent, this.currentLink)) {
                this.hideActiveDropdown();
            }
        }
        // handle current drop
        this.activeParent = this.currentItem;
        if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
            this.preventCurrentClick = false;
        } else {
            //e.preventDefault();
            this.preventCurrentClick = true;
            lib.addClass(this.currentItem, this.options.hoverClass);
            jQuery(this.currentItem).trigger('itemhover');
        }
    },
    clickHandler: function (e) {
        // prevent first click on link
        if (this.preventCurrentClick) {
            e.preventDefault();
        }
    },
    clickOutsideHandler: function (event) {
        var e = event.changedTouches ? event.changedTouches[0] : event;
        if (this.activeParent && !this.isParent(this.menu, e.target)) {
            this.hideActiveDropdown();
            this.touchFlag = false;
        }
    },
    isParent: function (parent, child) {
        while (child.parentNode) {
            if (child.parentNode == parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    isTouchPointerEvent: function (e) {
        return (e.type.indexOf('touch') > -1) ||
                (navigator.pointerEnabled && e.pointerType === 'touch') ||
                (navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH);
    },
    isPointerDevice: (function () {
        return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
    }()),
    isTouchDevice: (function () {
        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    }())
};
/*
 * Utility module
 */
lib = {
    hasClass: function (el, cls) {
        return el && el.className ? el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
    },
    addClass: function (el, cls) {
        if (el && !this.hasClass(el, cls))
            el.className += " " + cls;
    },
    removeClass: function (el, cls) {
        if (el && this.hasClass(el, cls)) {
            el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
        }
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    each: function (obj, callback) {
        var property, len;
        if (typeof obj.length === 'number') {
            for (property = 0, len = obj.length; property < len; property++) {
                if (callback.call(obj[property], property, obj[property]) === false) {
                    break;
                }
            }
        } else {
            for (property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (callback.call(obj[property], property, obj[property]) === false) {
                        break;
                    }
                }
            }
        }
    },
    event: (function () {
        var fixEvent = function (e) {
            e = e || window.event;
            if (e.isFixed)
                return e;
            else
                e.isFixed = true;
            if (!e.target)
                e.target = e.srcElement;
            e.preventDefault = e.preventDefault || function () {
                this.returnValue = false;
            };
            e.stopPropagation = e.stopPropagation || function () {
                this.cancelBubble = true;
            };
            return e;
        };
        return {
            add: function (elem, event, handler) {
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (e) {
                        var ret, handlers = elem.events[e.type];
                        e = fixEvent(e);
                        for (var i = 0, len = handlers.length; i < len; i++) {
                            if (handlers[i]) {
                                ret = handlers[i].call(elem, e);
                                if (ret === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }
                    };
                }
                if (!elem.events[event]) {
                    elem.events[event] = [];
                    if (elem.addEventListener)
                        elem.addEventListener(event, elem.handle, false);
                    else if (elem.attachEvent)
                        elem.attachEvent('on' + event, elem.handle);
                }
                elem.events[event].push(handler);
            },
            remove: function (elem, event, handler) {
                var handlers = elem.events[event];
                for (var i = handlers.length - 1; i >= 0; i--) {
                    if (handlers[i] === handler) {
                        handlers.splice(i, 1);
                    }
                }
                if (!handlers.length) {
                    delete elem.events[event];
                    if (elem.removeEventListener)
                        elem.removeEventListener(event, elem.handle, false);
                    else if (elem.detachEvent)
                        elem.detachEvent('on' + event, elem.handle);
                }
            }
        };
    }()),
    queryElementsBySelector: function (selector, scope) {
        scope = scope || document;
        if (!selector)
            return [];
        if (selector === '>*')
            return scope.children;
        if (typeof document.querySelectorAll === 'function') {
            return scope.querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (element && tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = element ? [element] : [];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName) == attrValue)
                            };
                            break;
                        case '~':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)')))
                            };
                            break;
                        case '|':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')))
                            };
                            break;
                        case '^':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) == 0)
                            };
                            break;
                        case '$':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length)
                            };
                            break;
                        case '*':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) > -1)
                            };
                            break;
                        default :
                            checkFunction = function (e) {
                                return e.getAttribute(attrName)
                            };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    trim: function (str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    bind: function (f, scope, forceArgs) {
        return function () {
            return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);
        };
    }
};
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
if (Object.create) {
    !function (a, b, c, d) {
        "use strict";
        function e(a, b, c) {
            return setTimeout(k(a, c), b)
        }
        function f(a, b, c) {
            return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
        }
        function g(a, b, c) {
            var e;
            if (a)
                if (a.forEach)
                    a.forEach(b, c);
                else if (a.length !== d)
                    for (e = 0; e < a.length; )
                        b.call(c, a[e], e, a), e++;
                else
                    for (e in a)
                        a.hasOwnProperty(e) && b.call(c, a[e], e, a)
        }
        function h(a, b, c) {
            for (var e = Object.keys(b), f = 0; f < e.length; )
                (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
            return a
        }
        function i(a, b) {
            return h(a, b, !0)
        }
        function j(a, b, c) {
            var d, e = b.prototype;
            d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && h(d, c)
        }
        function k(a, b) {
            return function () {
                return a.apply(b, arguments)
            }
        }
        function l(a, b) {
            return typeof a == kb ? a.apply(b ? b[0] || d : d, b) : a
        }
        function m(a, b) {
            return a === d ? b : a
        }
        function n(a, b, c) {
            g(r(b), function (b) {
                a.addEventListener(b, c, !1)
            })
        }
        function o(a, b, c) {
            g(r(b), function (b) {
                a.removeEventListener(b, c, !1)
            })
        }
        function p(a, b) {
            for (; a; ) {
                if (a == b)
                    return!0;
                a = a.parentNode
            }
            return!1
        }
        function q(a, b) {
            return a.indexOf(b) > -1
        }
        function r(a) {
            return a.trim().split(/\s+/g)
        }
        function s(a, b, c) {
            if (a.indexOf && !c)
                return a.indexOf(b);
            for (var d = 0; d < a.length; ) {
                if (c && a[d][c] == b || !c && a[d] === b)
                    return d;
                d++
            }
            return -1
        }
        function t(a) {
            return Array.prototype.slice.call(a, 0)
        }
        function u(a, b, c) {
            for (var d = [], e = [], f = 0; f < a.length; ) {
                var g = b ? a[f][b] : a[f];
                s(e, g) < 0 && d.push(a[f]), e[f] = g, f++
            }
            return c && (d = b ? d.sort(function (a, c) {
                return a[b] > c[b]
            }) : d.sort()), d
        }
        function v(a, b) {
            for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ib.length; ) {
                if (c = ib[g], e = c ? c + f : b, e in a)
                    return e;
                g++
            }
            return d
        }
        function w() {
            return ob++
        }
        function x(a) {
            var b = a.ownerDocument;
            return b.defaultView || b.parentWindow
        }
        function y(a, b) {
            var c = this;
            this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
                l(a.options.enable, [a]) && c.handler(b)
            }, this.init()
        }
        function z(a) {
            var b, c = a.options.inputClass;
            return new (b = c ? c : rb ? N : sb ? Q : qb ? S : M)(a, A)
        }
        function A(a, b, c) {
            var d = c.pointers.length, e = c.changedPointers.length, f = b & yb && d - e === 0, g = b & (Ab | Bb) && d - e === 0;
            c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, B(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c
        }
        function B(a, b) {
            var c = a.session, d = b.pointers, e = d.length;
            c.firstInput || (c.firstInput = E(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
            var f = c.firstInput, g = c.firstMultiple, h = g ? g.center : f.center, i = b.center = F(d);
            b.timeStamp = nb(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = J(h, i), b.distance = I(h, i), C(c, b), b.offsetDirection = H(b.deltaX, b.deltaY), b.scale = g ? L(g.pointers, d) : 1, b.rotation = g ? K(g.pointers, d) : 0, D(c, b);
            var j = a.element;
            p(b.srcEvent.target, j) && (j = b.srcEvent.target), b.target = j
        }
        function C(a, b) {
            var c = b.center, d = a.offsetDelta || {}, e = a.prevDelta || {}, f = a.prevInput || {};
            (b.eventType === yb || f.eventType === Ab) && (e = a.prevDelta = {x: f.deltaX || 0, y: f.deltaY || 0}, d = a.offsetDelta = {x: c.x, y: c.y}), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y)
        }
        function D(a, b) {
            var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp;
            if (b.eventType != Bb && (i > xb || h.velocity === d)) {
                var j = h.deltaX - b.deltaX, k = h.deltaY - b.deltaY, l = G(i, j, k);
                e = l.x, f = l.y, c = mb(l.x) > mb(l.y) ? l.x : l.y, g = H(j, k), a.lastInterval = b
            } else
                c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
            b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g
        }
        function E(a) {
            for (var b = [], c = 0; c < a.pointers.length; )
                b[c] = {clientX: lb(a.pointers[c].clientX), clientY: lb(a.pointers[c].clientY)}, c++;
            return{timeStamp: nb(), pointers: b, center: F(b), deltaX: a.deltaX, deltaY: a.deltaY}
        }
        function F(a) {
            var b = a.length;
            if (1 === b)
                return{x: lb(a[0].clientX), y: lb(a[0].clientY)};
            for (var c = 0, d = 0, e = 0; b > e; )
                c += a[e].clientX, d += a[e].clientY, e++;
            return{x: lb(c / b), y: lb(d / b)}
        }
        function G(a, b, c) {
            return{x: b / a || 0, y: c / a || 0}
        }
        function H(a, b) {
            return a === b ? Cb : mb(a) >= mb(b) ? a > 0 ? Db : Eb : b > 0 ? Fb : Gb
        }
        function I(a, b, c) {
            c || (c = Kb);
            var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
            return Math.sqrt(d * d + e * e)
        }
        function J(a, b, c) {
            c || (c = Kb);
            var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
            return 180 * Math.atan2(e, d) / Math.PI
        }
        function K(a, b) {
            return J(b[1], b[0], Lb) - J(a[1], a[0], Lb)
        }
        function L(a, b) {
            return I(b[0], b[1], Lb) / I(a[0], a[1], Lb)
        }
        function M() {
            this.evEl = Nb, this.evWin = Ob, this.allow = !0, this.pressed = !1, y.apply(this, arguments)
        }
        function N() {
            this.evEl = Rb, this.evWin = Sb, y.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }
        function O() {
            this.evTarget = Ub, this.evWin = Vb, this.started = !1, y.apply(this, arguments)
        }
        function P(a, b) {
            var c = t(a.touches), d = t(a.changedTouches);
            return b & (Ab | Bb) && (c = u(c.concat(d), "identifier", !0)), [c, d]
        }
        function Q() {
            this.evTarget = Xb, this.targetIds = {}, y.apply(this, arguments)
        }
        function R(a, b) {
            var c = t(a.touches), d = this.targetIds;
            if (b & (yb | zb) && 1 === c.length)
                return d[c[0].identifier] = !0, [c, c];
            var e, f, g = t(a.changedTouches), h = [], i = this.target;
            if (f = c.filter(function (a) {
                return p(a.target, i)
            }), b === yb)
                for (e = 0; e < f.length; )
                    d[f[e].identifier] = !0, e++;
            for (e = 0; e < g.length; )
                d[g[e].identifier] && h.push(g[e]), b & (Ab | Bb) && delete d[g[e].identifier], e++;
            return h.length ? [u(f.concat(h), "identifier", !0), h] : void 0
        }
        function S() {
            y.apply(this, arguments);
            var a = k(this.handler, this);
            this.touch = new Q(this.manager, a), this.mouse = new M(this.manager, a)
        }
        function T(a, b) {
            this.manager = a, this.set(b)
        }
        function U(a) {
            if (q(a, bc))
                return bc;
            var b = q(a, cc), c = q(a, dc);
            return b && c ? cc + " " + dc : b || c ? b ? cc : dc : q(a, ac) ? ac : _b
        }
        function V(a) {
            this.id = w(), this.manager = null, this.options = i(a || {}, this.defaults), this.options.enable = m(this.options.enable, !0), this.state = ec, this.simultaneous = {}, this.requireFail = []
        }
        function W(a) {
            return a & jc ? "cancel" : a & hc ? "end" : a & gc ? "move" : a & fc ? "start" : ""
        }
        function X(a) {
            return a == Gb ? "down" : a == Fb ? "up" : a == Db ? "left" : a == Eb ? "right" : ""
        }
        function Y(a, b) {
            var c = b.manager;
            return c ? c.get(a) : a
        }
        function Z() {
            V.apply(this, arguments)
        }
        function $() {
            Z.apply(this, arguments), this.pX = null, this.pY = null
        }
        function _() {
            Z.apply(this, arguments)
        }
        function ab() {
            V.apply(this, arguments), this._timer = null, this._input = null
        }
        function bb() {
            Z.apply(this, arguments)
        }
        function cb() {
            Z.apply(this, arguments)
        }
        function db() {
            V.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }
        function eb(a, b) {
            return b = b || {}, b.recognizers = m(b.recognizers, eb.defaults.preset), new fb(a, b)
        }
        function fb(a, b) {
            b = b || {}, this.options = i(b, eb.defaults), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, this.input = z(this), this.touchAction = new T(this, this.options.touchAction), gb(this, !0), g(b.recognizers, function (a) {
                var b = this.add(new a[0](a[1]));
                a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3])
            }, this)
        }
        function gb(a, b) {
            var c = a.element;
            g(a.options.cssProps, function (a, d) {
                c.style[v(c.style, d)] = b ? a : ""
            })
        }
        function hb(a, c) {
            var d = b.createEvent("Event");
            d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d)
        }
        var ib = ["", "webkit", "moz", "MS", "ms", "o"], jb = b.createElement("div"), kb = "function", lb = Math.round, mb = Math.abs, nb = Date.now, ob = 1, pb = /mobile|tablet|ip(ad|hone|od)|android/i, qb = "ontouchstart"in a, rb = v(a, "PointerEvent") !== d, sb = qb && pb.test(navigator.userAgent), tb = "touch", ub = "pen", vb = "mouse", wb = "kinect", xb = 25, yb = 1, zb = 2, Ab = 4, Bb = 8, Cb = 1, Db = 2, Eb = 4, Fb = 8, Gb = 16, Hb = Db | Eb, Ib = Fb | Gb, Jb = Hb | Ib, Kb = ["x", "y"], Lb = ["clientX", "clientY"];
        y.prototype = {handler: function () {}, init: function () {
                this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(x(this.element), this.evWin, this.domHandler)
            }, destroy: function () {
                this.evEl && o(this.element, this.evEl, this.domHandler), this.evTarget && o(this.target, this.evTarget, this.domHandler), this.evWin && o(x(this.element), this.evWin, this.domHandler)
            }};
        var Mb = {mousedown: yb, mousemove: zb, mouseup: Ab}, Nb = "mousedown", Ob = "mousemove mouseup";
        j(M, y, {handler: function (a) {
                var b = Mb[a.type];
                b & yb && 0 === a.button && (this.pressed = !0), b & zb && 1 !== a.which && (b = Ab), this.pressed && this.allow && (b & Ab && (this.pressed = !1), this.callback(this.manager, b, {pointers: [a], changedPointers: [a], pointerType: vb, srcEvent: a}))
            }});
        var Pb = {pointerdown: yb, pointermove: zb, pointerup: Ab, pointercancel: Bb, pointerout: Bb}, Qb = {2: tb, 3: ub, 4: vb, 5: wb}, Rb = "pointerdown", Sb = "pointermove pointerup pointercancel";
        a.MSPointerEvent && (Rb = "MSPointerDown", Sb = "MSPointerMove MSPointerUp MSPointerCancel"), j(N, y, {handler: function (a) {
                var b = this.store, c = !1, d = a.type.toLowerCase().replace("ms", ""), e = Pb[d], f = Qb[a.pointerType] || a.pointerType, g = f == tb, h = s(b, a.pointerId, "pointerId");
                e & yb && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ab | Bb) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {pointers: b, changedPointers: [a], pointerType: f, srcEvent: a}), c && b.splice(h, 1))
            }});
        var Tb = {touchstart: yb, touchmove: zb, touchend: Ab, touchcancel: Bb}, Ub = "touchstart", Vb = "touchstart touchmove touchend touchcancel";
        j(O, y, {handler: function (a) {
                var b = Tb[a.type];
                if (b === yb && (this.started = !0), this.started) {
                    var c = P.call(this, a, b);
                    b & (Ab | Bb) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, {pointers: c[0], changedPointers: c[1], pointerType: tb, srcEvent: a})
                }
            }});
        var Wb = {touchstart: yb, touchmove: zb, touchend: Ab, touchcancel: Bb}, Xb = "touchstart touchmove touchend touchcancel";
        j(Q, y, {handler: function (a) {
                var b = Wb[a.type], c = R.call(this, a, b);
                c && this.callback(this.manager, b, {pointers: c[0], changedPointers: c[1], pointerType: tb, srcEvent: a})
            }}), j(S, y, {handler: function (a, b, c) {
                var d = c.pointerType == tb, e = c.pointerType == vb;
                if (d)
                    this.mouse.allow = !1;
                else if (e && !this.mouse.allow)
                    return;
                b & (Ab | Bb) && (this.mouse.allow = !0), this.callback(a, b, c)
            }, destroy: function () {
                this.touch.destroy(), this.mouse.destroy()
            }});
        var Yb = v(jb.style, "touchAction"), Zb = Yb !== d, $b = "compute", _b = "auto", ac = "manipulation", bc = "none", cc = "pan-x", dc = "pan-y";
        T.prototype = {set: function (a) {
                a == $b && (a = this.compute()), Zb && (this.manager.element.style[Yb] = a), this.actions = a.toLowerCase().trim()
            }, update: function () {
                this.set(this.manager.options.touchAction)
            }, compute: function () {
                var a = [];
                return g(this.manager.recognizers, function (b) {
                    l(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
                }), U(a.join(" "))
            }, preventDefaults: function (a) {
                if (!Zb) {
                    var b = a.srcEvent, c = a.offsetDirection;
                    if (this.manager.session.prevented)
                        return void b.preventDefault();
                    var d = this.actions, e = q(d, bc), f = q(d, dc), g = q(d, cc);
                    return e || f && c & Hb || g && c & Ib ? this.preventSrc(b) : void 0
                }
            }, preventSrc: function (a) {
                this.manager.session.prevented = !0, a.preventDefault()
            }};
        var ec = 1, fc = 2, gc = 4, hc = 8, ic = hc, jc = 16, kc = 32;
        V.prototype = {defaults: {}, set: function (a) {
                return h(this.options, a), this.manager && this.manager.touchAction.update(), this
            }, recognizeWith: function (a) {
                if (f(a, "recognizeWith", this))
                    return this;
                var b = this.simultaneous;
                return a = Y(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
            }, dropRecognizeWith: function (a) {
                return f(a, "dropRecognizeWith", this) ? this : (a = Y(a, this), delete this.simultaneous[a.id], this)
            }, requireFailure: function (a) {
                if (f(a, "requireFailure", this))
                    return this;
                var b = this.requireFail;
                return a = Y(a, this), -1 === s(b, a) && (b.push(a), a.requireFailure(this)), this
            }, dropRequireFailure: function (a) {
                if (f(a, "dropRequireFailure", this))
                    return this;
                a = Y(a, this);
                var b = s(this.requireFail, a);
                return b > -1 && this.requireFail.splice(b, 1), this
            }, hasRequireFailures: function () {
                return this.requireFail.length > 0
            }, canRecognizeWith: function (a) {
                return!!this.simultaneous[a.id]
            }, emit: function (a) {
                function b(b) {
                    c.manager.emit(c.options.event + (b ? W(d) : ""), a)
                }
                var c = this, d = this.state;
                hc > d && b(!0), b(), d >= hc && b(!0)
            }, tryEmit: function (a) {
                return this.canEmit() ? this.emit(a) : void(this.state = kc)
            }, canEmit: function () {
                for (var a = 0; a < this.requireFail.length; ) {
                    if (!(this.requireFail[a].state & (kc | ec)))
                        return!1;
                    a++
                }
                return!0
            }, recognize: function (a) {
                var b = h({}, a);
                return l(this.options.enable, [this, b]) ? (this.state & (ic | jc | kc) && (this.state = ec), this.state = this.process(b), void(this.state & (fc | gc | hc | jc) && this.tryEmit(b))) : (this.reset(), void(this.state = kc))
            }, process: function () {}, getTouchAction: function () {}, reset: function () {}}, j(Z, V, {defaults: {pointers: 1}, attrTest: function (a) {
                var b = this.options.pointers;
                return 0 === b || a.pointers.length === b
            }, process: function (a) {
                var b = this.state, c = a.eventType, d = b & (fc | gc), e = this.attrTest(a);
                return d && (c & Bb || !e) ? b | jc : d || e ? c & Ab ? b | hc : b & fc ? b | gc : fc : kc
            }}), j($, Z, {defaults: {event: "pan", threshold: 10, pointers: 1, direction: Jb}, getTouchAction: function () {
                var a = this.options.direction, b = [];
                return a & Hb && b.push(dc), a & Ib && b.push(cc), b
            }, directionTest: function (a) {
                var b = this.options, c = !0, d = a.distance, e = a.direction, f = a.deltaX, g = a.deltaY;
                return e & b.direction || (b.direction & Hb ? (e = 0 === f ? Cb : 0 > f ? Db : Eb, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Cb : 0 > g ? Fb : Gb, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction
            }, attrTest: function (a) {
                return Z.prototype.attrTest.call(this, a) && (this.state & fc || !(this.state & fc) && this.directionTest(a))
            }, emit: function (a) {
                this.pX = a.deltaX, this.pY = a.deltaY;
                var b = X(a.direction);
                b && this.manager.emit(this.options.event + b, a), this._super.emit.call(this, a)
            }}), j(_, Z, {defaults: {event: "pinch", threshold: 0, pointers: 2}, getTouchAction: function () {
                return[bc]
            }, attrTest: function (a) {
                return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fc)
            }, emit: function (a) {
                if (this._super.emit.call(this, a), 1 !== a.scale) {
                    var b = a.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + b, a)
                }
            }}), j(ab, V, {defaults: {event: "press", pointers: 1, time: 500, threshold: 5}, getTouchAction: function () {
                return[_b]
            }, process: function (a) {
                var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime > b.time;
                if (this._input = a, !d || !c || a.eventType & (Ab | Bb) && !f)
                    this.reset();
                else if (a.eventType & yb)
                    this.reset(), this._timer = e(function () {
                        this.state = ic, this.tryEmit()
                    }, b.time, this);
                else if (a.eventType & Ab)
                    return ic;
                return kc
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function (a) {
                this.state === ic && (a && a.eventType & Ab ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb(), this.manager.emit(this.options.event, this._input)))
            }}), j(bb, Z, {defaults: {event: "rotate", threshold: 0, pointers: 2}, getTouchAction: function () {
                return[bc]
            }, attrTest: function (a) {
                return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fc)
            }}), j(cb, Z, {defaults: {event: "swipe", threshold: 10, velocity: .65, direction: Hb | Ib, pointers: 1}, getTouchAction: function () {
                return $.prototype.getTouchAction.call(this)
            }, attrTest: function (a) {
                var b, c = this.options.direction;
                return c & (Hb | Ib) ? b = a.velocity : c & Hb ? b = a.velocityX : c & Ib && (b = a.velocityY), this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && mb(b) > this.options.velocity && a.eventType & Ab
            }, emit: function (a) {
                var b = X(a.direction);
                b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a)
            }}), j(db, V, {defaults: {event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 2, posThreshold: 10}, getTouchAction: function () {
                return[ac]
            }, process: function (a) {
                var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime < b.time;
                if (this.reset(), a.eventType & yb && 0 === this.count)
                    return this.failTimeout();
                if (d && f && c) {
                    if (a.eventType != Ab)
                        return this.failTimeout();
                    var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0, h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                    this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
                    var i = this.count % b.taps;
                    if (0 === i)
                        return this.hasRequireFailures() ? (this._timer = e(function () {
                            this.state = ic, this.tryEmit()
                        }, b.interval, this), fc) : ic
                }
                return kc
            }, failTimeout: function () {
                return this._timer = e(function () {
                    this.state = kc
                }, this.options.interval, this), kc
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function () {
                this.state == ic && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }}), eb.VERSION = "2.0.4", eb.defaults = {domEvents: !1, touchAction: $b, enable: !0, inputTarget: null, inputClass: null, preset: [[bb, {enable: !1}], [_, {enable: !1}, ["rotate"]], [cb, {direction: Hb}], [$, {direction: Hb}, ["swipe"]], [db], [db, {event: "doubletap", taps: 2}, ["tap"]], [ab]], cssProps: {userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)"}};
        var lc = 1, mc = 2;
        fb.prototype = {set: function (a) {
                return h(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
            }, stop: function (a) {
                this.session.stopped = a ? mc : lc
            }, recognize: function (a) {
                var b = this.session;
                if (!b.stopped) {
                    this.touchAction.preventDefaults(a);
                    var c, d = this.recognizers, e = b.curRecognizer;
                    (!e || e && e.state & ic) && (e = b.curRecognizer = null);
                    for (var f = 0; f < d.length; )
                        c = d[f], b.stopped === mc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (fc | gc | hc) && (e = b.curRecognizer = c), f++
                }
            }, get: function (a) {
                if (a instanceof V)
                    return a;
                for (var b = this.recognizers, c = 0; c < b.length; c++)
                    if (b[c].options.event == a)
                        return b[c];
                return null
            }, add: function (a) {
                if (f(a, "add", this))
                    return this;
                var b = this.get(a.options.event);
                return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
            }, remove: function (a) {
                if (f(a, "remove", this))
                    return this;
                var b = this.recognizers;
                return a = this.get(a), b.splice(s(b, a), 1), this.touchAction.update(), this
            }, on: function (a, b) {
                var c = this.handlers;
                return g(r(a), function (a) {
                    c[a] = c[a] || [], c[a].push(b)
                }), this
            }, off: function (a, b) {
                var c = this.handlers;
                return g(r(a), function (a) {
                    b ? c[a].splice(s(c[a], b), 1) : delete c[a]
                }), this
            }, emit: function (a, b) {
                this.options.domEvents && hb(a, b);
                var c = this.handlers[a] && this.handlers[a].slice();
                if (c && c.length) {
                    b.type = a, b.preventDefault = function () {
                        b.srcEvent.preventDefault()
                    };
                    for (var d = 0; d < c.length; )
                        c[d](b), d++
                }
            }, destroy: function () {
                this.element && gb(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }}, h(eb, {INPUT_START: yb, INPUT_MOVE: zb, INPUT_END: Ab, INPUT_CANCEL: Bb, STATE_POSSIBLE: ec, STATE_BEGAN: fc, STATE_CHANGED: gc, STATE_ENDED: hc, STATE_RECOGNIZED: ic, STATE_CANCELLED: jc, STATE_FAILED: kc, DIRECTION_NONE: Cb, DIRECTION_LEFT: Db, DIRECTION_RIGHT: Eb, DIRECTION_UP: Fb, DIRECTION_DOWN: Gb, DIRECTION_HORIZONTAL: Hb, DIRECTION_VERTICAL: Ib, DIRECTION_ALL: Jb, Manager: fb, Input: y, TouchAction: T, TouchInput: Q, MouseInput: M, PointerEventInput: N, TouchMouseInput: S, SingleTouchInput: O, Recognizer: V, AttrRecognizer: Z, Tap: db, Pan: $, Swipe: cb, Pinch: _, Rotate: bb, Press: ab, on: n, off: o, each: g, merge: i, extend: h, inherit: j, bindFn: k, prefixed: v}), typeof define == kb && define.amd ? define(function () {
            return eb
        }) : "undefined" != typeof module && module.exports ? module.exports = eb : a[c] = eb
    }(window, document, "Hammer");
}