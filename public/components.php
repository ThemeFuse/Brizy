<?php

class Brizy_Public_Components {

	/**
	 * @var Brizy_Public_Components
	 */
	static private $instance;

	/**
	 * @var Brizy_Editor_Components_Abstract_Component[]
	 */
	private $components;


	static public function instance() {
		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self();
	}

	/**
	 * Brizy_Public_Component constructor.
	 */
	protected function __construct() {
		$this->components = [
			new Brizy_Editor_Components_LatestComments_Main()
		];

		self::$instance = $this;
	}

	public function initialize() {
		$this->components = apply_filters( 'brizy-editor-components', $this->components );
		$this->validateComponents( $this->components );
		$this->enqueueAssets();

		add_filter( 'brizy_compiler_params', array( $this, 'compilerParams' ) );
	}

	/**
	 * @param $id
	 *
	 * @return Brizy_Editor_Components_Abstract_Component|mixed
	 */
	public function getComponent( $id ) {
		foreach ( $this->components as $component ) {
			if ( $component->getId() === $id ) {
				return $component;
			}
		}
	}

	/**
	 * @param Brizy_Editor_Components_Abstract_Component $component
	 *
	 * @return $this
	 */
	public function addComponent( Brizy_Editor_Components_Abstract_Component $component ) {
		$this->components[] = $component;

		return $this;
	}

	/**
	 * @return Brizy_Editor_Components_Abstract_Component[]
	 */
	public function getComponents() {
		return $this->components;
	}

	/**
	 * @param $params
	 *
	 * @return mixed
	 */
	public function compilerParams( $params ) {

		$params['thirdPartyComponents'] = $this->components;

		return $params;
	}

	/**
	 * @param $components
	 *
	 * @return array
	 */
	private function validateComponents( $components ) {
		foreach ( $components as $i => $component ) {
			if ( ! ( $component instanceof Brizy_Editor_Components_Abstract_Component ) ) {
				unset( $components[ $i ] );
			}
		}

		return array_values( $components );
	}

	private function enqueueAssets() {
		foreach ( $this->components as $component ) {
			$assets = $component->getAssets();

			foreach ( $assets as $i => $asset ) {

				$file_parts = pathinfo( $asset );

				if ( $file_parts['extension'] == 'js' ) {
					wp_enqueue_script( "brizy_component_script_" . $component->getId() . "_{$i}", $asset, array( 'brizy-editor' ), false, true );
				}
				if ( $file_parts['extension'] == 'css' ) {
					wp_enqueue_style( "brizy_component_style_" . $component->getId() . "_{$i}", $asset, array() );
				}
			}
		}
	}

}