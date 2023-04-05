<?php

interface Brizy_Editor_Editor_ModuleGroups_ProviderInterface {
	public function collect($context);

	public function supportContext($context);
}