<?php

class Brizy_Content_Providers_WrapperProvider extends Brizy_Content_Providers_AbstractProvider
{

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
        $this->registerPlaceholderName('group', function ($name) {
            return new Brizy_Content_Placeholders_GroupPlaceholder();
        });
        $this->registerPlaceholderName('placeholder', function ($name) {
            return new Brizy_Content_Placeholders_EditorPlaceholderWrapper("Placeholder wrapper", $name, null);
        });
    }
}
