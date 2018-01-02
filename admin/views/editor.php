<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $url
 */
$plugins_url = plugins_url();

?>

<style>
    #post-status-info
    {
        display: none;
    }
</style>


<div class="brizy-editor">
    <a class="preview brizy-button brizy-button--primary" type="button" href="<?php echo $url; ?>"
    ><?php _e( 'Continue to edit with <img src="' . plugins_url( '../static/img/brizy.png', __FILE__ ) . '" class="brizy-logo" />', 'brizy' ); ?></a>
</div>
