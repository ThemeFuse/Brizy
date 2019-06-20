<?php


abstract class Brizy_Editor_Components_Abstract_Component {

	protected $context;

	/**
	 * @return mixed
	 */
	abstract public function getConfig();

	/**
	 * @return mixed
	 */
	abstract public function getData();

	/**
	 * @return string[]
	 */
	abstract public function getAssets();

	/**
	 * @return string
	 */
	abstract protected function getHtmlTemplate();

	/**
	 * @return string
	 */
	abstract protected function getCssTemplate();

	/**
	 * @return string
	 */
	abstract public function getId();

	/**
	 * @return mixed
	 */
	public function getContext() {
		return $this->context;
	}

	/**
	 * @param mixed $context
	 *
	 * @return Brizy_Editor_Components_Abstract_Component
	 */
	public function setContext( $context ) {
		$this->context = $context;

		return $this;
	}
}