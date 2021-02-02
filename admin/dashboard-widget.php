<?php


class Brizy_Admin_DashboardWidget extends Brizy_Admin_AbstractWidget {

	/**
	 * @throws Exception
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	public function __construct() {
		parent::__construct();

		global $wp_meta_boxes;

		$dashboard = $wp_meta_boxes['dashboard']['normal']['core'];
		$widget_id = $this->internalGetId();
		$ours      = [
			$widget_id => $dashboard[ $widget_id ],
		];

		$wp_meta_boxes['dashboard']['normal']['core'] = array_merge( $ours, $dashboard );
	}

	/**
	 * @return string
	 */
	public function getId() {
		return 'dashboard';
	}

	/**
	 * @return string
	 */
	public function getName() {
		return Brizy_Editor::get()->get_name() . " Overview";
	}

	public function render() {
		echo Brizy_Admin_View::render( 'dashboard', array(
			'news'  => $this->renderNews(),
			'posts' => $this->renderBrizyPosts()
		) );
	}

	/**
	 * @return string
	 */
	private function renderNews() {

		$transient_key = 'brizy_feed_news';

		if ( ! ( $news = get_transient( $transient_key ) ) ) {

			$request = wp_remote_get( 'https://www.brizy.io/index.php/wp-json/wp/v2/posts?categories=6' );

			if ( is_wp_error( $request ) ) {

				return $request->get_error_message();

			} elseif ( ! isset( $request['response'], $request['response']['code'] ) || ! is_array( $request['response'] ) ) {

				return esc_html__( 'Something went wrong. There is no a valid response code.', 'brizy' );

			} elseif ( 200 !== $request['response']['code'] ) {

				if ( isset( $request['response']['message'] ) ) {
					return $request['response']['message'];
				} else {
					return esc_html__( 'The request was blocked, or something is wrong with the remote server.', 'brizy' );
				}

			} elseif ( empty( $request['body'] ) ) {
				return esc_html__( 'There is no body in the remote server response.', 'brizy' );
			}

			$items = json_decode( $request['body'], true );

			if ( ! $items ) {
				return esc_html__( 'Filed decode returned json by brizy.io', 'brizy' );
			}

			$news = [];

			foreach ( array_slice( $items, 0, 3 ) as $item ) {
				$news[] = [
					'url'     => $item['link'],
					'title'   => $item['title']['rendered'],
					'excerpt' => $item['excerpt']['rendered'],
				];
			}

			set_transient( $transient_key, $news, 2 * DAY_IN_SECONDS );
		}

		return Brizy_Admin_View::render( 'dashboard-news', [ 'news' => $news ] );
	}

	/**
	 * @return string
	 */
	private function renderBrizyPosts() {

		$query = array(
			'post_type'   => array_diff( Brizy_Editor::get()->supported_post_types(), [ 'brizy-global-block', 'brizy-saved-block', 'brizy-global-block' ] ),
			'post_status' => [ 'publish', 'draft' ],
			'meta_key'    => 'brizy',
			'orderby'     => 'modified'
		);

		$posts       = get_posts( $query );
		$brizy_posts = [];

		foreach ( $posts as $apost ) {
			try {
				if ( ! Brizy_Editor_Entity::isBrizyEnabled( $apost ) ) {
					continue;
				}

				$brizy_posts[] = [
					'edit_url' => add_query_arg( [ Brizy_Editor::prefix('-edit') => '' ], get_permalink( $apost ) ),
					'title'    => get_the_title( $apost ),
					'date'     => get_the_modified_date( '', $apost )
				];

				if ( 6 === count( $brizy_posts ) ) {
					break;
				}

			} catch ( Exception $e ) {
				continue;
			}
		}

		return Brizy_Admin_View::render( 'dashboard-posts', array( 'posts' => $brizy_posts ) );
	}
}
