<?php

trait Brizy_Admin_Migrations_HelpersTrait {

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
	public function migrate_post($json_value, $post_id) {
		$old_arr = json_decode($json_value, true);

		$debug = true;
		$debug = false; // comment this for testing
		if ( $debug ) {
			// write in before.json to track the changes
			$result_old = file_put_contents($post_id.'-before.json', json_encode(
				$old_arr,
				JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT
			));
			echo 'put-contents-json-before=='.$result_old.'<br>';
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

		if ( $debug ) {
			// write in before.json to track the changes
			$result_new = file_put_contents($post_id.'-bfafter.json', json_encode(
				$new_arr,
				JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT
			));
			echo 'put-contents-json-after=='.$result_new.'<br>';
		}

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

}

