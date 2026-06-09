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

        $nonce = wp_create_nonce( 'brizy-admin-nonce' );

		try {
			if ( Brizy_Editor_Entity::isBrizyEnabled( get_the_ID() ) ) {
				$edit_url = esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_disable&post=' . get_the_ID() . '&hash=' . $nonce ) );
				?>
                <script id="brizy-gutenberg-btn-switch-mode" type="text/html">
                    <div class="brizy-buttons">
                        <a class="brizy-button brizy-button--primary enable-brizy-editor" href="<?php echo $edit_url ?>">
                            <?php echo __( 'Back to WordPress Editor', 'brizy' ) ?>
                        </a>
                    </div>
                    <?php $this->admin_head(); ?>
                </script>
                <script id="brizy-gutenberg-btn-middle" type="text/html">
                    <div class="brizy-buttons brizy-buttons-gutenberg">
                        <a href="<?php echo Brizy_Editor_Entity::getEditUrl( get_the_ID() ); ?>" class="">
                            <div class="button button-primary button-large">
	                            <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                            </div>
                        </a>
                    </div>
                    <?php $this->admin_head(); ?>
                </script>

				<?php
			} else {
				$edit_url = esc_url( admin_url( 'admin-post.php?action=_brizy_admin_editor_enable&post=' . get_the_ID() . '&hash=' . $nonce ) );

				?>
                <script id="brizy-gutenberg-btn-switch-mode" type="text/html">
                    <div class="brizy-buttons" >
                        <a href="<?php echo $edit_url;?>" class="button button-primary button-large">
                            <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                        </a>
                    </div>
                    <?php $this->admin_head(); ?>
                </script>
                <?php
			}
		} catch ( Exception $e ) {

		}

		$ai_button_label = __( 'Generate With', 'brizy' ) . ' ' . __bt( 'brizy', 'Brizy' ) . ' - ' . __( 'AI', 'brizy' );
		?>
		<script id="brizy-ai-btn-tpl" type="text/html">
			<a class="brz-ai-button js-open-ai-selection-modal" href="#" title="<?php echo esc_attr( $ai_button_label ); ?>">
				<span><?php echo esc_html( $ai_button_label ); ?></span>
				<span class="brz-ai-button-icon">
					<svg width="12" height="12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-1149, -610)" fill="currentColor" fill-rule="nonzero">
								<path d="M1154.33333,615.333333 C1154.82425,615.333333 1155.22222,615.731302 1155.22222,616.222222 C1155.22222,617.757576 1157.24242,619.777778 1158.77778,619.777778 C1159.2687,619.777778 1159.66667,620.175747 1159.66667,620.666667 C1159.66667,621.157586 1159.2687,621.555556 1158.77778,621.555556 C1157.0778,621.555556 1155.35817,623.34172 1155.22222,625.111111 C1155.18461,625.600588 1154.82425,626 1154.33333,626 C1153.84241,626 1153.4917,625.599751 1153.44444,625.111111 C1153.28133,623.424557 1151.19734,621.676618 1149.88889,621.555556 C1149.40006,621.510327 1149,621.157586 1149,620.666667 C1149,620.175747 1149.39797,619.777778 1149.88889,619.777778 C1151.61422,619.777778 1153.30894,617.628929 1153.44444,616.222222 C1153.49152,615.733564 1153.84241,615.333333 1154.33333,615.333333 Z M1162.57576,620.666667 C1162.91048,620.666667 1163.18182,620.938009 1163.18182,621.272727 C1163.18182,621.942163 1163.7245,622.484848 1164.39394,622.484848 C1164.72866,622.484848 1165,622.756191 1165,623.090909 C1165,623.425627 1164.72866,623.69697 1164.39394,623.69697 C1163.7245,623.69697 1163.18182,624.239655 1163.18182,624.909091 C1163.18182,625.243809 1162.91048,625.515152 1162.57576,625.515152 C1162.24104,625.515152 1161.9697,625.243809 1161.9697,624.909091 C1161.9697,624.239655 1161.42701,623.69697 1160.75758,623.69697 C1160.42286,623.69697 1160.15152,623.425627 1160.15152,623.090909 C1160.15152,622.756191 1160.42286,622.484848 1160.75758,622.484848 C1161.42701,622.484848 1161.9697,621.942163 1161.9697,621.272727 C1161.9697,620.938009 1162.24104,620.666667 1162.57576,620.666667 Z M1161.12121,610 C1161.65676,610 1161.91933,610.462379 1162.09091,610.969697 C1162.34915,611.733218 1163.37568,612.741286 1164.0303,612.909091 C1164.54908,613.042073 1165,613.343239 1165,613.878788 C1165,614.414337 1164.52882,614.652798 1164.0303,614.848485 C1163.50538,615.054537 1162.33869,616.084555 1162.09091,616.787879 C1161.91295,617.292997 1161.65676,617.757576 1161.12121,617.757576 C1160.58566,617.757576 1160.28335,617.306947 1160.15152,616.787879 C1159.97518,616.093614 1158.79726,614.979278 1158.21212,614.848485 C1157.68947,614.731659 1157.24242,614.414337 1157.24242,613.878788 C1157.24242,613.343239 1157.67657,612.909091 1158.21212,612.909091 C1158.83402,612.909091 1160.15152,611.584791 1160.15152,610.969697 C1160.15152,610.434148 1160.58566,610 1161.12121,610 Z M1151.90909,610 C1152.24381,610 1152.61095,610.283523 1152.70042,610.606061 C1152.88569,611.273913 1152.97759,611.4145 1153.73018,611.680868 C1154.04572,611.792548 1154.33333,612.089524 1154.33333,612.424242 C1154.33333,612.75896 1154.175,613.033142 1153.87085,613.172892 C1153.25209,613.457201 1152.88996,613.659113 1152.70042,614.242424 C1152.59698,614.560759 1152.24381,614.848485 1151.90909,614.848485 C1151.57437,614.848485 1151.13069,614.556681 1151.01546,614.242424 C1150.76381,613.556152 1150.41724,613.556152 1149.90086,613.172892 C1149.63209,612.973403 1149.48485,612.75896 1149.48485,612.424242 C1149.48485,612.089524 1149.771,611.779338 1150.09091,611.680868 C1150.87902,611.43828 1150.87902,611.192034 1151.14202,610.606061 C1151.27908,610.300691 1151.57437,610 1151.90909,610 Z"></path>
							</g>
						</g>
					</svg>
				</span>
			</a>
		</script>
		<?php
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
