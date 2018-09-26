<?php

class Brizy_Admin_Migrations_ShortcodesMobileTwoMigration implements Brizy_Admin_Migrations_MigrationInterface {

	use Brizy_Admin_Migrations_HelpersTrait;

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.32';
	}

	/**
	 * 
	 */
	public function execute() {
		$result = $this->get_posts_and_meta();

		// parse each post
		foreach ( $result as $item ) {
			$json_value = null;
			$instance   = Brizy_Editor_Storage_Post::instance($item->ID);
			$storage    = $instance->get_storage();
			$old_meta   = $instance->get(Brizy_Editor_Post::BRIZY_POST, false);

			if ( is_array($old_meta) ) {
				$json_value = base64_decode($old_meta['editor_data']);
			}
			elseif( is_object($old_meta) ) {
				$json_value = $old_meta->get_editor_data();
			}

			// test only for specific post id
			if ( 39 == $item->ID ) {
				if( !is_null($json_value) ) {
					// make a backup to previous version
					//update_post_meta($item->ID, 'brizy_bk_v_'.$this->getVersion(), $storage);

					// migrate post
					$new_json = $this->migrate_post($json_value, $item->ID); // $item->ID only for test with json

					// set the changed value in DB
					/*if ( is_array($old_meta) ) {
						$old_meta['editor_data'] = base64_encode($new_json);
					}
					elseif( is_object($old_meta) ) {
						$old_meta->set_editor_data($new_json);
					}
					$instance->set(Brizy_Editor_Post::BRIZY_POST, $old_meta);*/
				}
			}
		}
		die();
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
		//$debug = false;
		if ( $debug ) {
			// write in before.json to track the changes
			$result_old = file_put_contents($post_id.'-before.json', json_encode(
				$old_arr,
				JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT
			));
			echo 'put-contents-before-json=='.$result_old.'<br>';
		}


		// todo: need here to inspect if is allow inline function in PHP 5.4
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
			$result_new = file_put_contents($post_id.'-after.json', json_encode(
				$new_arr,
				JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT
			));
			echo 'put-contents-before-json=='.$result_new.'<br>';
		}

		return json_encode($new_arr);
	}

	/**
	 * Parse shortcodes
	 */
	public function parse_shortcodes(array &$array) {
		// Accordion
		$array = $this->unset_mobile_key( $array, "Accordion", "mobilePadding" );

		// Delete ungrouped mobile paddings if all are equal
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Accordion", 
			"mobile_keys"    => array(
				"mobilePaddingType",
				"mobilePaddingTop",
				"mobilePaddingRight",
				"mobilePaddingBottom",
				"mobilePaddingLeft"
			),
			"dependent_keys" => true
		) );

		// Tabs
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"   => "Tabs",
			"mobile_keys" => array(
				"mobileHorizontalAlign",
				"mobilePadding"
			)
		) );

		// Delete ungrouped mobile paddings if all are equal
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Tabs",
			"mobile_keys"    => array(
				"mobilePaddingType",
				"mobilePaddingTop",
				"mobilePaddingRight",
				"mobilePaddingBottom",
				"mobilePaddingLeft"
			),
			"dependent_keys" => true
		) );

		// Image
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Image",
			"mobile_keys"    => array(
				"mobileResize",
				"mobileZoom",
				"mobileWidth",
				"mobileHeight"
			)
		) );

		// Delete image position if all are equal
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Image",
			"mobile_keys"    => array(
				"mobilePositionX",
				"mobilePositionY"
			),
			"dependent_keys" => true
		) );

		// Form
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Form",
			"mobile_keys"    => array(
				"mobileHorizontalAlign"
			)
		) );

		// Form fields options
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "FormFields",
			"mobile_keys"    => array(
				"mobilePadding",
				"mobilePaddingRight",
				"mobilePaddingBottom",
				"mobilePaddingLeft",
			),
			"dependent_keys" => true
		) );

		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "FormFields",
			"mobile_keys"    => array(
				"mobileBorderRadius",
				"mobilePaddingTop" // top is used as zero from the default json
			)
		) );

		// Form single field options
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "FormField",
			"mobile_keys"    => array(
				"mobileWidth",
				"mobileHeight"
			)
		) );


		// Column - need to finish
		/*$array = $this->unset_mobile_key( $array, "Column", "mobileBgImageWidth" );
		$array = $this->unset_mobile_key( $array, "Column", "mobileBgImageHeight" );
		$array = $this->unset_mobile_key( $array, "Column", "mobileBgImageSrc" );*/

		return $array;
	}

}
