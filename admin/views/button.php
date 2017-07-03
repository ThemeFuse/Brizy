<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id
 */

?>
<button class="preview button button-primary"
        style="float: left"
        type="button"
        onclick="bitblox_wp_redirect(<?php echo $id ?>)"
><?php _e( 'Edit with BitBlox', bitblox_wp()->get_domain() ); ?></button>
