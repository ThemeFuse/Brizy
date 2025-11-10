<?php

class Brizy_Content_Providers_WrapperPlaceholderProvider extends Brizy_Content_PlaceholderProvider
{

    private static $instance;

    static public function getInstance($context = null)
    {
        if (self::$instance === null) {
            self::$instance = new self($context);
        }

        return self::$instance;
    }

    /**
     * BrizyPro_Content_ProviderPlaceholders constructor.
     *
     * $context: for back compatibility
     *
     * @param Brizy_Content_Context $context
     */
    public function __construct($context = null)
    {
        $this->providers = [];
        $this->providers[] = Brizy_Content_Providers_WrapperProvider::getInstance($context);
        $this->providers[] = Brizy_Content_Providers_GlobalBlocksProvider::getInstance($context);
    }

}
