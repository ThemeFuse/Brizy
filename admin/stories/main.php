<?php

/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */
class Brizy_Admin_Stories_Main
{

    const CP_STORY = 'brizy-story';

    /**
     * @return Brizy_Admin_Stories_Main
     */
    public static function _init()
    {
        static $instance;

        if ( ! $instance) {
            $instance = new self();
            $instance->initialize();
        }

        return $instance;
    }

    public function initialize()
    {

    }

    static public function registerCustomPosts()
    {

        $labels = array(
            'name'               => _x('Stories', 'post type general name', 'brizy'),
            'singular_name'      => _x('Story', 'post type singular name', 'brizy'),
            'menu_name'          => _x('Stories', 'admin menu', 'brizy'),
            'name_admin_bar'     => _x('Story', 'add new on admin bar', 'brizy'),
            'add_new'            => _x('Add New', self::CP_STORY, 'brizy'),
            'add_new_item'       => __('Add New Story', 'brizy'),
            'new_item'           => __('New Story', 'brizy'),
            'edit_item'          => __('Edit Story', 'brizy'),
            'view_item'          => __('View Story', 'brizy'),
            'all_items'          => __('Stories', 'brizy'),
            'search_items'       => __('Search Stories', 'brizy'),
            'parent_item_colon'  => __('Parent Stories:', 'brizy'),
            'not_found'          => __('No Stories found.', 'brizy'),
            'not_found_in_trash' => __('No Stories found in Trash.', 'brizy'),
        );

        register_post_type( self::CP_STORY,
            array(
                'labels'              => $labels,
                'public'              => false,
                'has_archive'         => false,
                'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'stories', 'brizy' ) . '.',
                'publicly_queryable'  => Brizy_Editor_User::is_user_allowed(),
                'show_ui'             => defined( 'BRIZY_PRO_VERSION' ),
                'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
                'query_var'           => false,
                'rewrite'             => array( 'slug' => self::CP_STORY ),
                'capability_type'     => 'page',
                //'map_meta_cap'        => true,
                'hierarchical'        => false,
                'show_in_rest'        => false,
                'can_export'          => true,
                'exclude_from_search' => true,
                'supports'            => array( 'title', 'revisions', 'page-attributes' )
            )
        );

        add_filter(
            'brizy_supported_post_types',
            function ($types) {
                $types[] = self::CP_STORY;

                return $types;
            }
        );
    }

}
