<?php


class Brizy_Public_ComponentsApi extends Brizy_Admin_AbstractApi {

	const AJAX_GET_DATA = 'brizy-get-component-data';

	/**
	 * @return null
	 */
	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	/**
	 * Brizy_Public_Component constructor.
	 */
	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::AJAX_GET_DATA, array( $this, 'actionGetThirdPartyData' ) );
	}

	public function actionGetThirdPartyData() {


		if ( ! $this->param( 'v' ) ) {
			$this->error( 400, 'Invalid V' );
		}

		if ( ! $this->param( 'id' ) ) {
			$this->error( 400, 'Invalid component' );
		}


		$id      = $this->param( 'id' );
		$v       = json_decode( stripslashes( $this->param( 'v' ) ), true );
		$context = new Brizy_Editor_Components_Context();
		$context->setV( $v );

		$component = Brizy_Public_Components::instance()->getComponent($id);

		if($component) {
			$component->setContext( $context );
			$data = $component->getData();
			$this->success( $data );
		}
		$this->error( '404', 'Component not found.' );
	}

}