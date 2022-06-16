<?php

class Brizy_Compatibilities_Gutenberg {

	public function __construct() {
		add_filter( 'the_content', array( $this, 'filter_the_content' ), 5 );
		add_action( 'admin_print_scripts-edit.php', array( $this, 'add_edit_button_to_gutenberg' ), 12 );
		add_action( 'admin_init', array( $this, 'action_disable_gutenberg' ) );
		add_action( 'admin_footer', array( $this, 'print_admin_footer_tpls' ) );
		add_action( 'admin_head', [ $this, 'admin_head' ] );
	}

	public function filter_the_content( $content ) {
		remove_filter( 'the_content', 'gutenberg_wpautop', 6 );

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
			if ( Brizy_Editor_Entity::isBrizyEnabled($_GET['post']) ) {
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

		try {
			if ( Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() ) ) {
				$edit_url = esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_disable&post=' . get_the_ID() ) );
				?>
                <script id="brizy-gutenberg-btn-switch-mode" type="text/html">
                    <div class="brizy-buttons">
                        <a class="brizy-button brizy-button--primary enable-brizy-editor" href="<?php echo $edit_url ?>">
                            <?php echo __( 'Back to WordPress Editor', 'brizy' ) ?>
                        </a>
                    </div>
                </script>
                <script id="brizy-gutenberg-btn-middle" type="text/html">
                    <div class="brizy-buttons brizy-buttons-gutenberg">
                        <a href="<?php echo Brizy_Editor_Entity::getEditUrl( get_the_ID() ); ?>" class="">
                            <div class="button button-primary button-large">
	                            <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                            </div>
                        </a>
                    </div>
                </script>

				<?php
			} else {
				$edit_url = esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_enable&post=' . get_the_ID() ) );

				?>
                <script id="brizy-gutenberg-btn-switch-mode" type="text/html">
                    <div class="brizy-buttons" >
                        <a href="<?php echo $edit_url;?>" class="button button-primary button-large">
                            <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                        </a>
                    </div>
                </script>
                <?php
			}
		} catch ( Exception $e ) {

		}
	}

	public function admin_head() {

		echo
			'<style>
			    .brizy-buttons .button::before {
				    -webkit-mask: url(' . __bt( 'brizy-logo', plugins_url( '../admin/static/img/brizy-logo.svg', __FILE__ ) ) . ') no-repeat center;
				    mask: url(' . __bt( 'brizy-logo', plugins_url( '../admin/static/img/brizy-logo.png', __FILE__ ) ) . ') no-repeat center;
				    mask-size: contain;
                    -webkit-mask-size: contain;
			    }' .
		    '</style>';
	}
}
