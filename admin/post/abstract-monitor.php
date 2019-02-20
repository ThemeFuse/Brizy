<?php


abstract class Brizy_Admin_Post_AbstractMonitor {

	/**
	 * @var string
	 */
	protected $postType;

	/**
	 * @var string[]
	 */
	protected $postMetaKeys;

	/**
	 * @param $postId
	 * @param $postType
	 *
	 * @return mixed
	 */
	abstract public function shouldStoreMetaRevision( $postId, $postType );

	/**
	 * Brizy_Admin_Post_AbstractMonitor constructor.
	 *
	 * @param $postType
	 * @param array $postMetaKeys
	 */
	public function __construct( $postType, $postMetaKeys = array() ) {
		$this->postType = $postType;
		$this->postMetaKeys = $postMetaKeys;
	}

	/**
	 * @return mixed
	 */
	public function getPostType() {
		return $this->postType;
	}

	/**
	 * @param $postType
	 *
	 * @return $this
	 */
	public function setPostType( $postType ) {
		$this->postType = $postType;

		return $this;
	}

	/**
	 * @return string[]
	 */
	public function getPostMetaKeys() {
		return $this->postMetaKeys;
	}

	/**
	 * @param string[] $postMetaKeys
	 *
	 * @return Brizy_Admin_Post_AbstractMonitor
	 */
	public function setPostMetaKeys( $postMetaKeys ) {
		$this->postMetaKeys = $postMetaKeys;

		return $this;
	}
}