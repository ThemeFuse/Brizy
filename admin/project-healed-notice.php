<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * Tells the site owner that the global project record was repaired. See BRZ-693.
 *
 * Brizy_Editor_ProjectHealer restores a project whose record lost its `data`
 * automatically, on a plain page load and with nobody watching. That is what
 * keeps the site working, but a silent repair is still a repair: the editor
 * presets that could not be recovered are gone, and the only honest thing to do
 * is to say so, name the backup row and let the owner decide whether to restore
 * an older copy instead.
 *
 * The notice is written by the healer, not by this class, so that the repair
 * itself stays independent of wp-admin and keeps working under WP-CLI and cron.
 */
class Brizy_Admin_ProjectHealedNotice {

	const DISMISS_ACTION = 'brizy-dismiss-project-healed-notice';

	/**
	 * @var Brizy_Admin_ProjectHealedNotice
	 */
	private static $instance;

	/**
	 * @return Brizy_Admin_ProjectHealedNotice
	 */
	public static function _init() {

		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self();
	}

	private function __construct() {
		add_action( 'admin_notices', array( $this, 'renderNotice' ) );
		add_action( 'admin_post_' . self::DISMISS_ACTION, array( $this, 'handleDismiss' ) );
	}

	/**
	 * @internal
	 */
	public function renderNotice() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$notice = get_option( Brizy_Editor_ProjectHealer::NOTICE_OPTION, array() );

		if ( ! is_array( $notice ) || empty( $notice['post_id'] ) ) {
			return;
		}

		$restored = isset( $notice['restored'] ) && is_array( $notice['restored'] ) ? $notice['restored'] : array();
		$kept     = isset( $notice['preserved'] ) && is_array( $notice['preserved'] ) ? $notice['preserved'] : array();
		$product  = __bt( 'brizy', 'Brizy' );

		?>
        <div class="notice notice-warning">
            <p>
				<?php
				printf(
				/* translators: %s: product name */
					esc_html__( '%s repaired its project settings automatically. The record that stores the global editor presets was missing or incomplete, which prevented every save - including license activation.', 'brizy' ),
					esc_html( $product )
				);
				?>
            </p>
			<?php if ( $restored ) : ?>
                <p>
					<?php
					printf(
					/* translators: %s: comma separated list of setting names */
						esc_html__( 'Reset to defaults: %s. Your pages and their content were not touched.', 'brizy' ),
						'<code>' . esc_html( implode( ', ', $restored ) ) . '</code>'
					);
					?>
                </p>
			<?php endif; ?>
			<?php if ( $kept ) : ?>
                <p>
					<?php
					printf(
					/* translators: %s: comma separated list of setting names */
						esc_html__( 'Kept as they were: %s.', 'brizy' ),
						'<code>' . esc_html( implode( ', ', $kept ) ) . '</code>'
					);
					?>
                </p>
			<?php endif; ?>
            <p>
				<?php
				printf(
				/* translators: 1: post meta key, 2: project post id */
					esc_html__( 'The previous value was copied to the %1$s post meta of project #%2$d before it was replaced, so it can still be inspected or restored.', 'brizy' ),
					'<code>' . esc_html( Brizy_Editor_ProjectHealer::BACKUP_META_KEY ) . '</code>',
					(int) $notice['post_id']
				);
				?>
            </p>
            <p>
                <a href="<?php echo esc_url( $this->dismissUrl() ); ?>" class="button">
					<?php esc_html_e( 'Got it', 'brizy' ); ?>
                </a>
            </p>
        </div>
		<?php
	}

	/**
	 * @internal
	 */
	public function handleDismiss() {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'brizy' ), '', array( 'response' => 403 ) );
		}

		check_admin_referer( self::DISMISS_ACTION );

		delete_option( Brizy_Editor_ProjectHealer::NOTICE_OPTION );

		wp_safe_redirect( wp_get_referer() ? wp_get_referer() : admin_url() );
		exit;
	}

	/**
	 * @return string
	 */
	private function dismissUrl() {
		return wp_nonce_url(
			add_query_arg( 'action', self::DISMISS_ACTION, admin_url( 'admin-post.php' ) ),
			self::DISMISS_ACTION
		);
	}
}
