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
	 * @var string[]
	 */
	protected $synchronizedWith = [];

	/**
	 * As our block class has two responsabilities :(
	 * we are forced to devine this method to restrict the logic of this
	 * trait only to instances that will return true
	 *
	 * @return mixed
	 */
	abstract protected function canBeSynchronized();

//	/**
//	 * @return array
//	 */
//	public function getCloudId() {
//		return $this->cloudId;
//	}
//
//	/**
//	 * @param array $cloudId
//	 *
//	 * @return Brizy_Editor_Synchronizable
//	 */
//	protected function setCloudId( $cloudId ) {
//		$this->cloudId = $cloudId;
//
//		return $this;
//	}

//	/**
//	 * @param string $meta
//	 *
//	 * @return Brizy_Editor_Block
//	 */
//	public function setContainer( $container ) {
//		update_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-container', $container );
//	}
//
//	/**
//	 * @return array|false|mixed|string|null
//	 */
//	public function getContainer() {
//		return get_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-container', true );
//	}
//
//
//	/**
//	 * @return array
//	 */
//	protected function getCloudAccountId() {
//		return $this->cloudAccountId;
//	}
//
//	/**
//	 * @param array $cloudAccountId
//	 *
//	 * @return Brizy_Editor_Synchronizable
//	 */
//	protected function setCloudAccountId( $cloudAccountId ) {
//		$this->cloudAccountId = $cloudAccountId;
//
//		return $this;
//	}

	/**
	 * @param $cloudAccountId
	 *
	 * @return string|null
	 */
	public function getCloudId( $cloudAccountId ) {
		if ( isset( $this->synchronizedWith[ $cloudAccountId ] ) ) {
			return $this->synchronizedWith[ $cloudAccountId ];
		}

		return null;
	}

	/**
	 * Load synchronisation data
	 */
	public function loadSynchronizationData() {
		$key                    = 'brizy-cloud-synchronised-with';
		$this->synchronizedWith = get_metadata( 'post', $this->getWpPostId(), $key, true );

		if ( ! is_array( $this->synchronizedWith ) ) {
			$this->synchronizedWith = [];
		}
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
//	public function setCloudUpdateRequired( $cloudUpdateRequired ) {
//
//		if ( $this->canBeSynchronized() ) {
//			update_metadata( 'post', $this->getWpPostId(), 'brizy-cloud-update-required', (int) $cloudUpdateRequired ? true : false );
//		}
//
//		return $this;
//	}

	/**
	 * @param $cloudAccountId
	 * @param $cloudId
	 *
	 * @return $this
	 */
	public function setSynchronized( $cloudAccountId, $cloudId ) {
		if ( $this->canBeSynchronized() ) {
			$key                                       = 'brizy-cloud-synchronised-with';
			$this->synchronizedWith[ $cloudAccountId ] = $cloudId;
			update_metadata( 'post', $this->getWpPostId(), $key, $this->synchronizedWith );
			//$this->setCloudUpdateRequired( false );
		}

		return $this;
	}

	public function isSynchronized( $cloudAccountId ) {
		if ( $this->canBeSynchronized() ) {
			return isset( $this->synchronizedWith[ $cloudAccountId ] );
		}

		return false;
	}

	/**
	 * We should allow only the new versions of blocks and layouts to be syncronized
	 *
	 * @param $cloudAccountId
	 *
	 * @return bool
	 */
	public function isSynchronizable( $cloudAccountId ) {
		if ( $this->canBeSynchronized() ) {
			return metadata_exists( 'post', $this->getWpPostId(), 'brizy-media' );
		}

		return false;
	}

}
