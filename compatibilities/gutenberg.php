<?php

class Brizy_Compatibilities_Gutenberg {

	public function __construct() {
		add_filter( 'the_content', array( $this, 'filter_the_content' ), 7 );
		add_action( 'admin_print_scripts-edit.php', array( $this, 'add_edit_button_to_gutenberg' ), 12 );
		add_action( 'admin_init', array( $this, 'action_disable_gutenberg' ) );
		add_action( 'admin_footer', array( $this, 'print_admin_footer_tpls' ) );
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

		global $pagenow;

		if ( ! in_array( $pagenow, array( 'post-new.php', 'post.php' ) ) || ! isset( $_GET['post'] ) ) {
			return;
		}

		if ( ! in_array( get_post_type( $_GET['post'] ), Brizy_Editor::get()->supported_post_types() ) ) {
			return;
		}

		try {
			if ( Brizy_Editor_Post::get( $_GET['post'] )->uses_editor() ) {
				add_filter( 'gutenberg_can_edit_post_type', '__return_false' );
			}
		} catch ( Exception $e ) {
			return;
		}
	}

	public function print_admin_footer_tpls() {

        global $pagenow;

        if ( ! in_array( $pagenow, array( 'post-new.php', 'post.php' ) ) ) {
            return;
        }

		if ( ! in_array( get_post_type(), Brizy_Editor::get()->supported_post_types() ) ) {
		    return;
		}

		$log_dir  = BRIZY_PLUGIN_URL . '/admin/static/img/';
		$edit_url = esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_enable&post=' . get_the_ID() ) );

		echo
			'<script id="brizy-gutenberg-btn-switch-mode" type="text/html">
                <div class="brizy-buttons" style="margin-top:15px;">
                    <a class="brizy-button brizy-button--primary enable-brizy-editor" type="button" href="' . $edit_url . '" style="padding:5px 27px 5px;">' .
                        esc_html__( 'Edit with', 'brizy' ) .
                        '<img src="' . $log_dir . 'brizy.png" srcset="' . $log_dir . 'brizy.png' . ' 1x, ' . $log_dir . 'brizy-2x.png 2x" class="brizy-logo">
                     </a>
                </div>
            </script>';
	}
}