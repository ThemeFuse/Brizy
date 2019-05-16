<?php defined( 'ABSPATH' ) or die();

echo '<pre style="background:#23282d;z-index:99999999;color:#78FF5B;font-size:14px;position:relative;">';
print_r( 'brizy-header-footer-template.php' );
echo '</pre>';

get_header();

if ( have_posts() ) {
	while ( have_posts() ) {
		the_post();
		the_content();
	}
} else {
	do_action( 'brizy_template_content' );
}

get_footer();
