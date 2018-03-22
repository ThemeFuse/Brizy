<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/22/18
 * Time: 11:18 AM
 */

class Brizy_Admin_Widget extends Brizy_Admin_AbstractWidget {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	public function getId() {
		return 'dashboard';
	}

	public function getName() {
		return Brizy_Editor::get()->get_name() . " Overview";
	}

	public function render() {
		$this->renderNews();
		$this->renderBrizyPosts();
	}

	private function renderNews() {

	}

	private function renderBrizyPosts() {
		$query = array(
			'post_type'  => 'any',
			'meta_query' => 'brizy'
		);

		$posts = get_posts( $query );

		?>
        <h3><b>Latest created posts</b></h3>
        <ul>
			<?php
			foreach ( $posts as $apost ) {

				try {
					$brizy_post = Brizy_Editor_Post::get( $apost );

					if(!$brizy_post->uses_editor()) continue;

					$link = add_query_arg(
						array( Brizy_Editor_Constants::EDIT_KEY => '' ),
						get_permalink( $apost )
					);

					?>
                    <li>
                        <a href="<?php echo $link; ?>">
							<?php echo get_the_title( $apost ) ?>
                        </a>
                    </li>
					<?php
				} catch ( Exception $e ) {
			        // ignore
				}

			}
			?>
        </ul>
		<?php
	}

}