<?php

trait Brizy_Editor_PostTagsAware {

	/**
	 * @var string
	 */
	protected $tags;

	/**
	 * @return string
	 */
	public function getTags() {
		return $this->tags;
	}

	/**
	 * @param string $tags
	 *
	 * @return Brizy_Editor_PostTagsAware
	 */
	public function setTags( $tags ) {
		$this->tags = $tags;

		return $this;
	}

	/**
	 * @return false|string[]
	 */
	public function getTagsAsArray() {
		return explode( ',', $this->getTags() );
	}

	protected function loadInstanceTags() {
		$this->tags = get_metadata( 'post', $this->getWpPostId(), Brizy_Editor_Post::BRIZY_TAGS, true );
	}

	protected function saveInstanceTags() {
		update_metadata( 'post', $this->getWpPostId(), Brizy_Editor_Post::BRIZY_TAGS, $this->tags );
	}

}
