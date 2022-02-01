<?php


class Brizy_Admin_DashboardWidget extends Brizy_Admin_AbstractWidget {

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
		return sprintf( __( '%s Overview', 'brizy' ), Brizy_Editor::get()->get_name() );
	}

	public function render() {
		try {
			$news = $this->getNews();
		} catch ( Exception $e ) {
			$news = $e->getMessage();
		}

		echo Brizy_Admin_View::render( 'dashboard', array(
			'news'  => Brizy_Admin_View::render( 'dashboard-news', [ 'news' => $news ] ),
			'posts' => $this->renderBrizyPosts()
		) );
	}

	/**
	 * @return array
	 * @throws Exception
	 */
	private function getNews() {

		$transient_key = 'brizy_feed_news';

		if ( ! ( $news = get_transient( $transient_key ) ) ) {

			$request = wp_remote_get( 'https://www.brizy.io/blog' );

			if ( is_wp_error( $request ) ) {
				throw new Exception( $request->get_error_message() );
			} elseif ( 200 !== wp_remote_retrieve_response_code( $request ) ) {
				throw new Exception( wp_remote_retrieve_response_message( $request ) );
			} elseif ( empty( $request['body'] ) ) {
				throw new Exception( esc_html__( 'There is no body in the remote server response.', 'brizy' ) );
			}

			$dom      = Brizy_Parser_Pquery::parseStr( $request['body'] );
			$news     = [];
			$titles   = $dom->query( '.wp-api-title' );
			$links    = $dom->query( '.wp-api-title .brz-a' );
			$excerpts = $dom->query( '.wp-api-excerpt' );

			if ( count( $titles ) !== 5 || count( $links ) !== 5 || count( $excerpts ) !== 5 ) {
				throw new Exception( __( 'Parsing failed!', 'brizy' ) );
			}

			foreach ( $titles as $title ) {
				$news[]['title'] = $title->getInnerText();
			}

			foreach ( $links as $i => $link ) {
				if ( isset( $news[ $i ] ) ) {
					$news[ $i ]['url'] = esc_url( 'https://www.brizy.io' . $link->getAttribute( 'href' ) );
				}
			}

			foreach ( $excerpts as $i => $excerpt ) {
				if ( isset( $news[ $i ] ) ) {
					$news[ $i ]['excerpt'] = wp_trim_words( wp_strip_all_tags( $excerpt->getInnerText() ), 40, '...' );
				}
			}

			set_transient( $transient_key, $news, 5 * DAY_IN_SECONDS );
		}

		return $news;
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
