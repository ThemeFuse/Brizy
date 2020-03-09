<?php


class Brizy_Compatibilities_Serialize {

	public function __construct() {
		add_filter( 'get_post_metadata', array( $this, 'getPostMetaFilter' ), 0, 4 );
	}

	public function getPostMetaFilter( $null, $object_id, $meta_key, $single ) {
		$t = 0;

		if ( strpos( $meta_key, 'brizy' ) === false ) {
			return null;
		}

		global $wpdb;

		$meta_values = $wpdb->get_results( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id=%d AND meta_key=%s", $object_id, $meta_key ), ARRAY_N );


		$results = [];
		foreach ( $meta_values as $i => $meta_value ) {
			$results[ $i ] = maybe_unserialize( $this->fixSerializedData( $meta_value[0] ) );
		}

		return $results;
	}

	public function fixSerializedData( $data ) {
		$newData = preg_replace( "/O:(\d+):\"Brizy_(.+?)\"/u", "C:$1:\"Brizy_$2\"", $data );

		if ( is_null( $newData ) ) {
			return $data;
		}

		return $newData;
	}
}
