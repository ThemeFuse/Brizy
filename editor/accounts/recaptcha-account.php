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
		return $this->get('sitekey');
	}

}
