<?php

class Brizy_Editor_ThirdParty_Main {

	/**
	 * @var Brizy_Editor_ThirdParty_ExtensionInterface[]
	 */
	private $extensions = [];

	public static function _init() {
		static $instance;
		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	public function __construct() {
		add_action( 'brizy_edit_mode', array( $this, 'init' ) );
	}

	public function init() {

		$this->extensions = apply_filters( 'brizy_extensions', $this->extensions );

		add_filter( 'brizy_editor_config', [ $this, 'registerExtensionsInConfig' ] );

		if ( ! wp_doing_ajax() && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT ) ] ) && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Admin_Fonts_Handler::ENDPOINT ) ] ) && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Editor_API::AJAX_REMOVE_LOCK ) ] ) ) {
			add_action( 'wp_enqueue_scripts', [ $this, 'enqueueExtensionAssets' ], 9998 );
		}
	}


	public function enqueueExtensionAssets() {
		foreach ( $this->extensions as $extension ) {
			if ( $extension instanceof Brizy_Editor_ThirdParty_ExtensionInterface ) {
				foreach ( $extension->getScripts() as $scriptUrl ) {
					$handle = 'brizy-custom-extension-' . md5( $scriptUrl );
					wp_register_script( $handle, $scriptUrl, [
						'brizy-editor-vendor',
						'brizy-react-vendor',
						'brizy-react-dom-vendor'
					], $extension->getVersion(), true );
					wp_enqueue_script( $handle );

				}
				foreach ( $extension->getStyles() as $styleUrl ) {
					$handle = 'brizy-custom-extension-' . md5( $styleUrl );
					wp_enqueue_style( $handle, $styleUrl, array(), $extension->getVersion() );
				}
			}
		}
	}

	public function registerExtensionsInConfig( $config ) {

		foreach ( $this->extensions as $extension ) {
			if ( $extension instanceof Brizy_Editor_ThirdParty_ExtensionInterface ) {
				foreach ( $extension->getScripts() as $script ) {
					$config['thirdPartyUrls'][] = [ 'scriptUrl' => $script ];
				}
			}
		}

		return $config;
	}
}