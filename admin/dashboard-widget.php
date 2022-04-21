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

		if ( ! extension_loaded( 'dom' ) || ! extension_loaded( 'libxml' ) ) {
			throw new Exception( 'In order to see these news you need to activate the php dom and libxml extensions' );
		}

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

			$news = [];
			$doc  = new DOMDocument();

			libxml_use_internal_errors( true );

			$doc->loadHTML( $request['body'] );

			$xpath = new DOMXpath( $doc );
			$items = $xpath->query( "//*[contains(@class, 'brz-posts__item')]" );

			$getItem = function( $contextNode, $class ) use ( $xpath ) {
				$childs = $xpath->query( ".//*[contains(@class, '{$class}')]", $contextNode );

				if ( ! $childs || $childs->length === 0 ) {
					throw new Exception( sprintf(
						__( '%1$s failed to extract the latest news. Please contact our %2$ssupport%3$s.', 'brizy' ),
						ucfirst( __bt( 'brizy', 'Brizy' ) ),
						'<a href="' . apply_filters( 'brizy_support_url', Brizy_Config::getSupportUrl() ) . '">',
						'</a>'
					) );
				}

				return $childs->item( 0 );
			};

			foreach ( $items as $item ) {
				$title   = $getItem( $item, 'wp-api-title' );
				$link    = $getItem( $title, 'brz-a' );
				$href    = $link->attributes->getNamedItem( 'href' )->nodeValue;
				$excerpt = $getItem( $item, 'wp-api-excerpt' );

				$news[] = [
					'title'   => $title->textContent,
					'url'     => esc_url( 'https://www.brizy.io' . $href ),
					'excerpt' => wp_trim_words( wp_strip_all_tags( $excerpt->textContent ), 40, '...' ),
				];
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
