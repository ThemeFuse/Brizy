<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state = $is_using_brizy ? 'disable' : 'enable';
$label = $is_using_brizy ? 'Back to WordPress' : 'Edit with Brizy';

?>
<style>
    .brizy-buttons
    {
        height: 50px;
        text-align: left;
        margin-top: 10px;
    }
</style>

<div class="brizy-buttons">
    <a class="button button-primary button-hero" type="button"
       href="<?php echo esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_' . $state . '&post=' . $post->ID ) ); ?>">
		<?php _e( $label, 'brizy' ); ?>
    </a>
</div>