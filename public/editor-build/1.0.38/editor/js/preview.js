!function(t,e){function i(t,e,i,l){t[n](o+e,"wheel"==s?i:function(t){!t&&(t=a.event);var e={originalEvent:t,target:t.target||t.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==t.type?0:1,deltaX:0,deltaZ:0,notRealWheel:1,preventDefault:function(){t.preventDefault?t.preventDefault():t.returnValue=!1}};return"mousewheel"==s?(e.deltaY=-.025*t.wheelDelta,t.wheelDeltaX&&(e.deltaX=-.025*t.wheelDeltaX)):e.deltaY=t.detail/3,i(e)},l||!1)}var n,s,o="";t.addEventListener?n="addEventListener":(n="attachEvent",o="on"),s="onwheel"in e.createElement("div")?"wheel":void 0!==e.onmousewheel?"mousewheel":"DOMMouseScroll",t.addWheelListener=function(t,e,n){i(t,s,e,n),"DOMMouseScroll"==s&&i(t,"MozMousePixelScroll",e,n)}}(window,document),function(t,e,i,n){"use strict";function s(n,s){this.isMobile()||(this.$elem=t(n),this.options=t.extend({bgClass:"parallax-bg",wheelIgnoreClass:[],items:[],baseElement:e,windowHeight:Math.max(i.documentElement.clientHeight,e.innerHeight||0),r:0,u:0,v:0,s:!1,F:!1},s),this._handleScrollBound=this._handleScroll.bind(this),this._handleWheelBound=this._handleWheel.bind(this),this._handleResizeBound=this._handleResize.bind(this),this._init())}var o="plugin_parallax";t.extend(s.prototype,{_init:function(){this.options.windowHeight=Math.max(i.documentElement.clientHeight,e.innerHeight||0),this.profileParallaxElements(),this._attachEvents(),this.d()},_attachEvents:function(){this.options.baseElement.addEventListener("scroll",this._handleScrollBound,!1),e.addEventListener("wheel",this._handleWheelBound,!1),e.addEventListener("resize",this._handleResizeBound,!1)},_detachEvents:function(){this.options.baseElement.removeEventListener("scroll",this._handleScrollBound,!1),e.removeEventListener("wheel",this._handleWheelBound,!1),e.removeEventListener("resize",this._handleResizeBound,!1)},_handleScroll:function(t){this.options.F=!0},_handleWheel:function(e){if(this.options.wheelIgnoreClass&&this.options.wheelIgnoreClass.length>0&&t(e.target).closest("."+this.options.wheelIgnoreClass.join(", .")).length>0)return null;e.preventDefault&&e.preventDefault(),this.options.v=e.notRealWheel?-e.deltaY/4:1==e.deltaMode?-e.deltaY/3:100===Math.abs(e.deltaY)?-e.deltaY/120:-e.deltaY/40,this.options.v=-2>this.options.v?-2:this.options.v,this.options.v=this.options.v>2?2:this.options.v,this.options.s=!0,this.options.u=4},_handleResize:function(){this.options.windowHeight=Math.max(i.documentElement.clientHeight,e.innerHeight||0),this.options.r=this.b(),this.profileParallaxElements()},profileParallaxElements:function(){var e=this.$elem,i=this;this.options.items=[],this.options.r=this.b(),e.find("."+this.options.bgClass).each(function(){var n=e,s=n.offset().top,o=i.getHeight(n);o&&i.setHeight(n,o),i.options.items.push({section:n.get(0),outerHeight:n.outerHeight(),elemTop:s,elemBottom:s+n.outerHeight(),isFirstSection:!1,imageHolder:this}),i.mr_setTranslate3DTransform(t(this).get(0),(i.f()+i.options.windowHeight-s)/2)})},setHeight:function(e,i){t(e).find("."+this.options.bgClass).css({height:100*i+"vh"})},getHeight:function(e){var i=t(e),n=t(this.options.baseElement).height(),s=i.height(),o=s/n;return s>n?o:null},getTransformStyle:function(t){for(var e=0;e<t.length;e++)if(void 0!==i.body.style[t[e]])return t[e];return null},getScrollingState:function(){return this.options.u>0},getCurrentElement:function(t){for(var e=0,i=this.options.items.length;this.options.items[e]&&this.options.items[e].section!==t;e++);return e===i?-1:e},isFunction:function(t){var e={};return t&&"[object Function]"===e.toString.call(t)},isMobile:function(){return/Android|iPad|iPhone|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent||navigator.vendor||e.opera)},requestAnimationFrame:function(t){return(this.options.baseElement.requestAnimationFrame||this.options.baseElement.mozRequestAnimationFrame||this.options.baseElement.webkitRequestAnimationFrame||this.options.baseElement.msRequestAnimationFrame)(t)},mr_setTranslate3DTransform:function(t,e){var i=this.getTransformStyle(["transform","msTransform","webkitTransform","mozTransform","oTransform"]);t.style[i]="translate3d(0,"+e+"px,0)"},refresh:function(t){this.profileParallaxElements()},destroy:function(t){this._detachEvents(),this.$elem.removeData(o),this.$elem.find("."+this.options.bgClass).css({height:"",transform:""})},e:function(t,e){this.isVariant()?e+this.options.windowHeight-this.options.r>t.elemTop&&e-this.options.r<t.elemBottom&&(t.isFirstSection?this.mr_setTranslate3DTransform(t.imageHolder,e/2):this.mr_setTranslate3DTransform(t.imageHolder,e-t.elemTop-this.options.r)):e+this.options.windowHeight>t.elemTop&&e<t.elemBottom&&(t.isFirstSection?this.mr_setTranslate3DTransform(t.imageHolder,e/2):this.mr_setTranslate3DTransform(t.imageHolder,(e+this.options.windowHeight-t.elemTop)/2))},c:function(t,e,i,n){var s=t-1;return s/=n,t/=n,s--,t--,i*(t*t*t*t*t+1)+e-(i*(s*s*s*s*s+1)+e)},d:function(){var t=0;if(this.options.F){for(var e=this.options.items.length,i=this.f();e--;)this.e(this.options.items[e],i);this.options.F=!1}this.options.s&&(((t+=-this.options.v*this.c(this.options.u,0,300,30))>1||-1>t)&&(this.options.baseElement.scrollBy(0,t),t=0),this.options.u++,this.options.u>30&&(this.options.u=0,this.options.s=!1,this.options.v=0,t=0)),this.requestAnimationFrame.call(this,this.d.bind(this))},isVariant:function(){return!1},b:function(){return t(this.options.baseElement).outerHeight(!0)},f:function(){return this.options.baseElement!=e?this.options.baseElement.scrollTop:0===i.documentElement.scrollTop?i.body.scrollTop:i.documentElement.scrollTop}}),t.fn.parallax=function(e){if(void 0===e||"object"==typeof e)return this.each(function(){t.data(this,o)||t.data(this,o,new s(this,e))});if("string"==typeof e&&"_"!==e[0]&&"init"!==e){var i=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=t.data(this,o);n instanceof s&&"function"==typeof n[e]&&n[e].apply(n,i)})}}}(jQuery,window,document);
!function(t,i,e,n){"use strict";function s(i,e){this.$elem=t(i),this.settings=t.extend({},h,e),this._handleIframeLoad=this._updateSettings.bind(this),this.handleVisibilitychange=this._updateSettings.bind(this),this._handleWindowResize=function(){this.refresh()}.bind(this),this._init()}var a="plugin_backgroundVideo",h={autoResize:!0,autoplay:!1,type:"youtube",mute:null,quality:null},o={youtube:function(t){var i=t.mute;i&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:i?"mute":"unMute"}),"*");var e=t.quality;e&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackQuality",args:["hd"+e,!0]}),"*"),t.autoplay&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:"playVideo"}),"*")},vimeo:function(t){var i=t.mute;i&&this.contentWindow.postMessage(JSON.stringify({method:"setVolume",value:i?0:100}),"*"),t.autoplay&&this.contentWindow.postMessage(JSON.stringify({method:"play"}),"*")}};t.extend(s.prototype,{_init:function(){this._resizePlayer(),this._attachEvents()},_updateSettings:function(){var t=this.$elem.find("iframe");o[this.settings.type].call(t.get(0),this.settings)},_resizePlayer:function(){var t=this.$elem.find("iframe"),i=function(){var t=this.$elem.width(),i=this.$elem.height();if(t/1.78<i){var e=Math.ceil(1.78*i);return{width:e,height:i,left:(t-e)/2,top:0}}var n=Math.ceil(t/1.78);return{width:t,height:n,left:0,top:(i-n)/2}}.call(this);t.width(i.width).height(i.height).css({left:i.left,top:i.top})},_attachEvents:function(){this.$elem.find("iframe").on("load",this._handleIframeLoad),t(i).on("visibilitychange",this.handleVisibilitychange),this.settings.autoResize&&t(i).on("resize",this._handleWindowResize)},_detachEvents:function(){this.$elem.find("iframe").off("load",this._handleIframeLoad),t(i).on("visibilitychange",this.handleVisibilitychange),this.settings.autoResize&&t(i).off("resize",this._resizeHandler)},refresh:function(i){this.settings=t.extend({},h,this.settings,i),this._updateSettings(),this._resizePlayer()},destroy:function(){this._detachEvents(),this.$elem.removeData(a),this.$elem=null,this.settings=null,this._handleIframeLoad=null,this._handleWindowResize=null}}),t.fn.backgroundVideo=function(i){if(void 0===i||"object"==typeof i)return this.each(function(){t.data(this,a)||t.data(this,a,new s(this,i))});if("string"==typeof i&&"_"!==i[0]){var e=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=t.data(this,a);n instanceof s&&"function"==typeof n[i]&&n[i].apply(n,e)})}}}(jQuery,window,document);
!function(t,i,e,n){function s(i){"use strict";this.settings=t.extend({now:(new Date).getTime()},i),this._startTime=(new Date).getTime(),this.start(),this.tick()}t.extend(s.prototype,{start:function(){this.intervalId=setInterval(this.tick.bind(this),this.settings.tickInterval)},update:function(i){this.settings=t.extend({},this.settings,i),this.intervalId||this.start(),this.tick()},tick:function(){var t=this.settings.now+((new Date).getTime()-this._startTime),i=Number(this.settings.endDate)+Number(this.settings.timeZoneOffset),e=this.settings.language,n=i-t,s=n>0,a=s?Math.floor(n/864e5):0,o=s?Math.floor(n%864e5/36e5):0,h=s?Math.floor(n%864e5/6e4)%60:0,r=s?Math.floor(n%864e5/1e3)%60%60:0;this.settings.onTick({days:{title:e.whichLabels(a)[3],amount:a},hours:{title:e.whichLabels(o)[4],amount:o},minutes:{title:e.whichLabels(h)[5],amount:h},seconds:{title:e.whichLabels(r)[6],amount:r}}),s||this.destroy()},destroy:function(){clearInterval(this.intervalId),this.intervalId=null}}),t.fn.countdown=function(i){var e="plugin_countdown";return void 0===i||"object"==typeof i?this.each(function(){t.data(this,e)?t.data(this,e).update(i):t.data(this,e,new s(i))}):"string"==typeof i&&"_"!==i[0]&&"init"!==i?this.each(function(){var n=t.data(this,e);n instanceof s&&"function"==typeof n[i]&&n[i].apply(n,Array.prototype.slice.call(arguments,1))}):void 0}}(jQuery,window,document);
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});


jQuery(document).ready(function(jQuery) {
var Brizy = {};
// i18n doesn't currently work at export
// so we'll mock it for now to not raise errors
var i18n = {
  t: function(key) {
    return "i18n mock. Requested " + key;
  }
};

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var $animated = $(".brz-animated");

if ($animated.length > 0) {
  var handleIntersection = function(entries) {
    entries.map(function(entry) {
      if (entry.isIntersecting) {
        var target = entry.target;
        var animateClassName = target.dataset.animateName;
        target.classList.add("brz-animate", animateClassName);
        observer.unobserve(target);
      }
    });
  };
  var observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: [0.35]
  };
  var observer = new IntersectionObserver(handleIntersection, observerOptions);

  $animated.each(function() {
    var $this = $(this);
    var delay = $this.data("animate-delay");
    var duration = $this.data("animate-duration");

    if (delay) {
      $this.css({
        "-webkit-animation-delay": delay + "ms",
        "animation-delay": delay + "ms"
      });
    }

    if (duration) {
      $this.css({
        "-webkit-animation-duration": duration + "ms",
        "animation-duration": duration + "ms"
      });
    }

    observer.observe(this);
  });
}

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var MOBILE_BREAKPOINT = 768;
var $window = $(window);

$window.on("load", function() {
  if ($window.width() >= MOBILE_BREAKPOINT) {
    backgroundParallax();
  }
});

$window.on("resize", function() {
  if ($window.width() < MOBILE_BREAKPOINT) {
    backgroundParallax("destroy");
  } else {
    backgroundParallax("refresh");
  }
});

function backgroundParallax(settings) {
  var $background = $(".brz-bg-image-parallax");

  $background.each(function() {
    var $this = $(this);

    if ($this.hasClass("destroy") && settings === "destroy") {
      return;
    }

    if ($this.hasClass("inited")) {
      if (settings === "refresh") {
        $this.closest(".brz-bg-media").parallax(settings);
      } else {
        $this.closest(".brz-bg-media").parallax(settings);
        $this.removeClass("inited");
        $this.addClass("destroy");
      }
      return;
    }

    var $container = $this.closest(".brz-bg-media");
    var backgroundImage = $this.css("background-image");
    var urlMatch = /url\(['"](.+)['"]\)/.exec(backgroundImage);

    if (urlMatch) {
      var img = new Image();

      img.onload = function() {
        $container.parallax({
          bgClass: "brz-bg-image-parallax"
        });
      };
      img.src = urlMatch[1];
    } else {
      $container.parallax();
    }

    // Inited Plugins
    $this.removeClass("destroy");
    $this.addClass("inited");
  });
}

$(".brz-bg-video").each(function() {
  var $this = $(this);
  var type = $this.attr("data-type");
  var autoplay = $this.attr("data-autoplay");
  var quality = $this.attr("data-quality");
  var mute = $this.attr("data-mute");

  $this.backgroundVideo({
    mute: mute === "on",
    autoplay: autoplay === "on",
    type: type,
    quality: quality
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(document).on("click", ".brz-anchor", function(event) {
  var anchorHash = this.hash;
  var $target = $(document.getElementById(anchorHash.slice(1)));

  if ($target.length) {
    event.preventDefault();
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $target.offset().top
        },
        600,
        function() {
          location.hash = anchorHash;
        }
      );
  }
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-control__select").each(function() {
  var $this = $(this);
  var $currentWrap = $this.find(".brz-control__select-current");
  var $currentOption = $currentWrap.find(".brz-control__select-option");
  var $options = $this.find(".brz-control__select-options");
  var $option = $options.find(".brz-control__select-option");

  $currentWrap.on("click", function() {
    $options.toggle();
  });

  $option.on("click", function() {
    $(this)
      .parent()
      .children()
      .removeClass("active");
    $(this).addClass("active");
    $this.find("input[type=hidden]").val($(this).text());
    $currentOption.html($(this).html());
    $options.hide();
  });

  $(window).on("click", function(e) {
    var $elem = $(e.target);
    if (!$elem.closest($this).length) {
      $options.hide();
    }
  });
});

}(jQuery));

(function () {
'use strict';

(function($) {
  var pluginName = "scrollPane";

  function Plugin(elem) {
    this.elem = elem;
    this.scrolableElem = this.elem.firstElementChild;

    this.options = {
      onlyWide: false,
      wideTrackClassName: "brz-ed-wide-track",
      wideThumbClassName: "brz-ed-wide-thumb",
      tallTrackClassName: "brz-ed-tall-track",
      tallThumbClassName: "brz-ed-tall-thumb"
    };

    this.init();
  }

  var _wheel_speed = 1;

  var _math = function(client, offset, scroll, position, track) {
    // In Google Chrome, sometimes scrollSize is less than clientSize by 1
    scroll = Math.max(scroll, client);
    var overflow = scroll - client,
      thumb = client / scroll * track,
      piece = track - thumb,
      shift = overflow == 0 ? 0 : position / overflow * piece;
    return {
      client: client,
      offset: offset,
      scroll: scroll,
      overflow: overflow,
      position: position,
      track: track,
      thumb: thumb,
      piece: piece,
      shift: shift
    };
  };

  Plugin.prototype.init = function() {
    var ua = navigator.userAgent.toLowerCase();
    var isFirefox = /firefox/.test(ua);
    var isChrome = /chrome/.test(ua);

    if (isFirefox) _wheel_speed = 20;
    if (isChrome) _wheel_speed = 0.8;

    this.onUpdateDOM();

    $(this.elem).on("wheel", this.onWheel.bind(this));
    $(this.scrolableElem).on("scroll", this.onUpdateDOM.bind(this));
  };

  Plugin.prototype.destroy = function() {
    $(this.elem).off("wheel");
    $(this.scrolableElem).off("scroll");
  };

  Plugin.prototype.onWheel = function(event) {
    var top = this.scrolableElem.scrollTop,
      left = this.scrolableElem.scrollLeft;
    if (this.options.onlyWide) {
      this.scrolableElem.scrollLeft =
        left +
        (event.originalEvent.deltaX
          ? event.originalEvent.deltaX
          : event.originalEvent.deltaY * _wheel_speed);
    } else {
      event.preventDefault();
      this.scrolableElem.scrollTop =
        top + event.originalEvent.deltaY * _wheel_speed;
      this.scrolableElem.scrollLeft = left + event.originalEvent.deltaX;
    }
    if (
      this.scrolableElem.scrollTop != top ||
      this.scrolableElem.scrollLeft != left ||
      this.options.onlyWide
    ) {
      event.preventDefault();
    }
  };

  Plugin.prototype.onUpdateDOM = function() {
    var wideTrack = this.elem.getElementsByClassName(
        this.options.wideTrackClassName
      )[0],
      wideTrackHeight,
      wideThumb = this.elem.getElementsByClassName(
        this.options.wideThumbClassName
      )[0],
      tallTrack = this.elem.getElementsByClassName(
        this.options.tallTrackClassName
      )[0],
      tallTrackWidth,
      tallThumb = this.elem.getElementsByClassName(
        this.options.tallThumbClassName
      )[0],
      wide = {
        overflow: Math.max(
          0,
          this.scrolableElem.scrollWidth - this.scrolableElem.clientWidth
        )
      },
      tall = {
        overflow: Math.max(
          this.scrolableElem.scrollHeight - this.scrolableElem.clientHeight
        )
      };

    wideTrack.style.position = "absolute";
    tallTrack.style.position = "absolute";
    wideThumb.style.position = "relative";
    tallThumb.style.position = "relative";

    wideTrack.style.display = "block";
    wideTrackHeight = wideTrack.offsetHeight;
    tallTrack.style.display = "block";
    tallTrackWidth = tallTrack.offsetWidth;

    this.scrolableElem.style.overflow = "hidden";
    this.scrolableElem.style.borderBottomWidth = wideTrackHeight + "px";
    this.scrolableElem.style.borderBottomStyle = wide.overflow
      ? "solid"
      : "none";
    this.scrolableElem.style.borderRightWidth = tallTrackWidth + "px";
    this.scrolableElem.style.borderRightStyle = tall.overflow
      ? "solid"
      : "none";

    // Previous step may lead to changing clientWidth/clientHeight
    wide.overflow = Math.max(
      0,
      this.scrolableElem.scrollWidth - this.scrolableElem.clientWidth
    );
    tall.overflow = Math.max(
      0,
      this.scrolableElem.scrollHeight - this.scrolableElem.clientHeight
    );

    wideTrack.style.display = wide.overflow ? "block" : "none";
    wideTrack.style.width = this.scrolableElem.clientWidth + "px";
    wideTrack.style.left = 0;
    wideTrack.style.top =
      this.scrolableElem.offsetHeight - wideTrackHeight + "px";

    tallTrack.style.display = tall.overflow ? "block" : "none";
    tallTrack.style.height = this.scrolableElem.clientHeight + "px";
    tallTrack.style.top = 0;
    // Previous step may lead to changing  track sizes
    wide = _math(
      this.scrolableElem.clientWidth,
      this.scrolableElem.offsetWidth,
      this.scrolableElem.scrollWidth,
      this.scrolableElem.scrollLeft,
      wideTrack.clientWidth
    );
    tall = _math(
      this.scrolableElem.clientHeight,
      this.scrolableElem.offsetHeight,
      this.scrolableElem.scrollHeight,
      this.scrolableElem.scrollTop,
      tallTrack.clientHeight
    );
    wideThumb.style.left = wide.shift + "px";
    wideThumb.style.width = wide.thumb + "px";
    tallThumb.style.top = tall.shift + "px";
    tallThumb.style.height = tall.thumb + "px";
  };

  $.fn[pluginName] = function(options) {
    var $this = $(this),
      dataKey = "plugin_" + pluginName;
    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$this.data(dataKey)) {
          $this.data(dataKey, new Plugin(this, options));
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      return this.each(function() {
        var instance = $this.data(dataKey);
        if (
          instance instanceof Plugin &&
          typeof instance[options] === "function"
        ) {
          instance[options].apply(
            instance,
            Array.prototype.slice.call(arguments, 1)
          );
        }
      });
    }
  };
})(jQuery);

(function($) {
  $(".brz-ed-scroll-pane").scrollPane();
})(jQuery);

}());


(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-accordion").each(function() {
  var accordionNavItems = $(this).find(".brz-accordion__nav");

  accordionNavItems.on("click", function() {
    var activeClassName = "brz-accordion__item--active";
    var item = $(this).closest('.brz-accordion__item');
    item.siblings().removeClass(activeClassName);
    item.addClass(activeClassName);
  });
});

}(jQuery));

(function ($,i18n) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var de = {
  labels: [
    ['Jahre','Monate','Wochen','Tage','Stunden','Minuten','Sekunden'],
    ['Jahr','Monat','Woche','Tag','Stunde','Minute','Sekunde']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};

var en = {
  labels: [
    ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
    ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};

var es = {
  labels: [
    ['Años','Meses','Semanas','Días','Horas','Minutos','Segundos'],
    ['Año','Mes','Semana','Día','Hora','Minuto','Segundo']
  ],
  whichLabels: function(amount) {
    var labelNumber = amount === 0 ? 0 : 1;

    return this.labels[labelNumber];
  }
};

var fr = {
  labels: [
    ['Années','Mois','Semaines','Jours','Heures','Minutes','Secondes'],
    ['Année','Mois','Semaine','Jour','Heure','Minute','Seconde']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};

var it = {
  labels: [
    ['Anni','Mesi','Settimane','Giorni','Ore','Minuti','Secondi'],
    ['Anno','Mese','Settimana','Giorno','Ora','Minuto','Secondo']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};

var nl = {
  labels: [
    ['Jaren','Maanden','Weken','Dagen','Uren','Minuten','Seconden'],
    ['Jaar','Maand','Week','Dag','Uur','Minuut','Seconde']
  ],
  whichLabels: function(amount) {
    var labelNumber = Number(amount > 1 ? 0 : 1);

    return this.labels[labelNumber];
  }
};

var ru = {
  labels: [
    ['Лет','Месяцев','Недель','Дней','Часов','Минут','Секунд'],
    ['Год','Месяц','Неделя','День','Час','Минута','Секунда'],
    ['Года','Месяца','Недели','Дня','Часа','Минуты','Секунды']
  ],
  whichLabels: function(amount) {
    var units = amount % 10;
    var tens = Math.floor((amount % 100) / 10);
    var labelNumber = (amount === 1 ? 1 : (units >= 2 && units <= 4 && tens !== 1 ? 2 :
      (units === 1 && tens !== 1 ? 1 : 0)));

    return this.labels[labelNumber];
  }
};

// https://github.com/kbwood/countdown/tree/master/src/js - translated files
// used var because this file is required at export but not transpiled
var LANGUAGES = {
  de: {
    title: i18n.t("German"),
    component: de
  },
  en: {
    title: i18n.t("English"),
    component: en
  },
  es: {
    title: i18n.t("Spanish"),
    component: es
  },
  fr: {
    title: i18n.t("French"),
    component: fr
  },
  it: {
    title: i18n.t("Italian"),
    component: it
  },
  nl: {
    title: i18n.t("Dutch"),
    component: nl
  },
  ru: {
    title: i18n.t("Russian"),
    component: ru
  }
};

var getLanguage = function(lang) {
  // used var because was problems for export
  var currentLang = LANGUAGES[lang] || LANGUAGES["en"];

  return currentLang.component;
};

$(".brz-countdown").each(function() {
  var $this = $(this);

  var pageLoadTime = Math.floor(Date.now() / 1000);

  // timer
  var $daysNumber = $this.find(".brz-countdown__days > .brz-countdown__number");
  var $hoursNumber = $this.find(
    ".brz-countdown__hours > .brz-countdown__number"
  );
  var $minutesNumber = $this.find(
    ".brz-countdown__minutes > .brz-countdown__number"
  );
  var $secondsNumber = $this.find(
    ".brz-countdown__seconds > .brz-countdown__number"
  );

  var $daysLabel = $this.find(".brz-countdown__days > .brz-countdown__label");
  var $hoursLabel = $this.find(".brz-countdown__hours > .brz-countdown__label");
  var $minutesLabel = $this.find(
    ".brz-countdown__minutes > .brz-countdown__label"
  );
  var $secondsLabel = $this.find(
    ".brz-countdown__seconds > .brz-countdown__label"
  );

  var endTime = $this.attr("data-end");
  var timezone = $this.attr("data-timezone");
  var language = $this.attr("data-language");

  var leftPadWith0 = function(number) {
    return ("0" + number).slice(-2);
  };

  $this.countdown({
    now: getTimestamp() * 1000,
    endDate: endTime,
    timeZoneOffset: -timezone * 60 * 1000,
    tickInterval: 1000,
    language: getLanguage(language),
    onTick: function(remaining) {
      $daysNumber.text(remaining.days.amount);
      $hoursNumber.text(leftPadWith0(remaining.hours.amount));
      $minutesNumber.text(leftPadWith0(remaining.minutes.amount));
      $secondsNumber.text(leftPadWith0(remaining.seconds.amount));

      $daysLabel.text(remaining.days.title);
      $hoursLabel.text(remaining.hours.title);
      $minutesLabel.text(remaining.minutes.title);
      $secondsLabel.text(remaining.seconds.title);
    }
  });

  function getTimestamp() {
    var currentTime = Math.floor(Date.now() / 1000),
      delta = currentTime - pageLoadTime;
    return parseInt(__CONFIG__.serverTimestamp) + delta;
  }
});

}(jQuery,i18n));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var elements = [];

$(".brz-counter").each(function() {
  var $this = $(this);
  elements.push({
    elem: this,
    start: $this.attr("data-start"),
    end: $this.attr("data-end"),
    duration: $this.attr("data-duration")
  });
});

var isScrolledIntoView = function(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  return isVisible;
};

var animate = function(value) {
  $({ countNum: Number(value.start) }).animate(
    {
      countNum: Number(value.end)
    },
    {
      duration: Number(value.duration * 1000),
      easing: "linear",

      step: function() {
        $(value.elem).text(Math.floor(this.countNum));
      },

      complete: function() {
        $(value.elem).text(this.countNum);
      }
    }
  );
};

var onScroll = function() {
  elements = elements.filter(function(value) {
    if (isScrolledIntoView(value.elem)) {
      animate(value);
      return false;
    }
    return true;
  });

  if (!elements.length) {
    document.removeEventListener("scroll", onScroll);
  }
};

document.addEventListener("scroll", onScroll);
onScroll();

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-form").each(function() {
  var $this = $(this);
  initForm($this);
});
function initForm($component) {
  $component.on("blur", "form input, form textarea", function() {
    validate.call(this);
  });
  $component.on(
    "click",
    "form .brz-control__select .brz-control__select-option",
    function() {
      var input = $(this)
        .closest(".brz-control__select")
        .find("input")
        .get(0);
      validate.call(input);
    }
  );
  $component.on("submit", "form", function(event) {
    event.preventDefault();

    var $this = $(this);
    var projectLanguage = $this.attr("data-project-language");
    var id = $this.attr("data-form-id");
    var url = $this.attr("action");
    var successMessage = $this.attr("data-success");
    var errorMessage = $this.attr("data-error");
    var redirect = $this.attr("data-redirect");

    event.preventDefault();
    clearFormMessages($this);

    var $elements = $this.find(
      "input[pattern], textarea[pattern], input[required], textarea[required]"
    );
    var submitForm = true;
    $elements.each(function() {
      if (!validate.call(this)) {
        submitForm = false;
      }
    });

    if (!submitForm) {
      return;
    }

    var data = [];
    $this.find("input, textarea").each(function() {
      var $elem = $(this);
      var name = $elem.attr("name");
      var type = $elem.attr("data-type");
      var value = $elem.val();
      var required = Boolean($elem.prop("required"));
      var label = $elem.attr("data-label");

      data.push({
        name: name,
        value: value,
        required: required,
        type: type,
        label: label
      });
    });

    $.ajax({
      type: "POST",
      url: url,
      data: {
        data: JSON.stringify(data),
        project_language: projectLanguage,
        form_id: id
      }
    })
      .done(function() {
        showFormMessage($this, getFormMessage("success", successMessage));
        if (redirect !== "") {
          window.location.replace(redirect);
        }
      })
      .fail(function() {
        $this.addClass("brz-form__send--fail");
        showFormMessage($this, getFormMessage("error", errorMessage));
      });
  });
}

function validate() {
  var $this = $(this);
  var $parentElem = $this.closest(".brz-form__item");
  var value = $this.val();
  var result = true;

  $parentElem.removeClass(
    "brz-form__item--error brz-form__item--error-pattern brz-form__item--error-required"
  );

  var pattern = $this.attr("pattern");
  if (!new RegExp(pattern).test(value)) {
    $parentElem.addClass("brz-form__item--error brz-form__item--error-pattern");
    result = false;
  }

  var isRequired = $this.prop("required");
  if (isRequired) {
    if (!value.length) {
      $parentElem.addClass(
        "brz-form__item--error brz-form__item--error-required"
      );
      result = false;
    }
  }

  return result;
}
function getFormMessage(status, text) {
  var defaultTexts = {
    success: "Your email was sent successfully",
    error: "Your email was not sent",
    empty: "Please check your entry and try again"
  };
  switch (status) {
    case "success":
      return (
        '<div class="brz-form__alert brz-form__alert--success">' +
        (text || defaultTexts.success) +
        "</div>"
      );
    case "error":
      return (
        '<div class="brz-form__alert brz-form__alert--error">' +
        (text || defaultTexts.error) +
        "</div>"
      );
  }
}
function clearFormMessages($form) {
  $form
    .parent()
    .find(".brz-form__alert")
    .remove();
  $form.removeClass(
    "brz-form__send--empty brz-form__send--success brz-form__send--fail"
  );
}
function showFormMessage($form, message) {
  $form.after(message);
}

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-map").each(function() {
  var $this = $(this);

  $this.on("click", function() {
    $this.children('iframe').css("pointer-events", "auto");
  });
  $this.on('mouseleave', function() {
    $this.children('iframe').css("pointer-events", "none");
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-progress-bar").each(function () {
  var $this = $(this);
  var percentWrapper = $this.find(".brz-progress-bar__wrapper");
  var percentText = $this.find(".brz-progress-bar__percent");
  var percentValue = parseInt(percentWrapper.attr("data-progress"));

  $({ countNum: 0 }).animate({ countNum: percentValue },
    {
      duration: 1500,
      easing: "linear",

      step: function () {
        percentText.text(Math.floor(this.countNum) + "%");
        percentWrapper.css({ maxWidth: Math.round(this.countNum + 0.5) + "%" });
      },

      complete: function () {
        percentText.text(Math.round(this.countNum) + "%");
      }
    });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

function getArrow(src, className) {
  return (
    '<div class="brz-slick-slider__arrow ' +
    className +
    '"><svg class="brz-icon-svg"><use xlink:href=' +
    src +
    " /></svg></div>"
  );
}

$(".brz-slick-slider").each(function() {
  var $this = $(this);
  var data = $this.data();
  var dots = data.dots;
  var dotsClass = data.dotsClass;
  var arrows = data.arrows;
  var nextArrow = data.nextArrow;
  var prevArrow = data.prevArrow;
  var fade = data.fade;
  var vertical = data.vertical;
  var autoPlay = data.autoPlay;
  var autoPlaySpeed = data.autoPlaySpeed;

  $this.slick({
    slidesToShow: 1,
    swipe: false,
    draggable: false,
    dots: dots,
    dotsClass: dotsClass,
    arrows: arrows,
    nextArrow: getArrow(nextArrow, "brz-slick-slider__arrow-next"),
    prevArrow: getArrow(prevArrow, "brz-slick-slider__arrow-prev"),
    fade: fade,
    vertical: vertical,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-tabs").each(function() {
  var $this = $(this);
  var $tabsContent = $this.children(".brz-tabs__content").children(".brz-tabs__items");

  $this.children(".brz-tabs__nav").on("click", function(e) {
    var $navItem = $(e.target).closest("li");
    var navIndex = $navItem.index();
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";

    if (navIndex !== -1) {
      // removeClass
      $tabsContent.removeClass("brz-tabs__items--active");
      $tabsContent.children(".brz-tabs__nav--mobile").removeClass(mobileActiveClassName);
      $navItem.siblings("li").removeClass("brz-tabs__nav--active");

      // addClass
      $navItem.addClass("brz-tabs__nav--active");
      $($tabsContent[navIndex]).children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);
      $($tabsContent[navIndex]).addClass("brz-tabs__items--active");
    }
  });

  // For Mobile
  var $mobileTabsContent = $(this).find(".brz-tabs__items");

  $mobileTabsContent.on("click", function() {
    var activeClassName = "brz-tabs__items--active";
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";
    var $item = $(this).closest('.brz-tabs__items');

    $item.siblings().removeClass(activeClassName);
    $item.siblings().children(".brz-tabs__nav--mobile").removeClass(mobileActiveClassName);

    $item.addClass(activeClassName);
    $item.children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-video__cover").each(function() {
  var $this = $(this);
  var $videoIframe = $this.siblings(".brz-iframe");

  $this.on("click", function() {
    $videoIframe.addClass("brz-visible");
    $(this).remove();
    $videoIframe.attr(
      "src",
      $videoIframe.attr("src").replace("autoplay=0", "autoplay=1")
    );
  });
});

}(jQuery));

});
