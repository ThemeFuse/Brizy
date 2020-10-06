<?php
/**
 * https://wordpress.org/plugins/events-manager/
 */
class Brizy_Compatibilities_EventsManager {

	public function __construct() {
		add_action( 'the_content', [ $this, 'the_content' ], 9 );
	}

	public function the_content( $content ) {
		global $post;

		$postTypes = [ EM_POST_TYPE_LOCATION, EM_POST_TYPE_EVENT ];
		$postType  = $post->post_type;

		if ( ! in_array( $postType, $postTypes ) || false === strpos( $content, 'brz-root__container' ) ) {
			return $content;
		}

		$class = $postType == EM_POST_TYPE_LOCATION ? 'EM_Location_Post' : 'EM_Event_Post';

		remove_filter( 'the_content', [ $class, 'the_content' ] );

		return $content;
	}
}
