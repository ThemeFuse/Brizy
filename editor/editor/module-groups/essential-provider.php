<?php

class Brizy_Editor_Editor_ModuleGroups_EssentialProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return !$this->isStory( $context );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'essentials', [
				"Text",
				"Image",
				"Button",
				"Icon",
				"Spacer",
				"Map",
				"Form2",
				"Line",
                "MenuSimple",
                "Menu",
				"Search"
			], 300 ),
		];
	}
}


