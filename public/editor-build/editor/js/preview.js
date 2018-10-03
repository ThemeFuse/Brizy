!function(e,i){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(t){return i(e,t)}):"object"==typeof module&&module.exports?module.exports=i(e,require("jquery")):e.jQueryBridget=i(e,e.jQuery)}(window,function(t,e){"use strict";var d=Array.prototype.slice,i=t.console,f=void 0===i?function(){}:function(t){i.error(t)};function o(h,n,l){(l=l||e||t.jQuery)&&(n.prototype.option||(n.prototype.option=function(t){l.isPlainObject(t)&&(this.options=l.extend(!0,this.options,t))}),l.fn[h]=function(t){if("string"==typeof t){var e=d.call(arguments,1);return r=e,u="$()."+h+'("'+(s=t)+'")',(i=this).each(function(t,e){var i=l.data(e,h);if(i){var o=i[s];if(o&&"_"!=s.charAt(0)){var n=o.apply(i,r);a=void 0===a?n:a}else f(u+" is not a valid method")}else f(h+" not initialized. Cannot call methods, i.e. "+u)}),void 0!==a?a:i}var i,s,r,a,u,o;return o=t,this.each(function(t,e){var i=l.data(e,h);i?(i.option(o),i._init()):(i=new n(e,o),l.data(e,h,i))}),this},s(l))}function s(t){!t||t&&t.bridget||(t.bridget=o)}return s(e||t.jQuery),o}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},o=i[t]=i[t]||[];return-1==o.indexOf(e)&&o.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{};return(i[t]=i[t]||{})[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var o=i.indexOf(e);return-1!=o&&i.splice(o,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var o=this._onceEvents&&this._onceEvents[t],n=0;n<i.length;n++){var s=i[n];o&&o[s]&&(this.off(t,s),delete o[s]),s.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function g(t){var e=parseFloat(t);return-1==t.indexOf("%")&&!isNaN(e)&&e}var i="undefined"==typeof console?function(){}:function(t){console.error(t)},v=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],_=v.length;function z(t){var e=getComputedStyle(t);return e||i("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}var I,x=!1;function S(t){if(function(){if(!x){x=!0;var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style.boxSizing="border-box";var e=document.body||document.documentElement;e.appendChild(t);var i=z(t);I=200==Math.round(g(i.width)),S.isBoxSizeOuter=I,e.removeChild(t)}}(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var e=z(t);if("none"==e.display)return function(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<_;e++)t[v[e]]=0;return t}();var i={};i.width=t.offsetWidth,i.height=t.offsetHeight;for(var o=i.isBorderBox="border-box"==e.boxSizing,n=0;n<_;n++){var s=v[n],r=e[s],a=parseFloat(r);i[s]=isNaN(a)?0:a}var u=i.paddingLeft+i.paddingRight,h=i.paddingTop+i.paddingBottom,l=i.marginLeft+i.marginRight,d=i.marginTop+i.marginBottom,f=i.borderLeftWidth+i.borderRightWidth,c=i.borderTopWidth+i.borderBottomWidth,m=o&&I,p=g(e.width);!1!==p&&(i.width=p+(m?0:u+f));var y=g(e.height);return!1!==y&&(i.height=y+(m?0:h+c)),i.innerWidth=i.width-(u+f),i.innerHeight=i.height-(h+c),i.outerWidth=i.width+l,i.outerHeight=i.height+d,i}}return S}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var i=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var o=e[i]+"MatchesSelector";if(t[o])return o}}();return function(t,e){return t[i](e)}}),function(e,i){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(t){return i(e,t)}):"object"==typeof module&&module.exports?module.exports=i(e,require("desandro-matches-selector")):e.fizzyUIUtils=i(e,e.matchesSelector)}(window,function(h,s){var l={extend:function(t,e){for(var i in e)t[i]=e[i];return t},modulo:function(t,e){return(t%e+e)%e}},e=Array.prototype.slice;l.makeArray=function(t){return Array.isArray(t)?t:null==t?[]:"object"==typeof t&&"number"==typeof t.length?e.call(t):[t]},l.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},l.getParent=function(t,e){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,s(t,e))return t},l.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},l.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},l.filterFindElements=function(t,o){t=l.makeArray(t);var n=[];return t.forEach(function(t){if(t instanceof HTMLElement)if(o){s(t,o)&&n.push(t);for(var e=t.querySelectorAll(o),i=0;i<e.length;i++)n.push(e[i])}else n.push(t)}),n},l.debounceMethod=function(t,e,o){o=o||100;var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];clearTimeout(t);var e=arguments,i=this;this[s]=setTimeout(function(){n.apply(i,e),delete i[s]},o)}},l.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},l.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var d=h.console;return l.htmlInit=function(a,u){l.docReady(function(){var t=l.toDashed(u),n="data-"+t,e=document.querySelectorAll("["+n+"]"),i=document.querySelectorAll(".js-"+t),o=l.makeArray(e).concat(l.makeArray(i)),s=n+"-options",r=h.jQuery;o.forEach(function(e){var t,i=e.getAttribute(n)||e.getAttribute(s);try{t=i&&JSON.parse(i)}catch(t){return void(d&&d.error("Error parsing "+n+" on "+e.className+": "+t))}var o=new a(e,t);r&&r.data(e,u,o)})})},l}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";var i=document.documentElement.style,o="string"==typeof i.transition?"transition":"WebkitTransition",n="string"==typeof i.transform?"transform":"WebkitTransform",s={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[o],r={transform:n,transition:o,transitionDuration:o+"Duration",transitionProperty:o+"Property",transitionDelay:o+"Delay"};function a(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var u=a.prototype=Object.create(t.prototype);u.constructor=a,u._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},u.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},u.getSize=function(){this.size=e(this.element)},u.css=function(t){var e=this.element.style;for(var i in t){e[r[i]||i]=t[i]}},u.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),o=t[e?"left":"right"],n=t[i?"top":"bottom"],s=parseFloat(o),r=parseFloat(n),a=this.layout.size;-1!=o.indexOf("%")&&(s=s/100*a.width),-1!=n.indexOf("%")&&(r=r/100*a.height),s=isNaN(s)?0:s,r=isNaN(r)?0:r,s-=e?a.paddingLeft:a.paddingRight,r-=i?a.paddingTop:a.paddingBottom,this.position.x=s,this.position.y=r},u.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop"),n=i?"paddingLeft":"paddingRight",s=i?"left":"right",r=i?"right":"left",a=this.position.x+t[n];e[s]=this.getXValue(a),e[r]="";var u=o?"paddingTop":"paddingBottom",h=o?"top":"bottom",l=o?"bottom":"top",d=this.position.y+t[u];e[h]=this.getYValue(d),e[l]="",this.css(e),this.emitEvent("layout",[this])},u.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},u.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},u._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),!n||this.isTransitioning){var s=t-i,r=e-o,a={};a.transform=this.getTranslate(s,r),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})}else this.layoutPosition()},u.getTranslate=function(t,e){return"translate3d("+(t=this.layout._getOption("originLeft")?t:-t)+"px, "+(e=this.layout._getOption("originTop")?e:-e)+"px, 0)"},u.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},u.moveTo=u._transitionTo,u.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},u._nonTransition=function(t){for(var e in this.css(t.to),t.isCleaning&&this._removeStyles(t.to),t.onTransitionEnd)t.onTransitionEnd[e].call(this)},u.transition=function(t){if(parseFloat(this.layout.options.transitionDuration)){var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);this.element.offsetHeight;null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0}else this._nonTransition(t)};var h="opacity,"+n.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()});u.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:h,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(s,this,!1)}},u.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},u.onotransitionend=function(t){this.ontransitionend(t)};var l={"-webkit-transform":"transform"};u.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=l[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],function(t){for(var e in t)return!1;return!0}(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd)e.onEnd[i].call(this),delete e.onEnd[i];this.emitEvent("transitionEnd",[this])}},u.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(s,this,!1),this.isTransitioning=!1},u._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var d={transitionProperty:"",transitionDuration:"",transitionDelay:""};return u.removeTransitionStyles=function(){this.css(d)},u.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},u.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},u.remove=function(){o&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),this.hide()):this.removeElem()},u.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},u.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},u.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},u.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},u.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},u.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},a}),function(n,s){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(t,e,i,o){return s(n,t,e,i,o)}):"object"==typeof module&&module.exports?module.exports=s(n,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):n.Outlayer=s(n,n.EvEmitter,n.getSize,n.fizzyUIUtils,n.Outlayer.Item)}(window,function(t,e,n,s,o){"use strict";var r=t.console,a=t.jQuery,i=function(){},u=0,h={};function l(t,e){var i=s.getQueryElement(t);if(i){this.element=i,a&&(this.$element=a(this.element)),this.options=s.extend({},this.constructor.defaults),this.option(e);var o=++u;this.element.outlayerGUID=o,(h[o]=this)._create(),this._getOption("initLayout")&&this.layout()}else r&&r.error("Bad element for "+this.constructor.namespace+": "+(i||t))}l.namespace="outlayer",l.Item=o,l.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var d=l.prototype;function f(t){function e(){t.apply(this,arguments)}return(e.prototype=Object.create(t.prototype)).constructor=e}s.extend(d,e.prototype),d.option=function(t){s.extend(this.options,t)},d._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},l.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},d._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),s.extend(this.element.style,this.options.containerStyle),this._getOption("resize")&&this.bindResize()},d.reloadItems=function(){this.items=this._itemize(this.element.children)},d._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0;n<e.length;n++){var s=new i(e[n],this);o.push(s)}return o},d._filterFindItemElements=function(t){return s.filterFindElements(t,this.options.itemSelector)},d.getItemElements=function(){return this.items.map(function(t){return t.element})},d.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},d._init=d.layout,d._resetLayout=function(){this.getSize()},d.getSize=function(){this.size=n(this.element)},d._getMeasurement=function(t,e){var i,o=this.options[t];o?("string"==typeof o?i=this.element.querySelector(o):o instanceof HTMLElement&&(i=o),this[t]=i?n(i)[e]:o):this[t]=0},d.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},d._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},d._layoutItems=function(t,i){if(this._emitCompleteOnItems("layout",t),t&&t.length){var o=[];t.forEach(function(t){var e=this._getItemLayoutPosition(t);e.item=t,e.isInstant=i||t.isLayoutInstant,o.push(e)},this),this._processLayoutQueue(o)}},d._getItemLayoutPosition=function(){return{x:0,y:0}},d._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},d.updateStagger=function(){var t=this.options.stagger;if(null!=t)return this.stagger=function(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],o=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var n=c[o]||1;return i*n}(t),this.stagger;this.stagger=0},d._positionItem=function(t,e,i,o,n){o?t.goTo(e,i):(t.stagger(n*this.stagger),t.moveTo(e,i))},d._postLayout=function(){this.resizeContainer()},d.resizeContainer=function(){if(this._getOption("resizeContainer")){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},d._getContainerSize=i,d._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},d._emitCompleteOnItems=function(e,t){var i=this;function o(){i.dispatchEvent(e+"Complete",null,[t])}var n=t.length;if(t&&n){var s=0;t.forEach(function(t){t.once(e,r)})}else o();function r(){++s==n&&o()}},d.dispatchEvent=function(t,e,i){var o=e?[e].concat(i):i;if(this.emitEvent(t,o),a)if(this.$element=this.$element||a(this.element),e){var n=a.Event(e);n.type=t,this.$element.trigger(n,i)}else this.$element.trigger(t,i)},d.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},d.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},d.stamp=function(t){(t=this._find(t))&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},d.unstamp=function(t){(t=this._find(t))&&t.forEach(function(t){s.removeFrom(this.stamps,t),this.unignore(t)},this)},d._find=function(t){if(t)return"string"==typeof t&&(t=this.element.querySelectorAll(t)),t=s.makeArray(t)},d._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},d._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},d._manageStamp=i,d._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=n(t);return{left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom}},d.handleEvent=s.handleEvent,d.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},d.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},d.onresize=function(){this.resize()},s.debounceMethod(l,"onresize",100),d.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},d.needsResizeLayout=function(){var t=n(this.element);return this.size&&t&&t.innerWidth!==this.size.innerWidth},d.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},d.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},d.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},d.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var i=this.updateStagger();t.forEach(function(t,e){t.stagger(e*i),t.reveal()})}},d.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var i=this.updateStagger();t.forEach(function(t,e){t.stagger(e*i),t.hide()})}},d.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},d.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},d.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},d.getItems=function(t){t=s.makeArray(t);var i=[];return t.forEach(function(t){var e=this.getItem(t);e&&i.push(e)},this),i},d.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),s.removeFrom(this.items,t)},this)},d.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete h[e],delete this.element.outlayerGUID,a&&a.removeData(this.element,this.constructor.namespace)},l.data=function(t){var e=(t=s.getQueryElement(t))&&t.outlayerGUID;return e&&h[e]},l.create=function(t,e){var i=f(l);return i.defaults=s.extend({},l.defaults),s.extend(i.defaults,e),i.compatOptions=s.extend({},l.compatOptions),i.namespace=t,i.data=l.data,i.Item=f(o),s.htmlInit(i,t),a&&a.bridget&&a.bridget(t,i),i};var c={ms:1,s:1e3};return l.Item=o,l}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/item",["outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window,function(t){"use strict";function e(){t.Item.apply(this,arguments)}var i=e.prototype=Object.create(t.Item.prototype),o=i._create;i._create=function(){this.id=this.layout.itemGUID++,o.call(this),this.sortData={}},i.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var n=i.destroy;return i.destroy=function(){n.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(e,i){"use strict";function o(t){(this.isotope=t)&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}var n=o.prototype;return["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"].forEach(function(t){n[t]=function(){return i.prototype[t].apply(this.isotope,arguments)}}),n.needsVerticalResizeLayout=function(){var t=e(this.isotope.element);return this.isotope.size&&t&&t.innerHeight!=this.isotope.size.innerHeight},n._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},n.getColumnWidth=function(){this.getSegmentSize("column","Width")},n.getRowHeight=function(){this.getSegmentSize("row","Height")},n.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},n.getFirstItemSize=function(){var t=this.isotope.filteredItems[0];return t&&t.element&&e(t.element)},n.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},n.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},o.modes={},o.create=function(t,e){function i(){o.apply(this,arguments)}return(i.prototype=Object.create(n)).constructor=i,e&&(i.options=e),o.modes[i.prototype.namespace=t]=i},o}),function(t,e){"function"==typeof define&&define.amd?define("masonry-layout/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,h){var e=t.create("masonry");e.compatOptions.fitWidth="isFitWidth";var i=e.prototype;return i._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},i.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],e=t&&t.element;this.columnWidth=e&&h(e).outerWidth||this.containerWidth}var i=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,n=o/i,s=i-o%i;n=Math[s&&s<1?"round":"floor"](n),this.cols=Math.max(n,1)},i.getContainerWidth=function(){var t=this._getOption("fitWidth")?this.element.parentNode:this.element,e=h(t);this.containerWidth=e&&e.innerWidth},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=Math[e&&e<1?"round":"ceil"](t.size.outerWidth/this.columnWidth);i=Math.min(i,this.cols);for(var o=this[this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition"](i,t),n={x:this.columnWidth*o.col,y:o.y},s=o.y+t.size.outerHeight,r=i+o.col,a=o.col;a<r;a++)this.colYs[a]=s;return n},i._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},i._getTopColGroup=function(t){if(t<2)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;o<i;o++)e[o]=this._getColGroupY(o,t);return e},i._getColGroupY=function(t,e){if(e<2)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},i._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols;i=1<t&&i+t>this.cols?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},i._manageStamp=function(t){var e=h(t),i=this._getElementOffset(t),o=this._getOption("originLeft")?i.left:i.right,n=o+e.outerWidth,s=Math.floor(o/this.columnWidth);s=Math.max(0,s);var r=Math.floor(n/this.columnWidth);r-=n%this.columnWidth?0:1,r=Math.min(this.cols-1,r);for(var a=(this._getOption("originTop")?i.top:i.bottom)+e.outerHeight,u=s;u<=r;u++)this.colYs[u]=Math.max(a,this.colYs[u])},i._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},i._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/masonry",["../layout-mode","masonry-layout/masonry"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotope.LayoutMode,t.Masonry)}(window,function(t,e){"use strict";var i=t.create("masonry"),o=i.prototype,n={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var s in e.prototype)n[s]||(o[s]=e.prototype[s]);var r=o.measureColumns;o.measureColumns=function(){this.items=this.isotope.filteredItems,r.call(this)};var a=o._getOption;return o._getOption=function(t){return"fitWidth"==t?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:a.apply(this.isotope,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("fitRows"),i=e.prototype;return i._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},i._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("vertical",{horizontalAlignment:0}),i=e.prototype;return i._resetLayout=function(){this.y=0},i._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i._getContainerSize=function(){return{height:this.y}},e}),function(r,a){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotope-layout/js/item","isotope-layout/js/layout-mode","isotope-layout/js/layout-modes/masonry","isotope-layout/js/layout-modes/fit-rows","isotope-layout/js/layout-modes/vertical"],function(t,e,i,o,n,s){return a(r,t,e,i,o,n,s)}):"object"==typeof module&&module.exports?module.exports=a(r,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotope-layout/js/item"),require("isotope-layout/js/layout-mode"),require("isotope-layout/js/layout-modes/masonry"),require("isotope-layout/js/layout-modes/fit-rows"),require("isotope-layout/js/layout-modes/vertical")):r.Isotope=a(r,r.Outlayer,r.getSize,r.matchesSelector,r.fizzyUIUtils,r.Isotope.Item,r.Isotope.LayoutMode)}(window,function(t,i,e,o,s,n,r){var a=t.jQuery,u=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},h=i.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});h.Item=n,h.LayoutMode=r;var l=h.prototype;l._create=function(){for(var t in this.itemGUID=0,this._sorters={},this._getSorters(),i.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"],r.modes)this._initLayoutMode(t)},l.reloadItems=function(){this.itemGUID=0,i.prototype.reloadItems.call(this)},l._itemize=function(){for(var t=i.prototype._itemize.apply(this,arguments),e=0;e<t.length;e++){t[e].id=this.itemGUID++}return this._updateItemsSortData(t),t},l._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?s.extend(e.options,i):i,this.modes[t]=new e(this)},l.layout=function(){this._isLayoutInited||!this._getOption("initLayout")?this._layout():this.arrange()},l._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},l.arrange=function(t){this.option(t),this._getIsInstant();var e=this._filter(this.items);this.filteredItems=e.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[e]):this._hideReveal(e),this._sort(),this._layout()},l._init=l.arrange,l._hideReveal=function(t){this.reveal(t.needReveal),this.hide(t.needHide)},l._getIsInstant=function(){var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;return this._isInstant=e},l._bindArrangeComplete=function(){var t,e,i,o=this;function n(){t&&e&&i&&o.dispatchEvent("arrangeComplete",null,[o.filteredItems])}this.once("layoutComplete",function(){t=!0,n()}),this.once("hideComplete",function(){e=!0,n()}),this.once("revealComplete",function(){i=!0,n()})},l._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],s=this._getFilterTest(e),r=0;r<t.length;r++){var a=t[r];if(!a.isIgnored){var u=s(a);u&&i.push(a),u&&a.isHidden?o.push(a):u||a.isHidden||n.push(a)}}return{matches:i,needReveal:o,needHide:n}},l._getFilterTest=function(e){return a&&this.options.isJQueryFiltering?function(t){return a(t.element).is(e)}:"function"==typeof e?function(t){return e(t.element)}:function(t){return o(t.element,e)}},l.updateSortData=function(t){var e;t?(t=s.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},l._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=d(i)}},l._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&i<e;i++){t[i].updateSortData()}};var d=function(t){if("string"!=typeof t)return t;var e,i,o=u(t).split(" "),n=o[0],s=n.match(/^\[(.+)\]$/),r=(e=s&&s[1],i=n,e?function(t){return t.getAttribute(e)}:function(t){var e=t.querySelector(i);return e&&e.textContent}),a=h.sortDataParsers[o[1]];return t=a?function(t){return t&&a(r(t))}:function(t){return t&&r(t)}};h.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},l._sort=function(){if(this.options.sortBy){var t=s.makeArray(this.options.sortBy);this._getIsSameSortBy(t)||(this.sortHistory=t.concat(this.sortHistory));var u,h,e=(u=this.sortHistory,h=this.options.sortAscending,function(t,e){for(var i=0;i<u.length;i++){var o=u[i],n=t.sortData[o],s=e.sortData[o];if(s<n||n<s){var r=void 0!==h[o]?h[o]:h,a=r?1:-1;return(s<n?1:-1)*a}}return 0});this.filteredItems.sort(e)}},l._getIsSameSortBy=function(t){for(var e=0;e<t.length;e++)if(t[e]!=this.sortHistory[e])return!1;return!0},l._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},l._resetLayout=function(){i.prototype._resetLayout.call(this),this._mode()._resetLayout()},l._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},l._manageStamp=function(t){this._mode()._manageStamp(t)},l._getContainerSize=function(){return this._mode()._getContainerSize()},l.needsResizeLayout=function(){return this._mode().needsResizeLayout()},l.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},l.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},l._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},l.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;i<n;i++)o=e[i],this.element.appendChild(o.element);var s=this._filter(e).matches;for(i=0;i<n;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;i<n;i++)delete e[i].isLayoutInstant;this.reveal(s)}};var f=l.remove;return l.remove=function(t){t=s.makeArray(t);var e=this.getItems(t);f.call(this,t);for(var i=e&&e.length,o=0;i&&o<i;o++){var n=e[o];s.removeFrom(this.filteredItems,n)}},l.shuffle=function(){for(var t=0;t<this.items.length;t++){this.items[t].sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},l._noTransition=function(t,e){var i=this.options.transitionDuration;this.options.transitionDuration=0;var o=t.apply(this,e);return this.options.transitionDuration=i,o},l.getFilteredItemElements=function(){return this.filteredItems.map(function(t){return t.element})},h});
!function(t,e){function i(t,e,i,l){t[n](o+e,"wheel"==s?i:function(t){!t&&(t=a.event);var e={originalEvent:t,target:t.target||t.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==t.type?0:1,deltaX:0,deltaZ:0,notRealWheel:1,preventDefault:function(){t.preventDefault?t.preventDefault():t.returnValue=!1}};return"mousewheel"==s?(e.deltaY=-.025*t.wheelDelta,t.wheelDeltaX&&(e.deltaX=-.025*t.wheelDeltaX)):e.deltaY=t.detail/3,i(e)},l||!1)}var n,s,o="";t.addEventListener?n="addEventListener":(n="attachEvent",o="on"),s="onwheel"in e.createElement("div")?"wheel":void 0!==e.onmousewheel?"mousewheel":"DOMMouseScroll",t.addWheelListener=function(t,e,n){i(t,s,e,n),"DOMMouseScroll"==s&&i(t,"MozMousePixelScroll",e,n)}}(window,document),function(t,e,i,n){"use strict";function s(n,s){this.$elem=t(n),this.options=t.extend({bgClass:"parallax-bg",wheelIgnoreClass:[],items:[],baseElement:e,windowHeight:Math.max(i.documentElement.clientHeight,e.innerHeight||0),r:0,u:0,v:0,s:!1,F:!1},s),this._handleScrollBound=this._handleScroll.bind(this),this._handleWheelBound=this._handleWheel.bind(this),this._handleResizeBound=this._handleResize.bind(this),this._init()}var o="plugin_parallax";t.extend(s.prototype,{_init:function(){this.options.windowHeight=Math.max(i.documentElement.clientHeight,e.innerHeight||0),this.profileParallaxElements(),this._attachEvents(),this.d()},_attachEvents:function(){this.options.baseElement.addEventListener("scroll",this._handleScrollBound,!1),e.addEventListener("wheel",this._handleWheelBound,!1),e.addEventListener("resize",this._handleResizeBound,!1)},_detachEvents:function(){this.options.baseElement.removeEventListener("scroll",this._handleScrollBound,!1),e.removeEventListener("wheel",this._handleWheelBound,!1),e.removeEventListener("resize",this._handleResizeBound,!1)},_handleScroll:function(t){this.options.F=!0},_handleWheel:function(e){if(this.options.wheelIgnoreClass&&this.options.wheelIgnoreClass.length>0&&t(e.target).closest("."+this.options.wheelIgnoreClass.join(", .")).length>0)return null;e.preventDefault&&e.preventDefault(),this.options.v=e.notRealWheel?-e.deltaY/4:1==e.deltaMode?-e.deltaY/3:100===Math.abs(e.deltaY)?-e.deltaY/120:-e.deltaY/40,this.options.v=-2>this.options.v?-2:this.options.v,this.options.v=this.options.v>2?2:this.options.v,this.options.s=!0,this.options.u=4},_handleResize:function(){this.options.windowHeight=Math.max(i.documentElement.clientHeight,e.innerHeight||0),this.options.r=this.b(),this.profileParallaxElements()},profileParallaxElements:function(){var e=this.$elem,i=this;this.options.items=[],this.options.r=this.b(),e.find("."+this.options.bgClass).each(function(){var n=e,s=n.offset().top,o=i.getHeight(n);o&&i.setHeight(n,o),i.options.items.push({section:n.get(0),outerHeight:n.outerHeight(),elemTop:s,elemBottom:s+n.outerHeight(),isFirstSection:!1,imageHolder:this}),i.mr_setTranslate3DTransform(t(this).get(0),(i.f()+i.options.windowHeight-s)/2)})},setHeight:function(e,i){t(e).find("."+this.options.bgClass).css({height:100*i+"vh"})},getHeight:function(e){var i=t(e),n=t(this.options.baseElement).height(),s=i.height(),o=s/n;return s>n?o:null},getTransformStyle:function(t){for(var e=0;e<t.length;e++)if(void 0!==i.body.style[t[e]])return t[e];return null},getScrollingState:function(){return this.options.u>0},getCurrentElement:function(t){for(var e=0,i=this.options.items.length;this.options.items[e]&&this.options.items[e].section!==t;e++);return e===i?-1:e},isFunction:function(t){var e={};return t&&"[object Function]"===e.toString.call(t)},requestAnimationFrame:function(t){return(this.options.baseElement.requestAnimationFrame||this.options.baseElement.mozRequestAnimationFrame||this.options.baseElement.webkitRequestAnimationFrame||this.options.baseElement.msRequestAnimationFrame)(t)},mr_setTranslate3DTransform:function(t,e){var i=this.getTransformStyle(["transform","msTransform","webkitTransform","mozTransform","oTransform"]);t.style[i]="translate3d(0,"+e+"px,0)"},refresh:function(t){this.profileParallaxElements()},destroy:function(t){this._detachEvents(),this.$elem.removeData(o),this.$elem.find("."+this.options.bgClass).css({height:"",transform:""})},e:function(t,e){this.isVariant()?e+this.options.windowHeight-this.options.r>t.elemTop&&e-this.options.r<t.elemBottom&&(t.isFirstSection?this.mr_setTranslate3DTransform(t.imageHolder,e/2):this.mr_setTranslate3DTransform(t.imageHolder,e-t.elemTop-this.options.r)):e+this.options.windowHeight>t.elemTop&&e<t.elemBottom&&(t.isFirstSection?this.mr_setTranslate3DTransform(t.imageHolder,e/2):this.mr_setTranslate3DTransform(t.imageHolder,(e+this.options.windowHeight-t.elemTop)/2))},c:function(t,e,i,n){var s=t-1;return s/=n,t/=n,s--,t--,i*(t*t*t*t*t+1)+e-(i*(s*s*s*s*s+1)+e)},d:function(){var t=0;if(this.options.F){for(var e=this.options.items.length,i=this.f();e--;)this.e(this.options.items[e],i);this.options.F=!1}this.options.s&&(((t+=-this.options.v*this.c(this.options.u,0,300,30))>1||-1>t)&&(this.options.baseElement.scrollBy(0,t),t=0),this.options.u++,this.options.u>30&&(this.options.u=0,this.options.s=!1,this.options.v=0,t=0)),this.requestAnimationFrame.call(this,this.d.bind(this))},isVariant:function(){return!1},b:function(){return t(this.options.baseElement).outerHeight(!0)},f:function(){return this.options.baseElement!=e?this.options.baseElement.scrollTop:0===i.documentElement.scrollTop?i.body.scrollTop:i.documentElement.scrollTop}}),t.fn.parallax=function(e){if(void 0===e||"object"==typeof e)return this.each(function(){t.data(this,o)||t.data(this,o,new s(this,e))});if("string"==typeof e&&"_"!==e[0]&&"init"!==e){var i=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=t.data(this,o);n instanceof s&&"function"==typeof n[e]&&n[e].apply(n,i)})}}}(jQuery,window,document);
!function(t,i,e,n){"use strict";function s(i,e){this.$elem=t(i),this.settings=t.extend({},h,e),this._handleIframeLoad=this._updateSettings.bind(this),this.handleVisibilitychange=this._updateSettings.bind(this),this._handleWindowResize=function(){this.refresh()}.bind(this),this._init()}var a="plugin_backgroundVideo",h={autoResize:!0,autoplay:!1,type:"youtube",mute:null,quality:null},o={youtube:function(t){var i=t.mute;i&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:i?"mute":"unMute"}),"*");var e=t.quality;e&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackQuality",args:["hd"+e,!0]}),"*"),t.autoplay&&this.contentWindow.postMessage(JSON.stringify({event:"command",func:"playVideo"}),"*")},vimeo:function(t){var i=t.mute;i&&this.contentWindow.postMessage(JSON.stringify({method:"setVolume",value:i?0:100}),"*"),t.autoplay&&this.contentWindow.postMessage(JSON.stringify({method:"play"}),"*")}};t.extend(s.prototype,{_init:function(){this._resizePlayer(),this._attachEvents()},_updateSettings:function(){var t=this.$elem.find("iframe");o[this.settings.type].call(t.get(0),this.settings)},_resizePlayer:function(){var t=this.$elem.find("iframe"),i=function(){var t=this.$elem.width(),i=this.$elem.height();if(t/1.78<i){var e=Math.ceil(1.78*i);return{width:e,height:i,left:(t-e)/2,top:0}}var n=Math.ceil(t/1.78);return{width:t,height:n,left:0,top:(i-n)/2}}.call(this);t.width(i.width).height(i.height).css({left:i.left,top:i.top})},_attachEvents:function(){this.$elem.find("iframe").on("load",this._handleIframeLoad),t(i).on("visibilitychange",this.handleVisibilitychange),this.settings.autoResize&&t(i).on("resize",this._handleWindowResize)},_detachEvents:function(){this.$elem.find("iframe").off("load",this._handleIframeLoad),t(i).on("visibilitychange",this.handleVisibilitychange),this.settings.autoResize&&t(i).off("resize",this._resizeHandler)},refresh:function(i){this.settings=t.extend({},h,this.settings,i),this._updateSettings(),this._resizePlayer()},destroy:function(){this._detachEvents(),this.$elem.removeData(a),this.$elem=null,this.settings=null,this._handleIframeLoad=null,this._handleWindowResize=null}}),t.fn.backgroundVideo=function(i){if(void 0===i||"object"==typeof i)return this.each(function(){t.data(this,a)||t.data(this,a,new s(this,i))});if("string"==typeof i&&"_"!==i[0]){var e=Array.prototype.slice.call(arguments,1);return this.each(function(){var n=t.data(this,a);n instanceof s&&"function"==typeof n[i]&&n[i].apply(n,e)})}}}(jQuery,window,document);
!function(t,i,e,n){function s(i){"use strict";this.settings=t.extend({now:(new Date).getTime()},i),this._startTime=(new Date).getTime(),this.start(),this.tick()}t.extend(s.prototype,{start:function(){this.intervalId=setInterval(this.tick.bind(this),this.settings.tickInterval)},update:function(i){this.settings=t.extend({},this.settings,i),this.intervalId||this.start(),this.tick()},tick:function(){var t=this.settings.now+((new Date).getTime()-this._startTime),i=Number(this.settings.endDate)+Number(this.settings.timeZoneOffset),e=this.settings.language,n=i-t,s=n>0,a=s?Math.floor(n/864e5):0,o=s?Math.floor(n%864e5/36e5):0,h=s?Math.floor(n%864e5/6e4)%60:0,r=s?Math.floor(n%864e5/1e3)%60%60:0;this.settings.onTick({days:{title:e.whichLabels(a)[3],amount:a},hours:{title:e.whichLabels(o)[4],amount:o},minutes:{title:e.whichLabels(h)[5],amount:h},seconds:{title:e.whichLabels(r)[6],amount:r}}),s||this.destroy()},destroy:function(){clearInterval(this.intervalId),this.intervalId=null}}),t.fn.countdown=function(i){var e="plugin_countdown";return void 0===i||"object"==typeof i?this.each(function(){t.data(this,e)?t.data(this,e).update(i):t.data(this,e,new s(i))}):"string"==typeof i&&"_"!==i[0]&&"init"!==i?this.each(function(){var n=t.data(this,e);n instanceof s&&"function"==typeof n[i]&&n[i].apply(n,Array.prototype.slice.call(arguments,1))}):void 0}}(jQuery,window,document);
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):window.jQuery||window.Zepto)}(function(a){var b,c,d,e,f,g,h="Close",i="BeforeClose",j="AfterClose",k="BeforeAppend",l="MarkupParse",m="Open",n="Change",o="mfp",p="."+o,q="mfp-ready",r="mfp-removing",s="mfp-prevent-close",t=function(){},u=!!window.jQuery,v=a(window),w=function(a,c){b.ev.on(o+a+p,c)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(c,d){b.ev.triggerHandler(o+c,d),b.st.callbacks&&(c=c.charAt(0).toLowerCase()+c.slice(1),b.st.callbacks[c]&&b.st.callbacks[c].apply(b,a.isArray(d)?d:[d]))},z=function(c){return c===g&&b.currTemplate.closeBtn||(b.currTemplate.closeBtn=a(b.st.closeMarkup.replace("%title%",b.st.tClose)),g=c),b.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(b=new t,b.init(),a.magnificPopup.instance=b)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(void 0!==a.transition)return!0;for(;b.length;)if(b.pop()+"Transition"in a)return!0;return!1};t.prototype={constructor:t,init:function(){var c=navigator.appVersion;b.isLowIE=b.isIE8=document.all&&!document.addEventListener,b.isAndroid=/android/gi.test(c),b.isIOS=/iphone|ipad|ipod/gi.test(c),b.supportsTransition=B(),b.probablyMobile=b.isAndroid||b.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),d=a(document),b.popupsCache={}},open:function(c){var e;if(c.isObj===!1){b.items=c.items.toArray(),b.index=0;var g,h=c.items;for(e=0;e<h.length;e++)if(g=h[e],g.parsed&&(g=g.el[0]),g===c.el[0]){b.index=e;break}}else b.items=a.isArray(c.items)?c.items:[c.items],b.index=c.index||0;if(b.isOpen)return void b.updateItemHTML();b.types=[],f="",c.mainEl&&c.mainEl.length?b.ev=c.mainEl.eq(0):b.ev=d,c.key?(b.popupsCache[c.key]||(b.popupsCache[c.key]={}),b.currTemplate=b.popupsCache[c.key]):b.currTemplate={},b.st=a.extend(!0,{},a.magnificPopup.defaults,c),b.fixedContentPos="auto"===b.st.fixedContentPos?!b.probablyMobile:b.st.fixedContentPos,b.st.modal&&(b.st.closeOnContentClick=!1,b.st.closeOnBgClick=!1,b.st.showCloseBtn=!1,b.st.enableEscapeKey=!1),b.bgOverlay||(b.bgOverlay=x("bg").on("click"+p,function(){b.close()}),b.wrap=x("wrap").attr("tabindex",-1).on("click"+p,function(a){b._checkIfClose(a.target)&&b.close()}),b.container=x("container",b.wrap)),b.contentContainer=x("content"),b.st.preloader&&(b.preloader=x("preloader",b.container,b.st.tLoading));var i=a.magnificPopup.modules;for(e=0;e<i.length;e++){var j=i[e];j=j.charAt(0).toUpperCase()+j.slice(1),b["init"+j].call(b)}y("BeforeOpen"),b.st.showCloseBtn&&(b.st.closeBtnInside?(w(l,function(a,b,c,d){c.close_replaceWith=z(d.type)}),f+=" mfp-close-btn-in"):b.wrap.append(z())),b.st.alignTop&&(f+=" mfp-align-top"),b.fixedContentPos?b.wrap.css({overflow:b.st.overflowY,overflowX:"hidden",overflowY:b.st.overflowY}):b.wrap.css({top:v.scrollTop(),position:"absolute"}),(b.st.fixedBgPos===!1||"auto"===b.st.fixedBgPos&&!b.fixedContentPos)&&b.bgOverlay.css({height:d.height(),position:"absolute"}),b.st.enableEscapeKey&&d.on("keyup"+p,function(a){27===a.keyCode&&b.close()}),v.on("resize"+p,function(){b.updateSize()}),b.st.closeOnContentClick||(f+=" mfp-auto-cursor"),f&&b.wrap.addClass(f);var k=b.wH=v.height(),n={};if(b.fixedContentPos&&b._hasScrollBar(k)){var o=b._getScrollbarSize();o&&(n.marginRight=o)}b.fixedContentPos&&(b.isIE7?a("body, html").css("overflow","hidden"):n.overflow="hidden");var r=b.st.mainClass;return b.isIE7&&(r+=" mfp-ie7"),r&&b._addClassToMFP(r),b.updateItemHTML(),y("BuildControls"),a("html").css(n),b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo||a(document.body)),b._lastFocusedEl=document.activeElement,setTimeout(function(){b.content?(b._addClassToMFP(q),b._setFocus()):b.bgOverlay.addClass(q),d.on("focusin"+p,b._onFocusIn)},16),b.isOpen=!0,b.updateSize(k),y(m),c},close:function(){b.isOpen&&(y(i),b.isOpen=!1,b.st.removalDelay&&!b.isLowIE&&b.supportsTransition?(b._addClassToMFP(r),setTimeout(function(){b._close()},b.st.removalDelay)):b._close())},_close:function(){y(h);var c=r+" "+q+" ";if(b.bgOverlay.detach(),b.wrap.detach(),b.container.empty(),b.st.mainClass&&(c+=b.st.mainClass+" "),b._removeClassFromMFP(c),b.fixedContentPos){var e={marginRight:""};b.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}d.off("keyup"+p+" focusin"+p),b.ev.off(p),b.wrap.attr("class","mfp-wrap").removeAttr("style"),b.bgOverlay.attr("class","mfp-bg"),b.container.attr("class","mfp-container"),!b.st.showCloseBtn||b.st.closeBtnInside&&b.currTemplate[b.currItem.type]!==!0||b.currTemplate.closeBtn&&b.currTemplate.closeBtn.detach(),b.st.autoFocusLast&&b._lastFocusedEl&&a(b._lastFocusedEl).focus(),b.currItem=null,b.content=null,b.currTemplate=null,b.prevHeight=0,y(j)},updateSize:function(a){if(b.isIOS){var c=document.documentElement.clientWidth/window.innerWidth,d=window.innerHeight*c;b.wrap.css("height",d),b.wH=d}else b.wH=a||v.height();b.fixedContentPos||b.wrap.css("height",b.wH),y("Resize")},updateItemHTML:function(){var c=b.items[b.index];b.contentContainer.detach(),b.content&&b.content.detach(),c.parsed||(c=b.parseEl(b.index));var d=c.type;if(y("BeforeChange",[b.currItem?b.currItem.type:"",d]),b.currItem=c,!b.currTemplate[d]){var f=b.st[d]?b.st[d].markup:!1;y("FirstMarkupParse",f),f?b.currTemplate[d]=a(f):b.currTemplate[d]=!0}e&&e!==c.type&&b.container.removeClass("mfp-"+e+"-holder");var g=b["get"+d.charAt(0).toUpperCase()+d.slice(1)](c,b.currTemplate[d]);b.appendContent(g,d),c.preloaded=!0,y(n,c),e=c.type,b.container.prepend(b.contentContainer),y("AfterChange")},appendContent:function(a,c){b.content=a,a?b.st.showCloseBtn&&b.st.closeBtnInside&&b.currTemplate[c]===!0?b.content.find(".mfp-close").length||b.content.append(z()):b.content=a:b.content="",y(k),b.container.addClass("mfp-"+c+"-holder"),b.contentContainer.append(b.content)},parseEl:function(c){var d,e=b.items[c];if(e.tagName?e={el:a(e)}:(d=e.type,e={data:e,src:e.src}),e.el){for(var f=b.types,g=0;g<f.length;g++)if(e.el.hasClass("mfp-"+f[g])){d=f[g];break}e.src=e.el.attr("data-mfp-src"),e.src||(e.src=e.el.attr("href"))}return e.type=d||b.st.type||"inline",e.index=c,e.parsed=!0,b.items[c]=e,y("ElementParse",e),b.items[c]},addGroup:function(a,c){var d=function(d){d.mfpEl=this,b._openClick(d,a,c)};c||(c={});var e="click.magnificPopup";c.mainEl=a,c.items?(c.isObj=!0,a.off(e).on(e,d)):(c.isObj=!1,c.delegate?a.off(e).on(e,c.delegate,d):(c.items=a,a.off(e).on(e,d)))},_openClick:function(c,d,e){var f=void 0!==e.midClick?e.midClick:a.magnificPopup.defaults.midClick;if(f||!(2===c.which||c.ctrlKey||c.metaKey||c.altKey||c.shiftKey)){var g=void 0!==e.disableOn?e.disableOn:a.magnificPopup.defaults.disableOn;if(g)if(a.isFunction(g)){if(!g.call(b))return!0}else if(v.width()<g)return!0;c.type&&(c.preventDefault(),b.isOpen&&c.stopPropagation()),e.el=a(c.mfpEl),e.delegate&&(e.items=d.find(e.delegate)),b.open(e)}},updateStatus:function(a,d){if(b.preloader){c!==a&&b.container.removeClass("mfp-s-"+c),d||"loading"!==a||(d=b.st.tLoading);var e={status:a,text:d};y("UpdateStatus",e),a=e.status,d=e.text,b.preloader.html(d),b.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),b.container.addClass("mfp-s-"+a),c=a}},_checkIfClose:function(c){if(!a(c).hasClass(s)){var d=b.st.closeOnContentClick,e=b.st.closeOnBgClick;if(d&&e)return!0;if(!b.content||a(c).hasClass("mfp-close")||b.preloader&&c===b.preloader[0])return!0;if(c===b.content[0]||a.contains(b.content[0],c)){if(d)return!0}else if(e&&a.contains(document,c))return!0;return!1}},_addClassToMFP:function(a){b.bgOverlay.addClass(a),b.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),b.wrap.removeClass(a)},_hasScrollBar:function(a){return(b.isIE7?d.height():document.body.scrollHeight)>(a||v.height())},_setFocus:function(){(b.st.focus?b.content.find(b.st.focus).eq(0):b.wrap).focus()},_onFocusIn:function(c){return c.target===b.wrap[0]||a.contains(b.wrap[0],c.target)?void 0:(b._setFocus(),!1)},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(l,[b,c,d]),a.each(c,function(c,d){if(void 0===d||d===!1)return!0;if(e=c.split("_"),e.length>1){var f=b.find(p+"-"+e[0]);if(f.length>0){var g=e[1];"replaceWith"===g?f[0]!==d[0]&&f.replaceWith(d):"img"===g?f.is("img")?f.attr("src",d):f.replaceWith(a("<img>").attr("src",d).attr("class",f.attr("class"))):f.attr(e[1],d)}}else b.find(p+"-"+c).html(d)})},_getScrollbarSize:function(){if(void 0===b.scrollbarSize){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),b.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return b.scrollbarSize}},a.magnificPopup={instance:null,proto:t.prototype,modules:[],open:function(b,c){return A(),b=b?a.extend(!0,{},b):{},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},a.fn.magnificPopup=function(c){A();var d=a(this);if("string"==typeof c)if("open"===c){var e,f=u?d.data("magnificPopup"):d[0].magnificPopup,g=parseInt(arguments[1],10)||0;f.items?e=f.items[g]:(e=d,f.delegate&&(e=e.find(f.delegate)),e=e.eq(g)),b._openClick({mfpEl:e},d,f)}else b.isOpen&&b[c].apply(b,Array.prototype.slice.call(arguments,1));else c=a.extend(!0,{},c),u?d.data("magnificPopup",c):d[0].magnificPopup=c,b.addGroup(d,c);return d};var C,D,E,F="inline",G=function(){E&&(D.after(E.addClass(C)).detach(),E=null)};a.magnificPopup.registerModule(F,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){b.types.push(F),w(h+"."+F,function(){G()})},getInline:function(c,d){if(G(),c.src){var e=b.st.inline,f=a(c.src);if(f.length){var g=f[0].parentNode;g&&g.tagName&&(D||(C=e.hiddenClass,D=x(C),C="mfp-"+C),E=f.after(D).detach().removeClass(C)),b.updateStatus("ready")}else b.updateStatus("error",e.tNotFound),f=a("<div>");return c.inlineElement=f,f}return b.updateStatus("ready"),b._parseMarkup(d,{},c),d}}});var H,I="ajax",J=function(){H&&a(document.body).removeClass(H)},K=function(){J(),b.req&&b.req.abort()};a.magnificPopup.registerModule(I,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){b.types.push(I),H=b.st.ajax.cursor,w(h+"."+I,K),w("BeforeChange."+I,K)},getAjax:function(c){H&&a(document.body).addClass(H),b.updateStatus("loading");var d=a.extend({url:c.src,success:function(d,e,f){var g={data:d,xhr:f};y("ParseAjax",g),b.appendContent(a(g.data),I),c.finished=!0,J(),b._setFocus(),setTimeout(function(){b.wrap.addClass(q)},16),b.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),c.finished=c.loadError=!0,b.updateStatus("error",b.st.ajax.tError.replace("%url%",c.src))}},b.st.ajax.settings);return b.req=a.ajax(d),""}}});var L,M=function(c){if(c.data&&void 0!==c.data.title)return c.data.title;var d=b.st.image.titleSrc;if(d){if(a.isFunction(d))return d.call(b,c);if(c.el)return c.el.attr(d)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=b.st.image,d=".image";b.types.push("image"),w(m+d,function(){"image"===b.currItem.type&&c.cursor&&a(document.body).addClass(c.cursor)}),w(h+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),v.off("resize"+p)}),w("Resize"+d,b.resizeImage),b.isLowIE&&w("AfterChange",b.resizeImage)},resizeImage:function(){var a=b.currItem;if(a&&a.img&&b.st.image.verticalFit){var c=0;b.isLowIE&&(c=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",b.wH-c)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(b.content&&b.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var c=0,d=a.img[0],e=function(f){L&&clearInterval(L),L=setInterval(function(){return d.naturalWidth>0?void b._onImageHasSize(a):(c>200&&clearInterval(L),c++,void(3===c?e(10):40===c?e(50):100===c&&e(500)))},f)};e(1)},getImage:function(c,d){var e=0,f=function(){c&&(c.img[0].complete?(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("ready")),c.hasSize=!0,c.loaded=!0,y("ImageLoadComplete")):(e++,200>e?setTimeout(f,100):g()))},g=function(){c&&(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("error",h.tError.replace("%url%",c.src))),c.hasSize=!0,c.loaded=!0,c.loadError=!0)},h=b.st.image,i=d.find(".mfp-img");if(i.length){var j=document.createElement("img");j.className="mfp-img",c.el&&c.el.find("img").length&&(j.alt=c.el.find("img").attr("alt")),c.img=a(j).on("load.mfploader",f).on("error.mfploader",g),j.src=c.src,i.is("img")&&(c.img=c.img.clone()),j=c.img[0],j.naturalWidth>0?c.hasSize=!0:j.width||(c.hasSize=!1)}return b._parseMarkup(d,{title:M(c),img_replaceWith:c.img},c),b.resizeImage(),c.hasSize?(L&&clearInterval(L),c.loadError?(d.addClass("mfp-loading"),b.updateStatus("error",h.tError.replace("%url%",c.src))):(d.removeClass("mfp-loading"),b.updateStatus("ready")),d):(b.updateStatus("loading"),c.loading=!0,c.hasSize||(c.imgHidden=!0,d.addClass("mfp-loading"),b.findImageSize(c)),d)}}});var N,O=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a,c=b.st.zoom,d=".zoom";if(c.enabled&&b.supportsTransition){var e,f,g=c.duration,j=function(a){var b=a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+c.duration/1e3+"s "+c.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,b.css(e),b},k=function(){b.content.css("visibility","visible")};w("BuildControls"+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.content.css("visibility","hidden"),a=b._getItemToZoom(),!a)return void k();f=j(a),f.css(b._getOffset()),b.wrap.append(f),e=setTimeout(function(){f.css(b._getOffset(!0)),e=setTimeout(function(){k(),setTimeout(function(){f.remove(),a=f=null,y("ZoomAnimationEnded")},16)},g)},16)}}),w(i+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.st.removalDelay=g,!a){if(a=b._getItemToZoom(),!a)return;f=j(a)}f.css(b._getOffset(!0)),b.wrap.append(f),b.content.css("visibility","hidden"),setTimeout(function(){f.css(b._getOffset())},16)}}),w(h+d,function(){b._allowZoom()&&(k(),f&&f.remove(),a=null)})}},_allowZoom:function(){return"image"===b.currItem.type},_getItemToZoom:function(){return b.currItem.hasSize?b.currItem.img:!1},_getOffset:function(c){var d;d=c?b.currItem.img:b.st.zoom.opener(b.currItem.el||b.currItem);var e=d.offset(),f=parseInt(d.css("padding-top"),10),g=parseInt(d.css("padding-bottom"),10);e.top-=a(window).scrollTop()-f;var h={width:d.width(),height:(u?d.innerHeight():d[0].offsetHeight)-g-f};return O()?h["-moz-transform"]=h.transform="translate("+e.left+"px,"+e.top+"px)":(h.left=e.left,h.top=e.top),h}}});var P="iframe",Q="//about:blank",R=function(a){if(b.currTemplate[P]){var c=b.currTemplate[P].find("iframe");c.length&&(a||(c[0].src=Q),b.isIE8&&c.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){b.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(h+"."+P,function(){R()})},getIframe:function(c,d){var e=c.src,f=b.st.iframe;a.each(f.patterns,function(){return e.indexOf(this.index)>-1?(this.id&&(e="string"==typeof this.id?e.substr(e.lastIndexOf(this.id)+this.id.length,e.length):this.id.call(this,e)),e=this.src.replace("%id%",e),!1):void 0});var g={};return f.srcAction&&(g[f.srcAction]=e),b._parseMarkup(d,g,c),b.updateStatus("ready"),d}}});var S=function(a){var c=b.items.length;return a>c-1?a-c:0>a?c+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=b.st.gallery,e=".mfp-gallery";return b.direction=!0,c&&c.enabled?(f+=" mfp-gallery",w(m+e,function(){c.navigateByImgClick&&b.wrap.on("click"+e,".mfp-img",function(){return b.items.length>1?(b.next(),!1):void 0}),d.on("keydown"+e,function(a){37===a.keyCode?b.prev():39===a.keyCode&&b.next()})}),w("UpdateStatus"+e,function(a,c){c.text&&(c.text=T(c.text,b.currItem.index,b.items.length))}),w(l+e,function(a,d,e,f){var g=b.items.length;e.counter=g>1?T(c.tCounter,f.index,g):""}),w("BuildControls"+e,function(){if(b.items.length>1&&c.arrows&&!b.arrowLeft){var d=c.arrowMarkup,e=b.arrowLeft=a(d.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(s),f=b.arrowRight=a(d.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(s);e.click(function(){b.prev()}),f.click(function(){b.next()}),b.container.append(e.add(f))}}),w(n+e,function(){b._preloadTimeout&&clearTimeout(b._preloadTimeout),b._preloadTimeout=setTimeout(function(){b.preloadNearbyImages(),b._preloadTimeout=null},16)}),void w(h+e,function(){d.off(e),b.wrap.off("click"+e),b.arrowRight=b.arrowLeft=null})):!1},next:function(){b.direction=!0,b.index=S(b.index+1),b.updateItemHTML()},prev:function(){b.direction=!1,b.index=S(b.index-1),b.updateItemHTML()},goTo:function(a){b.direction=a>=b.index,b.index=a,b.updateItemHTML()},preloadNearbyImages:function(){var a,c=b.st.gallery.preload,d=Math.min(c[0],b.items.length),e=Math.min(c[1],b.items.length);for(a=1;a<=(b.direction?e:d);a++)b._preloadItem(b.index+a);for(a=1;a<=(b.direction?d:e);a++)b._preloadItem(b.index-a)},_preloadItem:function(c){if(c=S(c),!b.items[c].preloaded){var d=b.items[c];d.parsed||(d=b.parseEl(c)),y("LazyLoad",d),"image"===d.type&&(d.img=a('<img class="mfp-img" />').on("load.mfploader",function(){d.hasSize=!0}).on("error.mfploader",function(){d.hasSize=!0,d.loadError=!0,y("LazyLoadError",d)}).attr("src",d.src)),d.preloaded=!0}}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=b.st.retina,c=a.ratio;c=isNaN(c)?c():c,c>1&&(w("ImageHasSize."+U,function(a,b){b.img.css({"max-width":b.img[0].naturalWidth/c,width:"100%"})}),w("ElementParse."+U,function(b,d){d.src=a.replaceSrc(d,c)}))}}}}),A()});
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});


jQuery(document).ready(function(jQuery) {
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

var $window = $(window);
var $parallax = $(".brz-bg-image-parallax");

$window.on("load", function() {
  if ($parallax.length > 0) {
    var $parallaxContainers = $parallax.closest(".brz-bg-media");

    $parallaxContainers.parallax({
      bgClass: "brz-bg-image-parallax"
    });

    $window.on("resize", function() {
      $parallaxContainers.parallax("refresh");
    });
  }
});

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

$(document).on(
  "click",
  ".brz-anchor, .brz-wp-shortcode__menu .menu-item a",
  function(event) {
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
  }
);

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var observer = {
  events: ["load", "scroll"],
  listeners: [],
  framePending: false,
  addEvents: function() {
    var _this = this;
    this.notifyListeners = this.notifyListeners.bind(this);

    this.events.forEach(function(event) {
      window.addEventListener(event, _this.notifyListeners);
    });
  },
  removeEvents: function() {
    var _this = this;

    this.events.forEach(function(event) {
      window.removeEventListener(event, _this.notifyListeners);
    });
  },
  addListener: function(listener) {
    if (this.listeners.length === 0) {
      this.addEvents();
    }

    this.listeners.push(listener);
  },
  removeListener: function(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);

    if (this.listeners.length === 0) {
      this.removeEvents();
    }
  },
  notifyListeners: function() {
    if (!this.framePending) {
      var _this = this;

      requestAnimationFrame(function() {
        _this.framePending = false;
        _this.listeners.forEach(function(listener) {
          listener();
        });
      });
      this.framePending = true;
    }
  }
};

(function($$$1, window, document, undefined) {
  var pluginName = "brzSticky";
  var defaults = {
    type: "animated",
    refNode: function() {
      throw new Error("brzSticky refNode must be specified");
    },
    onStickyChange: function() {}
  };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $$$1.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  $$$1.extend(Plugin.prototype, {
    init: function() {
      this.isSticky = false;
      observer.addListener(this.checkSticky.bind(this));
    },
    checkSticky: function() {
      var type = this.settings.type;
      var refNode = this.settings.refNode.call(this.element);
      var refNodeRect = refNode.getBoundingClientRect();
      var isSticky =
        type === "animated"
          ? -refNodeRect.top >= refNodeRect.height
          : refNodeRect.top <= 0;

      if (isSticky !== this.isSticky) {
        this.isSticky = isSticky;
        this.settings.onStickyChange.call(this.element, this.isSticky);
      }
    }
  });

  $$$1.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$$$1.data(this, "plugin_" + pluginName)) {
        $$$1.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})($, window, document);

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

$(".brz-image__lightbox").each(function() {
  $(this).magnificPopup({
    delegate: "a",
    type: "image",
    closeOnContentClick: true
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

// Grid
$(window).on("load", function() {
  $(".brz-image__gallery").isotope({
    itemSelector: ".brz-image__gallery-item",
    masonry: {
      columnWidth: ".brz-image__gallery-item"
    }
  });
});

// LightBox
$(".brz-image__gallery-lightbox").each(function() {
  $(this).magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true
    }
  });
});

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

$(".brz-slick-slider, .brz-carousel__slider").each(function() {
  var $this = $(this);
  var data = $this.data();
  var slidesToShow = data.slidesToShow;
  var slidesToScroll = data.slidesToScroll;
  var dots = data.dots;
  var dotsClass = data.dotsClass;
  var arrows = data.arrows;
  var nextArrow = data.nextArrow;
  var prevArrow = data.prevArrow;
  var fade = data.fade;
  var vertical = data.vertical;
  var autoPlay = data.autoPlay;
  var autoPlaySpeed = data.autoPlaySpeed;
  var swipe = data.swipe;

  $this.slick({
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    swipe: swipe,
    draggable: swipe,
    dots: dots,
    dotsClass: dotsClass,
    arrows: arrows,
    nextArrow: nextArrow && getArrow(nextArrow, "brz-slick-slider__arrow-next"),
    prevArrow: prevArrow && getArrow(prevArrow, "brz-slick-slider__arrow-prev"),
    fade: fade,
    vertical: vertical,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-section__header--animated").brzSticky({
  type: "animated",
  refNode: function() {
    return $(this)
      .closest(".brz-section__header")
      .get(0);
  },
  onStickyChange: function(isSticky) {
    $(this).toggleClass("brz-section__header--animated-opened", isSticky);
  }
});
$(".brz-section__header--fixed").brzSticky({
  type: "fixed",
  refNode: function() {
    return $(this)
      .closest(".brz-section__header")
      .get(0);
  },
  onStickyChange: function(isSticky) {
    var $this = $(this);

    if (isSticky) {
      $this.addClass("brz-section__header--fixed-opened");
      $this.closest(".brz-section__header").css({
        height: $this.outerHeight()
      });
    } else {
      $this.removeClass("brz-section__header--fixed-opened");
      $this.closest(".brz-section__header").css({
        height: "auto"
      });
    }
  }
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(document).on("click", '[data-brz-link-type="popup"]', function(e) {
  e.preventDefault();

  var popupId = this.getAttribute("href").slice(1); // without the `#`

  if (popupId) {
    $('[data-brz-popup="' + popupId + '"]').addClass("brz-popup--opened");
    $("html").addClass("brz-ow-hidden");
  }
});

$(".brz-popup").on("click", function(e) {
  var clickedInsideContent = $(e.target).closest(".brz-container").length === 0;

  if (clickedInsideContent) {
    $(this).removeClass("brz-popup--opened");
    $("html").removeClass("brz-ow-hidden");
  }
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-tabs").each(function() {
  var $this = $(this);
  var $tabsContent = $this
    .children(".brz-tabs__content")
    .children(".brz-tabs__items");

  $this.children(".brz-tabs__nav").on("click", function(e) {
    var $navItem = $(e.target).closest("li");
    var navIndex = $navItem.index();
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";

    if (navIndex !== -1) {
      // removeClass
      $tabsContent.removeClass("brz-tabs__items--active");
      $tabsContent
        .children(".brz-tabs__nav--mobile")
        .removeClass(mobileActiveClassName);
      $navItem.siblings("li").removeClass("brz-tabs__nav--active");

      // addClass
      $navItem.addClass("brz-tabs__nav--active");
      $($tabsContent[navIndex])
        .children(".brz-tabs__nav--mobile")
        .addClass(mobileActiveClassName);
      $($tabsContent[navIndex]).addClass("brz-tabs__items--active");
    }
  });

  // For Mobile
  var $mobileTabsContent = $this.find(".brz-tabs__nav--mobile");

  $mobileTabsContent.on("click", function() {
    var $navMobile = $(this);
    var activeClassName = "brz-tabs__items--active";
    var mobileActiveClassName = "brz-tabs__nav--mobile--active";
    var $item = $navMobile.closest(".brz-tabs__items");

    $item.siblings().removeClass(activeClassName);
    $item
      .siblings()
      .children(".brz-tabs__nav--mobile")
      .removeClass(mobileActiveClassName);

    $item.addClass(activeClassName);
    $item.children(".brz-tabs__nav--mobile").addClass(mobileActiveClassName);

    setTimeout(function() {
      $("html, body").animate({ scrollTop: $navMobile.offset().top }, 200);
    }, 100);
  });
});

}(jQuery));

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

$(".brz-video__cover").click(function(e) {
  e.preventDefault();
  var $this = $(this);
  var src = $this.find("a[href]").attr("href");

  if (src) {
    var iframe = jQuery("<iframe/>", {
      class: "brz-iframe",
      src: src
    });

    $this.html(iframe);
  }
});

}(jQuery));

});
