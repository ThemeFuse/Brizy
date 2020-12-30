<?php


class Brizy_Admin_Funnels_Main {
	const CP_FUNNEL = 'brizy-funnel';
	const CP_FUNNEL_PAGE = 'brizy-funnel-page';
	const CP_FUNNEL_POPUP = 'brizy-funnel-popup';

	/**
	 * @return Brizy_Admin_Funnels_Main
	 */
	public static function _init() {

		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Funnels_Main constructor.
	 */
	public function __construct() {
		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );

		if ( Brizy_Editor::is_user_allowed() ) {
			add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
			if ( is_admin() ) {
				add_action( 'save_post_' . self::CP_FUNNEL, array( $this, 'funnelSaved' ), 10, 3 );
				add_action( 'trashed_post', array( $this, 'funnelTrashed' ) );
				add_action( 'untrashed_post', array( $this, 'funnelUnTrashed' ) );
				add_filter( 'post_row_actions', array( $this, 'addBrizyEditRowAction' ), 10, 2 );
				add_action(
					'edit_form_after_title',
					array(
						$this,
						'actionAddEnableDisableButtons',
					)
				);
			}
		}
	}

	public function initializeActions() {
		Brizy_Admin_Funnels_Api::_init();
	}

	public function funnelSaved( $post_id, $post, $update ) {
		if ( $update ) {
			return;
		}

        $manager = new Brizy_Admin_Funnels_Manager(Brizy_Admin_Funnels_Main::CP_FUNNEL_PAGE);
        /**
         * @var Brizy_Editor_FunnelPage $page ;
         */
        $str  = 'Sample Funnel Page #'.$post_id;
        $page = $manager->createEntity(
            null,
            'draft',
            [
                'post_parent' => $post_id,
                'post_title'  => $str,
                'post_name'   => $str,
            ]
        );
        $page->save();

	}

	public function funnelTrashed( $post_id ) {
		if ( get_post_type( $post_id ) !== self::CP_FUNNEL ) {
			return;
		}

		$posts = get_posts(
			array(
				'numberposts' => - 1,
				'post_parent' => $post_id,
				'post_status' => get_post_stati(),
				'post_type'   => array( self::CP_FUNNEL_PAGE, self::CP_FUNNEL_POPUP ),
			)
		);

		foreach ( $posts as $post ) {
			wp_trash_post( $post->ID );
		}
	}

	public function funnelUnTrashed( $post_id ) {
		if ( get_post_type( $post_id ) !== self::CP_FUNNEL ) {
			return;
		}

		$posts = get_posts(
			array(
				'posts_parent' => $post_id,
				'post_status'  => 'trash',
				'post_type'    => array( self::CP_FUNNEL_PAGE, self::CP_FUNNEL_POPUP ),
			)
		);

		foreach ( $posts as $post ) {
			wp_untrash_post( $post->ID );
		}
	}

	public function actionAddEnableDisableButtons() {
		$get_post_type        = get_post_type();
		$supported_post_types = Brizy_Editor::get()->supported_post_types();
		if ( $get_post_type === self::CP_FUNNEL ) {
			$p = get_post();

			$posts = get_posts(
				array(
					'numberposts' => 1,
					'post_parent' => $p->ID,
					'post_status' => get_post_stati(),
					'post_type'   => array( self::CP_FUNNEL_PAGE, self::CP_FUNNEL_POPUP ),
				)
			);

			$subPost = $posts[0];

			if ( ! $subPost ) {
				return;
			}

			$brizyEditorPost = Brizy_Editor_Post::get( $subPost->ID );

			echo Brizy_Admin_View::render(
				'funnel-edit-button',
				array(
					'id'             => $subPost->ID,
					'post'           => $subPost,
					'is_using_brizy' => true,
					'url'            => $brizyEditorPost->edit_url(),
				)
			);
		}
	}

	/**
	 * @param array $actions
	 * @param WP_Post $post
	 *
	 * @return array
	 **@internal
	 *
	 */
	public function addBrizyEditRowAction( $actions, $post ) {

		$is_allowed    = Brizy_Editor_User::is_user_allowed();
		$get_post_type = get_post_type();

		if ( ! $is_allowed || $get_post_type !== self::CP_FUNNEL ) {
			return $actions;
		}

		try {

			$posts = get_posts(
				array(
					'numberposts' => 1,
					'post_parent' => $post->ID,
					'post_status' => get_post_stati(),
					'post_type'   => array( self::CP_FUNNEL_PAGE, self::CP_FUNNEL_POPUP ),
				)
			);

			$subPost = $posts[0];

			$p = Brizy_Editor_Post::get( $subPost->ID );
			if ( $p->uses_editor() ) {
				$actions['brizy-edit'] = "<a href='{$p->edit_url()}'>"
				                         . __( 'Edit with ' . __bt( 'brizy', 'Brizy' ), 'brizy' )
				                         . "</a>";
			}
		} catch ( Exception $exception ) {
		}

		return $actions;
	}

	static public function registerCustomPosts() {

		$labels = array(
			'name' => __( 'Funnels', 'brizy' ),
		);

		register_post_type(
			self::CP_FUNNEL,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Funnels', 'brizy' ),
				'publicly_queryable'  => false,
				'show_ui'             => defined( 'BRIZY_PRO_VERSION' ),
				'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => true,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions' ),
			)
		);

		register_post_type(
			self::CP_FUNNEL_PAGE,
			array(
				'labels'              => $labels,
				'public'              => true,
				'has_archive'         => false,
				'description'         => __( 'Funnels', 'brizy' ),
				'publicly_queryable'  => true,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions' ),
			)
		);

		register_post_type(
			self::CP_FUNNEL_POPUP,
			array(
				'labels'              => $labels,
				'public'              => false,
				'has_archive'         => false,
				'description'         => __( 'Funnels', 'brizy' ),
				'publicly_queryable'  => true,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'query_var'           => false,
				'capability_type'     => 'page',
				'hierarchical'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions' ),
			)
		);

		add_filter(
			'brizy_supported_post_types',
			function ( $posts ) {
				$posts[] = self::CP_FUNNEL_PAGE;
				$posts[] = self::CP_FUNNEL_POPUP;

				return $posts;
			}
		);
	}

}
