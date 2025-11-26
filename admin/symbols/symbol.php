<?php

class Brizy_Admin_Symbols_Symbol extends Brizy_Admin_Serializable {
	private $id;

	private $uid;

	private $label;

	private $className;

	private $componentTarget;

	private $version = 0;

	private $model;

	private $compiledStyles;

	private $linkedSymbolId;

	public function __construct( $postId = null, $uid = null, $label = null, $model = null, $version = null, $className = null, $componentTarget = null, $compiledStyles = null, $linkedSymbolId = null ) {
		$this->setId( $postId );
		$this->setUid( $uid );
		$this->setLabel( $label );
		$this->setModel( $model );
		$this->setVersion( $version );
		$this->setClassName( $className );
		$this->setComponentTarget( $componentTarget );
		$this->setCompiledStyles( $compiledStyles );
		$this->setLinkedSymbolId( $linkedSymbolId );
	}

	/**
	 * @return Brizy_Editor_CompiledSectionManager
	 */
	public function getCompiledSectionManager() {
		if ( ! $this->manager ) {
			$this->manager = new Brizy_Editor_CompiledSectionManager( '{"blocks":[ { "assets": } ]}' );
			$this->manager->setStyles( $this->getCompiledStyles() );
		}

		return $this->manager;
	}

	public function getWpPost() {
		if ( $this->getId() ) {
			return get_post( $this->getId() );
		}

		return null;
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @param mixed $id
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function setId( $id ) {
		$this->id = $id;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param mixed $uid
	 */
	public function setUid( $uid ) {
		$this->uid = $uid;
	}

	/**
	 * @return mixed
	 */
	public function getLabel() {
		return $this->label;
	}

	/**
	 * @param mixed $label
	 */
	public function setLabel( $label ) {
		$this->label = $label;
	}

	/**
	 * @return int
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * @param int $version
	 */
	public function setVersion( $version ) {
		$this->version = $version;
	}

	/**
	 * @return mixed
	 */
	public function getModel() {
		return $this->model;
	}

	/**
	 * @param mixed $model
	 */
	public function setModel( $model ) {
		$this->model = $model;
	}

	/**
	 * @return mixed
	 */
	public function getClassName() {
		return $this->className;
	}

	/**
	 * @param mixed $className
	 */
	public function setClassName( $className ) {
		$this->className = $className;
	}

	/**
	 * @return mixed
	 */
	public function getComponentTarget() {
		return $this->componentTarget;
	}

	/**
	 * @param mixed $componentTarget
	 */
	public function setComponentTarget( $componentTarget ) {
		$this->componentTarget = $componentTarget;
	}

	/**
	 * @return mixed
	 */
	public function getCompiledStyles() {
		return $this->compiledStyles;
	}

	/**
	 * @param mixed $compiledStyles
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function setCompiledStyles( $compiledStyles ) {
		$this->compiledStyles = $compiledStyles;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getLinkedSymbolId() {
		return $this->linkedSymbolId;
	}

	/**
	 * @param mixed $linkedSymbolId
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function setLinkedSymbolId( $linkedSymbolId ) {
		$this->linkedSymbolId = $linkedSymbolId;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function getCompiledAssetGroup() {
		$page_styles = $this->getCompiledStyles();
		if ( empty( $page_styles ) ) {
			return new \BrizyMerge\Assets\AssetGroup(null, [], [], [], [], []);
		}

		$page_styles = json_decode($page_styles,true);
		$assets      = [];
		if ( isset( $page_styles['styles'] ) && is_array( $page_styles['styles'] ) ) {
			foreach ( $page_styles['styles'] as $style ) {
				$assets[] = BrizyMerge\Assets\Asset::instanceFromJsonData( $style );
			}
		}

        return new \BrizyMerge\Assets\AssetGroup(null, [], [], [], [], $assets);
	}


	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {
		if ( is_null( $data ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self( isset( $data['uid'] ) ? $data['uid'] : null, isset( $data['label'] ) && ! empty( $data['label'] ) ? $data['label'] : null, isset( $data['data'] ) && ! empty( $data['data'] ) ? $data['data'] : null, isset( $data['version'] ) ? $data['version'] : null, isset( $data['className'] ) ? $data['className'] : null, isset( $data['componentTarget'] ) ? $data['componentTarget'] : null, isset( $data['compiledStyles'] ) ? $data['compiledStyles'] : null );
	}


	/**
	 * @param $json
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	static public function createFromJsonObject( $json, $postId = null ) {
		if ( is_null( $json ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self( (int) $postId, isset( $json->uid ) ? $json->uid : null, isset( $json->label ) ? $json->label : null, isset( $json->data ) ? $json->data : null, isset( $json->version ) ? $json->version : null, isset( $json->className ) ? $json->className : null, isset( $json->componentTarget ) ? $json->componentTarget : null, isset( $json->compiledStyles ) ? $json->compiledStyles : null, isset( $json->linkedSymbolId ) ? $json->linkedSymbolId : null );
	}


	/**
	 * @param Brizy_Admin_Symbols_Symbol $patch
	 *
	 * @return void
	 */
	public function patchFrom( $patch ) {
		if ( ! is_null( $patch->getModel() ) && ! empty( $patch->getModel() ) ) {
			$this->setModel( $patch->getModel() );
		}
		if ( ! is_null( $patch->getLabel() ) && ! empty( $patch->getLabel() ) ) {
			$this->setLabel( $patch->getLabel() );
		}
		if ( ! is_null( $patch->getVersion() ) && ! empty( $patch->getVersion() ) ) {
			$this->setVersion( $patch->getVersion() );
		}
		if ( ! is_null( $patch->getClassName() ) && ! empty( $patch->getClassName() ) ) {
			$this->setClassName( $patch->getClassName() );
		}
		if ( ! is_null( $patch->getComponentTarget() ) && ! empty( $patch->getComponentTarget() ) ) {
			$this->setComponentTarget( $patch->getComponentTarget() );
		}
		if ( ! is_null( $patch->getCompiledStyles() ) && ! empty( $patch->getCompiledStyles() ) ) {
			$this->setCompiledStyles( $patch->getCompiledStyles() );
		}
		if ( ! is_null( $patch->getLinkedSymbolId() ) && ! empty( $patch->getLinkedSymbolId() ) ) {
			$this->setLinkedSymbolId( $patch->getLinkedSymbolId() );
		}
	}

	public function convertToOptionValue() {
		$item = array(
			'id'              => $this->getId(),
			'uid'             => $this->getUid(),
			'label'           => $this->getLabel(),
			'className'       => $this->getClassName(),
			'componentTarget' => $this->getComponentTarget(),
			'version'         => $this->getVersion(),
			'linkedSymbolId'  => $this->getLinkedSymbolId(),
		);

		return $item;
	}

	public function convertToFullOptionValue() {
		$item                   = $this->convertToOptionValue();
		$item['compiledStyles'] = $this->getCompiledStyles();
		$item['data']           = $this->getModel();

		return $item;
	}

	public function jsonSerialize() {
		return $this->convertToOptionValue();
	}
}
