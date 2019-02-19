jQuery(document).ready(function ($) {

    $('.enable-brizy-editor').on('click', function (event) {
        event.preventDefault();

        jQuery(window).off('beforeunload.edit-post');

        if (wp.autosave) {
            wp.autosave.server.triggerSave();
        }

        window.location = $(this).attr('href');
    });

    var BrizyGutenberg = {

        insertBrizyBtn: function () {
            $('#editor').find('.edit-post-header-toolbar').append($('#brizy-gutenberg-btn-switch-mode').html());
        },

        init: function () {
            var self = this;
            setTimeout(function () {
                self.insertBrizyBtn();
            }, 1);
        }
    };

    $(function () {
        BrizyGutenberg.init();
    });


    /*
        <div class="brizy-featured-image hide-if-no-js">
            <div class="wrapper">
                    <img id="featured-image-el" src="{{ thumbnailSrc[0] }}" alt="" width="100%">
                    <div class="focal-point" style="left: {{ focalPoint['x'] }}%; top: {{ focalPoint['y'] }}%;"></div>
                    <div class="deleteImage">
                        <a href="#" id="remove-post-thumbnail">
                            <svg class="brz-icon-svg">
                                <use xlink:href="{{ pluginUrl }}/public/editor-build/editor/icons/icons.svg#nc-circle-remove"></use>
                            </svg>
                        </a>
                    </div>
            </div>
            <input type="hidden" id="_thumbnail_id" name="_thumbnail_id" value="{{ thumbnailId }}">
            <input type="hidden" id="_thumbnail_focal_point_x" name="_thumbnail_focal_point_x" value="{{ focalPoint['x'] }}"/>
            <input type="hidden" id="_thumbnail_focal_point_y" name="_thumbnail_focal_point_y" value="{{ focalPoint['y'] }}"/>
        </div>
    */
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'brizy/getSaveContentExtraProps',
        function (props) {
            debugger;
        }
    );

    wp.hooks.addFilter(
        'editor.PostFeaturedImage',
        'brizy/PostFeaturedImage',
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

                    origianalProps.onUpdateImage(e);
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
                            el('a', {id: 'remove-post-thumbnail', href: "#", onClick: origianalProps.onRemoveImage}, [
                                el('svg', {class: 'brz-icon-svg'}, [
                                    el('use', {'xlink:href': '{{ pluginUrl }}/public/editor-build/editor/icons/icons.svg#nc-circle-remove'}),
                                ]),
                            ]),
                        ]),
                    ]),
                    // el('input', {
                    //     type: 'hidden',
                    //     name: '_thumbnail_id',
                    //     id: '_thumbnail_id',
                    //     value: origianalProps.featuredImageId
                    // }),
                    // el('input', {
                    //     type: 'hidden',
                    //     name: '_thumbnail_focal_point_x',
                    //     id: '_thumbnail_focal_point_x',
                    //     value: x
                    // }),
                    // el('input', {
                    //     type: 'hidden',
                    //     name: '_thumbnail_focal_point_y',
                    //     id: '_thumbnail_focal_point_y',
                    //     value: y
                    // }),

                ]);
            }
        }
    );


});


