<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 11/26/18
 * Time: 5:00 PM
 */

class Brizy_Editor_Accounts_RecaptchaAccount extends Brizy_Editor_Accounts_AbstractAccount {

	const SERVICE_NAME = 'recaptcha';

	/**
	 * @return mixed
	 */
	public function getGroup() {
		return Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP;
	}

	/**
	 * @return mixed
	 */
	public function getService() {
		return self::SERVICE_NAME;
	}

	/**
	 * @param $data
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {

		$data['group']   = Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP;
		$data['service'] = self::SERVICE_NAME;

		return Brizy_Editor_Accounts_AbstractAccount::createFromSerializedData( $data );
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception
	 */
	public static function createFromJson( $json_obj ) {

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		if ( is_object( $json_obj ) ) {
			$json_obj->group   = Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP;
			$json_obj->service = self::SERVICE_NAME;

			return Brizy_Editor_Accounts_AbstractAccount::createFromSerializedData( get_object_vars( $json_obj ) );
		}

		throw new Exception( 'Invalid json provided.' );
	}

	public function getSiteKey() {
		return $this->get( 'sitekey' );
	}

	/**
	 * @throws Exception
	 */
	public function validate() {

		if ( ! isset( $_REQUEST['secretkey'] ) ) {
			throw new Exception( 'Invalid secret provided' );
		}

		if ( ! isset( $_REQUEST['response'] ) ) {
			throw new Exception( 'Invalid response provided' );
		}

		$http     = new WP_Http();
		$response = $http->post( 'https://www.google.com/recaptcha/api/siteverify', array(
			'body' => array(
				'secret'   => $_REQUEST['secretkey'],
				'response' => $_REQUEST['response']
			)
		) );

		$body = wp_remote_retrieve_body( $response );

		$responseJsonObject = json_decode( $body );

		if ( ! is_object( $responseJsonObject ) || ! $responseJsonObject->success ) {
			throw new Exception( "Unable to validate account" );
		}

		return true;
	}


}
