<?php
/**
 * https://wordpress.org/plugins/the-events-calendar/
 */
class Brizy_Compatibilities_TheEventsCalendar {

	public function __construct() {
		add_action( 'wp_head', [ $this, 'wp_head' ], 99 );
		add_action( 'loop_start', [ $this, 'loop_start' ], 999 );
	}

	public function wp_head() {
		if ( $this->isEvent() ) {
			remove_action( 'wp_head', [ 'Tribe__Events__Templates', 'maybeSpoofQuery' ], 100 );
		}
	}

	public function loop_start() {
		if ( $this->isEvent() ) {
			add_action( 'tribe_events_views_v2_should_hijack_page_template', '__return_false' );
		}
	}

	public function isEvent() {

		if ( ! tribe_is_event_query() ) {
			return false;
		}

		if ( isset( $_GET[ Brizy_Editor::prefix( '-edit' ) ] ) || isset( $_GET[ Brizy_Editor::prefix( '-edit-iframe' ) ] ) ) {
			return true;
		}

		if ( Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() ) || Brizy_Admin_Templates::getTemplate() ) {
			return true;
		}

		return false;
	}
}