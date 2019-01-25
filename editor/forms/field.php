<?php


class Brizy_Editor_Forms_Field extends Brizy_Admin_Serializable {


	use Brizy_Editor_Forms_DynamicPropsAware;

	/**
	 * Brizy_Editor_Forms_Field constructor.
	 *
	 * @param \BrizyForms\Model\Field|null $field
	 */
	public function __construct( \BrizyForms\Model\Field $field = null ) {
		$this->data = array();
		if ( $field ) {
			$this->data = array( 'slug'     => $field->getSlug(),
			                     'name'     => $field->getName(),
			                     'required' => $field->getRequired()
			);
		}
	}

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->jsonSerialize() );
	}

	public function unserialize( $serialized ) {
		$this->data = unserialize( $serialized );
	}

	public function jsonSerialize() {
		return $this->data;
	}

	public function convertToOptionValue() {
		return $this->data;
	}

	static public function createFromSerializedData( $data ) {
		$instance = new self();

		foreach ( $data as $key => $val ) {
			$instance->set( $key, $val );
		}

		return $instance;
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Forms_Field|void
	 * @throws Exception
	 */
	public static function createFromJson( $json_obj ) {

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		if ( is_object( $json_obj ) ) {
			return self::createFromSerializedData( get_object_vars( $json_obj ) );
		}

		return new self();
	}

}