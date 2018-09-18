<?php

class Brizy_Editor_UrlBuilder {

	/**
	 * @var Brizy_Editor_Project
	 */
	protected $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	protected $post;

	/**
	 * @var int
	 */
	protected $post_id;

	/**
	 * @var array
	 */
	protected $upload_dir;

	/**
	 * Brizy_Editor_UrlBuilder constructor.
	 *
	 * @param Brizy_Editor_Project|null $project
	 * @param int|null $post_id
	 */
	public function __construct( $project = null, $post_id = null ) {

		$this->project = $project;
		$this->post_id = $post_id;

		$this->upload_dir = Brizy_Admin_UploadDir::getUploadDir( null, true );
	}

	/**
	 * @return Brizy_Admin_UrlIterator
	 */
	public function compiler_url() {
		return Brizy_Config::getCompilerUrls();
	}


	/**
	 * @return Brizy_Admin_UrlIterator
	 */
	public function application_form_url() {

		$form_url = sprintf( Brizy_Config::BRIZY_APPLICATION_FORM_URL, Brizy_Config::BRIZY_APPLICATION_FORM_ID, urlencode( $this->multipass_url() ) );

		$urls = array();

		foreach ( Brizy_Config::getEditorBaseUrls() as $url ) {
			$urls[] = $url . $form_url;
		}

		return new Brizy_Admin_UrlIterator( $urls );
	}

	public function application_form_notification_url() {

		$urls = array();

		foreach ( Brizy_Config::getEditorBaseUrls() as $url ) {
			$urls[] = $url . Brizy_Config::BRIZY_APPLICATION_FORM_NOTIFICATION_URL;
		}

		return new Brizy_Admin_UrlIterator( $urls );
	}

	/**
	 * @param $post
	 */
	public function set_post_id( $post_id ) {
		$this->post_id = $post_id;
	}

	public function multipass_url() {
		return set_url_scheme( admin_url( 'admin-ajax.php' ) ) . "?action=brizy_multipass_create&client_id=" . Brizy_Config::BRIZY_APPLICATION_FORM_ID;
	}


	public function proxy_url( $end_point ) {

		$params = array();

		if ( $this->post_id ) {
			$params['brizy_post'] = ( (int) $this->post_id );
		}

		// do not move this line
		$params['brizy'] = $end_point;

		return add_query_arg( $params, home_url() );
	}

	/**
	 * @param string $end_point
	 *
	 * @return string
	 */
//	public function media_proxy_url( $end_point = '' ) {
//
//		$end_point = ltrim( $end_point, "/" );
//
//		return $this->proxy_url( "/media/" . $end_point );
//	}

	/**
	 * @param $path
	 *
	 * @return string
	 */
	public function upload_path( $path = null ) {
		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return $this->upload_dir['basedir'] . $path;
	}

	/**
	 * @param $path
	 *
	 * @return string
	 */
	public function upload_url( $path = null ) {
		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return $this->upload_dir['baseurl'] . $path;
	}

	/**
	 * @param null $path
	 *
	 * @return string
	 */
	public function page_asset_path( $path = null ) {

		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return $this->page_upload_path( 'assets' . $path );
	}

	/**
	 * @param null $path
	 *
	 * @return string
	 */
	public function page_asset_url( $path = null ) {

		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return $this->page_upload_url( 'assets' . $path );
	}

	/**
	 * This will return the relative path to the upload dir.
	 * ex: /brizy/pages/3/x.jpg
	 *
	 * @param null $path
	 * @param null $post_id
	 *
	 * @return string
	 */
	public function page_upload_path( $path = null, $post_id = null ) {

		if ( is_null( $post_id ) && $this->post_id ) {
			$post_id = (int) $this->post_id;
		}

		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return sprintf( Brizy_Config::LOCAL_PAGE_ASSET_STATIC_URL . $path, $post_id );
	}

	/**
	 * @param null $path
	 * @param null $post_id
	 *
	 * @return string
	 */
	public function page_upload_url( $path = null, $post_id = null ) {

		return $this->upload_url( $this->page_upload_path( $path, $post_id ) );
	}

	/**
	 * This will return the relative path to the upload dir.
	 * ex: /brizy/editor/x.jpg
	 *
	 * @param null $path
	 *
	 * @return string
	 */
	public function editor_asset_path( $path = null ) {

		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		return sprintf( Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH . $path );
	}

	public function editor_asset_url() {
		return BRIZY_PLUGIN_URL . '/public/editor-build';
	}

	/**
	 * This will return the relative path to the upload dir.
	 * ex: /brizy/media/media_file.jpg
	 *
	 * @param null $path
	 *
	 * @return string
	 */
	public function media_asset_path( $path = null ) {
		return Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL . $path;
	}

	/**
	 * @param null $path
	 *
	 * @return string
	 */
	public function external_media_url( $path = null ) {
		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		$url = Brizy_Config::MEDIA_IMAGE_URL . $path;

		$urls = array();
		foreach ( Brizy_Config::getEditorBaseUrls() as $baseUrl ) {
			$urls[] = $baseUrl . $url;
		}

		return new Brizy_Admin_UrlIterator( $urls );
	}

	/**
	 * @param null $path
	 * @param null $template_version
	 * @param null $template_slug
	 *
	 * @return string
	 */
	public function external_asset_url( $path = null, $template_version = null, $template_slug = null ) {

		if ( is_null( $template_slug ) ) {
			$template_slug = $this->project->getTemplateSlug();
		}
		if ( is_null( $template_version ) ) {
			$template_version = BRIZY_EDITOR_VERSION;
		}

		if ( $path ) {
			$path = "/" . ltrim( $path, "/" );
		}

		$urls = array();
		foreach ( Brizy_Config::getStaticBrizyUrls() as $url ) {
			$urls[] = sprintf( $url . $path, $template_slug, $template_version );
		}

		return new Brizy_Admin_UrlIterator( $urls );
	}
}

