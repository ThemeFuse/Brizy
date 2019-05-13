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
		$news = [
			[
				'url'     => 'https://www.brizy.io/blog/white-label/',
				'badge'   => 'new',
				'title'   => 'Brizy Pro 0.0.20: White Label',
				'excerpt' => 'Hydrogen is HERE :P. Just kidding, but if you had a company named Hydrogen you’d love our new White Label feature we just added in Brizy PRO.',
			],
			[
				'url'     => 'https://www.brizy.io/blog/keyboard-shortcuts/',
				'badge'   => 'new',
				'title'   => 'Keyboard Shortcuts are Here',
				'excerpt' => 'Starting today you’ll be creating client websites with Brizy even faster if that’s possible. We’ve added a bunch of keyboard shortcuts that will improve the speed you work with Brizy and make your life much easier when it comes to copy-pasting styles, duplicating content and more.',
			],
			[
				'url'     => 'https://www.brizy.io/blog/new-premium-layout-packs/',
				'badge'   => 'new',
				'title'   => 'Brizy Pro 0.0.19: 17 new premium layout packs ',
				'excerpt' => 'In our continuous effort to make Brizy the tool of choice when it comes to building stunning websites, I’d glad to tell you that we’ve just added 17 new premium layout packs that will let you kick start client websites in minutes. That is another 99 layouts on top of the 56 we already have.',
			],
		];

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

				$brizy_post = Brizy_Editor_Post::get( $apost );

				if ( ! $brizy_post->uses_editor() ) {
					continue;
				}

				$brizy_posts[] = [
					'edit_url' => add_query_arg( [ Brizy_Editor_Constants::EDIT_KEY => '' ], get_permalink( $apost ) ),
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