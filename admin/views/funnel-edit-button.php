<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state     = $is_using_brizy ? 'disable' : 'enable';
$label     = $is_using_brizy ? esc_html__( 'Back to WordPress Editor', 'brizy' ) : esc_html__( 'Edit with', 'brizy' );
$className = $is_using_brizy ? 'brizy-button--default' : 'brizy-button--primary';
?>
<div class="brizy-buttons">
    <a class="brizy-button brizy-button--primary" type="button" href="<?php echo $url; ?>">
        <?php _e( 'Continue to edit with', 'brizy' ); ?>&nbsp;
        <img class="brizy-logo" width="16" src="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?>"
                                           srcset="<?php echo __bt( 'brizy-logo', plugins_url( '../static/img/brizy.png', __FILE__ ) ) ?> 1x, <?php echo __bt( 'brizy-logo-2x', plugins_url( '../static/img/arrow.png', __FILE__ ) ) ?> 2x"/>
        <?php echo __bt( 'brizy', 'Brizy' ); ?>
    </a>
</div>