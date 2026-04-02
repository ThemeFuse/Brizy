<?php

use BrizyPlaceholders\ContentPlaceholder;

/**
 * Dynamic content provider for The Events Calendar.
 *
 * Registers placeholders that expose TEC event data (dates, venue, organizer, cost)
 * for use in Brizy's dynamic content system.
 */
class Brizy_Content_Providers_TecProvider extends Brizy_Content_Providers_AbstractProvider {

	public function __construct() {
		$this->registerEventDetailPlaceholders();
		$this->registerVenuePlaceholders();
		$this->registerOrganizerPlaceholders();
	}

	/**
	 * Get the current event post from the rendering context.
	 *
	 * Centralizes the post retrieval logic used by all placeholders,
	 * returning null if the current post is not a tribe_events post.
	 *
	 * @return WP_Post|null
	 */
	private function getEventPost() {
		$context = Brizy_Content_ContextFactory::getGlobalContext();
		$post    = $context ? $context->getWpPost() : get_post();

		if ( ! $post || $post->post_type !== 'tribe_events' ) {
			return null;
		}

		return $post;
	}

	private function registerEventDetailPlaceholders() {
		$this->registerPlaceholderName( 'tec_event_start_date', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Start Date', 'brizy' ),
				$name,
				function ( $context, ContentPlaceholder $contentPlaceholder ) {
					$post = $this->getEventPost();
					if ( ! $post ) {
						return '';
					}

					$attrs  = $contentPlaceholder->getAttributes();
					$format = ! empty( $attrs['format'] ) ? $attrs['format'] : null;

					return tribe_get_start_date( $post->ID, true, $format );
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_end_date', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event End Date', 'brizy' ),
				$name,
				function ( $context, ContentPlaceholder $contentPlaceholder ) {
					$post = $this->getEventPost();
					if ( ! $post ) {
						return '';
					}

					$attrs  = $contentPlaceholder->getAttributes();
					$format = ! empty( $attrs['format'] ) ? $attrs['format'] : null;

					return tribe_get_end_date( $post->ID, true, $format );
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_start_time', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Start Time', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_start_date( $post->ID, false, 'H:i' ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_end_time', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event End Time', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_end_date( $post->ID, false, 'H:i' ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_schedule', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Schedule', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_events_event_schedule_details( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_cost', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Cost', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_cost( $post->ID, true ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_website_url', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Website', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_event_website_url( $post->ID ) : '';
				},
				self::CONFIG_KEY_LINK
			);
		} );

		$this->registerPlaceholderName( 'tec_event_all_day', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'All Day Event', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();
					if ( ! $post ) {
						return '';
					}

					return tribe_event_is_all_day( $post->ID )
						? __( 'Yes', 'brizy' )
						: __( 'No', 'brizy' );
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_categories', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Event Categories', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();
					if ( ! $post ) {
						return '';
					}

					$cats = tribe_get_event_cat_slugs( $post->ID );

					return is_array( $cats ) ? implode( ', ', $cats ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );
	}

	private function registerVenuePlaceholders() {
		$this->registerPlaceholderName( 'tec_event_venue_name', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Venue Name', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_venue( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_venue_address', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Venue Address', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_full_address( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_venue_url', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Venue Link', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_venue_link( $post->ID ) : '';
				},
				self::CONFIG_KEY_LINK
			);
		} );
	}

	private function registerOrganizerPlaceholders() {
		$this->registerPlaceholderName( 'tec_event_organizer_name', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Organizer Name', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_organizer( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_organizer_phone', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Organizer Phone', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_organizer_phone( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_organizer_email', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Organizer Email', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_organizer_email( $post->ID ) : '';
				},
				self::CONFIG_KEY_TEXT
			);
		} );

		$this->registerPlaceholderName( 'tec_event_organizer_url', function ( $name ) {
			return new Brizy_Content_Placeholders_Simple(
				__( 'Organizer Website', 'brizy' ),
				$name,
				function () {
					$post = $this->getEventPost();

					return $post ? tribe_get_organizer_website_url( $post->ID ) : '';
				},
				self::CONFIG_KEY_LINK
			);
		} );
	}
}
