<?php

class BitBlox_WP_Editor_API {

	const nonce = 'bitblox-wp-api';
	const AJAX_PING = 'bitblox_wp_editor_ping';
	const AJAX_GET = 'bitblox_wp_editor_get_items';
	const AJAX_UPDATE = 'bitblox_wp_update_item';
	const AJAX_GLOBALS = 'bitblox_wp_globals';
	const AJAX_MEDIA = 'bitblox_wp_media';

	public static function init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	protected function __construct() {
		add_action( 'wp_ajax_' . self::AJAX_PING, array( $this, 'ping' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET, array( $this, 'get_items' ) );
		add_action( 'wp_ajax_' . self::AJAX_UPDATE, array( $this, 'update_item' ) );
		add_action( 'wp_ajax_' . self::AJAX_GLOBALS, array( $this, 'globals' ) );
		add_action( 'wp_ajax_' . self::AJAX_MEDIA, array( $this, 'media' ) );
	}

	/**
	 * @internal
	 **/
	public function ping() {
		try {
			$this->authorize();
			$this->success( array() );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function globals() {
		try {
			$this->authorize();
			$this->success( array(
					'created' => time(),
					'globals' => '{"project":{},"language":{}}',
					'id'      => 7,
					'name'    => "proj7",
					'updated' => "2016-11-01T08:35:17-0400",
					'user'    => array(
						'id'    => 2,
						'email' => null
					),
				)
			);
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function get_items() {
		try {
			$this->authorize();
			$id   = $this->param( 'id' );
			$post = new BitBlox_WP_Post( $id );

			$this->success( array(
				array(
					'title'    => get_the_title( $post->get_id() ),
					'slug'     => sanitize_title( get_the_title( $post->get_id() ) ),
					'data'     => $post->get_json(),
					'id'       => $post->get_id(),
					'is_index' => true,
				)
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function update_item() {
		try {
			$this->authorize();
			$id      = $this->param( 'id' );
			$content = $this->param( 'content' );

			$post = new BitBlox_WP_Post( $id );

			$post->set_json( stripslashes( $content ) );

			$this->success( array(
				'title'    => get_the_title( get_the_title( $post->get_id() ) ),
				'id'       => $post->get_id(),
				'is_index' => true,
				'slug'     => sanitize_title( get_the_title( $post->get_id() ) ),
				'data'     => json_encode( array( 'title' => $post->get_title(), 'index' => true ) )
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	/**
	 * @internal
	 **/
	public function media() {
		try {
			$this->authorize();
			$project       = BitBlox_WP_Post::get( $this->param( 'id' ) )->get_project();
			$attachment_id = $this->param( 'attachmentId' );

			$this->success( BitBlox_WP_User::get()->get_media_id( $project, $attachment_id ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	protected function param( $name ) {
		if ( isset( $_POST[ $name ] ) ) {
			return $_POST[ $name ];
		}

		throw new BitBlox_WP_Exception_Not_Found( "Parameter '$name' is missing", 400 );
	}

	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), $code );
	}

	protected function success( $data ) {
		wp_send_json( $data );
	}

	private function authorize() {
		if ( ! wp_verify_nonce( $_POST['hash'], self::nonce ) ) {
			throw new BitBlox_WP_Exception_Access_Denied();
		}
	}

	protected function static_url() {
		return bitblox_wp()->get_url( '/includes/editor/static' );
	}
}