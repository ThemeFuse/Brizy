<?php

class Brizy_Editor_Editor_ModuleGroups_ModuleGroup {

	/**
	 * @var string
	 */
	private $label;
	/**
	 * @var array<string>
	 */
	private $moduleNames = [];

	public function __construct( $label = null, $modulesNames = [] ) {
		$this->label       = $label;
		$this->set_module_names( $modulesNames );
	}

	public function toArrayStruct() {
		return get_object_vars( $this );
	}


	/**
	 * @return string
	 */
	public function get_label() {
		return $this->label;
	}

	/**
	 * @param string $label
	 */
	public function set_label( $label ) {
		$this->label = $label;
	}

	/**
	 * @return string[]
	 */
	public function get_module_names() {
		return $this->moduleNames;
	}

	/**
	 * @param string[] $moduleNames
	 */
	public function set_module_names( $moduleNames ) {
		$this->moduleNames = array_unique(array_filter(array_values($moduleNames)));
	}

	public function add_module_names( $modulesNames ) {
		$this->set_module_names( array_merge( $this->moduleNames, $modulesNames  ));
	}
}