<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Storage_Post extends Brizy_Editor_Storage_Abstract {

	const META_KEY = 'brizy';

	protected $id;

	static $storage_data;

	/**
	 * @param $id
	 *
	 * @return Brizy_Editor_Storage_Post
	 */
	public static function instance( $id ) {
		return new self( $id );
	}

	protected function __construct( $id ) {
		$this->id = (int) $id;
	}

	protected function get_id() {
		return $this->id;
	}

	/**
	 * @return array
	 */
	public function get_storage() {

		if ( isset( self::$storage_data[ $this->get_id() ] ) ) {
			return self::$storage_data[ $this->get_id() ];
		}

		self::$storage_data[ $this->get_id() ] = $this->get_metadata( $this->get_id(), $this->key(), true );

		//$get_metadata = get_metadata( 'post', $this->get_id(), $this->key(), true );

		if ( is_array( self::$storage_data[ $this->get_id() ] ) ) {
			return self::$storage_data[ $this->get_id() ];
		}

		return array();
	}

	/**
	 * @param array $storage
	 *
	 * @return $this
	 */
	protected function update_storage( $storage ) {

//		if(isset($storage['brizy-post']['editor_data']))
//		{
//			$storage['brizy-post']['editor_data'] = addslashes($storage['brizy-post']['editor_data']);
//		}
//		if(isset($storage['brizy-post']['compiled_html']))
//		{
//			$storage['brizy-post']['compiled_html'] = addslashes($storage['brizy-post']['compiled_html']);
//		}

		//update_metadata( 'post', $this->get_id(), $this->key(), $storage );

		$this->update_metadata( $this->get_id(), $this->key(), $storage );
		self::$storage_data[ $this->get_id() ] = $storage;

		return $this;
	}

	protected function key() {
		return self::META_KEY;
	}

	/**
	 * @param $object_id
	 * @param string $meta_key
	 * @param bool $single
	 *
	 * @return array|mixed
	 */
	public function get_metadata( $object_id, $meta_key = '', $single = false ) {
		global $wpdb;

		$results = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->postmeta} WHERE meta_key=%s AND post_id = %d", $meta_key, $object_id ) );

		if ( $single && isset( $results[0] ) ) {
			return maybe_unserialize( $results[0]->meta_value );
		} else {
			return array_map( function ( $row ) {
				return maybe_unserialize( $row->meta_value );
			}, $results );
		}
	}

	/**
	 * @param $object_id
	 * @param $meta_key
	 * @param $meta_value
	 * @param string $prev_value
	 *
	 * @return mixed
	 */
	public function update_metadata( $object_id, $meta_key, $meta_value, $prev_value = '' ) {
		global $wpdb;

		$shouldInsert = $wpdb->get_col( $wpdb->prepare( "SELECT meta_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND post_id = %d", $meta_key, $object_id ) );
		$meta_type    = 'post';
		$meta_subtype = get_object_subtype( $meta_type, $object_id );
		$meta_value   = sanitize_meta( $meta_key, $meta_value, $meta_type, $meta_subtype );

		if ( count( $shouldInsert ) == 0 ) {
			$data = array(
				'post_id'    => $object_id,
				'meta_key'   => $meta_key,
				'meta_value' => maybe_serialize( $meta_value ),
			);
			$wpdb->insert( $wpdb->postmeta, $data );
		} else {
			$data  = array(
				'meta_value' => maybe_serialize( $meta_value ),
			);
			$where = array( 'post_id' => $object_id, 'meta_key' => $meta_key );
			$wpdb->update( $wpdb->postmeta, $data, $where );
		}

	}
}