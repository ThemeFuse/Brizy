<?php



/**
 * Class BrizyPro_Content_Placeholder
 */
class Brizy_Content_ContentPlaceholder {

	/**
	 * @var string
	 */
	protected $uid;

	/**
	 * @var string
	 */
	protected $placeholder;

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var []
	 */
	protected $attributes;

	/**
	 * @var string
	 */
	protected $content;

	/**
	 * BrizyPro_Content_ContentPlaceholder constructor.
	 *
	 * @param $name
	 * @param $placeholder
	 * @param null $attributes
	 * @param null $content
	 */
	public function __construct( $name, $placeholder, $attributes = null, $content = null ) {

		$this->setUid( md5( microtime() . rand( 0, PHP_INT_MAX ).$placeholder ) );
		$this->setPlaceholder( $placeholder );
		$this->setName( $name );
		$this->setAttributes( $attributes );
		$this->setContent( $content );
	}

	/**
	 * @return string
	 */
	public function getUid() {
		return $this->uid;
	}

	/**
	 * @param $uid
	 *
	 * @return $this
	 */
	public function setUid( $uid ) {
		$this->uid = $uid;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getPlaceholder() {
		return $this->placeholder;
	}

	/**
	 * @param $placeholder
	 *
	 * @return $this
	 */
	public function setPlaceholder( $placeholder ) {
		$this->placeholder = $placeholder;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param $name
	 *
	 * @return $this
	 */
	public function setName( $name ) {
		$this->name = $name;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getAttributes() {
		return $this->attributes;
	}

	/**
	 * @param $attributes
	 *
	 * @return $this
	 */
	public function setAttributes( $attributes ) {
		$this->attributes = $attributes;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getContent() {
		return $this->content;
	}

	/**
	 * @param $content
	 *
	 * @return $this
	 */
	public function setContent( $content ) {
		$this->content = $content;

		return $this;
	}


}