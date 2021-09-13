<?php

class Brizy_Editor_Zip_ArchiveItem {
	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var bool
	 */
	private $pro;

	/**
	 * @var string
	 */
	private $uid;

	public function __construct( $uid, $isPro ) {
		$this->pro = $isPro;
		$this->uid = $uid;
	}

	/**
	 * @return Brizy_Editor_Post
	 */
	public function getPost() {
		return $this->post;
	}

	/**
	 * @param Brizy_Editor_Post $post
	 *
	 * @return Brizy_Editor_Zip_ArchiveItem
	 */
	public function setPost( $post ) {
		$this->post = $post;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isPro() {
		return $this->pro;
	}

	/**
	 * @param bool $pro
	 *
	 * @return Brizy_Editor_Zip_ArchiveItem
	 */
	public function setIsPro( $pro ) {
		$this->pro = $pro;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getUid() {
		return $this->uid;
	}

}