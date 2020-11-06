<?php

class Brizy_Editor_Asset_Optimize_Optimizer {

	/**
	 * @var string[]
	 */
	private $optimizers;

	/**
	 * Brizy_Editor_Asset_Optimize_Optimizer constructor.
	 */
	public function __construct() {
		$this->optimizers = array( 'Brizy_Editor_Asset_Optimize_ShortpixelOptimizer' );
	}

	/**
	 * @param $source
	 * @param $target
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	private function optimizerLoop( $source, $target ) {
		$settings = Brizy_Editor_Project::get()->getImageOptimizerSettings();
		foreach ( $this->optimizers as $optimizerClass ) {
			try {
				/**
				 * @var Brizy_Editor_Asset_Optimize_OptimizerInterface $optimizer
				 */
				$settings  = isset( $settings[ $optimizerClass::getId() ] ) ? $settings[ $optimizerClass::getId() ] : null;
				$optimizer = new $optimizerClass( $settings );

				return $optimizer->optimize( $source, $target );

			} catch ( Exception $e ) {
				Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
				continue;
			}
		}

		return false;
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $filter
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function optimize( $source, $target ) {

		if ( ! file_exists( $source ) ) {
			throw new Exception( 'Unable to optimize media. Source file not found.' );
		}

		if ( ! is_writable( dirname( $target ) ) ) {
			throw new Exception( 'Unable to optimize media. Target directory is not writable.' );
		}

		try {
			wp_raise_memory_limit( 'image' );
			$result = $this->optimizerLoop( $source, $target );

			return $result;
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

			return false;
		}
	}
}