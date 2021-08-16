<?php

use BrizyMerge\AssetAggregator;
use BrizyMerge\Assets\Asset;
use BrizyMerge\Assets\AssetGroup;

class Brizy_Public_AssetEnqueueManager
{
    /**
     * @var Brizy_Editor_Entity
     */
    private $post;

    /**
     * @var array
     */
    private $postStylesAssetCache;

    /**
     * @var array
     */
    private $postScriptAssetCache;

    private $enqueuedAssets;

    public function __construct(Brizy_Editor_Entity $post)
    {
        $this->post = $post;
        $this->postStylesAssetCache = [];
        $this->postScriptAssetCache = [];
        $this->enqueuedAssets = [];
    }

    public function registerActions()
    {
	    add_action( 'wp_enqueue_scripts', [ $this, 'enqueueStyles' ], 20 );
	    add_action( 'wp_enqueue_scripts', [ $this, 'enqueueScripts' ], 20 );
	    add_filter( 'script_loader_tag', [ $this, 'addScriptAttributes' ], 10, 2 );
	    add_filter( 'style_loader_tag', [ $this, 'addStyleAttributes' ], 10, 2 );
	    add_filter( 'wp_enqueue_scripts', [ $this, 'addEditorConfigVar' ] );
	    add_action( 'wp_head', [ $this, 'insertHeadCodeAssets' ] );
	    add_action( 'wp_footer', [ $this, 'insertBodyCodeAssets' ] );
    }

    public function insertHeadCodeAssets() {

	    $assets  = $this->getCodeStylesAsString();
	    $assets .= Brizy_Admin_Popups_Main::_init()->getPopupsHtml( Brizy_Editor_Project::get(), $this->post, 'head' );

	    if ( empty( $assets ) ) {
	    	return;
	    }

        echo apply_filters(
            'brizy_content',
            "\n\n<!-- BRIZY HEAD ASSETS -->\n\n" . $assets . "\n\n<!-- END BRIZY HEAD ASSETS -->\n\n",
            Brizy_Editor_Project::get(),
            $this->post->getWpPost(),
            'head'
        );
    }

    public function insertBodyCodeAssets() {

    	$assets = $this->getCodeScriptsAsString();

	    if ( empty( $assets ) ) {
		    return;
	    }

        echo apply_filters(
            'brizy_content',
	        '<!-- BRIZY BODY ASSETS -->\n\n' . $assets . '\n\n<!-- END BRIZY BODY ASSETS -->',
            Brizy_Editor_Project::get(),
            $this->post->getWpPost(),
            'body'
        );
    }

    public function addEditorConfigVar() {
        $current_user = wp_get_current_user();
        $config_json = json_encode(
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

    public function enqueueStyles()
    {
        // get all assets needed for this page
        $project = Brizy_Editor_Project::get();
        $styles = $this->post->getCompiledStyles();
        $assetGroups = [];
        if (isset($styles['free']) && !empty($styles['free'])) {
            $assetGroups[] = AssetGroup::instanceFromJsonData($styles['free']);
        }
        $assetGroups = apply_filters('brizy_pro_head_assets', $assetGroups, $this->post);

        // add popups and popup assets
        $popupMain = Brizy_Admin_Popups_Main::_init();

        $assetGroups = array_merge($assetGroups, $popupMain->getPopupsAssets($project, $this->post, 'head'));

        $assetAggregator = new AssetAggregator($assetGroups);

        // include content
        $this->postStylesAssetCache[$this->post->getWpPostId()] = $assets = $assetAggregator->getAssetList();

        foreach ($assets as $asset) {
            if ($asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_FILE) {
                $this->enqueueStyleAsset($asset);
            }
        }
    }

    public function enqueueScripts()
    {
        // get all assets needed for this page
        $project = Brizy_Editor_Project::get();
        $scripts = $this->post->getCompiledScripts();
        $assetGroups = [];

        if (!empty($scripts['free'])) {
            $assetGroups[] = AssetGroup::instanceFromJsonData($scripts['free']);
        }
        $assetGroups = apply_filters('brizy_pro_body_assets', $assetGroups, $this->post);

        // add popups and popup assets
        $popupMain = Brizy_Admin_Popups_Main::_init();

        $assetGroups = array_merge($assetGroups, $popupMain->getPopupsAssets($project, $this->post, 'body'));
        $assetAggregator = new AssetAggregator($assetGroups);

        // include content
        $this->postScriptAssetCache[$this->post->getWpPostId()] = $assets = $assetAggregator->getAssetList();

        foreach ($assets as $asset) {
            if ($asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_FILE) {
                $this->enqueueScriptAsset($asset);
            }
        }
    }

    public function getCodeStylesAsString()
    {
        $assets = $this->postStylesAssetCache[$this->post->getWpPostId()];
        return $this->getCodeAssetsAsString($assets);
    }

    public function getCodeScriptsAsString()
    {
        $assets = $this->postScriptAssetCache[$this->post->getWpPostId()];
        return $this->getCodeAssetsAsString($assets);
    }

    public function addScriptAttributes($tag, $ahandle)
    {
        if (isset($this->enqueuedAssets[$ahandle])) {
            $attributes = $this->getAttributes($asset = $this->enqueuedAssets[$ahandle]);
            $tag = str_replace('src=', $attributes . ' src=', $tag);
        }

        return $tag;
    }
    public function addStyleAttributes($tag, $ahandle)
    {
        if (isset($this->enqueuedAssets[$ahandle])) {
            $attributes = $this->getAttributes($asset = $this->enqueuedAssets[$ahandle]);
            $tag = str_replace('href=', $attributes . ' href=', $tag);
        }

        return $tag;
    }

    private function getCodeAssetsAsString($assets)
    {
        $content = '';
        foreach ($assets as $script) {
            if ($script->getType() == Asset::TYPE_CODE) {
                $content .= $script->getContent() . "\n";
            }
        }

        return $content;
    }

    private function enqueueStyleAsset(Asset $asset)
    {
        $handle = $this->getHandle($asset);
        switch ($asset->getType()) {
            case Asset::TYPE_INLINE:
                wp_register_style($handle, false, [], BRIZY_VERSION);
                wp_enqueue_style($handle);
                wp_add_inline_style($handle, $asset->getContent());
                $this->enqueuedAssets[$handle] = $asset;
                break;
            case Asset::TYPE_FILE:
                wp_enqueue_style($handle, Brizy_SiteUrlReplacer::restoreSiteUrl($asset->getUrl()), [], BRIZY_VERSION);
                $this->enqueuedAssets[$handle] = $asset;
                break;
        }
    }

    private function enqueueScriptAsset(Asset $asset)
    {
        $handle = $this->getHandle($asset);
        switch ($asset->getType()) {
            case Asset::TYPE_INLINE:
                wp_register_script($handle, false, [], BRIZY_VERSION, true);
                wp_enqueue_script($handle, false, [], false, true);
                wp_add_inline_script($handle, $asset->getContent());
                $this->enqueuedAssets[$handle] = $asset;

                break;
            case Asset::TYPE_FILE:
                wp_enqueue_script($handle, Brizy_SiteUrlReplacer::restoreSiteUrl($asset->getUrl()), [], BRIZY_VERSION, true);
                $this->enqueuedAssets[$handle] = $asset;

                break;
        }
    }

    private function getAttributes($asset)
    {
        $attrs = $asset->getAttrs();
        $attributes = array_reduce(array_keys($attrs), function ($attrString, $key) use ($attrs) {
            return $attrString . " {$key}=\"{$attrs[$key]}\"";
        }, '');
        return $attributes;

    }

    /**
     * @param Asset $asset
     * @return string
     */
    private function getHandle(Asset $asset)
    {
        $handle = Brizy_Editor::prefix() . '-asset-' . $asset->getName() . '-' . $asset->getScore();
        return $handle;
    }
}