<?php

/**
 * Module group provider for The Events Calendar elements in the editor sidebar.
 *
 * @see Brizy_Editor_Editor_ModuleGroups_ProductProvider
 */
class Brizy_Editor_Editor_ModuleGroups_TecProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface {

	use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

	public function supportContext( $context ) {
		return class_exists( 'Tribe__Events__Main' );
	}

	public function collect( $context ) {
		return [
			new Brizy_Editor_Editor_ModuleGroups_ModuleGroup(
				__( 'events', 'brizy' ),
				[ 'TECEventsList', 'TECEventCalendar' ],
				525
			),
		];
	}
}
