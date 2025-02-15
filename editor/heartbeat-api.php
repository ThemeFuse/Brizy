<?php

class Brizy_Editor_HeartbeatAPI extends Brizy_Admin_AbstractApi {

	const AJAX_HEARTBEAT = '_heartbeat';

	/**
	 * Brizy_Editor_API constructor.
	 *
	 * @param  Brizy_Editor_Project  $project
	 * @param  Brizy_Editor_Post  $post
	 */
	public function __construct() {

		parent::__construct();
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_nopriv_' . Brizy_Editor::prefix( '_heartbeat' ), array( $this, 'heartbeat' ) );
	}

	public function heartbeat() {
		$user = wp_get_current_user();

		if ( $user && $user->ID === 0 ) {
			$this->success( [
				'wp-auth-check' => is_user_logged_in(),
			] );
		}

        if ( $user && $user->ID !== 0 && ! wp_verify_nonce( $this->getRequestNonce(), Brizy_Editor_API::nonce ) ) {
			$this->success( [
				'updateHash' => wp_create_nonce( Brizy_Editor_API::nonce ),
			] );
		}

        $this->validateEditorVersion();

		if ( Brizy_Editor::get()->checkIfProjectIsLocked() === false ) {
			Brizy_Editor::get()->lockProject();
		}

        $editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), null );

		$this->success( $editor->getProjectStatus() );
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}
}
