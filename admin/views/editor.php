<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $url
 */

?>

<style>
    #post-status-info
    {
        display: none;
    }
</style>


<div class="brizy-editor">
    <a class="preview button button-primary" type="button" href="<?php echo $url; ?>"
    ><?php _e( 'Edit with Brizy', 'brizy' ); ?></a>
</div>
