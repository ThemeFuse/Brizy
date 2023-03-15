<div class="brizy-featured-image hide-if-no-js">
    <div class="wrapper">
        <img id="featured-image-el" src="<?php echo $thumbnailSrc[0]; ?>" alt="" width="100%">
        <div class="focal-point" style="left: <?php echo $focalPoint['x']; ?>%; top: <?php echo $focalPoint['y']; ?>%;"></div>
        <div class="deleteImage">
            <a href="#" id="remove-post-thumbnail">
                <svg class="brz-icon-svg">
                    <use xlink:href="<?php echo $pluginUrl; ?>/editor/icons/icons.svg#nc-circle-remove"></use>
                </svg>
            </a>
        </div>
    </div>
    <input type="hidden" id="_thumbnail_id" name="_thumbnail_id" value="<?php echo $thumbnailId; ?>">
    <input type="hidden" id="_thumbnail_focal_point_x" name="_thumbnail_focal_point_x" value="<?php echo $focalPoint['x']; ?>"/>
    <input type="hidden" id="_thumbnail_focal_point_y" name="_thumbnail_focal_point_y" value="<?php echo $focalPoint['y']; ?>"/>
</div>

<script>
	jQuery(document).ready(function ($) {
		(function () {
			var $focalPointDiv = $('.focal-point');
			var $focalPointX = $('#_thumbnail_focal_point_x');
			var $focalPointY = $('#_thumbnail_focal_point_y');
			var $featuredImageEl = $('#featured-image-el');
			var isDragging = false;

			$('.brizy-featured-image .wrapper').on('mouseleave', function () {
				isDragging = false;
			});

			$featuredImageEl.on('mousedown', function () {
				isDragging = true;
			});

			$featuredImageEl.on('mouseup', function () {
				isDragging = false;
			});

			$focalPointDiv.on('mouseup', function () {
				isDragging = false;
			});

			$focalPointDiv.on('mousedown', function () {
				isDragging = true;
			});

			$featuredImageEl.on( 'click mousemove', function ( e ) {
				if ( ! isDragging && e.type!=='click' ) {
					return;
                }

				if ( window.getSelection ) {
					window.getSelection().removeAllRanges();
				} else if ( document.selection ) {
					document.selection.empty();
				}

				var $this = $(this);
				var imageW = $this.width();
				var imageH = $this.height();

				//Calculate FocusPoint coordinates
				var offsetX = e.pageX - $this.offset().left;
				var offsetY = e.pageY - $this.offset().top;

				//Calculate CSS Percentages
				var percentageX = (offsetX / imageW) * 100;
				var percentageY = (offsetY / imageH) * 100;

				// Set positioning
				$focalPointDiv.css({left: percentageX.toFixed(0) + '% ', top: percentageY.toFixed(0) + '%'});
				$focalPointX.val(percentageX.toFixed(0));
				$focalPointY.val(percentageY.toFixed(0));
			});
		})();
    });
</script>