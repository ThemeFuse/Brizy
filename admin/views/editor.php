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
    <a class="preview brizy-button brizy-button--primary" type="button" href="<?php echo $url; ?>"><?php _e( 'Continue to edit with', 'brizy' ); ?>&nbsp;
        <img src="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ );?>" srcset="<?php echo plugins_url( '../static/img/brizy.png', __FILE__ );?> 1x, <?php echo plugins_url( '../static/img/brizy-2x.png', __FILE__ );?> 2x" class="brizy-logo" /></a>
</div>
