<?php

class Brizy_Import_Plugins {
	private $plugins;
	private $skin;

	/**
	 * $plugins = [
	 *      [
	 *	        'name'       => 'Plugin Name',
	 *	        'file'       => 'folder/plugin-name',
	 *	        'version'    => '2.2.10',
	 *          'sourceType' => 'repo'
	 *	    ]
	 *      ...
	 * ];
	 *
	 * @param $plugins
	 */
	public function __construct( $plugins ) {

		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
		}

		$this->plugins = array_map( function( $plugin ) {
			$parts = explode( '/', $plugin['file'] );
			$plugin['slug'] = $parts[0];
			return $plugin;
		}, $plugins );

		$this->skin = new Brizy_Import_UpgraderSkin();
	}

	/**
	 * @throws Exception
	 */
	public function install() {

		if ( ! class_exists( 'Plugin_Upgrader', false ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		}

		wp_cache_flush();

		foreach ( $this->plugins as $plugin ) {

			$file = $plugin['file'];

			if ( is_plugin_active( $file ) ) {
				$this->upgrade( $plugin );
			} elseif( array_key_exists( $file, get_plugins() ) ) {
				$this->upgrade( $plugin );
				$this->activate( $file );
			} else {
				$upgrader = new Plugin_Upgrader( $this->skin );
				$result   = $upgrader->install( $this->getDownloadUrl( $plugin ) );

				if ( is_wp_error( $result ) ) {
					throw new Exception( $result->get_error_message() );
				}

				$this->activate( $file );
			}
		}
	}

	/**
	 * @throws Exception
	 */
	private function upgrade( $plugin ) {

		$file       = $plugin['file'];
		$pluginData = get_plugins()[ $file ];

		if ( version_compare( $plugin['version'], $pluginData['Version'], '>' ) ) {
			$to_inject = [
				$file => array_merge( $this->getPluginField( $plugin['slug'] ), [ 'source' => $this->getDownloadUrl( $plugin ) ] )
			];

			$this->injectUpdateInfo( $to_inject );

			$upgrader = new Plugin_Upgrader( $this->skin );
			$result   = $upgrader->upgrade( $file );

			if ( is_wp_error( $result ) ) {
				throw new Exception( $result->get_error_message() );
			}
		}
	}

	/**
	 * @throws Exception
	 */
	private function activate( $file ) {

		$activate = activate_plugin( $file, '', false, true );

		if ( is_wp_error( $activate ) ) {
			throw new Exception( $activate->get_error_message() );
		}
	}

	/**
	 * Try to grab information from WordPress API.
	 *
	 * @param string $slug Plugin slug.
	 * @param string $field field name.
	 *
	 * @return mixed value of $field from the response object, DomainException on failure.
	 * @throws Exception
	 */
	private function getPluginField( $slug, $field = '' ) {

		static $apis = [];

		if ( ! isset( $apis[ $slug ] ) ) {

			if ( ! function_exists( 'plugins_api' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
			}

			$api = plugins_api( 'plugin_information', [ 'slug' => $slug, 'fields' => [ 'sections' => false ] ] );

			if ( is_wp_error( $api ) ) {
				throw new Exception( $api->get_error_message() );
			} else {
				$apis[ $slug ] = $api;
			}
		}

		return $field ? $apis[ $slug ]->{$field} : $apis[ $slug ];
	}

	/**
	 * Inject information into the 'update_plugins' site transient as WP checks that before running an update.
	 *
	 * @param array $plugins The plugin information for the plugins which are to be updated.
	 */
	private function injectUpdateInfo( $plugins ) {
		$repo_updates = get_site_transient( 'update_plugins' );

		if ( ! is_object( $repo_updates ) ) {
			$repo_updates = new stdClass;
		}

		foreach ( $plugins as $file => $plugin ) {

			if ( empty( $repo_updates->response[ $file ] ) ) {
				$repo_updates->response[ $file ] = new stdClass;
			}

			// We only really need to set package, but let's do all we can in case WP changes something.
			$repo_updates->response[ $file ]->slug        = $plugin['slug'];
			$repo_updates->response[ $file ]->plugin      = $file;
			$repo_updates->response[ $file ]->new_version = $plugin['version'];
			$repo_updates->response[ $file ]->package     = $plugin['source'];

			if ( empty( $repo_updates->response[ $file ]->url ) && ! empty( $plugin['external_url'] ) ) {
				$repo_updates->response[ $file ]->url = $plugin['external_url'];
			}
		}

		set_site_transient( 'update_plugins', $repo_updates );
	}

	/**
	 * Retrieve the download URL for a package.
	 *
	 * @param array $plugin Plugin data.
	 *
	 * @return string Plugin download URL or path to local file or empty string if undetermined.
	 * @throws Exception
	 */
	private function getDownloadUrl( $plugin ) {
		$dl_source = '';

		switch ( $plugin['sourceType'] ) {
			case 'repo':
				return $this->getPluginField( $plugin['slug'], 'download_link' );
			case 'external':
				return $plugin['source'];
		}

		return $dl_source;
	}
}
