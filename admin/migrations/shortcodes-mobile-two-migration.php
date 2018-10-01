<?php

class Brizy_Admin_Migrations_ShortcodesMobileTwoMigration implements Brizy_Admin_Migrations_MigrationInterface {

	use Brizy_Admin_Migrations_PostsTrait;

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.39';
	}

	/**
	 * Execute the migration
	 */
	public function execute() {
		$this->posts_migration();
		$this->globals_migration();
	}

	/**
	 * Posts migrations
	 */
	public function posts_migration() {
		$result = $this->get_posts_and_meta();
		$class  = get_class();

		// parse each post
		foreach ( $result as $item ) {
			$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $item->ID );
			if ( $postMigrationStorage->hasMigration($this) ) {
				return;
			}

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

			if( !is_null($json_value) ) {
				// make a backup to previous version
				update_post_meta($item->ID, 'brizy-bk-'.$class.'-'.$this->getVersion(), $storage);

				// migrate post
				$new_json = $this->migrate_post($json_value, $item->ID);

				// set the changed value in DB
				if ( is_array($old_meta) ) {
					$old_meta['editor_data'] = base64_encode($new_json);
				}
				elseif( is_object($old_meta) ) {
					$old_meta->set_editor_data($new_json);
				}
				$instance->set(Brizy_Editor_Post::BRIZY_POST, $old_meta);
				$postMigrationStorage->addMigration($this)->save();
			}
		}
	}

	/**
	 * Globals migration
	 */
	public function globals_migration() {
		$class  = get_class();
		$result = $this->get_globals_posts();
		foreach ($result as $item) {
			$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $item->ID );
			if ( $postMigrationStorage->hasMigration($this) ) {
				continue;
			}

			$instance   = Brizy_Editor_Storage_Project::instance( $item->ID );
			$storage    = $instance->get_storage();
			$json_value = base64_decode($storage['globals']);

			if( !is_null($json_value) ) {
				// make a backup to previous version
				update_post_meta($item->ID, 'brizy-bk-' . $class . '-' . $this->getVersion(), $storage);

				// migrate data
				$new_json = $this->migrate_post($json_value, $item->ID);

				// set the changed value in DB
				$storage['globals'] = base64_encode($new_json);
				$instance->loadStorage($storage);

				// set that migration was successful executed
				$postMigrationStorage->addMigration($this)->save();
			}
		}
	}

	/**
	 * Parse shortcodes
	 */
	public function parse_shortcodes(array &$array) {
		// Accordion
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Accordion",
			"mobile_keys"    => array(
				"mobilePadding"
			),
		) );

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

		// Icon
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Icon",
			"mobile_keys"    => array(
				"mobilePadding"
			)
		) );

		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Icon",
			"mobile_keys"    => array(
				"mobileSize",
				"mobileCustomSize"
			),
			"dependent_keys" => true
		) );

		// Row
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Row",
			"mobile_keys"    => array(
				"mobileMedia",
				"mobileBgImageWidth",
				"mobileBgImageHeight",
				"mobileBgImageSrc",
				"mobileBgColorHex",
				"mobileBgColorOpacity",
				"mobileBgColorPalette",
				"mobileBgMapZoom"
			)
		) );

		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Row",
			"mobile_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		// Column
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Column",
			"mobile_keys"    => array(
				"mobileBgImageWidth",
				"mobileBgImageHeight",
				"mobileBgImageSrc",
				"mobileBgColorHex",
				"mobileBgColorOpacity",
				"mobileBgColorPalette"
			)
		) );

		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "Column",
			"mobile_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		// Section
		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "SectionItem",
			"mobile_keys"    => array(
				"mobileMedia",
				"mobileBgImageWidth",
				"mobileBgImageHeight",
				"mobileBgImageSrc",
				"mobileBgColorHex",
				"mobileBgColorOpacity",
				"mobileBgColorPalette",
				"mobileBgMapZoom"
			)
		) );

		$array = $this->unset_mobile_multi_keys( $array, array(
			"shortcode"      => "SectionItem",
			"mobile_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		return $array;
	}

}
