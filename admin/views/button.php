<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id
 */

?>
<button class="preview button button-primary"
        type="button"
        id="<?php echo bitblox_wp()->get_slug(); ?>-admin-enable"
><?php _e( 'Edit with BitBlox', bitblox_wp()->get_domain() ); ?></button>
<button class="preview button button-primary"
        type="button"
        id="<?php echo bitblox_wp()->get_slug(); ?>-admin-disable"
><?php _e( 'Back to WordPress', bitblox_wp()->get_domain() ); ?></button>
