<?php


class Brizy_Content_PlaceholderWrapperProcessor
{

    /**
     * @var Brizy_Editor_Content_ProcessorInterface[]
     */
    private $processors = array();


    /**
     * @var Brizy_Content_Context
     */
    private $context;

    /**
     * @param Brizy_Content_Context $context
     */
    public function __construct(Brizy_Content_Context $context)
    {
        $this->context = $context;
        $this->processors[] = new Brizy_Content_ReferencedGlobalBlockProcessor(); // collect all referenced blocks
        $this->processors[] = new Brizy_Content_BlocksProcessor(); // inserts the global blocks and popups referenced
        $this->processors[] = new Brizy_Content_WrapperToPlaceholderProcessor();
    }

    /**
     * @param $content
     *
     * @return string
     */
    public function process($content)
    {
        foreach ($this->processors as $processor) {
            $content = $processor->process($content, $this->context);
        }

        return $content;
    }

    /**
     * @param Brizy_Content_Context $context
     */
    public function setContext($context)
    {
        $this->context = $context;
    }
}
