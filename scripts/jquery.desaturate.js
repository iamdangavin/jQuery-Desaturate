/**
 * Image Desaturate - jQuery plugin
 * Desaturate (convert) all types of images on web page
 * 
 * (c) 2010 Dmitry Kelmi <miksir@maker.ru>
 * Version: 0.6 (23 Sep 2010)
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * How to use:
 *  $(selector).desaturate(options);
 *  options = {
 *    'iefix': true or false  - autofix images for IE(6-8)
 *  }
 *
 *  IE fix need in following cases:
 *    - image is png with transparency - it apply standart IE fix for png
 *    - desaturated image will be switched with opacity (fadeIn/fadeOut) - jQuery can reset filters after
 *      fadeIn / fadeOut and lost desaturate effect
 *  'iefix' apply fixes only to target of desaturate() and not to other png images!
 *  If you set 'iefix' to false, you can fix images with .desaturateImgFix(), note: all other kind of scripts
 *  for PNG IE fix wont work with .desaturate().
 *
 *  Note: desaturate will replace current image and return new node as result (for all browsers)
 *  Note for non-ie: u can't desaturate IMG which is not loaded yet, so better to use it with onload event.
 */
jQuery.desaturate = {
  defaults: {
    'onswitch': null,
    'iefix': true, // autofix png for IE
    'level': 1,    // level of desaturation, ignored in IE
    'rgb': [0.3333, 0.3333, 0.3333] // levels of RGB for compose grayscale, ignored in IE
  },
  customClass: 'js-desaturate-fixed' // usually no need to change this
};

jQuery.desaturate.Image = function(obj) {
    this.image = obj;
    this.canvas = null;
    this.options = {};
    this.jImage = jQuery(this.image);

    this.jImage.bind("load.desaturate", jQuery.proxy(this.imageLoaded, this));
    this.loaded = this.image.complete;

    this.src = this.jImage.attr('src');
    this.isPNG = this.jImage.is("IMG[src$=.png]");

    var styleWidth  = new String(this.jImage.css('width')); styleWidth = styleWidth.replace(/px/, '');
    var styleHeight = new String(this.jImage.css('height')); styleHeight = styleHeight.replace(/px/, '');

    this.width = this.jImage.width() ? this.jImage.width() : (styleWidth ? styleWidth : this.jImage.attr('width'));
    this.height = this.jImage.height() ? this.jImage.height() : (styleHeight ? styleHeight : this.jImage.attr('height'));

//      var styles = ['padding', 'margin', 'border'];
//      for (var i in styles) {
//        this.imgCustomStyles += styles[i] + ':' + this.image.style[styles[i]]+';';
//        this.image.style[styles[i]] = '';
//      }

    this.imgFilter = '';
    if (this.image.style.filter) {
      this.imgFilter = 'filter:'+this.image.style.filter+';';
      this.image.style.filter = '';
    }

    this.image.style.width = '';
    this.image.style.height = '';

    this.imgId    = this.jImage.attr('id') ? 'id="' + this.jImage.attr('id') + '" ' : '';
    this.imgClass = 'class="' + this.jImage.attr('class') + ' ' + jQuery.desaturate.customClass + '" ';
    this.imgTitle = this.jImage.attr('title') ? 'title="' + this.jImage.attr('title') + '" ' : '';
    this.imgAlt   = this.jImage.attr('alt') ? 'alt="' + this.jImage.attr('alt') + '" ' : '';

    this.imgStyles  = this.image.style.cssText;
    this.imgStyles += this.jImage.attr('align') ? 'float:' + this.jImage.attr('align') + ';' : '';
    this.imgStyles += this.jImage.parent().attr('href') ? 'cursor:hand;' : '';

    // nulled filter present as FILTER: in cssText
    this.imgStyles = this.imgStyles.replace(/filter:/i,'');


    this.imgCssSize = (this.width && this.height) ? 'width:' + this.width + 'px;' + 'height:' + this.height + 'px;' : '';
};

jQuery.desaturate.Image.prototype.imageLoaded = function() {
  this.loaded = true;
  this.jImage.unbind("load.desaturate");
  if (this.canvas)
  {
    this.replaceImageWithCanvas();
    this.canvas = null;
  }
};

jQuery.desaturate.Image.prototype.replace = function(html) {
    return jQuery(html).replaceAll(this.image).get(0);
};

jQuery.desaturate.Image.prototype.prepareCanvas = function() {
  var canvasStr = '<canvas style="display:inline-block;' + this.imgStyles + this.imgCssSize + '" ';
  canvasStr += this.imgId + this.imgClass + this.imgTitle + this.imgAlt + '></canvas>';

  this.canvas = jQuery(canvasStr).get(0);
  return this.canvas;
};

jQuery.desaturate.Image.prototype.switchToCanvas = function() {
  if (this.loaded && this.canvas) {
    this.replaceImageWithCanvas();
    this.canvas = null;
  }
};

jQuery.desaturate.Image.prototype.replaceImageWithCanvas = function() {
    var el = this.replace(this.getCanvas());
    if (typeof(this.options.onswitch) == 'function')
       this.options.onswitch.call(el);
};

jQuery.desaturate.Image.prototype.getCanvas = function() {
    var options = this.options;
    var canvas = this.canvas;
    var canvasContext = canvas.getContext('2d');

    var imgW = this.width;
    var imgH = this.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(this.image, 0, 0);

    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    for(var y = 0; y < imgPixels.height; y++){
      for(var x = 0; x < imgPixels.width; x++){
        var i = (y * 4) * imgPixels.width + x * 4;
        var avg = imgPixels.data[i]*options.rgb[0] + imgPixels.data[i + 1]*options.rgb[1] + imgPixels.data[i + 2]*options.rgb[2];
        imgPixels.data[i] = avg*options.level + imgPixels.data[i]*(1-options.level);
        imgPixels.data[i + 1] = avg*options.level + imgPixels.data[i + 1]*(1-options.level);
        imgPixels.data[i + 2] = avg*options.level + imgPixels.data[i + 2]*(1-options.level);
      }
    }

    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas;
};

jQuery.desaturate.Image.prototype.getIeFix = function() {
    /* Some jQuery operations like fadeIn/Out can reset filter atribute, so we need 3 SPAN's: 1st for styles and
     * correct work with jQuery's animation, 2rd for grayScale filter and last one for alpha image filter.
     * Combined 2 filters in one span won't work too.
     */
    var blockInit = 'display:block;background:transparent;padding:0;margin:0;';
    var strNewHTML = '<span style="display:inline-block;' + this.imgStyles + this.imgCssSize + '" ';
    strNewHTML += this.imgId + this.imgClass + this.imgTitle + this.imgAlt + '>';
      strNewHTML += '<span style="' + blockInit + this.imgCssSize + this.imgFilter + '">';
      if (this.isPNG) {
        strNewHTML += '<span style="' + blockInit + this.imgCssSize;
        strNewHTML += 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.src + '\', sizingMethod=\'crop\');">';
        strNewHTML += '</span>';
      } else {
        strNewHTML += '<img style="' + blockInit + this.imgCssSize + '" ' + this.imgTitle + this.imgAlt;
        strNewHTML += ' src="' + this.src + '">';
      }
      strNewHTML += '</span>';
    strNewHTML += '</span>';

    return jQuery(strNewHTML).get(0);
};

jQuery.fn.desaturate = function(options) {

  var ret = [];
  var _opt = jQuery.extend(true, {}, jQuery.desaturate.defaults, options);

  this.each(function() {
    var el = this;
    var image = null;
    var $opt = jQuery.extend(true, {}, _opt, jQuery.metadata ? jQuery(el).metadata() : {}, jQuery(el).data('desaturate'));

    if (jQuery.browser.msie && jQuery(el).is("IMG") && $opt.iefix) {
      // autofix IE images
      image = new jQuery.desaturate.Image(el);
      image.options = $opt;
      el = image.replace(image.getIeFix());
    }

    if (jQuery.browser.msie && (jQuery(el).is("IMG") || jQuery(el).hasClass(jQuery.desaturate.customClass))) {
      // apply filter for IE
        var el1 = el;
        if (jQuery(el).hasClass(jQuery.desaturate.customClass))
        {
          // if this element is our imgage fixed by pngIE - set grayscale filter to child span
          el1 = jQuery("SPAN", el).get(0);
        }
        el1.style.filter = (el1.style.filter ? el1.style.filter+' ' : '') +
                            'progid:DXImageTransform.Microsoft.BasicImage(grayScale=1)';

        if (typeof($opt.onswitch) == 'function')
          jQuery.proxy($opt.onswitch, el);
    }

    if (!jQuery.browser.msie && (jQuery(el).is("IMG"))) {
      // convert image to canvas
      image = new jQuery.desaturate.Image(el);
      image.options = $opt;
      el = image.prepareCanvas();
      image.switchToCanvas();
    }

    ret.push(el);
  });

  return this.pushStack(ret, "desaturate", "");
};

jQuery.fn.desaturateImgFix = function(options) {
  if (!jQuery.browser.msie) {
    return this;
  }

  var _opt = jQuery.extend(true, {}, jQuery.desaturate.defaults, options);
  var ret = [];

  this.each(function() {
    var $opt = jQuery.extend(true, {}, _opt, jQuery.metadata ? jQuery(this).metadata() : {}, jQuery(this).data('desaturate'));
    if (!jQuery(this).is("IMG")) {
      ret.push(this);
    } else {
      var image = new jQuery.desaturate.Image(this);
      image.options = $opt;
      ret.push(image.replace(image.getIeFix()));
    }
  });

  return this.pushStack(ret, "desaturateImgFix", "");
};




