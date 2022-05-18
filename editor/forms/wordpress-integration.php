<?php


class Brizy_Editor_Forms_WordpressIntegration extends Brizy_Editor_Forms_AbstractIntegration {

	/**
	 * @var string
	 */
	protected $emailTo;

	/**
	 * @var string
	 */
	protected $subject;

	/**
	 * @var string
	 */
	protected $fromEmail;

	/**
	 * @var string
	 */
	protected $fromName;

	/**
	 * @var string
	 */
	protected $replayTo;

	/**
	 * @var string
	 */
	protected $cc;

	/**
	 * @var string
	 */
	protected $bcc;

	/**
	 * @var string
	 */
	protected $metaData;

	/**
	 * Brizy_Editor_Forms_WordpressIntegration constructor.
	 */
	public function __construct() {
		parent::__construct( 'wordpress' );
	}

	/**
	 * @param Brizy_Editor_Forms_Form $form
	 * @param $fields
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function handleSubmit( Brizy_Editor_Forms_Form $form, $fields ) {

		$this->exception = null;
		///$recipients = explode( ',', $this->getEmailTo() );

		$headers   = array();
		$headers[] = 'Content-type: text/html; charset=UTF-8';

		if ( $this->getCc() ) {
			$headers[] = "Cc: {$this->getCc()}";
		}

		if ( $this->getBcc() ) {
			$headers[] = "Bcc: {$this->getBcc()}";
		}

		if ( $this->getReplayTo() ) {
			$replay_to = apply_filters( 'brizy_replay_to', $this->getReplayTo(), $fields, $form );
			$headers[] = "Reply-To: {$replay_to}";
		}

		if ( $this->getFromEmail() ) {
			$fromName = '';
			if ( $this->getFromName() ) {
				$headers[] = "From: \"{$this->getFromName()}\" <{$this->getFromEmail()}>";
			} else {
				$headers[] = "From: {$this->getFromEmail()}";
			}
		}

//		$field_string = array();
//		foreach ( $fields as $field ) {
//			$field_string[] = "{$field->label}: " . esc_html( $field->value );
//		}

		$email_body = $form->getEmailTemplateContent( $fields );

		$headers       = apply_filters( 'brizy_form_email_headers', $headers, $fields, $form );
		$email_body    = apply_filters( 'brizy_form_email_body', $email_body, $fields, $form );
		$email_subject = apply_filters( 'brizy_form_email_subject', $this->getSubject(), $fields, $form );

		$email_body = $this->insertMetaDataFields( $email_body );

		if ( ! function_exists( 'wp_mail' ) ) {
			throw new Exception( 'Please check your wordpress configuration.' );
		}

		return wp_mail(
            apply_filters( 'brizy_form_email_to', $this->getEmailTo(), $fields, $form ),
			$email_subject,
			$email_body,
			$headers
		);
	}

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {

		$get_object_vars = parent::jsonSerialize();

		$get_object_vars['emailTo']   = $this->getEmailTo();
		$get_object_vars['subject']   = $this->getSubject();
		$get_object_vars['fromEmail'] = $this->getFromEmail();
		$get_object_vars['fromName']  = $this->getFromName();
		$get_object_vars['replayTo']  = $this->getReplayTo();
		$get_object_vars['cc']        = $this->getCc();
		$get_object_vars['bcc']       = $this->getBcc();
		$get_object_vars['metaData']  = $this->getMetaData();

		return $get_object_vars;
	}

	static public function createFromSerializedData( $data, $instance = null ) {

		if ( is_null( $instance ) ) {
			$instance = new self();
		}

		if ( isset( $data['completed'] ) ) {
			$instance->setCompleted( $data['completed'] );
		}

		if ( isset( $data['emailTo'] ) ) {
			$instance->setEmailTo( $data['emailTo'] );
		}

		if ( isset( $data['subject'] ) ) {
			$instance->setSubject( $data['subject'] );
		}

		if ( isset( $data['fromEmail'] ) ) {
			$instance->setFromEmail( $data['fromEmail'] );
		}

		if ( isset( $data['fromName'] ) ) {
			$instance->setFromName( $data['fromName'] );
		}

		if ( isset( $data['replayTo'] ) ) {
			$instance->setReplayTo( $data['replayTo'] );
		}

		if ( isset( $data['cc'] ) ) {
			$instance->setCc( $data['cc'] );
		}

		if ( isset( $data['bcc'] ) ) {
			$instance->setBcc( $data['bcc'] );
		}

		if ( isset( $data['metaData'] ) ) {
			$instance->setMetaData( $data['metaData'] );
		}

		return $instance;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->jsonSerialize() );
	}

	/**
	 * @return string
	 */
	public function getEmailTo() {
		return $this->emailTo;
	}

	/**
	 * @param string $emailTo
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setEmailTo( $emailTo ) {
		$this->emailTo = $emailTo;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSubject() {
		return $this->subject;
	}

	/**
	 * @param string $subject
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setSubject( $subject ) {
		$this->subject = $subject;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getFromEmail() {
		return $this->fromEmail;
	}

	/**
	 * @param string $fromEmail
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setFromEmail( $fromEmail ) {
		$this->fromEmail = $fromEmail;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getFromName() {
		return $this->fromName;
	}

	/**
	 * @param string $fromName
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setFromName( $fromName ) {
		$this->fromName = $fromName;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getReplayTo() {
		return $this->replayTo;
	}

	/**
	 * @param string $replayTo
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setReplayTo( $replayTo ) {
		$this->replayTo = $replayTo;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getCc() {
		return $this->cc;
	}

	/**
	 * @param string $cc
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setCc( $cc ) {
		$this->cc = $cc;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getBcc() {
		return $this->bcc;
	}

	/**
	 * @param string $bcc
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setBcc( $bcc ) {
		$this->bcc = $bcc;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getMetaData() {
		return $this->metaData;
	}

	/**
	 * @param string $metaData
	 *
	 * @return Brizy_Editor_Forms_WordpressIntegration
	 */
	public function setMetaData( $metaData ) {
		$this->metaData = $metaData;

		return $this;
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
		}

		return $instance;
	}

	private function insertMetaDataFields( $emailBody ) {

		$metaFields = explode( ',', $this->getMetaData() );
		$tests      = array();
		foreach ( $metaFields as $meta ) {
			switch ( $meta ) {
				case 'time':
					$tests[] = 'Time: ' . date( 'Y-m-d H:i:s' );
					break;
				case 'pageUrl':
					$tests[] = 'Page Url: ' . $_SERVER['HTTP_REFERER'];
					break;
				case 'userAgent':
					$tests[] = 'User Agent: ' . $_SERVER['HTTP_USER_AGENT'];
					break;
				case 'remoteIp':
					$ip = $_SERVER['REMOTE_ADDR'];

					if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
						$ip = $_SERVER['HTTP_CLIENT_IP'];
					} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
						$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
					}

					$tests[] = 'Remote IP: ' . $ip;
					break;
				case 'credit':
					$tests[] = 'Powered by : ' . __bt( 'brizy', 'Brizy' );
					break;
			}
		}

		$tests = implode( '<br>', $tests );

		return $emailBody . "<br>-------------------------<br>" . $tests;
	}

	protected static function populateInstanceDataFromJson( $instance, $json_obj ) {
		if ( is_object( $json_obj ) ) {

			if ( isset( $json_obj->emailTo ) ) {
				$instance->setEmailTo( trim( $json_obj->emailTo ) );
			} else {
			    // set the default email
                $current_user   = wp_get_current_user();
                $instance->setEmailTo( $current_user->user_email );;
            }
			if ( isset( $json_obj->subject ) ) {
				$instance->setSubject( trim( $json_obj->subject ) );
			}

			if ( isset( $json_obj->fromEmail ) ) {
				$instance->setFromEmail( trim( $json_obj->fromEmail ) );
			}

			if ( isset( $json_obj->fromName ) ) {
				$instance->setFromName( trim( $json_obj->fromName ) );
			}

			if ( isset( $json_obj->replayTo ) ) {
				$instance->setReplayTo( trim( $json_obj->replayTo ) );
			}

			if ( isset( $json_obj->cc ) ) {
				$instance->setCc( trim( $json_obj->cc ) );
			}

			if ( isset( $json_obj->bcc ) ) {
				$instance->setBcc( trim( $json_obj->bcc ) );
			}

			if ( isset( $json_obj->metaData ) ) {
				$instance->setMetaData( trim( $json_obj->metaData ) );
			}

		}

		return $instance;
	}
}
