<?php

interface Brizy_Editor_ThirdParty_ExtensionInterface {

	public function getPublicPath();

	/**
	 * @return mixed
	 */
	public function getName();

	/**
	 * @return mixed
	 */
	public function getTitle();

	/**
	 * @return mixed
	 */
	public function getCategory();

	/**
	 * @return void[]
	 */
	public function getEditorScripts();

	/**
	 * @return void[]
	 */
	public function getViewScripts();

	/**
	 * @return void[]
	 */
	public function getEditorStyles();

	/**
	 * @return void[]
	 */
	public function getViewStyles();

	/**
	 * @return mixed
	 */
	public function getVersion();
}