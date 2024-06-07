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
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init() {

		$this->extensions = apply_filters( 'brizy_extensions', $this->extensions );
		add_filter( 'brizy_editor_config', [ $this, 'registerExtensionsInConfig' ] );
		if ( ! wp_doing_ajax() && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT ) ] ) && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Admin_Fonts_Handler::ENDPOINT ) ] ) && ! isset( $_REQUEST[ Brizy_Editor::prefix( Brizy_Editor_API::AJAX_REMOVE_LOCK ) ] ) ) {
			add_action( 'brizy_pre_editor_enqueue_scripts', [ $this, 'enqueueExtensionAssets' ] );
			add_filter( 'brizy_preview_enqueue_scripts', [ $this, 'enqueuePreviewExtensionAssets' ] );
		}
	}


	public function enqueuePreviewExtensionAssets() {
		foreach ( $this->extensions as $extension ) {
			if ( $extension instanceof Brizy_Editor_ThirdParty_ExtensionInterface ) {
				foreach ( $extension->getViewScripts() as $scriptUrl ) {
					$handle = 'brizy-extension-' . md5( $extension->getName() . $scriptUrl );
					wp_enqueue_script( $handle, $scriptUrl, [], $extension->getVersion(), true );

				}
				foreach ( $extension->getViewStyles() as $styleUrl ) {
					$handle = 'brizy-extension-' . md5( $extension->getName() . $styleUrl );
					wp_enqueue_style( $handle, $styleUrl, array(), $extension->getVersion() );
				}
			}
		}
	}


	public function enqueueExtensionAssets() {
		foreach ( $this->extensions as $extension ) {
			if ( $extension instanceof Brizy_Editor_ThirdParty_ExtensionInterface ) {
				foreach ( $extension->getEditorScripts() as $scriptUrl ) {
					$handle = 'brizy-extension-' . md5( $extension->getName() . $scriptUrl );
					wp_register_script( $handle, $scriptUrl, [
						'brizy-editor-vendor',
						'brizy-react-vendor',
						'brizy-react-dom-vendor'
					], $extension->getVersion(), true );
					wp_enqueue_script( $handle );

				}
				foreach ( $extension->getEditorStyles() as $styleUrl ) {
					$handle = 'brizy-extension-' . md5( $extension->getName() . $styleUrl );
					wp_enqueue_style( $handle, $styleUrl, array(), $extension->getVersion() );
				}
			}
		}
	}

	public function registerExtensionsInConfig( $config ) {

		foreach ( $this->extensions as $extension ) {
			if ( $extension instanceof Brizy_Editor_ThirdParty_ExtensionInterface ) {
				foreach ( $extension->getEditorScripts() as $script ) {
					$config['thirdPartyUrls'][] = [ 'scriptUrl' => $script ];
				}
				$config['thirdPartyComponentHosts'][] = [
					'name' => $extension->getName(),
					'host' => $extension->getPublicPath()
				];
			}
		}

		return $config;
	}
}