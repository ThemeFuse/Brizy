<?php

class Brizy_Admin_Migrations_ShortcodesMobileOneMigration implements Brizy_Admin_Migrations_MigrationInterface {

	use Brizy_Admin_Migrations_PostsTrait;

	/**
	 * @return int|mixed
	 */
	public function getPriority() {
		return 0;
	}

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
	 * Posts migration
	 */
	public function posts_migration() {
		$result = $this->get_posts_and_meta();
		$class  = __CLASS__;

		// parse each post
		foreach ( $result as $item ) {
			$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $item->ID );
			if ( $postMigrationStorage->hasMigration($this) ) {
				continue;
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
				$new_json = $this->migrate_post($json_value);

				// set the changed value in DB
				if ( is_array($old_meta) ) {
					$old_meta['editor_data'] = base64_encode($new_json);
				}
				elseif( is_object($old_meta) ) {
					$old_meta->set_editor_data($new_json);
				}
				$instance->set(Brizy_Editor_Post::BRIZY_POST, $old_meta);

				// set that migration was successful executed
				$postMigrationStorage->addMigration($this)->save();
			}
		}
	}

	/**
	 * Globals migration
	 */
	public function globals_migration() {
		$class  = __CLASS__;
		$result = $this->get_globals_posts();
		foreach ($result as $item) {
			$postMigrationStorage = new Brizy_Admin_Migrations_PostStorage( $item->ID );
			if ( $postMigrationStorage->hasMigration($this) ) {
				continue;
			}

			$instance   = Brizy_Editor_Storage_Project::instance( $item->ID );
			$storage    = $instance->get_storage();

			if ( ! isset( $storage['globals'] ) ) {
				continue;
			}

			$json_value = base64_decode($storage['globals']);

			if( !is_null($json_value) ) {
				// make a backup to previous version
				update_post_meta($item->ID, 'brizy-bk-' . $class . '-' . $this->getVersion(), $storage);

				// migrate post
				$new_json = $this->migrate_post($json_value);

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
		// Line
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Line",
			"delete_keys" => array(
				"mobileWidth",
				"mobileBorderWidth"
			)
		) );

		// Spacer
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Spacer",
			"delete_keys" => array(
				"mobileHeight"
			)
		) );

		// Video
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Video",
			"delete_keys" => array(
				"mobileSize",
				"mobileCoverImageWidth",
				"mobileCoverImageHeight"
			)
		) );

		// EmbedCode
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "EmbedCode",
			"delete_keys" => array(
				"mobileWidth",
				"mobileHeight"
			)
		) );

		// Map
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Map",
			"delete_keys" => array(
				"mobileSize",
				"mobileHeight"
			)
		) );

		// SoundCloud
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "SoundCloud",
			"delete_keys" => array(
				"mobileWidth",
				"mobileHeight"
			)
		) );

		// Countdown
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Countdown",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// ProgressBar
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "ProgressBar",
			"delete_keys" => array(
				"mobileWidth",
				"mobileBorderRadius"
			)
		) );

		// Wrapper
		$array = $this->mobile_migation_wrapper_align( $array, "Wrapper" );

		// Cloneable
		$array = $this->mobile_migation_wrapper_align( $array, "Cloneable" );

		// WOOCategories
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WOOCategories",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WOOPages
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WOOPages",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WOOProducts
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WOOProducts",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WPSidebar
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WPSidebar",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WPCustomShortcode
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WPCustomShortcode",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WOOProductPage
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WOOProductPage",
			"delete_keys" => array(
				"mobileWidth"
			)
		) );

		// WPNavigation
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "WPNavigation",
			"delete_keys" => array(
				"mobileWidth",
				"mobileItemPadding"
			)
		) );

		// Button
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Button",
			"delete_keys" => array(
				"mobileBorderRadius"
			)
		) );

		// Tabs
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"   => "Tabs",
			"delete_keys" => array(
				"mobileHorizontalAlign"
			)
		) );

		// Image
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Image",
			"delete_keys"    => array(
				"mobileResize",
				"mobileZoom",
				"mobileWidth",
				"mobileHeight"
			)
		) );

		// Delete image position if all are equal
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Image",
			"delete_keys"    => array(
				"mobilePositionX",
				"mobilePositionY"
			),
			"dependent_keys" => true
		) );

		// Form
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Form",
			"delete_keys"    => array(
				"mobileHorizontalAlign"
			)
		) );

		// Form fields options
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "FormFields",
			"delete_keys"    => array(
				"mobilePadding",
				"mobilePaddingRight",
				"mobilePaddingBottom",
				"mobilePaddingLeft",
			),
			"dependent_keys" => true
		) );

		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "FormFields",
			"delete_keys"    => array(
				"mobileBorderRadius",
				"mobilePaddingTop" // top is used as zero from the default json
			)
		) );

		// Form single field options
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "FormField",
			"delete_keys"    => array(
				"mobileWidth",
				"mobileHeight"
			)
		) );

		// Icon
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Icon",
			"delete_keys"    => array(
				"mobilePadding",
				"mobileBorderRadius"
			)
		) );

		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Icon",
			"delete_keys"    => array(
				"mobileSize",
				"mobileCustomSize"
			),
			"dependent_keys" => true
		) );

		// Row
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Row",
			"delete_keys"    => array(
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

		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Row",
			"delete_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		// Column
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Column",
			"delete_keys"    => array(
				"mobileBgImageWidth",
				"mobileBgImageHeight",
				"mobileBgImageSrc",
				"mobileBgColorHex",
				"mobileBgColorOpacity",
				"mobileBgColorPalette"
			)
		) );

		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "Column",
			"delete_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		// Section
		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "SectionItem",
			"delete_keys"    => array(
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

		$array = $this->unset_prefixed_keys( $array, array(
			"shortcode"      => "SectionItem",
			"delete_keys"    => array(
				"mobileBgPositionX",
				"mobileBgPositionY"
			),
			"dependent_keys" => true
		) );

		return $array;
	}

	/**
	 * Special Migration for Wrapper and Cloneable "align"
	 */
	public function mobile_migation_wrapper_align(array &$array, $shortcode = "") {
		if ( empty($shortcode) ) {
			return $array;
		}

		if ( $shortcode == $array['type'] ) {
			if ( isset( $array['value']['horizontalAlign'], $array['value']['mobileHorizontalAlign'] ) && $array['value']['horizontalAlign'] === $array['value']['mobileHorizontalAlign'] )
			{
				unset( $array['value']['mobileHorizontalAlign'] );
			}
			else
			{
				// !Attention this need only 1-time execution in JSON (to not apply to the same JSON 2 times)
				if ( isset( $array['value']['horizontalAlign'] )
				     && ( $array['value']['horizontalAlign'] !== "center" )
					&& !isset( $array['value']['mobileHorizontalAlign'] ) )
				{
					$array['value']['mobileHorizontalAlign'] = "center";
				}
			}
		}

		return $array;
	}

}
