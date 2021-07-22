<?php
/**
 * https://wordpress.org/plugins/wp-job-manager/
 */
class Brizy_Compatibilities_WpJobManager {

	public function __construct() {
		add_filter( 'the_content', [ $this, 'the_content' ], 9 );
	}

	public function the_content( $content ) {
		global $post;

		if ( ! is_singular( 'job_listing' ) || ! in_the_loop() || 'job_listing' !== $post->post_type ) {
			return $content;
		}

		if ( ! Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() ) && ! Brizy_Admin_Templates::getTemplate() ) {
			return $content;
		}

		$jobManager = WP_Job_Manager_Post_Types::instance();

		remove_filter( 'the_content', [ $jobManager, 'job_content' ] );

		return $content;
	}
}
