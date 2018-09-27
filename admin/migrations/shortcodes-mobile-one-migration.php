<?php

class Brizy_Admin_Migrations_ShortcodesMobileOneMigration implements Brizy_Admin_Migrations_MigrationInterface {

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
	 * Execute the migration
	 */
	public function execute() {
		$result = $this->get_posts_and_meta();

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
				update_post_meta($item->ID, 'brizy_bk_v_'.$this->getVersion(), $storage);

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
	 * Parse shortcodes
	 */
	public function parse_shortcodes(array &$array) {
		// Line
		$array = $this->unset_mobile_key( $array, "Line", "mobileWidth" );
		$array = $this->unset_mobile_key( $array, "Line", "mobileBorderWidth" );

		// Spacer
		$array = $this->unset_mobile_key( $array, "Spacer", "mobileHeight" );

		// Video
		$array = $this->unset_mobile_key( $array, "Video", "mobileSize" );

		// EmbedCode
		$array = $this->unset_mobile_key( $array, "EmbedCode", "mobileWidth" );

		// Map
		$array = $this->unset_mobile_key( $array, "Map", "mobileSize" );
		$array = $this->unset_mobile_key( $array, "Map", "mobileHeight" );

		// SoundCloud
		$array = $this->unset_mobile_key( $array, "SoundCloud", "mobileWidth" );
		$array = $this->unset_mobile_key( $array, "SoundCloud", "mobileHeight" );

		// Countdown
		$array = $this->unset_mobile_key( $array, "Countdown", "mobileWidth" );

		// ProgressBar
		$array = $this->unset_mobile_key( $array, "ProgressBar", "mobileWidth" );

		// Wrapper
		$array = $this->mobile_migation_wrapper_align( $array, "Wrapper" );

		// Cloneable
		$array = $this->mobile_migation_wrapper_align( $array, "Cloneable" );

		// WOOCategories
		$array = $this->unset_mobile_key( $array, "WOOCategories", "mobileWidth" );

		// WOOPages
		$array = $this->unset_mobile_key( $array, "WOOPages", "mobileWidth" );

		// WOOProducts
		$array = $this->unset_mobile_key( $array, "WOOProducts", "mobileWidth" );

		// WPSidebar
		$array = $this->unset_mobile_key( $array, "WPSidebar", "mobileWidth" );

		// WPCustomShortcode
		$array = $this->unset_mobile_key( $array, "WPCustomShortcode", "mobileWidth" );

		// WOOProductPage
		$array = $this->unset_mobile_key( $array, "WOOProductPage", "mobileWidth" );

		// WPNavigation
		$array = $this->unset_mobile_key( $array, "WPNavigation", "mobileItemPadding" );

		return $array;
	}

	/**
	 * Special Migration for Wrapper and Cloneable "Align"
	 */
	public function mobile_migation_wrapper_align(array &$array, $shortcode = "") {
		if ( empty($shortcode) ) {
			return $array;
		}

		if ( $shortcode == $array['type'] ) {
			if ( isset( $array['value']['horizontalAlign'] )
				&& isset( $array['value']['mobileHorizontalAlign'] )
				&& $array['value']['horizontalAlign'] === $array['value']['mobileHorizontalAlign'] )
			{
				unset( $array['value']['mobileHorizontalAlign'] );
			}
			else
			{
				// !Attention this need only 1-time execution in JSON (to not apply to the same JSON 2 times)
				if ( isset( $array['value']['horizontalAlign'] )
					&& $array['value']['horizontalAlign'] !== "center"
					&& !isset( $array['value']['mobileHorizontalAlign'] ) )
				{
					$array['value']['mobileHorizontalAlign'] = "center";
				}
			}
		}

		return $array;
	}

}
