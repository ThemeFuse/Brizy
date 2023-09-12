<?php

use BrizyPlaceholders\ContentPlaceholder;

class Brizy_Content_Providers_WrapperProvider extends Brizy_Content_Providers_AbstractProvider
{
    public function __construct()
    {
        $this->registerPlaceholder(new Brizy_Content_Placeholders_EditorPlaceholderWrapper("Placeholder wrapper", 'placeholder', null));
    }
}
