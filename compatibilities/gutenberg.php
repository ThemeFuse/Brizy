<?php

class Brizy_Compatibilities_Gutenberg {

	public function __construct() {

		if ( ! function_exists( 'gutenberg_init' ) ) {
			return;
		}

		add_filter( 'the_content', array( $this, 'filter_the_content' ), 7 );
		add_action( 'admin_print_scripts-edit.php', array( $this, 'add_edit_button_to_gutenberg' ), 12 );
		add_action( 'admin_init', array( $this, 'action_disable_gutenberg' ) );
	}

	public function filter_the_content( $content ) {
		remove_filter( 'the_content', 'gutenberg_wpautop', 8 );

		return $content;
	}

	public function add_edit_button_to_gutenberg() {
		global $typenow;

		$new_post_url = add_query_arg( array(
			'action'    => 'brizy_new_post',
			'post_type' => $typenow,
		), set_url_scheme( admin_url( 'edit.php' ) ) );

		?>
		<script type="text/javascript">
			document.addEventListener('DOMContentLoaded', function () {
				var dropdown = document.querySelector('#split-page-title-action .dropdown');

				if (!dropdown) {
					return;
				}

				var url = '<?php echo esc_attr( $new_post_url ); ?>';

				dropdown.insertAdjacentHTML('afterbegin', '<a href="' + url + '">Brizy</a>');
			});
		</script>
		<?php
	}

	public function action_disable_gutenberg() {

		if ( ! isset( $_GET['post'] ) ) {
			return;
		}

		if ( in_array( get_post_type( $_GET['post'] ), Brizy_Editor::get()->supported_post_types() ) ) {

			try {
				Brizy_Editor_Post::get( $_GET['post'] )->uses_editor();
			} catch ( Exception $e ) {
				return;
			}

			add_filter( 'gutenberg_can_edit_post_type', '__return_false' );
		}
	}
}