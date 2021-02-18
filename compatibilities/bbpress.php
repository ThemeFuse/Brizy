<?php

class Brizy_Compatibilities_Bbpress {

	public function __construct() {

		/* We need to know if this post should be displayed with brizy */

		// First Method
		// add_action( 'bbp_template_include', array( $this, 'bbp_template_include' ), 3 );

		// Second Method - better the reset some vars in the $wp_query;
		add_action( 'bbp_template_include_theme_compat', [ $this, 'bbp_template_include_theme_compat' ] );
	}

	public function bbp_template_include_theme_compat() {
		// Error: Non-static method Brizy_Admin_Templates::filterPageContent() should not be called statically
		add_filter('the_content', [ 'Brizy_Admin_Templates', 'filterPageContent' ], -12000);
	}

	public function bbp_template_include() {
		// filter bbp_template_include is executed on template_include filter
		// in the function bbp_template_include_theme_compat all the_content filters will be removed with: bbp_remove_all_filters( 'the_content' );
		remove_filter( 'bbp_template_include', 'bbp_template_include_theme_compat', 4 );
	}
}
