<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var array $types
 */
?>

<div class="wrap">
    <h1><?php echo brizy()->get_name() ?></h1>

    <h2 class="nav-tab-wrapper">
        <?php do_action( 'brizy_settings_render_tabs'); ?>
    </h2>

	<?php do_action( 'brizy_settings_render_content'); ?>
</div>