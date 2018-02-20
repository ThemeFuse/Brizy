<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

?>
<div id="<?php echo brizy()->get_slug() . '-root-element'; ?>" class="bbm wp-env">
    <div id="page" class="visual-page">
        <?php echo Brizy_Editor_View::get( Brizy_Public_Main::path( 'views/main-template' ) ); ?>
    </div>
</div>