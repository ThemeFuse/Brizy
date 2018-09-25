<?php

trait Brizy_Admin_Migrations_PostsTrait {

	/**
	 * Parse array of shortcodes recursive
	 */
	public function array_walk_recursive_and_delete(array &$array, callable $callback, $userdata = null) {
		foreach ($array as $key => &$value) {
			if ( is_array($value) ) {
				$value = $this->array_walk_recursive_and_delete($value, $callback, $userdata);
				// if is shortcode parse recursive
				if ( isset( $value['type'] ) && isset( $value['value'] ) ) {
					$this->parse_shortcodes($value);
				}
			}
		}

		return $array;
	}

	/**
	 * Get posts and meta
	 */
	public function get_posts_and_meta() {
		global $wpdb;

		// query all posts (all post_type, all post_status) that have meta_key = 'brizy' and is not 'revision'
		return $wpdb->get_results("
			SELECT p.ID, pm.meta_value FROM {$wpdb->postmeta} pm
			LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			WHERE pm.meta_key = 'brizy'
			AND p.post_type != 'revision'
			AND p.post_type != 'attachment'
		");
	}

	/**
	 * Migrate post
	 */
	public function migrate_post($json_value) {
		$old_arr = json_decode($json_value, true);
		if( is_null($old_arr) ) {
			return $json_value;
		}

		$new_arr = $this->array_walk_recursive_and_delete($old_arr, function ($value, $key) {
			if ( is_array($value) ) {
				return empty($value);
			}

			if ( isset($value['type']) && isset($value['value']) ) {
				// if is shortcode return true
				return true;
			}
		});

		return json_encode($new_arr);
	}

	/**
	 * Parse shortcodes
	 */
	public function parse_shortcodes(array &$array) {
		// rewrite this function in your class

		return $array;
	}

	/**
	 * Unset a mobile key
	 */
	public function unset_mobile_key(array &$array, $shortcode = "", $mobile_key = "") {
		if ( empty($shortcode) && empty($mobile_key) ) {
			return $array;
		}

		//echo 'type=='.$array['type'].'<br>';
		if ( $shortcode == $array['type'] ) {
			// replace "mobile" with empty string then make first letter lowercase
			$key = lcfirst( str_replace("mobile", "", $mobile_key) );
			if ( isset( $array['value'][$key] )
				&& isset( $array['value'][$mobile_key] )
				&& $array['value'][$key] === $array['value'][$mobile_key] )
			{
				unset( $array['value'][$mobile_key] );
			}
		}

		return $array;
	}

	/**
	 * Get Glogals posts
	 */
	public function get_globals_posts() {
		global $wpdb;

		// query all global posts
		return $wpdb->get_results("
			SELECT p.ID, pm.meta_value FROM {$wpdb->postmeta} pm
			LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			WHERE pm.meta_key = 'brizy-project'
			AND p.post_type = 'brizy-project'
		");
	}

	public function unset_mobile_multi_keys( array &$array, $atts = array() ) {
		// merge with default $atts
		$atts = array_merge(
			array (
				"shortcode"      => "",
				"mobile_keys"    => array(),
				"dependent_keys" => false,
			),
			$atts
		);

		if ( empty($atts['shortcode']) && empty($atts['mobile_keys']) ) {
			return $array;
		}

		//echo 'type=='.$array['type'].'<br>';
		if ( $atts['shortcode'] == $array['type'] ) {
			$keys_to_remove = array();
			foreach($atts['mobile_keys'] as $mobile_key) {
				// replace "mobile" with empty string then make first letter lowercase
				$key = lcfirst( str_replace("mobile", "", $mobile_key) );
				if ( isset( $array['value'][$key] )
					&& isset( $array['value'][$mobile_key] )
					&& $array['value'][$key] === $array['value'][$mobile_key] )
				{
					$keys_to_remove[] = $mobile_key;
				}
			}

			// !Atention if the number of keys to delete are not the same to not delete
			if ( $atts['dependent_keys'] && count($keys_to_remove) != count($atts['mobile_keys']) ) {
				$keys_to_remove = array();
			}

			// remove keys
			if ( !empty($keys_to_remove) ) {
				foreach($keys_to_remove as $key_to_remove) {
					unset( $array['value'][$key_to_remove] );
				}
			}
		}

		return $array;
	}

}

