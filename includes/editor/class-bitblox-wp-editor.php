<?php

class BitBlox_WP_Editor {
	/**
	 * @var BitBlox_WP_Post
	 */
	private $post;

	public function __construct( BitBlox_WP_Post $post ) {
		$this->post = $post;
	}

	public function load() {
		$this->register_static();
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_static' ) );
	}

	protected function get_post() {
		return $this->post;
	}

	protected function register_static() {

		$url = 'http://bitblox.dev';

		wp_register_style(
			bitblox_wp()->get_slug() . '-wireframes',
			$url . '/visual/wireframes.css',
			array()
		);
		wp_register_style(
			bitblox_wp()->get_slug() . '-main',
			$url . '/assets/css/main.css',
			array()
		);

		wp_register_style(
			bitblox_wp()->get_slug() . '-editor',
			$url . '/visual/editor.css',
			array(
				bitblox_wp()->get_slug() . '-wireframes',
				bitblox_wp()->get_slug() . '-main'
			)
		);

		wp_register_script(
			bitblox_wp()->get_slug() . '-typekit',
			'//use.typekit.net/ueo0lzq.js',
			array(),
			false,
			true
		);
		wp_register_script(
			bitblox_wp()->get_slug() . '-jquery',
			$this->static_url() . '/jquery.js',
			array( 'jquery' ),
			bitblox_wp()->get_version(),
			true
		);

		wp_register_script(
			bitblox_wp()->get_slug() . '-react',
			'https://cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react-with-addons.js',
			array( bitblox_wp()->get_slug() . '-jquery', 'underscore' ),
			'0.12.2',
			true
		);
		wp_register_script(
			bitblox_wp()->get_slug() . '-wireframes-editor',
			$this->static_url() . '/visual/wireframes.editor.js',
			array(),
			false,
			true
		);
		wp_register_script(
			bitblox_wp()->get_slug() . '-editor-vendor',
			$url . '/visual/editor.vendor.js',
			array(),
			false,
			true
		);
		wp_register_script(
			bitblox_wp()->get_slug() . '-shortcodes-config',
			$url . '/assets/js/shortcodes-config.js',
			array(),
			false,
			true
		);
		wp_register_script(
			bitblox_wp()->get_slug() . '-editor',
			$url . '/visual/editor.dev.js',
			array(
				bitblox_wp()->get_slug() . '-typekit',
				bitblox_wp()->get_slug() . '-react',
				//bitblox_wp()->get_slug() . '-wireframes-editor',
				bitblox_wp()->get_slug() . '-editor-vendor',
				bitblox_wp()->get_slug() . '-shortcodes-config',
				'media-upload'
			),
			false,
			true
		);

		wp_localize_script(
			bitblox_wp()->get_slug() . '-editor-vendor',
			'__VISUAL_CONFIG__',
			$this->config()
		);
		wp_localize_script(
			bitblox_wp()->get_slug() . '-editor-vendor',
			'__SHORTCODES_CONFIG__',
			array()
		);
	}

	public function config() {
		return array(
			'env'             => 'WP',
			'rootElement'     => '#' . bitblox_wp()->get_slug() . '-root-element',
			'editorOptions'   => array(
				'isLegacy'    => false,
				'isMultipage' => false,
				'isVariant'   => false,
			),
			'hosts'           => array(
				'api'     => 'api.testblox.info',
				'base'    => 'www.testblox.info',
				'origin'  => 'testblox.info',
				'primary' => 'testblox.info',
			),
			'project'         => $this->get_post()->get_id(),
			'projectLanguage' => array(
				'id'      => 7,
				'variant' => array(
					'id'   => 7,
					'name' => 'A',
				),
			),
			'serverTimestamp' => time(),
			'urls'            => array(
				'api'         => home_url( '/wp-json/bitblox-wp/v1' ),
				'base'        => 'http://www.testblox.info',
				'image'       => 'http://static.bitblox.xyz/storage/media',
				'integration' => 'http://integration.bitblox.site',
				'origin'      => 'http://testblox.info',
				'primary'     => 'http://bitblox.dev',
			),
			'user'            => $this->get_post()->get_id(),
			'versions'        => array(
				'editor'   => '4.3.0',
				'template' => null
			),
			'wp'              => array(
				'page'       => $this->get_post()->ID(),
				'templates'  => $this->get_post()->get_templates(),
				'api'        => array(
					'hash'         => wp_create_nonce( BitBlox_WP_Editor_API::nonce ),
					'url'          => admin_url( 'admin-ajax.php' ),
					'globals'      => array(
						'set' => BitBlox_WP_Editor_API::AJAX_SET_GLOBALS,
						'get' => BitBlox_WP_Editor_API::AJAX_GET_GLOBALS,
					),
					'media'        => BitBlox_WP_Editor_API::AJAX_MEDIA,
					'ping'         => BitBlox_WP_Editor_API::AJAX_PING,
					'getPage'      => BitBlox_WP_Editor_API::AJAX_GET,
					'updatePage'   => BitBlox_WP_Editor_API::AJAX_UPDATE,
					'getSidebars'  => BitBlox_WP_Editor_API::AJAX_SIDEBARS,
					'buildContent' => BitBlox_WP_Editor_API::AJAX_BUILD,
				),
				'shortcodes' => array(
					'sidebar' => BITBLOX_WP_SHORTCODES_PREFIX . 'sidebar'
				)
			)
		);
	}

	public function static_url() {
		return bitblox_wp()->get_url( '/includes/editor/static' );
	}

	/**
	 * @internal
	 **/
	public function _action_register_static() {
		wp_enqueue_media();
		wp_enqueue_style( bitblox_wp()->get_slug() . '-editor' );
		wp_enqueue_script( bitblox_wp()->get_slug() . '-editor' );
	}
}