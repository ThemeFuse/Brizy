<?php

/**
 *
 * @deprecated
 *
 * Class Brizy_Editor_API_Page
 */
class Brizy_Editor_API_Page extends Brizy_Admin_Serializable {

	/**
	 * @var array
	 */
	private $data;

	/**
	 * @param array $data
	 *
	 * @return Brizy_Editor_API_Page
	 */
	public static function get( $data = array() ) {
		return new self( $data );
	}

	public function convertToOptionValue() {
		return array(
			'data' => $this->data
		);
	}

	static public function createFromSerializedData( $data ) {
		$page = new self( $data['data'] );

		return $page;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->data );
	}

	/**
	 * @param $data
	 */
	public function unserialize( $data ) {
		$this->data = unserialize( $data );
	}

	/**
	 * Brizy_Editor_API_Page constructor.
	 *
	 * @param array $data
	 */
	public function __construct( $data = array() ) {

		$default    = array( 'title' => 'Default title', 'data' => '{}' );
		$this->data = array_merge( $default, $data );
	}

	public function get_id() {
		return isset( $this->data['id'] ) ? $this->data['id'] : '';
	}

	public function set_id( $id ) {
		$this->data['id'] = $id;

		return $this;
	}

	public function get_title() {
		return isset( $this->data['title'] ) ? $this->data['title'] : '';
	}

	public function set_title( $title ) {
		$this->data['title'] = $title;

		return $this;
	}

//	public function get_status() {
//		return isset( $this->data['status'] ) ? $this->data['status'] : '';
//	}
//
//	public function set_status( $status ) {
//		//$this->data['status'] = $status;
//
//		return $this;
//	}

	public function get_content() {
		return isset( $this->data['data'] ) ? $this->data['data'] : '';
	}

	public function set_content( $content ) {
		$this->data['data'] = stripslashes( $content );

		return $this;
	}

	public function get_language() {
		return isset( $this->data['language'] ) ? $this->data['language'] : null;
	}

	public function get_type() {
		return isset( $this->data['type'] ) ? $this->data['type'] : null;
	}

	public function get_url() {
		return isset( $this->data['url'] ) ? $this->data['url'] : '';
	}

	public function get_description() {
		return isset( $this->data['description'] ) ? $this->data['description'] : '';
	}

	public function set_description( $data ) {
		$data['description'] = $data;

		return $this;
	}

	public function is_index() {
		return isset( $this->data['is_index'] ) ? (bool) $this->data['is_index'] : true;
	}

	public function set_is_index( $is_index ) {
		$this->data['is_index'] = $is_index;

		return $this;
	}

	public function getSaveData() {

		$data = $this->data;

		return array_diff_key( $data, array( 'id' => 0, 'cloned_from' => null ) );
	}

}