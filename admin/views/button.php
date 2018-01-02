<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state = $is_using_brizy ? 'disable' : 'enable';
$label = $is_using_brizy
    ? '<img src="' . plugins_url( '../static/img/arrow.png', __FILE__ ) . '" class="brizy-button--arrow" /> Back to WordPress Editor'
    : 'Edit with <img src="' . plugins_url( '../static/img/brizy.png', __FILE__ ) . '" class="brizy-logo" />';
$className = $is_using_brizy ? 'brizy-button--default' : 'brizy-button--primary';
?>

<div class="brizy-buttons">
    <a class="brizy-button <?php echo $className; ?>" type="button"
       href="<?php echo esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_' . $state . '&post=' . $post->ID ) ); ?>">
		<?php _e( $label, 'brizy' ); ?>
    </a>
</div>