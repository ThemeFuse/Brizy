<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $url
 */

?>
<div class="bitblox-wp-editor">
    <a class="preview button button-primary" type="button" href="<?php echo $url; ?>"
    ><?php _e( 'Edit with BitBlox', bitblox_wp()->get_domain() ); ?></a>
</div>
