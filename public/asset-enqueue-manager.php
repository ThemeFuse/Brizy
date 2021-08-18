<?php

use BrizyMerge\AssetAggregator;
use BrizyMerge\Assets\Asset;
use BrizyMerge\Assets\AssetGroup;

class Brizy_Public_AssetEnqueueManager {
	private $posts    = [];
	private $scripts  = [];
	private $styles   = [];
	private $enqueued = [];

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * @throws Exception
	 */
	private function __construct() {
		$this->project = Brizy_Editor_Project::get();
		$this->popupMain = Brizy_Admin_Popups_Main::_init();
		$this->registerActions();
	}

	private function registerActions() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueStyles' ], 10002 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueScripts' ], 10002 );
		add_filter( 'wp_enqueue_scripts', [ $this, 'addEditorConfigVar' ], 10002 );
		add_filter( 'script_loader_tag',  [ $this, 'addScriptAttributes' ], 10, 2 );
		add_filter( 'style_loader_tag',   [ $this, 'addStyleAttributes' ], 10, 2 );
		add_action( 'wp_head',            [ $this, 'insertHeadCodeAssets' ] );
		add_action( 'wp_footer',          [ $this, 'insertBodyCodeAssets' ] );
	}

	/**
	 * @param Brizy_Editor_Post $post
	 */
	public function enqueuePost( $post ) {
		$id = $post->getWpPost()->ID;

		if ( ! isset( $this->posts[ $id ] ) ) {
			$this->posts[ $id ] = $post;
		}
	}

	public function insertHeadCodeAssets() {

		$assets = $this->getCodeAssetsAsString( $this->styles );

		foreach ( $this->posts as $editorPost ) {
			$assets .= $this->popupMain->getPopupsHtml( $this->project, $editorPost, 'head' );
		}

		if ( empty( $assets ) ) {
			return;
		}

		echo apply_filters(
			'brizy_content',
			$assets,
			$this->project,
			null,
			'head'
		);
	}

	public function insertBodyCodeAssets() {

		$assets = $this->getCodeAssetsAsString( $this->scripts );

		if ( empty( $assets ) ) {
			return;
		}

		echo apply_filters(
			'brizy_content',
			$assets,
			$this->project,
			null,
			'body'
		);
	}

	public function addEditorConfigVar() {
		$current_user = wp_get_current_user();
		$config_json  = json_encode(
			[
				'serverTimestamp' => time(),
				'currentUser'     => [
					'user_login'     => $current_user->user_login,
					'user_email'     => $current_user->user_email,
					'user_level'     => $current_user->user_level,
					'user_firstname' => $current_user->user_firstname,
					'user_lastname'  => $current_user->user_lastname,
					'display_name'   => $current_user->display_name,
					'ID'             => $current_user->ID,
					'roles'          => $current_user->roles,
				]
			]
		);

		wp_register_script( 'brizy-preview', '' );
		wp_enqueue_script( 'brizy-preview' );
		wp_add_inline_script( 'brizy-preview', "var __CONFIG__ = ${config_json};", 'before' );
	}

	public function enqueueStyles() {
		$assetGroups = [];

		foreach ( $this->posts as $editorPost ) {
			$styles = $editorPost->getCompiledStyles();

			if ( ! empty( $styles['free'] ) ) {
				$assetGroups[] = AssetGroup::instanceFromJsonData( $styles['free'] );
			}

			$assetGroups = apply_filters( 'brizy_pro_head_assets', $assetGroups, $editorPost );
			$assetGroups = array_merge( $assetGroups, $this->popupMain->getPopupsAssets( $this->project, $editorPost, 'head' ) );
		}

		$assetAggregator = new AssetAggregator( $assetGroups );
		$this->styles    = $assetAggregator->getAssetList();

		foreach ( $this->styles as $asset ) {
			if ( $asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_FILE ) {
				$this->enqueueStyleAsset( $asset );
			}
		}
	}

	public function enqueueScripts() {
		$assetGroups = [];

		foreach ( $this->posts as $editorPost ) {
			$scripts = $editorPost->getCompiledScripts();

			if ( ! empty( $scripts['free'] ) ) {
				$assetGroups[] = AssetGroup::instanceFromJsonData( $scripts['free'] );
			}

			$assetGroups = apply_filters( 'brizy_pro_body_assets', $assetGroups, $editorPost );
			$assetGroups = array_merge( $assetGroups, $this->popupMain->getPopupsAssets( $this->project, $editorPost, 'body' ) );
		}

		$assetAggregator = new AssetAggregator( $assetGroups );
		$this->scripts   = $assetAggregator->getAssetList();

		foreach ( $this->scripts as $asset ) {
			if ( $asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_FILE ) {
				$this->enqueueScriptAsset( $asset );
			}
		}
	}

	public function addScriptAttributes( $tag, $handle ) {
		if ( isset( $this->enqueued[ $handle ] ) ) {
			$attrs = $this->getAttributes( $this->enqueued[ $handle ] );
			$tag   = str_replace( 'src=', $attrs . ' src=', $tag );
		}

		return $tag;
	}

	public function addStyleAttributes( $tag, $handle ) {
		if ( isset( $this->enqueued[ $handle ] ) ) {
			$attrs = $this->getAttributes( $this->enqueued[ $handle ] );
			$tag   = str_replace( 'href=', $attrs . ' href=', $tag );
		}

		return $tag;
	}

	private function getCodeAssetsAsString( $assets ) {
		$content = '';
		foreach ( $assets as $script ) {
			if ( $script->getType() == Asset::TYPE_CODE ) {
				$content .= $script->getContent() . "\n";
			}
		}

		return $content;
	}

	private function enqueueStyleAsset( Asset $asset ) {
		$handle = $this->getHandle( $asset );
		switch ( $asset->getType() ) {
			case Asset::TYPE_INLINE:
				wp_register_style( $handle, false, [], BRIZY_VERSION );
				wp_enqueue_style( $handle );
				wp_add_inline_style( $handle, $asset->getContent() );
				$this->enqueued[ $handle ] = $asset;
				break;
			case Asset::TYPE_FILE:
				wp_register_style( $handle, Brizy_SiteUrlReplacer::restoreSiteUrl( $asset->getUrl() ), [], BRIZY_VERSION );
				wp_enqueue_style( $handle );
				$this->enqueued[ $handle ] = $asset;
				break;
		}
	}

	private function enqueueScriptAsset( Asset $asset ) {
		$handle = $this->getHandle( $asset );
		switch ( $asset->getType() ) {
			case Asset::TYPE_INLINE:
				wp_register_script( $handle, false, [], BRIZY_VERSION, true );
				wp_enqueue_script( $handle );
				wp_add_inline_script( $handle, $asset->getContent() );
				$this->enqueued[ $handle ] = $asset;
				break;
			case Asset::TYPE_FILE:
				wp_register_script( $handle, Brizy_SiteUrlReplacer::restoreSiteUrl( $asset->getUrl() ), [], BRIZY_VERSION, true );
				wp_enqueue_script( $handle );
				$this->enqueued[ $handle ] = $asset;
				break;
		}
	}

	private function getAttributes( $asset ) {
		$attrs = $asset->getAttrs();
		return array_reduce( array_keys( $attrs ), function ( $attrString, $key ) use ( $attrs ) {
			return $attrString . " {$key}=\"{$attrs[$key]}\"";
		}, '' );
	}

	/**
	 * @param Asset $asset
	 *
	 * @return string
	 */
	private function getHandle( Asset $asset ) {
		return Brizy_Editor::prefix() . '-asset-' . $asset->getName() . '-' . $asset->getScore();
	}
}