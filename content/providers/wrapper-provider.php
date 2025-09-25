<?php

class Brizy_Content_Providers_WrapperProvider extends Brizy_Content_Providers_AbstractProvider {
	public function __construct() {
		$this->registerPlaceholderName( 'group', function ( $name ) {
			return new Brizy_Content_Placeholders_GroupPlaceholder();
		} );
		$this->registerPlaceholderName( 'placeholder', function ( $name ) {
			return new Brizy_Content_Placeholders_EditorPlaceholderWrapper( "Placeholder wrapper", $name, null );
		} );
	}
}
