jQuery(document).ready(function ($) {
    if (wp.hooks && wp.hooks.addFilter)
        wp.hooks.addFilter(
            'editor.PostFeaturedImage',
            'brizy/featuredImage',
            function (originalElement) {
                return function (origianalProps) {

                    var isDragging = false;
                    var el = wp.element.createElement;
                    var x = Brizy_Admin_Data.page.focalPoint.x;
                    var y = Brizy_Admin_Data.page.focalPoint.y;

                    if (!origianalProps.media) {
                        return el(originalElement, origianalProps);
                    }

                    var clickAndMouseMoveHandler = function (e) {

                        if (!isDragging && e.type !== 'click') return;

                        var $this = $(e.target);
                        var imageW = $this.width();
                        var imageH = $this.height();
                        var $focalPointX = $('#_thumbnail_focal_point_x');
                        var $focalPointY = $('#_thumbnail_focal_point_y');
                        var $focalPointDiv = $('#_thumbnail_focal_point_div');

                        $focalPointDiv.on('mouseup', function () {
                            isDragging = false;
                        });

                        // Calculate FocusPoint coordinates
                        var offsetX = e.pageX - $this.offset().left;
                        var offsetY = e.pageY - $this.offset().top;

                        // Calculate CSS Percentages
                        var percentageX = (offsetX / imageW) * 100;
                        var percentageY = (offsetY / imageH) * 100;

                        // Set positioning
                        $focalPointDiv.css({
                            left: percentageX.toFixed(0) + '% ',
                            top: percentageY.toFixed(0) + '%'
                        });
                        $focalPointX.val(percentageX.toFixed(0));
                        $focalPointY.val(percentageY.toFixed(0));

                        wp.data.dispatch('core/editor').editPost({
                            'brizy_attachment_focal_point': {
                                x: percentageX.toFixed(0),
                                y: percentageY.toFixed(0)
                            }
                        });

                    };

                    return el('div', {class: 'brizy-featured-image hide-if-no-js'}, [
                        el('div', {class: 'wrapper'}, [
                            el('img', {
                                id: 'featured-image-el',
                                src: origianalProps.media.guid.raw,
                                width: "100%",
                                onClick: clickAndMouseMoveHandler,
                                onMouseMove: clickAndMouseMoveHandler,
                                onMouseDown: function () {
                                    isDragging = true;
                                },
                                onMouseUp: function () {
                                    isDragging = false;
                                }
                            }),

                            el('div', {
                                class: 'focal-point',
                                id: '_thumbnail_focal_point_div',
                                style: {left: x + "%", top: y + "%"}
                            }),
                            el('div', {class: 'deleteImage'}, [
                                el('a', {
                                        id: 'remove-post-thumbnail', href: "#", onClick: function (e) {
                                            origianalProps.onRemoveImage(e);
                                            wp.data.dispatch('core/editor').editPost({
                                                'brizy_attachment_focal_point': {
                                                    x: 50,
                                                    y: 50
                                                }
                                            });
                                        }
                                    },
                                    [
                                        el('svg', {class: 'brz-icon-svg'}, [
                                            el('use', {'xlinkHref': Brizy_Admin_Data.pluginUrl + '/public/editor-build/editor/icons/icons.svg#nc-circle-remove'}),
                                        ]),
                                    ]),
                            ]),
                        ]),
                    ]);
                }
            }
        );
});


