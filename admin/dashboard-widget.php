<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/22/18
 * Time: 11:18 AM
 */

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
			//'news'  => $this->renderNews(),
			'posts' => $this->renderBrizyPosts()
		) );
	}

	/**
	 * @return string
	 */
	private function renderNews() {
		return Brizy_Admin_View::render( 'dashboard-news', array() );
	}

	/**
	 * @return string
	 */
	private function renderBrizyPosts() {
		$query = array(
			'post_type'   => brizy()->supported_post_types(),
			'meta_query'  => 'brizy',
			'post_status' => array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit' ),
			'order'=>'DESC',
			'order_by'=>'ID'
		);

		$posts = get_posts( $query );

		return Brizy_Admin_View::render( 'dashboard-posts', array( 'posts' => $posts ) );
	}

}