<?php

class Brizy_Content_Providers_GlobalBlockProvider extends Brizy_Content_Providers_AbstractProvider
{
    /**
     * @var Brizy_Content_Providers_GlobalBlockProvider
     */
    private static $instance;

    static public function getInstance($context = null)
    {
        if (self::$instance === null) {
            self::$instance = new self($context);
        }

        return self::$instance;
    }

    public function __construct()
    {
        $this->registerPlaceholderName('brizy_dc_global_block', function ($name) {
            return new Brizy_Content_Placeholders_GlobalBlock(__('Brizy Global Block', 'brizy'), $name);
        });

        $this->registerPlaceholderName('group', function ($name) {
            return new Brizy_Content_Placeholders_GroupPlaceholder();
        });

    }
}
