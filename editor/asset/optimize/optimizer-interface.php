<?php

interface Brizy_Editor_Asset_Optimize_OptimizerInterface {

	/**
	 * Brizy_Editor_Asset_Optimize_OptimizerInterface constructor.
	 *
	 * @param $settings
	 */
	public function __construct( $settings );

	/**
	 * @return mixed
	 */
	public function validateConfig();

	/**
	 * @param $sourcePath
	 * @param $targetPath
	 *
	 * @return mixed
	 */
	public function optimize( $sourcePath, $targetPath );

	/**
	 * @return mixed
	 */
	static public function getId();
}