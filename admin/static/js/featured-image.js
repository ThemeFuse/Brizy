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

                    var clickAndMouseMoveHandler = function ( e ) {

                        if ( ! isDragging && e.type !== 'click' ) {
	                        return;
                        }

                        var $this = $(e.target);
                        var imageW = $this.width();
                        var imageH = $this.height();
                        var $focalPointX = $('#_thumbnail_focal_point_x');
                        var $focalPointY = $('#_thumbnail_focal_point_y');
                        var $focalPointDiv = $('#_thumbnail_focal_point_div');

                        $focalPointDiv.on('mouseup', function () {
                            isDragging = false;
                        });

	                    if ( window.getSelection ) {
	                    	window.getSelection().removeAllRanges();
	                    } else if ( document.selection ) {
	                    	document.selection.empty();
	                    }

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
	                    el('input', {
		                    id: '_thumbnail_focal_point_x',
		                    name: '_thumbnail_focal_point_x',
		                    type: 'hidden',
		                    value: Brizy_Admin_Data.page.focalPoint.x
	                    }),
	                    el('input', {
		                    id: '_thumbnail_focal_point_y',
		                    name: '_thumbnail_focal_point_y',
		                    type: 'hidden',
		                    value: Brizy_Admin_Data.page.focalPoint.y
	                    }),
                        el('div',
	                        {
                        	    class: 'wrapper',
		                        onMouseLeave: function () {
		                            isDragging = false;
	                            }
	                        }, [
                            el('img', {
                                id: 'featured-image-el',
                                src: origianalProps.media.source_url,
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
                                style: {left: x + "%", top: y + "%"},
	                            onMouseDown: function () {
		                            isDragging = true;
	                            }
                            }),
                            el('div', {class: 'deleteImage'}, [
                                el('a', {
                                        id: 'remove-post-thumbnail', href: "#", onClick: function (e) {
                                            origianalProps.onRemoveImage(e);

			                                Brizy_Admin_Data.page.focalPoint.x = 50;
			                                Brizy_Admin_Data.page.focalPoint.y = 50;

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
                                            el('use', {'xlinkHref': Brizy_Admin_Data.pluginUrl + '/editor/icons/icons.svg#nc-circle-remove'}),
                                        ]),
                                    ]),
                            ]),
                        ]),
                    ]);
                }
            }
        );
});


