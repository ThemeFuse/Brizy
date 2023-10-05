<?php

class Brizy_Editor_Editor_ModuleGroups_SocialProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return !$this->isStory( $context );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'social', [
                "Facebook",
                "Twitter",
                "FacebookComments"
            ], 450 ),
		];
	}
}


