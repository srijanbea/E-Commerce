/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
var Rs. = jQuery.noConflict();

let UomoSections = {};
let UomoElements = {};

let UomoSelectors = {
  pageBackDropActiveClass: 'page-overlay_visible',
  quantityControl: '.qty-control',
  scrollToTopId: 'scrollTop',
  Rs.pageBackDrop: document.querySelector('.page-overlay'),
  scrollWidth:   window.innerWidth - document.body.clientWidth + 'px',
  jsContentVisible: '.js-content_visible',
  starRatingControl: '.star-rating .star-rating__star-icon',
}

// Utility functions
let UomoHelpers = {
  isMobile: false,
  sideStkEl: {},

  debounce: (callback, wait, immediate = false) => {
    let timeout = null;

    return function() {
      const callNow = immediate && !timeout;
      const next = () => callback.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(next, wait);

      if (callNow) {
        next();
      }
    }
  },

  showPageBackdrop: () => {
    UomoSelectors.Rs.pageBackDrop && UomoSelectors.Rs.pageBackDrop.classList.add(UomoSelectors.pageBackDropActiveClass);
    document.body.classList.add('overflow-hidden');
    document.body.style.paddingRight = UomoSelectors.scrollWidth;
    document.querySelectorAll('.header_sticky, .footer-mobile').forEach(element => {
      element.style.borderRight = UomoSelectors.scrollWidth + ' solid transparent';
    });
  },

  hidePageBackdrop: () => {
    UomoSelectors.Rs.pageBackDrop && UomoSelectors.Rs.pageBackDrop.classList.remove(UomoSelectors.pageBackDropActiveClass);
    document.body.classList.remove('overflow-hidden');
    document.body.style.paddingRight = '';
    document.querySelectorAll('.header_sticky, .footer-mobile').forEach(element => {
      element.style.borderRight = '';
    });
  },

  hideHoverComponents: () => {
    document.querySelectorAll(UomoSelectors.jsContentVisible).forEach( el => {
      el.classList.remove(UomoSelectors.jsContentVisible.substring(1));
    });
  },

  updateDeviceSize: () => {
    return window.innerWidth < 992
  }
};

function purecookieDismiss() {
  setCookie("purecookieDismiss", "1", 7), pureFadeOut("cookieConsentContainer")
}

function setCookie(e, o, i) {
  var t = "";
  if (i) {
    var n = new Date;
    n.setTime(n.getTime() + 24 * i * 60 * 60 * 1e3), t = "; expires=" + n.toUTCString()
  }
  document.cookie = e + "=" + (o || "") + t + "; path=/"
}

function pureFadeOut(e) {
  var o = document.getElementById(e);
  o.style.opacity = 1,
    function e() {
      (o.style.opacity -= .02) < 0 ? o.style.display = "none" : requestAnimationFrame(e)
    }()
}

(function () {
  'use strict';

  // Scroll bar width
  const scrollBarWidth = window.innerWidth - document.body.clientWidth

  // Components appear after click
  UomoElements.JsHoverContent = (function () {
    function JsHoverContent () {
      const visibleClass = UomoSelectors.jsContentVisible.substring(1);

      document.querySelectorAll('.js-hover__open').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();

          const Rs.container = e.currentTarget.closest('.hover-container');
          if (Rs.container.classList.contains(visibleClass)) {
            Rs.container.classList.remove(visibleClass);
            // e.stopPropagation();
          } else {
            UomoHelpers.hideHoverComponents();
            Rs.container.classList.add(visibleClass);
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest(UomoSelectors.jsContentVisible)) {
          UomoHelpers.hideHoverComponents();
        }
      });
    }


    return JsHoverContent;
  })();

  UomoElements.QtyControl = (function () {
    function QtyControl () {
      document.querySelectorAll(UomoSelectors.quantityControl).forEach(function(Rs.qty) {
        if (Rs.qty.classList.contains('qty-initialized')) {
          return;
        }

        Rs.qty.classList.add('qty-initialized');
        const Rs.reduce = Rs.qty.querySelector('.qty-control__reduce');
        const Rs.increase = Rs.qty.querySelector('.qty-control__increase');
        const Rs.number = Rs.qty.querySelector('.qty-control__number');

        Rs.reduce.addEventListener('click', function() {
          Rs.number.value = parseInt(Rs.number.value) > 1 ? parseInt(Rs.number.value) - 1 : parseInt(Rs.number.value);
        });

        Rs.increase.addEventListener('click', function() {
          Rs.number.value = parseInt(Rs.number.value) + 1;
        });
      });
    }

    return QtyControl;
  })();

  UomoElements.ScrollToTop = (function () {
    function ScrollToTop () {
      const Rs.scrollTop = document.getElementById(UomoSelectors.scrollToTopId);

      if (!Rs.scrollTop) {
        return;
      }

      Rs.scrollTop.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.scrollTo(window.scrollX, 0);
      });

      let scrolled = false;
      window.addEventListener('scroll', function() {
        if ( 250 < window.scrollY && !scrolled ) {
          Rs.scrollTop.classList.remove('visually-hidden');
          scrolled = true;
        }

        if ( 250 > window.scrollY && scrolled ) {
          Rs.scrollTop.classList.add('visually-hidden');
          scrolled = false;
        }
      });
    }

    return ScrollToTop;
  })();

  UomoElements.Search = (function() {
    function Search() {
      // Declare variables
      this.selectors = {
        container: '.search-field',
        inputBox: '.search-field__input',
        searchSuggestItem: '.search-suggestion a.menu-link',
        searchFieldActor: '.search-field__actor',
        resetButton: '.search-popup__reset',
        searchCategorySelector: '.js-search-select',
        resultContainer: '.search-result',
        ajaxURL: './search.html'
      }

      this.searchInputFocusedClass = 'search-field__focused';

      this.Rs.containers = document.querySelectorAll(this.selectors.container);

      this._initSearchSelect();
      this._initSearchReset();
      this._initSearchInputFocus();
      this._initAjaxSearch();

      this._handleAjaxSearch = this._handleAjaxSearch.bind(this);
      this._updateSearchResult = this._updateSearchResult.bind(this);
    }

    Search.prototype = Object.assign({}, Search.prototype, {
      _initSearchSelect: function () {
        const _this = this;
        this.Rs.containers.forEach( el => {
          /**
           * Filter suggestion list on input
           */

          const Rs.inputBox = el.querySelector(_this.selectors.inputBox);
          Rs.inputBox && Rs.inputBox.addEventListener('keyup', (e) => {
            const filterValue = e.currentTarget.value.toUpperCase();
            el.querySelectorAll(_this.selectors.searchSuggestItem).forEach( el => {
              const txtValue = el.innerText;

              if (txtValue.toUpperCase().indexOf(filterValue) > -1) {
                el.style.display = "";
              } else {
                el.style.display = "none";
              }
            });
          });

          /**
           * Search category selector
           */
          el.querySelectorAll(_this.selectors.searchCategorySelector).forEach( scs => {
            scs.addEventListener('click', function(e) {
              e.preventDefault();
              const Rs.s_f_a = el.querySelector(_this.selectors.searchFieldActor);
              if (Rs.s_f_a) {
                Rs.s_f_a.value = e.target.innerText;
              }
            });
          });
        })
      },

      _removeFormActiveClass(Rs.eventEl) {
        const Rs.parentDiv = Rs.eventEl.closest(this.selectors.container);
        Rs.parentDiv.classList.remove(this.searchInputFocusedClass);
      },

      _initSearchReset: function () {
        const _this = this;
        document.querySelectorAll(this.selectors.resetButton).forEach( el => {
          el.addEventListener('click', function(e) {
            const Rs.parentDiv = e.target.closest(_this.selectors.container);
            const Rs.inputBox = Rs.parentDiv.querySelector(_this.selectors.inputBox);
            const Rs.rc = Rs.parentDiv.querySelector(_this.selectors.resultContainer);

            Rs.inputBox.value = '';
            Rs.rc.innerHtml = '';
            _this._removeFormActiveClass(e.target);
          });
        })
      },

      _initSearchInputFocus: function () {
        const _this = this;

        document.querySelectorAll(this.selectors.inputBox).forEach( el => {
          el.addEventListener('blur', function(e) {
            if (e.target.value.length == 0) {
              _this._removeFormActiveClass(e.target);
            }
          })
        });
      },

      _initAjaxSearch: function () {
        const _this = this;
        document.querySelectorAll(this.selectors.inputBox).forEach( el => {
          el.addEventListener('keyup', (event) => {
            if (event.target.value.length == 0) {
              _this._removeFormActiveClass(event.target);
            } else {
              _this._handleAjaxSearch(event, _this);
            }
          });
        })
      },

      _handleAjaxSearch: UomoHelpers.debounce((event, _this) => {
        const Rs.form = event.target.closest(_this.selectors.container);
        const method = Rs.form ? Rs.form.method : 'GET';
        const url = _this.selectors.ajaxURL;

        url && fetch(url, { method: method }).then(function (response) {
          if (response.ok) {
            return response.text();
          } else {
            return Promise.reject(response);
          }
        }).then(function(data) {
          _this._updateSearchResult(data, Rs.form);
        }).catch(function (err) {
          _this._handleAjaxSearchError(err.message, Rs.form);
        });
      }, 180),

      _updateSearchResult: function(data, Rs.form) {
        const Rs.ajaxDom = new DOMParser().parseFromString(data, 'text/html');
        // Get filtered result dom
        const Rs.f_r = Rs.ajaxDom.querySelector('.search-result');
        Rs.form.querySelector(this.selectors.resultContainer).innerHTML = Rs.f_r.innerHTML;
        Rs.form.classList.add(this.searchInputFocusedClass);
      },

      _handleAjaxSearchError: function (error, Rs.form) {
        Rs.form.classList.remove(this.searchInputFocusedClass);
        console.log(error);
      }
    });

    return Search
  })();

  // Aside Popup
  UomoElements.Aside = (function () {
    function Aside () {
      this.selectors = {
        activator:    '.js-open-aside',
        closeBtn:     '.js-close-aside',
        activeClass:  'aside_visible'
      }

      this.Rs.asideActivators = document.querySelectorAll(this.selectors.activator);
      this.Rs.closeBtns = document.querySelectorAll(this.selectors.closeBtn);

      this._init();
      this._initCloseActions();
      this._initBackDropClick();
    }

    Aside.prototype = Object.assign({}, Aside.prototype, {
      _init: function () {
        const _this = this;
        this.Rs.asideActivators.forEach(function(Rs.activator) {
          Rs.activator.addEventListener('click', (event) => {
            event.preventDefault();
            const targetElId = event.currentTarget.dataset.aside;
            const Rs.targetAside = document.getElementById(targetElId);

            UomoHelpers.showPageBackdrop();
            Rs.targetAside && Rs.targetAside.classList.add(_this.selectors.activeClass);
          });
        });
      },

      _initCloseActions: function () {
        const _this = this;
        this.Rs.closeBtns.forEach( el => {
          el.addEventListener('click', (event) => {
            event.preventDefault();
            _this._closeAside();
          });
        });
      },

      _initBackDropClick() {
        if (UomoSelectors.Rs.pageBackDrop) {
          UomoSelectors.Rs.pageBackDrop.addEventListener('click', () => {
            this._closeAside();
          });
        }
      },

      _closeAside: function () {
        UomoHelpers.hidePageBackdrop();
        document.querySelectorAll('.' + this.selectors.activeClass).forEach( el => {
          el.classList.remove(this.selectors.activeClass);
        });
      }
    });

    return Aside;
  })();

  UomoElements.Countdown = (function () {
    function Countdown (container) {
      this.selectors = {
        element: '.js-countdown'
      }

      this.Rs.container = container || document.body;

      this._init()
    }

    Countdown.prototype = Object.assign({}, Countdown.prototype, {
      _init: function () {
        const _this = this;
        const Rs.countdowns = this.Rs.container.querySelectorAll(this.selectors.element);
        Rs.countdowns.forEach(function(Rs.el) {
          _this._initElement(Rs.el);
        });
      },

      _initElement(Rs.el) {
        // eslint-disable-next-line no-undef
        const timer = new countdown({
          target: Rs.el
        });
      }
    });


    return Countdown;
  })();

  UomoElements.ShopViewChange = (function () {
    function ShopViewChange () {
      this.selectors = {
        element: '.js-cols-size',
        activeClass: 'btn-link_active'
      }

      this.Rs.buttons = document.querySelectorAll(this.selectors.element);

      this._init();
    }

    ShopViewChange.prototype = Object.assign({}, ShopViewChange.prototype, {
      _init: function () {
        const _this = this;
        this.Rs.buttons.forEach(function(Rs.btn) {
          Rs.btn.addEventListener('click', function(event) {
            event.preventDefault();
            const targetDomId = Rs.btn.dataset.target;
            _this._resetActiveLinks();
            this.classList.add(_this.selectors.activeClass);
            const newCol = Rs.btn.dataset.cols;
            _this._changeViewCols(targetDomId, newCol);
          });
        });
      },

      _changeViewCols(parentId, newCol) {
        const Rs.targetDom = document.getElementById(parentId);
        if (Rs.targetDom) {
          Rs.targetDom.classList.remove(
            'row-cols-xl-2', 'row-cols-xl-3', 'row-cols-xl-4', 'row-cols-xl-5', 'row-cols-xl-6',
            'row-cols-lg-2', 'row-cols-lg-3', 'row-cols-lg-4', 'row-cols-lg-5', 'row-cols-lg-6');
          Rs.targetDom.classList.add('row-cols-xl-' + newCol, 'row-cols-lg-' + newCol);
        }
      },

      _resetActiveLinks() {
        const _this = this;
        document.querySelectorAll(`Rs.{this.selectors.element}.Rs.{this.selectors.activeClass}`).forEach(Rs.el => {
          Rs.el.classList.remove(_this.selectors.activeClass);
        });
      }
    });

    return ShopViewChange;
  })();

  UomoElements.Filters = (function () {
    function Filters () {
      this.selectors = {
        element: '.js-filter',
        activeClass: 'swatch_active',
      }

      this.Rs.buttons = document.querySelectorAll(this.selectors.element);

      this._init();
    }

    Filters.prototype = Object.assign({}, Filters.prototype, {
      _init: function () {
        const _this = this;
        this.Rs.buttons.forEach(function(Rs.btn) {
          Rs.btn.addEventListener('click', function(event) {
            event.preventDefault();
            _this._toggleActive(Rs.btn);
          });
        });
      },

      _toggleActive(Rs.btn) {
        if (Rs.btn.classList.contains(this.selectors.activeClass)) {
          Rs.btn.classList.remove(this.selectors.activeClass);
        } else {
          Rs.btn.classList.add(this.selectors.activeClass);
        }
      }
    });


    return Filters;
  })();

  UomoElements.StickyElement = (function () {
    function StickyElement () {
      this.selectors = {
        element: '.side-sticky'
      }

      this.Rs.stickies = document.querySelectorAll(this.selectors.element);
      this._updateStatus = this._updateStatus.bind(this);
      this._init();
    }

    StickyElement.prototype = Object.assign({}, StickyElement.prototype, {
      _init: function () {
        if (UomoHelpers.isMobile) {
          return;
        }

        this.Rs.stickies.forEach(function(Rs.sticky) {
          const Rs.grid = Rs.sticky.previousElementSibling || Rs.sticky.nextElementSibling;
          const Rs.target = Rs.grid.offsetHeight > Rs.sticky.offsetHeight ? Rs.sticky : Rs.grid;

          Rs.target.lastKnownY = window.scrollY;
          if (!UomoHelpers.sideStkEl.currentTop) {
            UomoHelpers.sideStkEl.currentTop = 0;
          } else {
            return;
          }


          UomoHelpers.sideStkEl.initialTopOffset = parseInt(window.getComputedStyle(Rs.target).top);
        });

        window.addEventListener('scroll', this._updateStatus);
      },

      _updateStatus() {
        const _this = this;

        _this.Rs.stickies.forEach(function(Rs.sticky) {
          const Rs.grid = Rs.sticky.previousElementSibling || Rs.sticky.nextElementSibling;
          const Rs.target = Rs.grid.offsetHeight > Rs.sticky.offsetHeight ? Rs.sticky : Rs.grid;

          var bounds = Rs.target.getBoundingClientRect(),
              maxTop = bounds.top + window.scrollY - Rs.target.offsetTop + UomoHelpers.sideStkEl.initialTopOffset,
              minTop = Rs.target.clientHeight - window.innerHeight + 30;

          if (window.scrollY < Rs.target.lastKnownY) {
            UomoHelpers.sideStkEl.currentTop -= window.scrollY - Rs.target.lastKnownY;
          } else {
            UomoHelpers.sideStkEl.currentTop += Rs.target.lastKnownY - window.scrollY;
          }


          UomoHelpers.sideStkEl.currentTop = Math.min(Math.max(UomoHelpers.sideStkEl.currentTop, -minTop), maxTop, UomoHelpers.sideStkEl.initialTopOffset);
          Rs.target.lastKnownY = window.scrollY;

          Rs.target.style.top = UomoHelpers.sideStkEl.currentTop + 'px';
        });
      }
    });


    return StickyElement;
  })();

  // Header Section
  UomoSections.Header = (function () {
    function Header () {
      this.selectors = {
        header: '.header',
        mobileHeader: '.header-mobile',
        mobileMenuActivator: '.mobile-nav-activator',
        mobileMenu: '.navigation',
        mobileMenuActiveClass: 'mobile-menu-opened',
        mobileSubNavOpen: '.js-nav-right',
        mobileSubNavClose: '.js-nav-left',
        mobileSubNavHiddenClass: 'd-none',
        stickyHeader: '.header_sticky',
        stickyActiveClass: 'header_sticky-active',
      }

      // Set sticky active class from
      this.stickyMinPos = 25;
      this.stkHd = false;

      this._init = this._init.bind(this);
      this._stickyScrollHander = this._stickyScrollHander.bind(this);
      this._init();
      window.addEventListener('resize', this._init);
    }

    Header.prototype = Object.assign({}, Header.prototype, {
      _init: function () {
        const headerClass = UomoHelpers.isMobile ? this.selectors.mobileHeader : this.selectors.header;

        this.lastScrollTop = 0;
        this.Rs.header = document.querySelector(headerClass);

        if (!this.Rs.header) {
          return;
        }

        if (!UomoHelpers.isMobile) {
          this._initMenuPosition();
        } else {
          this._initMobileMenu();
        }

        this._initStickyHeader();
      },

      _initMobileMenu: function() {
        const _this = this;
        const Rs.mobileMenuActivator = this.Rs.header.querySelector(this.selectors.mobileMenuActivator);
        const Rs.mobileDropdown = this.Rs.header.querySelector(this.selectors.mobileMenu);
        let transformLeft = 0;

        if (Rs.mobileDropdown) {
          Rs.mobileMenuActivator && Rs.mobileMenuActivator.addEventListener('click', function(event) {
            event.preventDefault();
            if (document.body.classList.contains(_this.selectors.mobileMenuActiveClass)) {
              document.body.classList.remove(_this.selectors.mobileMenuActiveClass);
              _this.Rs.header.style.paddingRight = '';
              Rs.mobileDropdown.style.paddingRight = '';
            } else {
              document.body.classList.add(_this.selectors.mobileMenuActiveClass);
              _this.Rs.header.style.paddingRight = UomoSelectors.scrollWidth;
              Rs.mobileDropdown.style.paddingRight = UomoSelectors.scrollWidth;
            }
          });

          const Rs.mobileMenu = Rs.mobileDropdown.querySelector('.navigation__list');
          let menuMaxHeight = Rs.mobileMenu.offsetHeight;
          Rs.mobileMenu && Rs.mobileMenu.querySelectorAll(_this.selectors.mobileSubNavOpen).forEach(Rs.btn => {
            Rs.btn.addEventListener('click', function(event) {
              event.preventDefault;
              Rs.btn.nextElementSibling.classList.remove(_this.selectors.mobileSubNavHiddenClass);

              transformLeft -= 100;
              if (menuMaxHeight < Rs.btn.nextElementSibling.offsetHeight) {
                Rs.mobileMenu.style.transform = 'translateX(' + transformLeft.toString() + '%)';
                Rs.mobileMenu.style.minHeight = Rs.btn.nextElementSibling.offsetHeight + 'px';
              } else {
                Rs.mobileMenu.style.transform = 'translateX(' + transformLeft.toString() + '%)';
                Rs.mobileMenu.style.minHeight = menuMaxHeight + 'px';
              }
            });
          });


          Rs.mobileMenu && Rs.mobileMenu.querySelectorAll(_this.selectors.mobileSubNavClose).forEach(Rs.btn => {
            Rs.btn.addEventListener('click', function(event) {
              event.preventDefault;
              transformLeft += 100;
              Rs.mobileMenu.style.transform = 'translateX(' + transformLeft.toString() + '%)';
              Rs.btn.parentElement.classList.add(_this.selectors.mobileSubNavHiddenClass);
              const Rs.wrapper = Rs.btn.closest('.sub-menu');
              if (Rs.wrapper) {
                const minHeight = menuMaxHeight < Rs.wrapper.offsetHeight ? Rs.wrapper.offsetHeight : menuMaxHeight;
                Rs.mobileMenu.style.minHeight = minHeight + 'px';
              }
            });
          });
        }
      },

      _initStickyHeader: function () {
        if (this.Rs.header.classList.contains(this.selectors.stickyHeader)) {
          return;
        }

        const _this = this;
        let headerHeight = this.Rs.header.offsetHeight;
        if(this.Rs.header.classList.contains("header-transparent-bg")) {
          headerHeight = 0;

          if(document.querySelectorAll(".header-transparent-bg .header-top").length > 0) {
            headerHeight = document.querySelector(".header-transparent-bg .header-top").offsetHeight;
          }
        }

        document.querySelector("main").style.paddingTop = headerHeight + 'px';
        _this.Rs.header.classList.add('position-absolute');

        document.removeEventListener('scroll', this._stickyScrollHander);
        document.addEventListener('scroll', this._stickyScrollHander);
      },

      _initMenuPosition () {
        const _this = this;
        _this.Rs.header.querySelectorAll('.box-menu').forEach( el => {
          _this._setBoxMenuPosition(el)
        });

        _this.Rs.header.querySelectorAll('.default-menu').forEach( el => {
          _this._setDefaultMenuPosition(el)
        });
      },

      _setBoxMenuPosition (menu) {
        const limitR = window.innerWidth - menu.offsetWidth - scrollBarWidth;
        const limitL = 0;
        const menuPaddingLeft = parseInt(window.getComputedStyle(menu, null).getPropertyValue('padding-left'));
        const parentPaddingLeft = parseInt(window.getComputedStyle(menu.previousElementSibling, null).getPropertyValue('padding-left'));
        const centerPos = menu.previousElementSibling.offsetLeft - menuPaddingLeft + parentPaddingLeft;

        let menuPos = centerPos;
        if (centerPos < limitL) {
          menuPos = limitL;
        } else if (centerPos > limitR) {
          menuPos = limitR;
        }

        menu.style.left = `Rs.{menuPos}px`;
      },

      _setDefaultMenuPosition (menu) {
        const limitR = window.innerWidth - menu.offsetWidth - scrollBarWidth;
        const limitL = 0;
        const menuPaddingLeft = parseInt(window.getComputedStyle(menu, null).getPropertyValue('padding-left'));
        const parentPaddingLeft = parseInt(window.getComputedStyle(menu.previousElementSibling, null).getPropertyValue('padding-left'));
        const centerPos = menu.previousElementSibling.offsetLeft - menuPaddingLeft + parentPaddingLeft;

        let menuPos = centerPos;
        if (centerPos < limitL) {
          menuPos = limitL;
        } else if (centerPos > limitR) {
          menuPos = limitR;
        }

        menu.style.left = `Rs.{menuPos}px`;
      },

      _stickyScrollHander() {
        if (this.Rs.header.classList.contains("sticky_disabled")) {
          return;
        }
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > this.lastScrollTop || currentScrollTop < this.stickyMinPos) {
          this.Rs.header.classList.remove(this.selectors.stickyActiveClass);
          this.Rs.header.classList.add('position-absolute');
        } else if (currentScrollTop > this.stickyMinPos) {
          this.Rs.header.classList.add(this.selectors.stickyActiveClass);
          this.Rs.header.classList.remove('position-absolute');
        }

        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
      }
    });


    return Header;
  })();

  // Footer Section
  UomoSections.Footer = (function () {
    function Footer () {
      this.selectors = {
        footer: '.footer-mobile'
      }
      this.Rs.footer = document.querySelector(this.selectors.footer);

      this._init = this._init.bind(this);
      this._init();
      window.addEventListener('resize', this._init);
    }

    Footer.prototype = Object.assign({}, Footer.prototype, {
      _init: function() {
        if (!this.Rs.footer || !UomoHelpers.isMobile) {
          return;
        }

        setTimeout(() => {
          this._initStickyFooter();
        }, 750);
      },

      _initStickyFooter: function () {
        const height = this.Rs.footer.offsetHeight;

        document.body.style.paddingBottom = height + 'px';
        this.Rs.footer.classList.add('position-fixed');
        setTimeout(() => {
          this.Rs.footer.classList.add('footer-mobile_initialized');
        }, 750);
      },
    });


    return Footer;
  })();

  // Customer login form
  UomoSections.CustomerSideForm = (function () {
    function CustomerSideForm () {
      this.selectors = {
        aside:        '.aside.customer-forms',
        formsWrapper:  '.customer-forms__wrapper',
        registerActivator:  '.js-show-register',
        loginActivator:     '.js-show-login'
      }

      this.Rs.aside = document.querySelector(this.selectors.aside);
      if (!this.Rs.aside) {
        return false;
      }

      this.Rs.formsWrapper = this.Rs.aside.querySelector(this.selectors.formsWrapper);
      this.Rs.registerActivator = this.Rs.aside.querySelector(this.selectors.registerActivator);
      this.Rs.loginActivator = this.Rs.aside.querySelector(this.selectors.loginActivator);

      this.Rs.formsWrapper && this._showLoginForm()
      this.Rs.formsWrapper && this._showRegisterForm()
    }

    CustomerSideForm.prototype = Object.assign({}, CustomerSideForm.prototype, {
      _showLoginForm: function () {
        this.Rs.loginActivator.addEventListener('click', () => {
          this.Rs.formsWrapper.style.left = 0;
        });
      },

      _showRegisterForm: function () {
        this.Rs.registerActivator.addEventListener('click', () => {
          this.Rs.formsWrapper.style.left = '-100%';
        });
      }
    });

    return CustomerSideForm;
  })();

  UomoSections.CartDrawer = (function () {
    function CartDrawer () {
      this.selectors = {
        aside:            '.aside.cart-drawer',
        asideHeader:      '.aside-header',
        cartItemRemover:  '.js-cart-item-remove',
        cartActions:      '.cart-drawer-actions',
        cartItemsList:    '.cart-drawer-items-list'
      }

      this.asideContentMargin = 30;

      this.Rs.aside = document.querySelector(this.selectors.aside);
      if (!this.Rs.aside) {
        return false;
      }

      this.Rs.header = this.Rs.aside.querySelector(this.selectors.asideHeader);
      this.Rs.actions = this.Rs.aside.querySelector(this.selectors.cartActions);
      this.Rs.list = this.Rs.aside.querySelector(this.selectors.cartItemsList);

      setTimeout(() => {
        this._initCartItemsList();
        this._initCartItemRemoval();
      }, 1000);
    }

    CartDrawer.prototype = Object.assign({}, CartDrawer.prototype, {
      _initCartItemsList: function () {
        if (!UomoHelpers.isMobile) {
          return;
        }

        const drawerHeight = this.Rs.aside.offsetHeight;
        const headerHeight = this.Rs.header ? this.Rs.header.offsetHeight : 0;
        const actionsHeader = this.Rs.actions ? this.Rs.actions.offsetHeight : 0;

        if (this.Rs.list) {
          this.Rs.list.style.maxHeight = drawerHeight - headerHeight - actionsHeader - this.asideContentMargin * 2 + 'px';
        }
      },

      _initCartItemRemoval: function () {
        this.Rs.aside.querySelectorAll(this.selectors.cartItemRemover).forEach( el => {
          el.addEventListener('click', (event) => {
            event.preventDefault();
            const Rs.parentEl = event.target.parentElement;
            const Rs.divider  = Rs.parentEl.nextElementSibling;
            Rs.parentEl.classList.add('_removed');
            Rs.divider && Rs.divider.classList.contains('cart-drawer-divider') && Rs.divider.classList.add('_removed');
            setTimeout(() => {
              Rs.parentEl.remove();
              Rs.divider && Rs.divider.classList.contains('cart-drawer-divider') && Rs.divider.remove();
            }, 350);
          });
        });
      }
    });

    return CartDrawer;
  })();

  UomoSections.SwiperSlideshow = (function () {
    function SwiperSlideshow () {
      this.selectors = {
        container: '.js-swiper-slider'
      }

      this.Rs.containers = document.querySelectorAll(this.selectors.container);
      this._initSliders();
    }

    SwiperSlideshow.prototype = Object.assign({}, SwiperSlideshow.prototype, {
      _initSliders() {
        this.Rs.containers.forEach(function(Rs.sliderContainer) {
          if (Rs.sliderContainer.classList.contains('swiper-container-initialized')) {
            return;
          }

          let settings = {
            autoplay: 0,
            slidesPerView: 1,
            loop: true,
            navigation: {
              nextEl: ".pc__img-next",
              prevEl: ".pc__img-prev"
            }
          };

          if (Rs.sliderContainer.classList.contains('swiper-number-pagination')) {
            settings = Object.assign(settings, {
              pagination: {
                "el": ".slideshow-pagination",
                "type": "bullets",
                "clickable": true,
                renderBullet: function(index, className) {
                  return '<span class="' + className + '">' + (index + 1).toString().padStart(2, '0') + '</span>';
                }
              }
            });
          }

          if (Rs.sliderContainer.dataset.settings) {
            settings = Object.assign(settings, JSON.parse(Rs.sliderContainer.dataset.settings));
          }

          if (Rs.sliderContainer.querySelectorAll('.swiper-slide').length > 1) {
            // eslint-disable-next-line no-undef
            new Swiper(Rs.sliderContainer, settings);
          } else {
            Rs.sliderContainer.classList.add('swiper-container-initialized');
            const Rs.active_slide = Rs.sliderContainer.querySelector('.swiper-slide');
            Rs.active_slide && Rs.active_slide.classList.add('swiper-slide-active');
          }
        });
      }
    });

    return SwiperSlideshow;
  })();

  UomoSections.ProductSingleMedia = (function () {
    function ProductSingleMedia () {
      this.selectors = {
        container: '.product-single__media'
      }

      this.Rs.containers = Rs.(this.selectors.container);
      this._initProductMedia();
    }

    function setSlideHeight(that){
      Rs.('.product-single__thumbnail .swiper-slide').css({height:'auto'});
          var currentSlide = that.activeIndex;
          var newHeight = Rs.(that.slides[currentSlide]).height();
  
          Rs.('.product-single__thumbnail .swiper-wrapper, .product-single__thumbnail .swiper-slide').css({ height : newHeight })
          that.update();
     }

    ProductSingleMedia.prototype = Object.assign({}, ProductSingleMedia.prototype, {
      _initProductMedia() {
        this.Rs.containers.each(function() {
          if (Rs.(this).hasClass('product-media-initialized')) {
            return;
          }

          let media_type = Rs.(this).data('media-type');

          Rs.(this).addClass(media_type);

          if (media_type == 'vertical-thumbnail') {
            var galleryThumbs = new Swiper(".product-single__thumbnail .swiper-container", {
              direction: 'vertical',
              slidesPerView: 6,
              spaceBetween: 0,
              freeMode: true,
              breakpoints: {
                0: {
                  direction: 'horizontal',
                  slidesPerView: 4,
                },
                992: {
                  direction: 'vertical',
                }
              },
              on: {
                init:function(){
                  setSlideHeight(this);
                },
                slideChangeTransitionEnd:function(){
                  setSlideHeight(this);
                }
              }
            });
            var galleryMain = new Swiper(".product-single__image .swiper-container", {
              direction: 'horizontal',
              slidesPerView: 1,
              spaceBetween: 32,
              mousewheel: false,
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              },
              grabCursor: true,
              thumbs: {
                swiper: galleryThumbs
              },
              on: {
                slideChangeTransitionStart: function() {
                  galleryThumbs.slideTo(galleryMain.activeIndex);
                }
              }
            });
          } else if (media_type == 'vertical-dot') {
            var galleryMain = new Swiper(".product-single__image .swiper-container", {
              direction: 'horizontal',
              slidesPerView: 1,
              spaceBetween: 32,
              mousewheel: false,
              grabCursor: true,
              pagination: {
                el: ".product-single__image .swiper-pagination",
                type: "bullets",
                clickable: true
              },
            });
          } else if (media_type == 'scroll-snap') {
            // Rs.("html").addClass("snap");

            // window.addEventListener('scroll', function() {
            //   if ( Rs.(".product-single__media").height() - Rs.(window).height() < window.scrollY ) {
            //     Rs.("html").removeClass("snap");
            //   } else {
            //     Rs.("html").addClass("snap");
            //   }
            // });
          } else if (media_type == 'horizontal-thumbnail') {
            var galleryThumbs = new Swiper(".product-single__thumbnail .swiper-container", {
              direction: 'horizontal',
              slidesPerView: 6,
              spaceBetween: 0,
              freeMode: true,
              breakpoints: {
                0: {
                  slidesPerView: 4,
                },
                992: {
                  slidesPerView: 7,
                }
              }
            });
            var galleryMain = new Swiper(".product-single__image .swiper-container", {
              direction: 'horizontal',
              slidesPerView: 1,
              spaceBetween: 32,
              mousewheel: false,
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              },
              grabCursor: true,
              thumbs: {
                swiper: galleryThumbs
              },
              on: {
                slideChangeTransitionStart: function() {
                  galleryThumbs.slideTo(galleryMain.activeIndex);
                }
              }
            });
          }

          Rs.(this).addClass('product-media-initialized');
        });
      }
    });

    return ProductSingleMedia;
  })();

  UomoElements.StarRating = (function () {
    function StarRating () {
      let stars = Array.from(document.querySelectorAll(UomoSelectors.starRatingControl));
      let user_selected_star = document.querySelector('#form-input-rating');

      stars.forEach(star => {
        // Mouseover event
        star.addEventListener('mouseover', (e) => {
          stars.forEach((item, current_index) => {
            if (current_index <= stars.indexOf(e.target)) {
              item.classList.add('is-overed');
            } else {
              item.classList.remove('is-overed');
            }
          })
        })
      
        // Mouseover event
        star.addEventListener('mouseleave', (e) => {
          stars.forEach((item) => {
            item.classList.remove('is-overed');
          })
        })
      
        // Click event
        star.addEventListener('click', (e) => {
          const selected_index = stars.indexOf(e.target);
          user_selected_star.value = selected_index + 1;
          stars.forEach((item, current_index) => {
            if (current_index <= stars.indexOf(e.target)) {
              item.classList.add('is-selected');
            } else {
              item.classList.remove('is-selected');
            }
          })
        })
      })
    }

    return StarRating;
  })();

  class Uomo {
    constructor() {
      this.initCookieConsient();
      this.initAccessories();
      this.initMultiSelect();
      this.initBsTooltips();
      this.initRangeSlider();

      new UomoElements.JsHoverContent();
      new UomoElements.Search();
      new UomoElements.Aside();
      new UomoElements.QtyControl();
      new UomoElements.ScrollToTop();
      new UomoElements.Countdown();
      new UomoElements.ShopViewChange();
      new UomoElements.Filters();
      new UomoElements.StickyElement();
      new UomoElements.StarRating();

      new UomoSections.Header();
      new UomoSections.Footer();
      new UomoSections.CustomerSideForm();
      new UomoSections.CartDrawer();
      new UomoSections.SwiperSlideshow();
      new UomoSections.ProductSingleMedia();
    }

    initCookieConsient() {
      const purecookieDesc = "In order to provide you a personalized shopping experience, our site uses cookies. By continuing to use this site, you are agreeing to our cookie policy.",
      purecookieButton = "Accept";

      function pureFadeIn(e, o) {
        var i = document.getElementById(e);
        i.style.opacity = 0, i.style.display = o || "block",
        function e() {
          var o = parseFloat(i.style.opacity);
          (o += .02) > 1 || (i.style.opacity = o, requestAnimationFrame(e))
        }()
      }

      function getCookie(e) {
        for (var o = e + "=", i = document.cookie.split(";"), t = 0; t < i.length; t++) {
          for (var n = i[t];" " == n.charAt(0);) {
            n = n.substring(1, n.length);
          }
          if (0 == n.indexOf(o))
            return n.substring(o.length, n.length)
        }
        return null
      }

      function appendHtml(el, str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        while (div.children.length > 0) {
          el.appendChild(div.children[0]);
        }
      }

      // getCookie("purecookieDismiss") || (appendHtml(document.body, '<div class="cookieConsentContainer" id="cookieConsentContainer"><div class="cookieDesc"><p>' + purecookieDesc + '</p></div><div class="cookieButton"><a onClick="purecookieDismiss();">' + purecookieButton + "</a></div></div>"), pureFadeIn("cookieConsentContainer"))
    }

    initAccessories() {
      // Check if device is mobile on resize
      window.addEventListener('resize', function() {
        UomoHelpers.isMobile = UomoHelpers.updateDeviceSize();
      });
    }

    initMultiSelect() {
      // Declare variables
      const Rs.containers = document.querySelectorAll('.multi-select');

      this._initMultiSelect(Rs.containers);
    }

    _initMultiSelect(Rs.containers) {
      Rs.containers.forEach( el => {
        const Rs.component = el;
        const Rs.list = el.querySelector('.multi-select__list');
        const Rs.select = Rs.component.querySelector('select');
        const Rs.actor = Rs.component.querySelector('.multi-select__actor');

        /**
         * Change hero value when selecting item
         */
        const Rs.selectArray = Rs.component.querySelectorAll('.js-multi-select');
        Rs.selectArray.forEach( el => {
          el.addEventListener('click', function(e) {
            e.preventDefault();

            const optionIndex = (Array.prototype.indexOf.call(Rs.list.children, e.currentTarget)).toString();
            const selectedOption = Rs.select.options[optionIndex];

            if (selectedOption && !selectedOption.selected) {
              e.currentTarget.classList.add('mult-select__item_selected');
              selectedOption.selected = true;
            } else {
              e.currentTarget.classList.remove('mult-select__item_selected');
              selectedOption.selected = false;
            }

            if (Rs.actor && !Rs.actor.classList.contains('js-no-update')) {
              let content = Rs.actor.dataset.placeholder;
              if (Rs.select.selectedIndex > -1) {
                content = '';
                for (let i = 0; i < Rs.select.selectedOptions.length; i++) {
                  const Rs.option = Rs.select.selectedOptions[i];
                  content = content + Rs.option.innerText;
                  if (i < Rs.select.selectedOptions.length - 1) {
                    content = content + ', ';
                  }
                }
              }

              Rs.actor.innerText = content;
            }
          });
        });
      });
    }

    initBsTooltips() {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        // eslint-disable-next-line no-undef
        return new bootstrap.Tooltip(tooltipTriggerEl)
      });
    }

    initRangeSlider() {
      const selectors = {
        elementClass: '.price-range-slider',
        minElement: '.price-range__min',
        maxElement: '.price-range__max'
      }

      document.querySelectorAll(selectors.elementClass).forEach(Rs.se => {
        // Rs.se = sliderElement
        const currency = Rs.se.dataset.currency;

        if (Rs.se) {
          // eslint-disable-next-line no-undef
          const priceRange = new Slider(Rs.se, {
            tooltip_split: true,
            formatter: function(value) {
              return currency + value;
            },
          });

          priceRange.on('slideStop', (value) => {
            const Rs.minEl = Rs.se.parentElement.querySelector(selectors.minElement);
            const Rs.maxEl = Rs.se.parentElement.querySelector(selectors.maxElement);
            Rs.minEl.innerText = currency + value[0];
            Rs.maxEl.innerText = currency + value[1];
          });
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Init theme
    UomoHelpers.isMobile = UomoHelpers.updateDeviceSize();
    new Uomo();
  });

  Rs.('a[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
    var paneTarget = Rs.(e.target).attr('href');
    var Rs.thePane = Rs.('.tab-pane' + paneTarget);
    if (Rs.thePane.find('.swiper-container').length > 0 && 0 === Rs.thePane.find('.swiper-slide-active').length) {
      document.querySelectorAll('.tab-pane' + paneTarget + ' .swiper-container').forEach( function(item) {
        item.swiper.update();
        item.swiper.lazy.load();
      });
     }
  });

  Rs.('#quickView.modal').on('shown.bs.modal', function(e) {
    var paneTarget = "#quickView";
    var Rs.thePane = Rs.('.modal' + paneTarget);
    if (Rs.thePane.find('.swiper-container').length > 0 && 0 === Rs.thePane.find('.swiper-slide-active').length) {
      document.querySelectorAll('.modal' + paneTarget + ' .swiper-container').forEach( function(item) {
        item.swiper.update();
        item.swiper.lazy.load();
      });
     }
  });

  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {'html':true})
  });

  Rs.('.shopping-cart .btn-checkout').off('click').on('click', function() {
    window.location.href='./shop_checkout.html';
  });

  Rs.('.checkout-form .btn-checkout').off('click').on('click', function() {
    window.location.href='./shop_order_complete.html';
  });

  document.querySelector('.js-show-register').addEventListener('click', function(e) {
    document.querySelector(this.getAttribute("href")).click();
  });

  Rs.('button.js-add-wishlist, a.add-to-wishlist').off('click').on('click', function() {
    if(Rs.(this).hasClass("active"))
      Rs.(this).removeClass("active");
    else
      Rs.(this).addClass("active");
    return false;
  });

  if(Rs.('[data-fancybox="gallery"]').length > 0) {
    Rs.('[data-fancybox="gallery"]').fancybox({
      backFocus: false
    });
  }

  Rs.(window).off("scroll").on("scroll", function() {
    if(Rs.(".mobile_fixed-btn_wrapper").length > 0) {
      if(Rs.(this).width() < 992 && Rs.(this).width() >= 768) {
        if(Rs.(this).scrollTop() + Rs.(this).height() - 76 <= Rs.(".mobile_fixed-btn_wrapper").offset().top && Rs.(this).scrollTop() > Rs.(this).height()) {
          Rs.(".mobile_fixed-btn_wrapper > .button-wrapper").addClass("fixed-btn");
        } else {
          Rs.(".mobile_fixed-btn_wrapper > .button-wrapper").removeClass("fixed-btn");
        }
      } else if(Rs.(this).width() < 768) {
        if(Rs.(this).scrollTop() + Rs.(this).height() - 124 <= Rs.(".mobile_fixed-btn_wrapper").offset().top && Rs.(this).scrollTop() > Rs.(this).height()) {
          Rs.(".mobile_fixed-btn_wrapper > .button-wrapper").addClass("fixed-btn");
        } else {
          Rs.(".mobile_fixed-btn_wrapper > .button-wrapper").removeClass("fixed-btn");
        }
      } else {
        Rs.(".mobile_fixed-btn_wrapper > .button-wrapper").removeClass("fixed-btn");
      }
    }
  });

  window.onload = () => {
    if(Rs.("#newsletterPopup").length > 0)
      Rs.("#newsletterPopup").modal("show");

    Rs.('.btn-video-player').each(function() {
      Rs.(this).off("click").on("click", function() {
        if (Rs.(this).hasClass("playing")) {
          Rs.(this).removeClass("playing");
          Rs.(Rs.(this).data("video")).get(0).pause();
        } else {
          Rs.(this).addClass("playing");
          Rs.(Rs.(this).data("video")).get(0).play();
        }
      });

      const btn_player = Rs.(this);
  
      Rs.(Rs.(this).data("video")).off("ended").on("ended", function() {
        Rs.(btn_player).removeClass("playing");
        this.currentTime = 0;
      });
    });
  }
})(Rs.);

(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.querySelectorAll("input[data-cf-pwd]").forEach(function (el) {
          if(form.querySelector(el.getAttribute("data-cf-pwd")).value != el.value) {
            event.preventDefault();
            event.stopPropagation();
          }
        });

        form.classList.add('was-validated')
      }, false);

      form.querySelectorAll("input[data-cf-pwd]").forEach(function (el) {
        el.addEventListener('keyup', function (event) {
          if (!el.value || form.querySelector(el.getAttribute("data-cf-pwd")).value != el.value) {
            el.classList.add("is-invalid");
            el.classList.remove("is-valid");
            el.setCustomValidity("Invalid field.");
          } else {
            el.classList.remove("is-invalid");
            el.classList.add("is-valid");
            el.setCustomValidity("");
          }
        });
        form.querySelector(el.getAttribute("data-cf-pwd")).addEventListener('keyup', function (event) {
          if (!el.value || form.querySelector(el.getAttribute("data-cf-pwd")).value != el.value) {
            el.classList.add("is-invalid");
            el.classList.remove("is-valid");
            el.setCustomValidity("Invalid field.");
          } else {
            el.classList.remove("is-invalid");
            el.classList.add("is-valid");
            el.setCustomValidity("");
          }
        });
      });
    });
})();

window.addEventListener('load', () => {
  try {
    let url = window.location.href.split('#').pop();
    document.querySelector('#'+url).click();
  } catch {

  }
});