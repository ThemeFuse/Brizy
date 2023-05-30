<?php

class Brizy_Editor_Editor_ModuleGroups_StoryProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return $this->isStory($context);
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'essentials', [
				"StoryButton",
				"StoryIcon",
				"StoryEmbed",
				"StoryText",
				"StoryMap",
				"StoryProgressBar",
				"StoryLine",
				"StoryCountdown2",
				"StoryCounter",
				"StoryShape",
				"StoryForm2",
				"StoryStarRating",
				"StoryLottie"
			], 600 ),
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup( 'media', [
                "StoryImage",
                "StoryVideo"
            ], 650 ),
		];
	}
}


