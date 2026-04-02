<?php
/**
 * Compatibility with The Events Calendar plugin.
 *
 * TEC hijacks page rendering at multiple levels:
 * 1. template_include (priority 50) — replaces the entire page template
 * 2. wp_head (priority 1000) — mocks the main query with a fake page
 * 3. loop_start (priority 1000) — registers the_content filter
 * 4. the_content (priority 25) — replaces post content with TEC views HTML
 *
 * We must block all levels when Brizy is active for the current event.
 *
 * @see https://wordpress.org/plugins/the-events-calendar/
 */
class Brizy_Compatibilities_TheEventsCalendar {

	public function __construct() {
		add_action( 'wp', [ $this, 'preventTecHijack' ] );
		add_filter( 'the_content', [ $this, 'the_content' ], 9 );
		add_action( 'wp_enqueue_scripts', [ $this, 'dequeueScripts' ], 100 );
		add_filter( 'brizy_supported_post_types', [ $this, 'registerPostTypes' ] );
		add_filter( 'brizy_providers', [ $this, 'registerProviders' ] );
		add_filter( 'brizy_editor_config_module_group_collectors', [ $this, 'registerModuleGroups' ] );
	}

	/**
	 * Prevent TEC V2 Views from hijacking template and content when Brizy is active.
	 *
	 * Hooked on 'wp' — the queried object is available and this runs before
	 * template_include, wp_head, and loop_start where TEC does its hijacking.
	 */
	public function preventTecHijack() {
		if ( ! $this->isEvent() ) {
			return;
		}

		// Level 1: Force TEC to use standard WP template hierarchy instead of its own.
		// This prevents TEC's template_include filter (priority 50) from replacing the template.
		// Brizy's template_include (priority 10000) will then pick up the page correctly.
		add_filter( 'tribe_events_views_v2_use_wp_template_hierarchy', '__return_true' );

		// Level 2: Prevent TEC from hijacking the page content via loop_start.
		add_filter( 'tribe_events_views_v2_should_hijack_page_template', '__return_false' );

		// Level 3: Prevent TEC's legacy template system from spoofing the query.
		remove_action( 'wp_head', [ 'Tribe__Events__Templates', 'maybeSpoofQuery' ], 100 );

		// Level 4: Remove TEC's wp_head query hijack that mocks the main query.
		if ( function_exists( 'tribe' ) ) {
			$hooks = tribe( 'Tribe\Events\Views\V2\Hooks' );
			remove_action( 'wp_head', [ $hooks, 'on_wp_head' ], 1000 );
		}

		// Level 5: Remove TEC's the_content filter if already registered.
		if ( class_exists( 'Tribe\Events\Views\V2\Template\Page' ) ) {
			$page = tribe( 'Tribe\Events\Views\V2\Template\Page' );
			remove_filter( 'the_content', [ $page, 'filter_hijack_page_content' ], 25 );
		}
	}

	/**
	 * Fallback: prevent TEC from filtering the_content when Brizy markup is present.
	 */
	public function the_content( $content ) {
		global $post;

		if ( ! $post || $post->post_type !== 'tribe_events' ) {
			return $content;
		}

		if ( false === strpos( $content, 'brz-root__container' ) ) {
			return $content;
		}

		if ( class_exists( 'Tribe\Events\Views\V2\Template\Page' ) ) {
			$page = tribe( 'Tribe\Events\Views\V2\Template\Page' );
			remove_filter( 'the_content', [ $page, 'filter_hijack_page_content' ], 25 );
		}

		return $content;
	}

	/**
	 * Dequeue TEC frontend scripts/styles when editing in Brizy to prevent conflicts.
	 */
	public function dequeueScripts() {
		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}

		wp_dequeue_style( 'tribe-events-views-v2-skeleton' );
		wp_dequeue_style( 'tribe-events-views-v2-full' );
		wp_dequeue_script( 'tribe-events-views-v2-manager' );
	}

	/**
	 * Register TEC custom post types as Brizy-editable.
	 */
	public function registerPostTypes( $types ) {
		$types[] = 'tribe_events';
		$types[] = 'tribe_venue';
		$types[] = 'tribe_organizer';

		return $types;
	}

	/**
	 * Register TEC dynamic content provider.
	 */
	public function registerProviders( $providers ) {
		$providers[] = new Brizy_Content_Providers_TecProvider();

		return $providers;
	}

	/**
	 * Register TEC module group for the editor sidebar.
	 */
	public function registerModuleGroups( $providers ) {
		$providers[] = new Brizy_Editor_Editor_ModuleGroups_TecProvider();

		return $providers;
	}

	/**
	 * Check if the current page is a TEC event where Brizy should take over rendering.
	 *
	 * Uses both tribe_is_event_query() (set by TEC on main query)
	 * and direct post type check (reliable on the 'wp' hook before TEC query manipulation).
	 */
	public function isEvent() {

		$isTecPostType = in_array( get_post_type(), [ 'tribe_events', 'tribe_venue', 'tribe_organizer' ], true );
		$isTecQuery    = function_exists( 'tribe_is_event_query' ) && tribe_is_event_query();

		if ( ! $isTecPostType && ! $isTecQuery ) {
			return false;
		}

		if ( Brizy_Public_Main::is_editing() ) {
			return true;
		}

		if ( Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() ) || Brizy_Admin_Templates::getTemplate() ) {
			return true;
		}

		return false;
	}
}
