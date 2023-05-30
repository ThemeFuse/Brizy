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

    /**
     * @var int
     */
    private $position;

    public function __construct( $label = null, $modulesNames = [], $position = 0 ) {
        $this->label = $label;
        $this->set_module_names( $modulesNames );
        $this->position = $position;
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
        $this->moduleNames = array_values(array_unique(array_filter($moduleNames)));
    }

    public function add_module_names( $modulesNames ) {
        $this->set_module_names(array_merge( $this->moduleNames, $modulesNames ));
    }

    /**
     * @return int|mixed
     */
    public function getPosition() {
        return $this->position;
    }

    /**
     * @param int|mixed $position
     * @return Brizy_Editor_Editor_ModuleGroups_ModuleGroup
     */
    public function setPosition( $position ) {
        $this->position = $position;

        return $this;
    }

}