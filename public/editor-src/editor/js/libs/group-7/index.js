/**
 * Monk Media Popup v.1 - a script to open window with videoplayer
 * (c) 2010 Adam Randlett : monkdevelopment.com
 */
//associates the audio or video anchor on click event
//with a new instance of MonkMedia Popup object
function associateObjWithEvent(obj, methodName) {
  return function (e) {
    e = e || window.event;
    return obj[methodName](e, this);
  };
}
//MonkMedia.popup object
var MonkMedia = MonkMedia || {};
MonkMedia.popup =
  MonkMedia.popup ||
  function (obj) {
    this.globalwidth = "";
    this.globalheight = "";
    this.options = {};
    this.element = obj;
    this.eurl = this.element.href;
    this.offsetHeight = 25; //acounts for window heading height

    this.gup = function (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp(regexS),
        results = regex.exec(this.eurl);
      if (results === null) {
        return "";
      } else {
        return results[1];
      }
    };

    this.options = {
      width: this.gup("width"),
      height: this.gup("height"),
      playlist: this.gup("playlist"),
      template: this.gup("template") // "/_player/videoplayer.php"
    };

    //assigns onclick event with anchor element
    this.element.onclick = associateObjWithEvent(this, "doOnClick");

    this.clickHandler = function () {
      if (this.options.playlist !== "false") {
        this.pwidth = 231;
        this.varwidth = Number(this.options.width) + this.pwidth;
        this.globalwidth = String(this.varwidth);
      } else {
        this.globalwidth = this.options.width;
      }

      this.globalheight = Number(this.options.height) + this.offsetHeight;
      this.indx = this.eurl.indexOf("?");
      this.attr = this.eurl.substring(this.indx);
      this.url = this.options.template + this.attr + "&target=MediaPlayer";

      popupWindow(this.url, "MediaPlayer", {
        width: this.globalwidth,
        height: this.globalheight,
        status: 0,
        scrollbars: 0
      });
    };
  };

/*
 * MonkCMS actions
 */

//separate function so with ajax filtering this can be initiated to add click handler to new links
function doMediaEvents(node) {
  var links = node.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    if (
      links[i].className.match("mcms_audioplayer") ||
      links[i].className.match("mcms_videoplayer")
    ) {
      var player = new Object();
      player[i] = new MonkMedia.popup(links[i]);
    }
  }
  MonkMedia.popup.prototype.doOnClick = function (event, element) {
    this.clickHandler();
    event.preventDefault ? event.preventDefault() : (event.returnValue = false); //IE<9 uses event.returnValue
  };
}

function popupWindow(url, name, opts) {
  var specs = {
    width: 400,
    height: 550,
    menubar: 0,
    toolbar: 0,
    status: 1,
    scrollbars: 1
  };

  var opts = opts || {};

  for (var k in opts) {
    specs[k] = opts[k];
  }

  specs.left = window.screenX + window.outerWidth / 2 - specs.width / 2;
  specs.top = window.screenY + window.outerHeight / 2.62 - specs.height / 2;

  specs = Object.keys(specs)
    .map(function (k) {
      return k + "=" + specs[k];
    })
    .join(",");

  return window.open(decodeURIComponent(url), name, specs);
}

/**
 * Initialize
 */

export const initEkklesiaPopups = (nodes) => {
  if (!document.getElementsByTagName) {
    return false;
  }

  nodes.forEach((node) => doMediaEvents(node));
};
