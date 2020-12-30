<?php


class Brizy_Editor_FunnelPopup extends Brizy_Editor_Popup {
	use Brizy_Admin_Funnels_PositionAware;

	static protected $instance = null;

	/**
	 * @param $apost
	 *
	 * @return Brizy_Editor_Post|mixed
	 * @throws Exception
	 */
	public static function get( $apost, $uid = null ) {

		$wp_post_id = $apost;
		if ( $apost instanceof WP_Post ) {
			$wp_post_id = $apost->ID;
		}

		if ( isset( self::$instance[ $wp_post_id ] ) ) {
			return self::$instance[ $wp_post_id ];
		}

		return self::$instance[ $wp_post_id ] = new self( $wp_post_id );
	}

	/**
	 * Clear all cached instances;
	 */
	public static function cleanClassCache() {
		self::$instance = array();
	}

	/**
	 * @return bool
	 * @todo rename this to isGlobal
	 *
	 */
	public function isGlobalPopup() {
		return false;
	}

	public function isSavedPopup() {
		return false;
	}

	public function isCloudUpdateRequired() {
		return false;
	}

	public function setCloudUpdateRequired( $flag ) {
		throw new Exception( 'Cloud Update is not supported for Funnel Popups' );
	}

	public function setCloudId( $flag ) {
		throw new Exception( 'Cloud Update is not supported for Funnel Popups' );
	}

	public function setContainer( $flag ) {
		throw new Exception( 'Cloud Update is not supported for Funnel Popups' );
	}

	public function jsonSerialize() {
		$data = parent::jsonSerialize();
		unset( $data['cloudId'] );
		$data['funnelMeta'] = $this->getFunnelMeta();
		$data['postType'] = $this->getWpPost()->post_type;
		$data['editUrl'] = $this->edit_url();

		return $data;
	}

	public function convertToOptionValue() {
		$data = parent::convertToOptionValue();
		unset( $data['cloudId'] );

		return $data;
	}

	public function createResponse( $fields = array() ) {
		$p_id      = (int) $this->getWpPostId();
		$the_title = get_the_title( $p_id );

		$global = array(
			'title'       => $the_title,
			'slug'        => sanitize_title( $the_title ),
			'data'        => $this->get_editor_data(),
			'id'          => $p_id,
			'uid'         => $this->getUid(),
			'is_index'    => false,
			'template'    => get_page_template_slug( $p_id ),
			'status'      => get_post_status( $p_id ),
			'url'         => get_the_permalink( $p_id ),
			'dataVersion' => $this->getCurrentDataVersion(),
			'funnelMeta'  => $this->getFunnelMeta(),
			'postType'    => $this->getWpPost()->post_type,
			'editUrl'     => $this->edit_url()
		);

		return $global;
	}
}
