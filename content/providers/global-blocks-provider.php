<?php

class Brizy_Content_Providers_GlobalBlocksProvider extends Brizy_Content_Providers_AbstractProvider
{
    public function __construct()
    {
        $this->registerPlaceholderName( 'group', function ( $name ) {
			return new Brizy_Content_Placeholders_GroupPlaceholder();
		} );
		$this->registerPlaceholderName('brizy_dc_global_block', function ($name) {
			return new Brizy_Content_Placeholders_GlobalBlock(
				__('Brizy Global Block', 'brizy'),
				$name
			);
		});

    }
}
