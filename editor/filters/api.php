<?php

class Brizy_Editor_Filters_Api extends Brizy_Admin_AbstractApi {

	const AJAX_FILTER = 'asss';

	protected function initializeApiActions() {
		if ( ! Brizy_Editor_User::is_user_allowed() ) {
			return;
		}
		$this->addAjaxAction( self::AJAX_FILTER, array( $this, 'removeProjectLock' ) );
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}
}
