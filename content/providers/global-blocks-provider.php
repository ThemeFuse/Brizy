<?php

use BrizyPlaceholders\ContentPlaceholder;

class Brizy_Content_Providers_GlobalBlocksProvider extends Brizy_Content_Providers_AbstractProvider {
	public function __construct() {
		$this->registerPlaceholder(
			new Brizy_Content_Placeholders_GlobalBlocks( __( 'Brizy Global Blocks', 'brizy' ),
				'brizy_dc_global_blocks' )
		);
		$this->registerPlaceholder(
			new Brizy_Content_Placeholders_GlobalBlock( __( 'Brizy Global Block', 'brizy' ), 'brizy_dc_global_block' )
		);

	}
}
