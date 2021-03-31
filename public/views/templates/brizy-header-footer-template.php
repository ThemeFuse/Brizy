<?php defined( 'ABSPATH' ) or die();

get_header();

	if ( is_category() || is_archive() || is_tag() || is_404() || is_search() || is_home() ) {
		do_action( 'brizy_template_content' );
	} else {
		while ( have_posts() ) { the_post();
			if ( post_password_required() ) {
				echo get_the_password_form();
			} else {
				the_content();
			}
		}
	}

get_footer();
