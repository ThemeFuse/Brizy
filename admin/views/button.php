<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state     = $is_using_brizy ? 'disable' : 'enable';
$className = $is_using_brizy ? 'brizy-button--default' : 'brizy-button--primary';
?>
    <div class="brizy-buttons">
        <a class="brizy-button <?php echo $className; ?> enable-brizy-editor brizy-button--primary" type="button"
           href="<?php echo esc_url( set_url_scheme( admin_url( 'admin-post.php?action=_brizy_admin_editor_' . $state . '&post=' . $post->ID ) ) ); ?>">
			<?php
			if ( $is_using_brizy ) {
				?>
                <img src="<?php echo plugins_url( '../static/img/arrow.png', __FILE__ ) ?>"
                     class="brizy-button--arrow"/><?php esc_html_e( 'Back to WordPress Editor', 'brizy' ); ?>
				<?php
			} else {
				?>
				<?php esc_html_e( 'Edit with', 'brizy' ); ?>
                <img class="brizy-logo" width="16"
                     src="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?>"
                     srcset="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?> 1x, <?php echo __bt( 'brizy-logo-2x', plugins_url( '../static/img/arrow.png', __FILE__ ) ) ?> 2x" /><?php echo __bt( 'brizy', 'Brizy' ); ?>
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
        <a class="brizy-button brizy-button--primary" type="button" href="<?php echo $url; ?>">
			<?php _e( 'Continue to edit with', 'brizy' ); ?>&nbsp;<img class="brizy-logo" width="16"
                                                                       src="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?>"
                                                                       srcset="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?> 1x, <?php echo __bt( 'brizy-logo-2x', plugins_url( '../static/img/arrow.png', __FILE__ ) ) ?> 2x"/>
			<?php echo __bt( 'brizy', 'Brizy' ); ?>
        </a>
    </div>
	<?php
}
?>