<?php

trait Brizy_Editor_Synchronizable {

	/**
	 * @var array
	 */
	protected $cloudId;

	/**
	 * @var array
	 */
	protected $cloudAccountId;

	/**
	 * As our block class has two responsabilities :(
	 * we are forced to devine this method to restrict the logic of this
	 * trait only to instances that will return true
	 *
	 * @return mixed
	 */
	abstract protected function canBeSynchronized();

	/**
	 * @return array
	 */
	public function getCloudId() {
		return $this->cloudId;
	}

	/**
	 * @param array $cloudId
	 *
	 * @return Brizy_Editor_Synchronizable
	 */
	protected function setCloudId( $cloudId ) {
		$this->cloudId = $cloudId;

		return $this;
	}

	/**
	 * @param string $meta
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setContainer( $container ) {
		update_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-container', $container );
	}

	public function getContainer() {
		return get_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-container', true );
	}


	/**
	 * @return array
	 */
	protected function getCloudAccountId() {
		return $this->cloudAccountId;
	}

	/**
	 * @param array $cloudAccountId
	 *
	 * @return Brizy_Editor_Synchronizable
	 */
	protected function setCloudAccountId( $cloudAccountId ) {
		$this->cloudAccountId = $cloudAccountId;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isCloudUpdateRequired() {

		if ( $this->canBeSynchronized() ) {
			return (bool) get_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-update-required', true );
		}

		return false;
	}

	/**
	 * @param bool $cloudUpdateRequired
	 *
	 * @return Brizy_Editor_Block
	 */
	public function setCloudUpdateRequired( $cloudUpdateRequired ) {

		if ( $this->canBeSynchronized() ) {
			update_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-update-required', (int) $cloudUpdateRequired ? true : false );
		}

		return $this;
	}

	/**
	 * @param $cloudAccountId
	 * @param $cloudId
	 *
	 * @return $this
	 */
	public function setSynchronized( $cloudAccountId, $cloudId ) {
		if ( $this->canBeSynchronized() ) {
			$this->setCloudUpdateRequired( false );
			$this->setCloudId( $cloudId );
			$this->setCloudAccountId( $cloudAccountId );
		}

		return $this;
	}

	public function isSynchronized( $cloudAccountId ) {
		if ( $this->canBeSynchronized() ) {
			return ! empty( $this->getCloudId() ) && $cloudAccountId === $this->getCloudAccountId();
		}

		return false;
	}

	/**
	 * There are old blocks that must not be synchronized
	 *
	 * Only block that have meta key 'brizy-cloud-update-required'
	 *
	 * @return bool
	 */
	public function isSynchronizable() {
		if ( $this->canBeSynchronized() ) {
			return metadata_exists( 'post', $this->getWpPostId(), 'brizy-cloud-update-required' );
		}

		return false;
	}

}