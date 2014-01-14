(function($) {

    $.fn.imageInfo = function(options) {

        var settings = $.extend({
            color: "#FFF",
            backgroundColor: "#000"
        }, options);

        return this.filter("img").each(function() {
            var img = $(this);
            var offset = img.offset();
            var zIndex = img.css('z-index');

            var info = {
                imageSrc: img.attr('src'),
                alt: img.attr('alt'),
                width: img.width(),
                height: img.height()
            }

            var html = '<div style="position: absolute; padding: 5px; font-size: 10px; font-family: sans-serif; width: auto; height: auto; z-index: ' + zIndex + '; top: ' + offset.top + 'px; left: ' + offset.left + 'px; color: ' + settings.color + '; background: ' + settings.backgroundColor + ';">'+
                           'Source: ' + info.imageSrc + '<br>' +
                           'Alt: ' + info.alt + '<br>' +
                           'Width: ' + info.width + 'px<br>' +
                           'Height: ' + info.height + 'px<br>' +
                           '</div>';

            $(html).appendTo('body');

        })

    }

})(jQuery);