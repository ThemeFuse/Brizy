<?php

class BitBlox_WP_Editor {

	private $post_id;
	private $project_id;

	public function __construct( $post_id, $project_id ) {
		$this->post_id    = $post_id;
		$this->project_id = $project_id;
	}

	public function load() {
		$this->register_static();
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_static' ) );
	}

	protected function get_id() {
		return $this->post_id;
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
				// 'mode'                    => 'regular',
				// 'synchronizeButton'       => null,
				// 'synchronizeButton'       => array(
				//     'appSlug'             => 'shopify-remote-editor',
				//     'url'                 => 'http://example.com',
				// ),
			),
			'encryptedData'   => array(
				'activecampaign'        => 'uQjAX0ErchXRhooruOmrrvXxMtAuiQeyP7HV+YBmPzk=',
				'antispam'              => '+GaVPrxiME72oCPxznnOv2f1P7UXPaWpaLaSTav6PoU==',
				'aweber'                => 'i9tl49nro2405x+PXCwHfM9MwMg1KCCF7gpQ/pKl9fg=',
				'campaignmonitor'       => 'yk+vH+K5QxRyOIABMy/FJRtdfu9/Ky5M4yd9kuC30Qw=',
				'constantcontact'       => 'P2S7eiZyAbCpV3gKZWr4HU4mwEH3i3jjhExboX8I7rs=',
				'editor'                => '............................................',
				'getresponse'           => 'DW2juku51q0tOaZDPzcL5gH+cfFh6QygWlhAaWH+6kU=',
				'integrations'          => 'Lw15T1DBKZLF2cVJKiUOd8LIBoTW5+FCmd0Zt/xX5g4=',
				'mailchimp'             => 'nJopCChf28JaJgQ2VxNLMiZX2zSyY2r8qrza/Rjkthk=',
				'mandrill'              => 'Go9vLArTvl6+4wvE3yXX6oe/ZUKj+6mctQkLDsRbk4M=',
				'metrics'               => 'vaAeEh1enpyJxOktgePsrEJ9GzJzQ0+8IysxAp3nGzk=',
				'salesforce'            => 'iaQiLLvGARvjKoKLJgh1bhgybacARW1n9dWXKf5krUQ=',
				'shopify-remote-editor' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
				'spreadsheet'           => 'qskb56Y7tHRyWiXkI85XqpHFIgzzoolLe1kK1VPCqAk=',
			),
			'hosts'           => array(
				'api'     => 'api.testblox.info',
				'base'    => 'www.testblox.info',
				'origin'  => 'testblox.info',
				'primary' => 'testblox.info',
			),
			'project'         => $this->project_id,
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
			'user'            => $this->get_id(),
			'versions'        => array(
				'editor'   => '4.3.0',
				'template' => null
			),
			'wp'              => array(
				'page'       => $this->get_id(),
				'templates'  => $this->get_templates(),
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

	protected function get_templates() {
		$templates = wp_get_theme()->get_page_templates();
		$list      = array(
			array(
				'id'    => '',
				'title' => __( 'Default' )
			)
		);

		foreach ( $templates as $key => $title ) {
			$list[] = array(
				'id'    => $key,
				'title' => $title
			);
		}

		return $list;
	}
}