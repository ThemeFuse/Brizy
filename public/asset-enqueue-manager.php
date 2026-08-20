<?php

use BrizyMerge\AssetAggregator;
use BrizyMerge\Assets\Asset;
use BrizyMerge\Assets\AssetGroup;

class Brizy_Public_AssetEnqueueManager
{
    private $posts = [];
    private $scripts = [];
    private $styles = [];

    /**
     * @var Brizy_Editor_UrlBuilder
     */
    private $urlBuilder;

    /**
     * @var Brizy_Editor_Project
     */
    private $project;

    public static function _init()
    {
        static $instance;
        if (!$instance) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * @throws Exception
     */
    private function __construct()
    {
        $this->project = Brizy_Editor_Project::get();
        $this->urlBuilder = new Brizy_Editor_UrlBuilder($this->project);
        $this->registerActions();
    }

    private function registerActions()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueStyles'], 10002);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts'], 10002);
        add_filter('wp_enqueue_scripts', [$this, 'addEditorConfigVar'], 10002);
        add_filter('wp_enqueue_scripts', [$this, 'addExtensionAssets'], 10004);
        add_filter('wp_enqueue_scripts', [$this, 'addExtensionAssets'], 10004);
        add_filter('script_loader_tag', [$this, 'addScriptAttributes'], 10, 2);
        add_filter('style_loader_tag', [$this, 'addStyleAttributes'], 10, 2);
        add_action('wp_head', [$this, 'insertHeadCodeAssets']);
        add_action('wp_footer', [$this, 'insertBodyCodeAssets']);
    }

    public function addExtensionAssets()
    {
        do_action('brizy_preview_enqueue_scripts');
    }

    /**
     * @param Brizy_Editor_Post $post
     */
    public function enqueuePost($post)
    {
        if (!($post = apply_filters('brizy_asset_enqueue_post', $post))) {
            return;
        }
        $id = $post->getWpPost()->ID;
        if (!isset($this->posts[$id])) {
            $this->posts[$id] = $post;
            do_action('brizy_preview_enqueue_post', $id);
        }
    }

    /**
     * @param Brizy_Editor_Post $post
     */
    public function dequeuePost($post)
    {
        $id = $post->getWpPost()->ID;
        if (isset($this->posts[$id])) {
            unset($this->posts[$id]);
            do_action('brizy_preview_denqueue_post', $id);
        }
    }

    public function isPostEnqueued($post)
    {

        $id = null;
        if ($post instanceof WP_Post) {
            $id = $post->ID;
        } else if ($post instanceof Brizy_Editor_Entity) {
            $id = $post->getWpPostId();
        } else {
            $id = (int)$post;
        }

        return isset($this->posts[$id]);
    }

    public function insertHeadCodeAssets()
    {
        $content = $this->getCodeAssetsAsString($this->styles);
        if (empty($content)) {
            return;

        }
        echo $content;
    }

    public function insertBodyCodeAssets()
    {
        $content = $this->getCodeAssetsAsString($this->scripts);
        if (empty($content)) {
            return;

        }
        echo $content;
    }

    public function addEditorConfigVar()
    {
        $current_user = wp_get_current_user();
        $config_json = json_encode([
            'serverTimestamp' => time(),
            'currentUser' => [
                'user_login' => $current_user->user_login,
                'user_email' => $current_user->user_email,
                'user_level' => $current_user->user_level,
                'user_firstname' => $current_user->user_firstname,
                'user_lastname' => $current_user->user_lastname,
                'display_name' => $current_user->display_name,
                'ID' => $current_user->ID,
                'roles' => $current_user->roles,
            ],
        ]);
        wp_register_script('brizy-preview', '');
        wp_enqueue_script('brizy-preview');
        wp_add_inline_script('brizy-preview', "var __CONFIG__ = $config_json;", 'before');
    }

    public function enqueueStyles()
    {
        $styles = [];

        if (is_array($this->project->getCompiledStyles())) {
            $styles[] = $this->project->getCompiledAssetGroup();
        }

        foreach ($this->posts as $editorPost) {
            $sectionSet = $editorPost->getCompiledSectionManager();
            $postGroups = $sectionSet->getAssetsGroups();
            if (count($postGroups) == 0) {
                continue;
            }
            foreach ($postGroups['freeStyles'] as $i => &$aGroup) {
                $this->replacePlaceholders($aGroup, $editorPost->getWpPost(), 'head');
            }
            $styles = array_merge($styles, $postGroups['freeStyles']);

            if (isset($postGroups['proStyles'])) {
                foreach ($postGroups['proStyles'] as $i => &$aGroup) {
                    $this->replacePlaceholders($aGroup, $editorPost->getWpPost(), 'head');
                }
                $styles = array_merge($styles, $postGroups['proStyles']);
            }

        }

        $assetAggregator = new AssetAggregator($styles);
        foreach ($assetAggregator->getAssetList() as $asset) {
            /*
             * Allow the manipulation of styles from the outside,
             * for example when you have a duplicate meta tag viewport that can come from the theme,
             * you can disable ours by this filter and its name
             */
            if ($asset = apply_filters('brizy_add_style', $asset)) {
                $this->styles[$this->getHandle($asset)] = $asset;
            }
        }

        foreach ($this->styles as $handle => $asset) {
            if ($asset->getType() == Asset::TYPE_FILE) {
                wp_register_style($handle, $this->getAssetUrl($asset), [], apply_filters('brizy_asset_version', BRIZY_EDITOR_VERSION, $asset));
                wp_enqueue_style($handle);
            }
        }
        $collectInline = array_filter($this->styles, function ($asset) {
            return $asset->getType() == Asset::TYPE_INLINE;
        });
        if (count($collectInline) > 0) {
            $handleStr = 'inline-handle-' . md5(count($collectInline));
            $cachePath = $this->getInlineStylesCachePath();
            $cacheHit = false;

            if ($cachePath) {
                if (file_exists($cachePath)) {
                    // Keep mtime fresh so a still-current file isn't swept as if orphaned:
                    // writeInlineStylesCache() only sets mtime on a miss, never on reuse.
                    @touch($cachePath);
                    $cacheHit = true;
                } else {
                    $cacheHit = $this->writeInlineStylesCache($cachePath, $collectInline);
                }
            }

            if ($cacheHit) {
                wp_register_style($handleStr, $this->getInlineStylesCacheUrl($cachePath), [], null);
                wp_enqueue_style($handleStr);
            } else {
                wp_register_style($handleStr, false);
                $assetStr = array_reduce($collectInline, function ($assetStr, $asset) {
                    return $assetStr . "\n\n" . $asset->getContent();
                }, '');
                wp_enqueue_style($handleStr);
                wp_add_inline_style($handleStr, $assetStr);
            }
        }

    }

    /**
     * Absolute filesystem path for the cached, deduplicated-by-content copy of the current
     * request's concatenated inline styles, or null if the uploads dir isn't usable.
     * The filename is a hash of the actual compiled content driving the CSS (project styles +
     * each enqueued post's stored compiled sections), not a proxy like post_modified_gmt, which
     * WordPress does not update on every path that changes compiled section content (e.g. autosave).
     *
     * Returns null (forcing the wp_add_inline_style fallback) whenever any enqueued post is
     * password-protected: WordPress deliberately sends no-store headers for those responses so
     * the page itself is never cached, and this content must stay inside that same response
     * rather than becoming an independently-cacheable, unauthenticated static file.
     *
     * @return string|null
     */
    private function getInlineStylesCachePath()
    {
        foreach ($this->posts as $editorPost) {
            if (post_password_required($editorPost->getWpPost())) {
                return null;
            }
        }

        $uploadDir = Brizy_Admin_UploadDir::getUploadDir();
        if (!empty($uploadDir['error'])) {
            return null;
        }

        $cacheDir = trailingslashit($uploadDir['basedir']) . 'brizy/head-styles';
        if (!file_exists($cacheDir) && !wp_mkdir_p($cacheDir)) {
            return null;
        }
        if (!is_dir($cacheDir) || !is_writable($cacheDir)) {
            return null;
        }

        $contentSignatures = [wp_json_encode($this->project->getCompiledStyles())];
        foreach ($this->posts as $id => $editorPost) {
            $contentSignatures[$id] = $editorPost->getCompiledSections();
        }
        ksort($contentSignatures);

        return $cacheDir . '/' . md5(implode("\x00", $contentSignatures)) . '.css';
    }

    private function getInlineStylesCacheUrl($cachePath)
    {
        $uploadDir = Brizy_Admin_UploadDir::getUploadDir();

        return trailingslashit($uploadDir['baseurl']) . 'brizy/head-styles/' . basename($cachePath);
    }

    /**
     * Writes the cache file atomically (write to a temp file, then rename) so a webserver
     * serving the file directly can never read a partially-written copy.
     *
     * Occasionally sweeps cache files older than a day rather than deleting the previous
     * variant synchronously on every write: an in-flight request that already served an older
     * variant's URL to a visitor may still be fetching it, deleting it immediately could 404
     * that visitor's stylesheet.
     *
     * @param string $cachePath
     * @param Asset[] $collectInline
     *
     * @return bool
     */
    private function writeInlineStylesCache($cachePath, $collectInline)
    {
        $assetStr = array_reduce($collectInline, function ($assetStr, $asset) {
            return $assetStr . "\n\n" . $asset->getContent();
        }, '');

        $tmpPath = $cachePath . '.' . uniqid('', true) . '.tmp';
        if (@file_put_contents($tmpPath, $assetStr, LOCK_EX) === false) {
            @unlink($tmpPath);
            return false;
        }
        if (!@rename($tmpPath, $cachePath)) {
            @unlink($tmpPath);
            return false;
        }

        if (mt_rand(1, 100) === 1) {
            foreach (glob(dirname($cachePath) . '/*.css') ?: [] as $file) {
                if ($file !== $cachePath && filemtime($file) < time() - DAY_IN_SECONDS) {
                    @unlink($file);
                }
            }
        }

        return true;
    }

    public function enqueueScripts()
    {
        $assets = [];
        foreach ($this->posts as $editorPost) {
            $sectionSet = $editorPost->getCompiledSectionManager();
            $postGroups = $sectionSet->getAssetsGroups();
            if (count($postGroups) == 0) {
                continue;
            }
            foreach ($postGroups['freeScripts'] as $i => &$aGroup) {
                $this->replacePlaceholders($aGroup, $editorPost->getWpPost(), 'body');
            }
            $assets = array_merge($assets, $postGroups['freeScripts']);
            if (isset($postGroups['proScripts'])) {
                foreach ($postGroups['proScripts'] as $i => &$aGroup) {
                    $this->replacePlaceholders($aGroup, $editorPost->getWpPost(), 'body');
                }
                $assets = array_merge($assets, $postGroups['proScripts']);
            }
        }
        $assetAggregator = new AssetAggregator($assets);
        foreach ($assetAggregator->getAssetList() as $asset) {
            $this->scripts[$this->getHandle($asset)] = $asset;
        }
        $registered = [];
        foreach ($this->scripts as $handle => $asset) {
            if ($asset->getType() == Asset::TYPE_FILE) {
                wp_register_script($handle, $this->getAssetUrl($asset), [], apply_filters('brizy_asset_version', BRIZY_EDITOR_VERSION, $asset), true);
                wp_enqueue_script($handle);
                $registered[] = $asset;

            }
        }
        foreach ($this->scripts as $asset) {
            if ($asset->getType() == Asset::TYPE_INLINE) {

                $parentHandle = null;
                $position = 'after';
                foreach ($registered as $registeredAsset) {
                    if ($registeredAsset->getScore() < $asset->getScore()) {
                        $parentHandle = $this->getHandle($registeredAsset);
                    } else {
                        if ($registeredAsset->getScore() == $asset->getScore()) {
                            $parentHandle = $this->getHandle($registeredAsset);
                            $position = 'before';
                            break;
                        }
                    }
                }
                if (!$parentHandle) {
                    $parentHandle = $this->getHandle($registered[0]);
                    $position = 'before';

                }
                wp_add_inline_script($parentHandle, $asset->getContent(), $position);
            }
        }
    }

    public function addScriptAttributes($tag, $handle)
    {
        if (isset($this->scripts[$handle])) {

            $beforeId = $handle . '-js-before';
            $afterId = $handle . '-js-after';
            if (strpos($tag, $beforeId) || strpos($tag, $afterId)) {
                $position = array_search($handle, array_keys($this->scripts));
                $values = array_values($this->scripts);
                if (strpos($tag, $beforeId) && isset($values[$position - 1])) {
                    $attrs = $this->getAttributes($values[$position - 1]);
                    $tag = str_replace("id='{$beforeId}'", "{$attrs} id='{$beforeId}'", $tag);

                }
                if (strpos($tag, $afterId) && isset($values[$position + 1])) {
                    $attrs = $this->getAttributes($values[$position + 1]);
                    $tag = str_replace("id='{$afterId}'", "{$attrs} id='{$afterId}'", $tag);

                }
            }
            $attrs = $this->getAttributes($this->scripts[$handle]);
            $tag = str_replace('src=', $attrs . ' src=', $tag);
        }

        return $tag;
    }

    public function addStyleAttributes($tag, $handle)
    {
        if (isset($this->styles[$handle])) {
            $attrs = $this->getAttributes($this->styles[$handle]);
            $tag = str_replace('href=', $attrs . ' href=', $tag);
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

    private function getAssetUrl(Asset $asset)
    {

        if (strpos($asset->getUrl(), '://') !== false) {
            return $asset->getUrl();
        }

        return apply_filters('brizy_asset_url', $this->urlBuilder->asset_url($asset->getUrl()), $asset);
    }

    /**
     * @param Asset $asset
     *
     * @return string
     */
    private function getAttributes($asset)
    {
        $attrs = $asset->getAttrs();
        if (!is_array($attrs)) {
            return '';
        }

        return array_reduce(array_keys($attrs), function ($attrString, $key) use ($attrs) {
            return $attrString . ' ' . esc_attr($key) . '="' . esc_attr($attrs[$key]) . '"';
        }, '');
    }


    /**
     * @param Asset $asset
     *
     * @return string
     */
    private function getHandle(Asset $asset)
    {
        $prefix = $asset->isPro() ? "pro" : "";
        return Brizy_Editor::prefix() . "-asset-" . $asset->getName() . "-" . $asset->getScore() . "-" . $prefix;
    }

    private function replacePlaceholders(AssetGroup $ag, $post, $context)
    {

        $this->replacePlaceholderInAsset($ag->getMain(), $post, $context);
        foreach ($ag->getGeneric() as &$asset) {
            $this->replacePlaceholderInAsset($asset, $post, $context);
        }
//		foreach ( $ag->getLibsMap() as $i => &$asset ) {
//			$this->replacePlaceholderInAsset( $asset, $post, $context );
//		}
//		foreach ( $ag->getPageFonts() as $i => &$asset ) {
//			$this->replacePlaceholderInAsset( $asset, $post, $context );
//		}
        foreach ($ag->getPageStyles() as &$asset) {
            $this->replacePlaceholderInAsset($asset, $post, $context);
        }
    }

    private function replacePlaceholderInAsset(Asset $asset, $post, $context)
    {

        if ($asset->getType() == Asset::TYPE_INLINE || $asset->getType() == Asset::TYPE_CODE) {

            $assetContent = apply_filters('brizy_content', $asset->getContent(), $this->project, apply_filters('brizy_asset_manager_post', $post), $context);
            $asset->setContent($assetContent);
        }

        return $asset;
    }
}
