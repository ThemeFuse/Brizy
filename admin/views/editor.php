<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $url
 */

?>
<div class="brizy-editor">
    <a class="preview button button-primary" type="button" href="<?php echo $url; ?>"
    ><?php _e( 'Edit with BitBlox', brizy()->get_domain() ); ?></a>
</div>
