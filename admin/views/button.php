<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state     = $is_using_brizy ? 'disable' : 'enable';
$label     = $is_using_brizy ? 'Back to WordPress Editor' : 'Edit with';
$className = $is_using_brizy ? 'brizy-button--default' : 'brizy-button--primary';
?>
    <div class="brizy-buttons">
        <a class="brizy-button <?php echo $className; ?> enable-brizy-editor" type="button"
           href="<?php echo esc_url( set_url_scheme(admin_url( 'admin-post.php?action=_brizy_admin_editor_' . $state . '&post=' . $post->ID )) ); ?>">
			<?php
			if ( $is_using_brizy ) {
				?>
                <img src="<?php echo plugins_url( '../static/img/arrow.png', __FILE__ ) ?>"
                     class="brizy-button--arrow"/> <?php echo _e( $label, 'brizy' ); ?>
				<?php
			} else {
				?>
				<?php echo _e( $label, 'brizy' ); ?> <img
                        src="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ ) ?>"
                        srcset="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ ) ?> 1x, <?php echo plugins_url( '../static/img/brizy-2x.png', __FILE__ ) ?> 2x"
                        class="brizy-logo"/>
				<?php
			}
			?>
        </a>
    </div>
<?php
if ( $is_using_brizy ) {
	?>
    <style>
        #post-status-info {
            display: none;
        }
    </style>

    <div class="brizy-editor">
        <a class="preview brizy-button brizy-button--primary" type="button"
           href="<?php echo $url; ?>"><?php _e( 'Continue to edit with', 'brizy' ); ?>&nbsp;
            <img src="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ ); ?>" srcset="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ ); ?> 1x, <?php echo plugins_url( '../static/img/brizy-2x.png', __FILE__ ); ?> 2x" class="brizy-logo"/></a>
    </div>
	<?php
}
?>