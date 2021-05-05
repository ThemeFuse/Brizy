<?php

class Brizy_Admin_Stories_Main
{

    const CP_STORY = 'editor-story';

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
        if (is_admin()) {
            add_filter('post_updated_messages', array($this, 'filterMessages'));
            add_action('admin_init', array($this, 'removeAttributeMetaBox'));
        }
    }

    public function removeAttributeMetaBox() {
        remove_meta_box('pageparentdiv',self::CP_STORY,'normal' );
    }

    static public function registerCustomPosts()
    {

        $labels = array(
            'name'               => _x('Stories', 'post type general name', 'brizy'),
            'singular_name'      => _x('Story', 'post type singular name', 'brizy'),
            'menu_name'          => _x('Stories', 'admin menu', 'brizy'),
            'name_admin_bar'     => _x('Story', 'add new on admin bar', 'brizy'),
            'add_new'            => __('Add New Story', 'brizy'),
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

        register_post_type(
            self::CP_STORY,
            [
	            'labels'              => $labels,
	            'public'              => true,
	            'description'         => __bt( 'brizy', 'Brizy' ) . ' ' . __( 'stories', 'brizy' ) . '.',
	            'show_in_menu'        => Brizy_Admin_Settings::menu_slug(),
	            'rewrite'             => [ 'slug' => self::CP_STORY ],
	            'capability_type'     => 'page',
	            'exclude_from_search' => true,
	            'supports'            => [ 'title', 'post_content', 'revisions' ],
            ]
        );

        remove_post_type_support( self::CP_STORY, 'page-attributes' );

        add_filter(
            'brizy_supported_post_types',
            function ($types) {
                $types[] = self::CP_STORY;

                return $types;
            }
        );
    }

    /**
     * @param $messages
     *
     * @return mixed
     */
    function filterMessages($messages)
    {
        $post             = get_post();
        $post_type        = get_post_type($post);
        $post_type_object = get_post_type_object($post_type);

        $messages[self::CP_STORY] = array(
            0  => '', // Unused. Messages start at index 1.
            1  => __('Story updated.'),
            2  => __('Custom field updated.'),
            3  => __('Custom field deleted.'),
            4  => __('Story updated.'),
            /* translators: %s: date and time of the revision */
            5  => isset($_GET['revision']) ? sprintf(
                __('Story restored to revision from %s'),
                wp_post_revision_title((int)$_GET['revision'], false)
            ) : false,
            6  => __('Story published.'),
            7  => __('Story saved.'),
            8  => __('Story submitted.'),
            9  => sprintf(
                __('Story scheduled for: <strong>%1$s</strong>.'),
                // translators: Publish box date format, see http://php.net/date
                date_i18n(__('M j, Y @ G:i'), strtotime($post->post_date))
            ),
            10 => __('Story draft updated.'),
        );

        if ($post_type_object->publicly_queryable && self::CP_STORY === $post_type) {
            $permalink = get_permalink($post->ID);

            $view_link               = sprintf(' <a href="%s">%s</a>', esc_url($permalink), __('View Story'));
            $messages[$post_type][1] .= $view_link;
            $messages[$post_type][6] .= $view_link;
            $messages[$post_type][9] .= $view_link;

            $preview_permalink        = add_query_arg('preview', 'true', $permalink);
            $preview_link             = sprintf(
                ' <a target="_blank" href="%s">%s</a>',
                esc_url($preview_permalink),
                __('Preview Story')
            );
            $messages[$post_type][8]  .= $preview_link;
            $messages[$post_type][10] .= $preview_link;
        }

        return $messages;
    }

}
