<?php

class Brizy_Shortcode_PostField extends Brizy_Shortcode_AbstractShortcode
{

    /**
     * Get shortcode name
     *
     * @return string
     */
    public function getName()
    {
        return 'post_field';
    }

    /**
     * Ex: [brizy_post_field post="12" property="post_excerpt"]
     * Ex: [brizy_post_field property="post_excerpt"]
     *
     * @param $atts
     * @param null $content
     *
     * @return mixed|string
     */
    public function render($atts, $content = null)
    {

        $post = $this->getPost($atts);

        if ( ! $post || ! isset($atts['property'])) {
            return '';
        }

        $property = $atts['property'];

        return $this->filterData($property, $post);
    }

    /**
     * @param $atts
     *
     * @return array|WP_Post|null
     */
    protected function getPost($atts)
    {

        if (isset($atts['post'])) {
            return Brizy_Admin_Templates::getPostSample((int)$atts['post']);
        } elseif ($context = Brizy_Content_ContextFactory::getGlobalContext()) {
            return $context->getWpPost();
        } else {
            $posts = get_posts();
            $post  = isset($posts[0]) ? $posts[0] : null;
        }

        return $post;
    }

    protected function filterData($property, $post)
    {
        switch ($property) {
            case 'post_title':
                return get_the_title($post);
            case 'post_excerpt':
                return self::wp_trim_excerpt($post->post_excerpt, $post);
            case 'post_content':
                $GLOBALS['post'] = $post;
                setup_postdata($post);
                // remove all brizy the_content fitlers
                remove_filter('the_content', [Brizy_Admin_Templates::_init(), 'filterPageContent'], -12000);
                $brizyPost = Brizy_Editor_Post::get($post);
                Brizy_Public_Main::get($brizyPost)->removeTheContentFilters();

                // get the content
                add_filter('the_content', 'wpautop');
                $content = get_the_content(null, null, $post);
                $content = apply_filters('the_content', $content);
                $content = str_replace(']]>', ']]&gt;', $content);
                remove_filter('the_content', 'wpautop');

                // add the filters back
                add_filter('the_content', [Brizy_Admin_Templates::_init(), 'filterPageContent'], -12000);
                Brizy_Public_Main::get($brizyPost)->addTheContentFilters();

                wp_reset_postdata();

                return $content;
            case 'post_password':
                return '';
            default:
                return $post->{$property};
        }
    }

    /**
     * It rewrite the wodpress function wp_trim_excerpt.
     * The only thing we do is exclude the appling of the hook the_content.
     * Further information read the description of the function getValue of this class.
     *
     * @param string $text
     * @param null $post
     *
     * @return string
     */
    public static function wp_trim_excerpt($text = '', $post = null)
    {
        $raw_excerpt = $text;
        if ('' == $text) {
            $post = get_post($post);
            $text = get_the_content('', false, $post);

            $text = strip_shortcodes($text);
            $text = excerpt_remove_blocks($text);

            /** This filter is documented in wp-includes/post-template.php */
            //$text = apply_filters( 'the_content', $text );
            $text = str_replace(']]>', ']]&gt;', $text);
            $text = Brizy_Content_PlaceholderExtractor::stripPlaceholders($text);
            /**
             * Filters the number of words in an excerpt.
             *
             * @param int $number The number of words. Default 55.
             *
             * @since 2.7.0
             *
             */
            $excerpt_length = apply_filters('excerpt_length', 55);
            /**
             * Filters the string in the "more" link displayed after a trimmed excerpt.
             *
             * @param string $more_string The string shown within the more link.
             *
             * @since 2.9.0
             *
             */
            $excerpt_more = apply_filters('excerpt_more', ' '.'[&hellip;]');
            $text         = wp_trim_words($text, $excerpt_length, $excerpt_more);
        }

        /**
         * Filters the trimmed excerpt string.
         *
         * @param string $text The trimmed text.
         * @param string $raw_excerpt The text prior to trimming.
         *
         * @since 2.8.0
         *
         */
        return apply_filters('wp_trim_excerpt', $text, $raw_excerpt);
    }


}
