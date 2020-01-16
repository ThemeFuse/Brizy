<?php


abstract class Brizy_Editor_Accounts_AbstractAccount extends Brizy_Admin_Serializable {

	const INTEGRATIONS_GROUP = 'form-integration';
	const RECAPTCHA_GROUP = 'recaptcha';
	const SOCIAL_GROUP = 'social';


	use Brizy_Editor_Forms_DynamicPropsAware;

	/**
	 * This will group the accounts
	 * ex: form-integration,
	 *     recaptcha
	 *     other implementations
	 *
	 *
	 * @return string
	 */
	abstract public function getGroup();

	/**
	 * This will return the service name for this account:
	 * ex: facebook, twitter, linkedin....
	 *
	 * @return mixed
	 */
	abstract public function getService();

	/**
	 * Brizy_Editor_Accounts_Account constructor.
	 *
	 * @param null $data
	 */
	public function __construct( $data = null ) {
		if ( is_array( $data ) ) {
			foreach ( $data as $key => $val ) {
				$this->set( $key, $val );
			}
		} else {
			$this->data = array();
		}

		if ( ! isset( $data['id'] ) ) {
			$this->set( 'id', md5( time() . rand( 0, 10000 ) ) );
		}

		$this->set( 'group', $this->getGroup() );
	}

	/**
	 * @param self $account
	 *
	 * @return bool
	 */
	public function isEqual( self $account ) {
		$aData = $account->convertToOptionValue();
		foreach ( $this->data as $key => $val ) {
			if ( $key == 'id' ) {
				continue;
			}
			if ( ! isset( $aData[ $key ] ) || $aData[ $key ] != $val ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @return array|null
	 */
	public function convertToAuthData() {

		$data = $this->data;

		unset( $data['id'] );
		unset( $data['group'] );
		unset( $data['service'] );

		return $data;
	}

	/**
	 * @param string[] $data
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 */
	public function setData( $data ) {
		$this->data = $data;

		return $this;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->jsonSerialize() );
	}

	/**
	 * @param $serialized
	 */
	public function unserialize( $serialized ) {
		$this->data = unserialize( $serialized );
	}

	/**
	 * @return array|mixed|null
	 */
	public function jsonSerialize() {
		return $this->data;
	}

	/**
	 * @return array|null
	 */
	public function convertToOptionValue() {
		return $this->data;
	}


	/**
	 * @param $data
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {

		if ( isset( $data['group'] ) )
			switch ( $data['group'] ) {
				default:
				case self::INTEGRATIONS_GROUP:
					return new Brizy_Editor_Accounts_Account( $data );
				case self::SOCIAL_GROUP:
					return new Brizy_Editor_Accounts_SocialAccount( $data );
				case self::RECAPTCHA_GROUP:
					return new Brizy_Editor_Accounts_RecaptchaAccount( $data );
			}

		throw new Exception( 'Invalid account group.' );
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception`
	 */
	public static function createFromJson( $json_obj ) {

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		if ( is_object( $json_obj ) ) {
			return self::createFromSerializedData( get_object_vars( $json_obj ) );
		}

		throw new Exception( 'Invalid json provided.' );
	}

	/**
	 * Some accounts may need advanced validation
	 *
	 * Ex: a request to an external api may be needed
	 *
	 * @return bool
	 */
	public function validate() {
		return true;
	}

}
