<?php


class Brizy_Editor_Forms_Group extends Brizy_Admin_Serializable {


	use Brizy_Editor_Forms_DynamicPropsAware;

	/**
	 * Brizy_Editor_Forms_Group constructor.
	 *
	 * @param \BrizyForms\Model\Group|null $group
	 */
	public function __construct( \BrizyForms\Model\Group $group = null ) {
		$this->data = array();
		if ( $group ) {
			$this->data = array( 'id' => $group->getId(), 'name' => $group->getName() );
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