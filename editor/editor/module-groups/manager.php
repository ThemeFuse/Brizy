<?php

class Brizy_Editor_Editor_ModuleGroups_Manager {

	/**
	 * @var array<Brizy_Editor_Editor_ModuleGroups_ProviderInterface>
	 */
	private $providers = [];

	public function __construct() {
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_GridProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_ArchiveProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_ProductProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_EssentialProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_MediaProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_ContentProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_SocialProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_WooArchiveProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_StoryProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_SingleProvider();
        $this->providers[] = new Brizy_Editor_Editor_ModuleGroups_WordpressProvider();

        $this->providers = apply_filters( 'brizy_editor_config_module_group_collectors', $this->providers );
	}

	public function getAll( $context ) {
        $modules = [];

		foreach ( $this->providers as $collector ) {
			if ( ! $collector->supportContext( $context ) ) {
				continue;
			}
			$modules = $this->mergeGroups( $modules, $collector->collect( $context ) );
		}

        $result = [];

        foreach ( $modules as $module ) {
            if (isset($result[$module->getPosition()])) {
                throw new Exception('The position [' . $module->getPosition() . '] is already take by other module');
            }

            $result[$module->getPosition()] = $module->toArrayStruct();
        }

        // sort by order
        ksort( $result );

		return array_values( $result );
	}

	/**
	 * @param array<Brizy_Editor_Editor_ModuleGroups_ModuleGroup> $targets
	 * @param array<Brizy_Editor_Editor_ModuleGroups_ModuleGroup> $sources
	 *
	 * @return void
	 */
	private function mergeGroups( $targets, $sources ) {
		foreach ( $sources as $j => $source ) {
			$founds = false;
			foreach ( $targets as $i => $target ) {
				if ( $target->get_label() == $source->get_label() ) {
					$targets[ $i ]->add_module_names( $source->get_module_names() );
					$founds = true;
				}
			}

			// include the source group if has not been found in targets
			if ( ! $founds ) {
				$targets[] = $source;
			}
		}

		return $targets;
	}
}