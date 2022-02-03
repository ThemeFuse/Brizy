<?php

use BrizyMerge\AssetAggregator;
use BrizyMerge\Assets\Asset;
use BrizyMerge\Assets\AssetGroup;

class Brizy_Public_AssetEnqueueManager {
	private $posts = [];
	private $scripts = [];
	private $styles = [];
	private $enqueued = [];
	private $mainJsHandle = null;
	private $mainCssHandle = null;
	private $urlBuilder;

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
		$this->project    = Brizy_Editor_Project::get();
		$this->urlBuilder = new Brizy_Editor_UrlBuilder( $this->project );

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

	/**
	 * @param Brizy_Editor_Post $post
	 */
	public function dequeuePost( $post ) {
		$id = $post->getWpPost()->ID;

		if ( isset( $this->posts[ $id ] ) ) {
			unset( $this->posts[ $id ] );
		}
	}

	public function insertHeadCodeAssets() {

		$content = $this->getCodeAssetsAsString( $this->styles );

		if ( empty( $content ) ) {
			return;
		}

		echo $content;
	}

	public function insertBodyCodeAssets() {

		$content = $this->getCodeAssetsAsString( $this->scripts );

		if ( empty( $content ) ) {
			return;
		}

		echo $content;
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
		$ours   = [];
		$others = [];

		foreach ( $this->posts as $editorPost ) {
			$styles = $editorPost->getCompiledStyles();

			if ( ! empty( $styles['free'] ) ) {
				$ours[] = $ourGroup = AssetGroup::instanceFromJsonData( $styles['free'] );
				$this->replacePlaceholders( $ourGroup, $editorPost->getWpPost(), 'head' );
			}

			$_others = apply_filters( 'brizy_pro_head_assets', [], $editorPost );

			foreach ( $_others as &$otherGroup ) {
				$this->replacePlaceholders( $otherGroup, $editorPost->getWpPost(), 'body' );
			}

			$others = array_merge($others,$_others);
		}

		$assetAggregator     = new AssetAggregator( array_merge( $ours, $others ) );
		$this->styles        = $assetAggregator->getAssetList();
		$this->mainCssHandle = $this->getMainFileHandle( 'styles' );

		foreach ( $this->styles as $asset ) {
			if ( $asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_FILE ) {
				$this->enqueueStyleAsset( $asset );
			}
		}
	}

	public function enqueueScripts() {
		$ours   = [];
		$others = [];

		foreach ( $this->posts as $editorPost ) {
			$scripts = $editorPost->getCompiledScripts();

			if ( ! empty( $scripts['free'] ) ) {
				$ours[] = $ourGroup = AssetGroup::instanceFromJsonData( $scripts['free'] );
				$this->replacePlaceholders( $ourGroup, $editorPost->getWpPost(), 'body' );
			}

			$_others = apply_filters( 'brizy_pro_body_assets', [], $editorPost );

			foreach ( $_others as &$otherGroup ) {
				$this->replacePlaceholders( $otherGroup, $editorPost->getWpPost(), 'body' );
			}

			$others = array_merge($others,$_others);
		}

		$assetAggregator    = new AssetAggregator( array_merge( $ours, $others ) );
		$this->scripts      = $assetAggregator->getAssetList();
		$this->mainJsHandle = $this->getMainFileHandle( 'scripts' );

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
		$handle = $this->getHandle( $asset, 'css' );
		switch ( $asset->getType() ) {
			case Asset::TYPE_INLINE:
				wp_add_inline_style( $this->mainCssHandle, $asset->getContent() );
				$this->enqueued[ $handle ] = $asset;
				break;
			case Asset::TYPE_FILE:
				wp_register_style( $handle, $this->getAssetUrl( $asset ), [], apply_filters( 'brizy_asset_version', BRIZY_VERSION, $asset ) );
				wp_enqueue_style( $handle );
				$this->enqueued[ $handle ] = $asset;
				break;
		}
	}

	private function enqueueScriptAsset( Asset $asset ) {
		$handle = $this->getHandle( $asset, 'js' );
		switch ( $asset->getType() ) {
			case Asset::TYPE_INLINE:
				wp_add_inline_script( $this->mainJsHandle, $asset->getContent() );
				$this->enqueued[ $handle ] = $asset;
				break;
			case Asset::TYPE_FILE:
				wp_register_script( $handle, $this->getAssetUrl( $asset ), [], apply_filters( 'brizy_asset_version', BRIZY_VERSION, $asset ), true );
				wp_enqueue_script( $handle );
				$this->enqueued[ $handle ] = $asset;
				break;
		}
	}

	private function getAssetUrl( Asset $asset ) {

		if ( strpos( $asset->getUrl(), '://' ) ) {
			return $asset->getUrl();
		}

		return apply_filters( 'brizy_asset_url', $this->urlBuilder->plugin_url( $asset->getUrl() ), $asset );
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
	private function getHandle( Asset $asset, $type) {
		return Brizy_Editor::prefix() . '-asset-' . $asset->getName() . '-' . $asset->getScore() . '-' . $type;
	}

	private function replacePlaceholders( AssetGroup $ag, $post, $context ) {

		$this->replacePlaceholderInAsset( $ag->getMain(), $post, $context );

		foreach ( $ag->getGeneric() as &$asset ) {
			$this->replacePlaceholderInAsset( $asset, $post, $context );
		}
//		foreach ( $ag->getLibsMap() as $i => &$asset ) {
//			$this->replacePlaceholderInAsset( $asset, $post, $context );
//		}
//		foreach ( $ag->getPageFonts() as $i => &$asset ) {
//			$this->replacePlaceholderInAsset( $asset, $post, $context );
//		}
		foreach ( $ag->getPageStyles() as &$asset ) {
			$this->replacePlaceholderInAsset( $asset, $post, $context );
		}

	}

	private function replacePlaceholderInAsset( Asset $asset, $post, $context ) {

		if ( $asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_CODE ) {

			$assetContent = apply_filters(
				'brizy_content',
				$asset->getContent(),
				$this->project,
				apply_filters( 'brizy_asset_manager_post', $post ),
				$context
			);

			$asset->setContent( $assetContent );
		}

		return $asset;
	}

	private function getMainFileHandle( $type ) {

		if ( ! $this->{$type} ) {
			return null;
		}

		$handle = null;

		foreach ( $this->{$type} as $asset ) {
			if ( $asset->getName() == 'main' ) {
				$handle = $this->getHandle( $asset, ( $type == 'scripts' ? 'js' : 'css' ) );
				break;
			}
		}

		return $handle;
	}
}