<?php

class Brizy_Content_Providers_GlobalBlockProvider extends Brizy_Content_Providers_AbstractProvider
{
    public function __construct()
    {
        $this->registerPlaceholder(new Brizy_Content_Placeholders_GroupPlaceholder());
        $this->registerPlaceholder(
            new Brizy_Content_Placeholders_GlobalBlock(__('Brizy Global Block', 'brizy'), 'brizy_dc_global_block')
        );

    }
}
