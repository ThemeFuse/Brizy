<?php

final class Brizy_Editor_ThirdParty_Extension implements Brizy_Editor_ThirdParty_ExtensionInterface {


	private $publicPath;
	private $name;
	private $title;
	private $category;
	/**
	 * @var void[]
	 */
	private $editorScripts;
	/**
	 * @var void[]
	 */
	private $viewScripts;
	/**
	 * @var void[]
	 */
	private $editorStyles;
	/**
	 * @var void[]
	 */
	private $viewStyles;
	private $version;


	public function __construct( $publicUrl, $file ) {

		$this->publicPath = $publicUrl;
		if ( ! file_exists( $file ) ) {
			throw new \Exception( "File $file does not exist" );
		}
		$config = json_decode( file_get_contents( $file ) );
		if ( is_null( $config ) ) {
			throw new \Exception( "Invalid config object provided" );
		}
		$this->name     = $config->name;
		$this->title    = $config->title;
		$this->version  = $config->version;
		$this->category = $config->category;
		$closure = function ( $file ) {
			if ( strpos( $file, "http" ) !== 0 ) {
				return $this->publicPath . $file;
			}

			return $file;
		};
		$this->editorScripts = \array_map( $closure, $config->editorScripts ?: [] );
		$this->viewScripts   = \array_map( $closure, $config->viewScripts ?: [] );
		$this->editorStyles  = \array_map( $closure, $config->editorStyles ?: [] );
		$this->viewStyles    = \array_map( $closure, $config->viewStyles ?: [] );

	}

	/**
	 * @return mixed
	 */
	public function getPublicPath() {
		return $this->publicPath;
	}

	/**
	 * @return mixed
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @return mixed
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * @return mixed
	 */
	public function getCategory() {
		return $this->category;
	}

	/**
	 * @return void[]
	 */
	public function getEditorScripts() {
		return $this->editorScripts;
	}

	/**
	 * @return void[]
	 */
	public function getViewScripts() {
		return $this->viewScripts;
	}

	/**
	 * @return void[]
	 */
	public function getEditorStyles() {
		return $this->editorStyles;
	}

	/**
	 * @return void[]
	 */
	public function getViewStyles() {
		return $this->viewStyles;
	}

	/**
	 * @return mixed
	 */
	public function getVersion() {
		return $this->version;
	}
}