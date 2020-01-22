<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 11/20/18
 * Time: 4:48 PM
 */

class Brizy_Editor_Forms_GmailSmtpIntegration extends Brizy_Editor_Forms_SmtpIntegration {

	/**
	 * Brizy_Editor_Forms_WordpressIntegration constructor.
	 */
	public function __construct() {
		$this->id             = 'gmail_smtp';
		$this->host           = 'smtp.gmail.com';
		$this->port           = 465;
		$this->encryption     = 'ssl';
		$this->authentication = true;
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration|null
	 */
	public static function createFromJson( $json_obj ) {
		$instance = null;
		if ( is_object( $json_obj ) ) {
			$instance = new self();

			self::populateInstanceDataFromJson( $instance, $json_obj );

			if ( isset( $json_obj->emailTo ) ) {
				$instance->setEmailTo( trim( $json_obj->emailTo ) );
			}

			if ( isset( $json_obj->subject ) ) {
				$instance->setSubject( trim( $json_obj->subject ) );
			}

			if ( isset( $json_obj->username ) ) {
				$instance->setUsername( trim( $json_obj->username ) );
			}
			if ( isset( $json_obj->password ) ) {
				$instance->setPassword( trim( $json_obj->password ) );
			}
		}

		return $instance;
	}

	public static function createFromSerializedData( $data, $instance = null ) {
		if ( is_null( $instance ) ) {
			$instance = new self();
		}

		$instance = parent::createFromSerializedData( $data, $instance );

		return $instance;
	}
}
