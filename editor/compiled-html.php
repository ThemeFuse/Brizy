<?php if ( ! defined('ABSPATH')) {
    die('Direct access forbidden.');
}

class Brizy_Editor_CompiledHtml
{

    /**
     * @var Brizy_Editor_Helper_Dom
     */
    private $dom;

    /**
     * @var Brizy_Editor_Entity
     */
    private $post;

    /**
     * @var Brizy_Editor_Content_ProcessorInterface[]
     */
    private $processors = array();

    /**
     * Brizy_Editor_CompiledHtml constructor.
     *
     * @param $html
     */
    public function __construct($brizyPost)
    {
        $this->post = $brizyPost;
        $this->dom  = new Brizy_Editor_Helper_Dom($brizyPost->get_compiled_html());
    }

    /**
     * @param Brizy_Editor_Content_ProcessorInterface[] $processors
     */
    public function setProcessors($processors)
    {
        $this->processors = $processors;
    }

    /**
     * @param Brizy_Editor_Asset_ProcessorInterface $asset_processor
     */
    public function addAssetProcessor($asset_processor)
    {
        $this->asset_processors[] = $asset_processor;
    }


    /**
     * @return string
     */
    public function get_body()
    {

        $body_tag = $this->dom->get_body();

        $content = apply_filters('brizy_body_assets', $body_tag->get_content(), $this->post);

        $content = $this->apply_processors($content);

        return $content;
    }

    /**
     * @param bool $include_parent_tag
     *
     * @return string
     */
    public function get_head()
    {
        $head_tag = $this->dom->get_head();

        $content = apply_filters('brizy_head_assets', $head_tag->get_content(), $this->post);

        $content = $this->apply_processors($content);

        return $content;
    }

    private function apply_processors($content)
    {

        $content = html_entity_decode($content, ENT_QUOTES | ENT_HTML5, get_bloginfo('charset'));

        $processors = apply_filters('brizy_apply_content_processors', $this->processors);

        foreach ($processors as $processor) {
            $content = $processor->process($content);
        }

        return $content;
    }
}
