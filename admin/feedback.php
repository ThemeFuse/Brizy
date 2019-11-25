<?php defined( 'ABSPATH' ) or die();

class Brizy_Admin_Feedback {

	/**
	 * Brizy_Admin_Feedback constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_brizy-dismiss-notice', [ $this, 'ajax_dismiss_notice' ] );
		add_action( 'wp_ajax_brizy-send-feedback', [ $this, 'ajax_send_feedback' ] );
		add_action( 'admin_notices', [ $this, 'admin_notices' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
		add_action( 'admin_footer', [ $this, 'admin_footer' ] );
	}

	public function admin_notices() {

	    if ( 'dismissed' == get_user_meta( get_current_user_id(), 'brizy-notice-rating', true ) || get_transient( 'brizy-notice-rating' ) ) {
	        return;
        }

		?>
		<div class="brz-notice notice is-dismissible">
			<div class="brz-notice-container">
				<div class="brz-notice-image">
                    <img src="<?php echo plugins_url( 'static/img/logo.svg', __FILE__ ) ?>" alt="brizy-logo">
				</div>
				<div class="brz-notice-content">
					<div class="brz-notice-heading">
						<?php esc_html_e( 'Hello! Seems like you are using Brizy to build your website - Thanks a lot!', 'brizy' ); ?>
					</div>
					<?php esc_html_e( 'Could you please do us a BIG favor and give it a 5-star rating on WordPress? This would boost our motivation and help other users make a comfortable decision while choosing the Brizy plugin.', 'brizy' ); ?>
					<br/>
					<div class="brz-review-notice-container">
						<a href="https://wordpress.org/support/plugin/brizy/reviews/?filter=5#new-post" class="brz-review-deserve button-primary" target="_blank">
							<?php esc_html_e( 'Ok, you deserve it', 'brizy' ); ?>
						</a>
						<span class="dashicons dashicons-calendar"></span>
						<a href="#" class="brz-review-later">
							<?php esc_html_e( 'Nope, maybe later', 'brizy' ); ?>
						</a>
						<span class="dashicons dashicons-smiley"></span>
						<a href="#" class="brz-review-done">
							<?php esc_html_e( 'I already did', 'brizy' ); ?>
						</a>
					</div>
				</div>
			</div>
		</div>

		<?php
	}

	public function ajax_dismiss_notice() {

		check_ajax_referer( 'brizy-admin-nonce', 'nonce' );

		if ( $_POST['repeat'] == 'true' ) {
			set_transient( 'brizy-notice-rating', true, WEEK_IN_SECONDS );
		} else {
			update_user_meta( get_current_user_id(), 'brizy-notice-rating', 'dismissed' );
		}

		wp_send_json_success();
	}

	public function ajax_send_feedback() {

		check_ajax_referer( 'brizy-admin-nonce', 'nonce' );

		parse_str( $_POST['form'], $form );

		$reason_key = $form['reason_key'];

		$body = [
			'version'      => BRIZY_VERSION,
			'site_lang'    => get_bloginfo( 'language' ),
			'feedback_key' => $reason_key
		];

		if ( ! empty( $form[ 'reason_' . $reason_key ] ) ) {
			$body['feedback'] = sanitize_text_field( $form[ 'reason_' . $reason_key ] );
        }

		wp_remote_post( 'http://test.themefuse.com/', [
			'timeout' => 30,
			'body'    => $body,
		] );

		wp_send_json_success();
	}

	public function admin_enqueue_scripts() {

		if ( ! $this->is_plugins_page() ) {
			return;
		}

		wp_enqueue_script( 'jquery-ui-dialog' );
		wp_enqueue_style( 'wp-jquery-ui-dialog' );
	}

	public function admin_footer() {

	    if ( ! $this->is_plugins_page() ) {
	        return;
        }

		$deactivate_reasons = [
			'no_longer_needed' => [
				'title' => __( 'I no longer need the plugin', 'brizy' ),
				'input_placeholder' => '',
			],
			'found_a_better_plugin' => [
				'title' => __( 'I found a better plugin', 'brizy' ),
				'input_placeholder' => __( 'Please share which plugin', 'brizy' ),
			],
			'couldnt_get_the_plugin_to_work' => [
				'title' => __( 'I couldn\'t get the plugin to work', 'brizy' ),
				'input_placeholder' => '',
			],
			'temporary_deactivation' => [
				'title' => __( 'It\'s a temporary deactivation', 'brizy' ),
				'input_placeholder' => '',
			],
			'brizy_pro' => [
				'title' => __( 'I have Brizy Pro', 'brizy' ),
				'input_placeholder' => '',
				'alert' => __( 'Wait! Don\'t deactivate Brizy. You have to activate both Brizy and Brizy Pro in order for the plugin to work.', 'brizy' ),
			],
			'other' => [
				'title' => __( 'Other', 'brizy' ),
				'input_placeholder' => __( 'Please share the reason', 'brizy' ),
			],
		];

		?>

        <div id="brz-deactivate-feedback-dialog" class="hidden">
            <div class="brz-deactivate-feedback-dialog-header">
                <img class="brz-deactivate-feedback-dialog-logo" src="<?php echo plugins_url( 'static/img/logo.svg', __FILE__ ) ?>" alt="brizy-logo">
                <span class="brz-deactivate-feedback-dialog-header-title"><?php echo __( 'Quick Feedback', 'brizy' ); ?></span>
            </div>
            <form class="brz-deactivate-feedback-dialog-form" method="post">
                <div class="brz-deactivate-feedback-dialog-form-caption">
                    <?php echo __( 'If you have a moment, please share why you are deactivating Brizy:', 'brizy' ); ?>
                </div>
                <div class="brz-deactivate-feedback-dialog-form-body">
			        <?php foreach ( $deactivate_reasons as $reason_key => $reason ) : ?>
                        <div class="brz-deactivate-feedback-dialog-input-wrapper">
                            <input id="brz-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="brz-deactivate-feedback-dialog-input" type="radio" name="reason_key" value="<?php echo esc_attr( $reason_key ); ?>" />
                            <label for="brz-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="brz-deactivate-feedback-dialog-label"><?php echo esc_html( $reason['title'] ); ?></label>
					        <?php if ( ! empty( $reason['input_placeholder'] ) ) : ?>
                                <input class="brz-feedback-text hidden" type="text" name="reason_<?php echo esc_attr( $reason_key ); ?>" placeholder="<?php echo esc_attr( $reason['input_placeholder'] ); ?>" />
					        <?php endif; ?>
					        <?php if ( ! empty( $reason['alert'] ) ) : ?>
                                <div class="brz-feedback-text-alert brz-feedback-text hidden"><?php echo esc_html( $reason['alert'] ); ?></div>
					        <?php endif; ?>
                        </div>
			        <?php endforeach; ?>
                </div>
            </form>
        </div>
		<?php
	}

	private function is_plugins_page() {
		global $pagenow;

		return 'plugins.php' === $pagenow;
    }
}
