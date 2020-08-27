<?php


class Brizy_Content_Providers_FreeProvider extends Brizy_Content_Providers_AbstractProvider {

	/**
	 * @return array|mixed
	 */
	public function getGroupedPlaceholders() {
		return array();
	}

	/**
	 * @return array|int
	 * @throws Exception
	 */
	public function getAllPlaceholders() {

		return array(
			new Brizy_Content_Placeholders_ImageTitleAttribute( 'Internal Title Attributes', 'brizy_dc_image_title' ),
			new Brizy_Content_Placeholders_ImageAltAttribute( 'Internal Alt Attributes', 'brizy_dc_image_alt' ),
			new Brizy_Content_Placeholders_UniquePageUrl( 'Uniquer page url', 'brizy_dc_current_page_unique_url' ),
			new Brizy_Content_Placeholders_Simple( 'WP Language', 'brizy_dc_page_language', get_locale() ),
			new Brizy_Content_Placeholders_Simple( 'Ajax Url', 'brizy_dc_ajax_url', admin_url( 'admin-ajax.php' ) ),
			new Brizy_Content_Placeholders_Permalink(),
            new Brizy_Content_Placeholders_Simple( '', 'editor_sidebars', function( $context, $contentPlaceholder ) {

                $attrs = $contentPlaceholder->getAttributes();

                $id = isset( $attrs['id'] ) ? $attrs['id'] : null;

                if ( $id ) {
                    ob_start();

                    dynamic_sidebar( $id );

                    return ob_get_clean();
                }

                return '';
            } ),

            new Brizy_Content_Placeholders_Simple( '', 'editor_navigation', function( $context, $contentPlaceholder ) {

                $attrs = $contentPlaceholder->getAttributes();

                return $attrs['name'] ? wp_nav_menu( array( 'menu' => $attrs['name'], 'echo' => false ) ) : '';
            } ),

            new Brizy_Content_Placeholders_Simple( '', 'editor_post_field', function( $context, $contentPlaceholder ) {

                $attrs = $contentPlaceholder->getAttributes();

                $post = $this->getPost( $attrs );

                if ( ! $post || ! isset( $attrs['property'] ) ) {
                    return '';
                }

                return $this->filterData( $attrs['property'], $post );
            } ),

            new Brizy_Content_Placeholders_Simple( '', 'editor_post_info', function( $context, $contentPlaceholder ) {

                $attrs = $contentPlaceholder->getAttributes();

                $twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . '/public/views' );

                $post = $this->getPost( $attrs );

                if ( $post ) {
                    $params             = array();
                    $params['author']   = get_the_author_meta( 'nickname', $post->post_author );
                    $params['date']     = get_the_date( '', $post );
                    $params['time']     = get_the_time( '', $post );
                    $params['comments'] = get_comment_count( $post->ID );

                    return $twig->render( 'post-info.html.twig', $params );
                }

                return '';
            } ),

            new Brizy_Content_Placeholders_Simple( '', 'editor_posts', function( $context, $contentPlaceholder ) {

                $atts = $contentPlaceholder->getAttributes();

                // shortcode to use in page: {{editor_posts posts_per_page="5" category="1,2" orderby="date" order="DESC" columns="1" display_date="1" display_author="1"}}

                // this array is used as default values for displayPosts
                $extra_atts = array(
                    "columns"        => 1,
                    "display_date"   => 1,
                    "display_author" => 1,
                );

                $extra_atts = array_merge( $extra_atts, $atts );

                $posts = $this->getPosts( $atts );

                return $this->displayPosts( $posts, $extra_atts );
            } ),

            new Brizy_Content_Placeholders_Simple( '', 'editor_product_page', function( $context, $contentPlaceholder ) {

                $postId = $this->getPost( $contentPlaceholder->getAttributes() );

                return do_shortcode( '[product_page id="' . $postId . '"]' );
            } ),
		);
	}

    /**
     * @param $atts
     *
     * @return array|WP_Post|null
     */
    private function getPost( $atts ) {

        if ( isset( $atts['post'] ) ) {
            return Brizy_Admin_Templates::getPostSample((int) $atts['post']);
        } else {
            $posts = get_posts();
            $post  = isset( $posts[0] ) ? $posts[0] : null;
        }

        return $post;
    }

    private function filterData( $property, $post ) {
        switch ( $property ) {
            case 'post_title':
                return get_the_title( $post );
            case 'post_excerpt':
                return $this->wp_trim_excerpt( $post->post_excerpt, $post );
            case 'post_content':
                $GLOBALS['post'] = $post;
                setup_postdata($post);
                // remove all brizy the_content fitlers
                remove_filter( 'the_content', [ Brizy_Admin_Templates::_init(), 'filterPageContent' ], - 12000 );
                $brizyPost = Brizy_Editor_Post::get( $post );
                Brizy_Public_Main::get( $brizyPost )->removeTheContentFilters();

                // get the content
                add_filter( 'the_content', 'wpautop' );
                $content = get_the_content( null, null, $post );
                $content = apply_filters( 'the_content', $content );
                $content = str_replace( ']]>', ']]&gt;', $content );
                remove_filter( 'the_content', 'wpautop' );

                // add the filters back
                add_filter( 'the_content', [ Brizy_Admin_Templates::_init(), 'filterPageContent' ], - 12000 );
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
    private function wp_trim_excerpt( $text = '', $post = null ) {
        $raw_excerpt = $text;
        if ( '' == $text ) {
            $post = get_post( $post );
            $text = get_the_content( '', false, $post );

            $text = strip_shortcodes( $text );
            $text = excerpt_remove_blocks( $text );

            /** This filter is documented in wp-includes/post-template.php */
            //$text = apply_filters( 'the_content', $text );
            $text = str_replace( ']]>', ']]&gt;', $text );
            $text = Brizy_Content_PlaceholderExtractor::stripPlaceholders( $text );
            /**
             * Filters the number of words in an excerpt.
             *
             * @param int $number The number of words. Default 55.
             *
             * @since 2.7.0
             *
             */
            $excerpt_length = apply_filters( 'excerpt_length', 55 );
            /**
             * Filters the string in the "more" link displayed after a trimmed excerpt.
             *
             * @param string $more_string The string shown within the more link.
             *
             * @since 2.9.0
             *
             */
            $excerpt_more = apply_filters( 'excerpt_more', ' ' . '[&hellip;]' );
            $text         = wp_trim_words( $text, $excerpt_length, $excerpt_more );
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
        return apply_filters( 'wp_trim_excerpt', $text, $raw_excerpt );
    }

    private function getPosts( $atts ) {
        // here are default posts arguments: https://codex.wordpress.org/Template_Tags/get_posts
        // maybe here we need to change some attributes, unset or add something before make query
        $posts = get_posts( $atts );

        return $posts;
    }

    private function displayPosts( $posts, $extra_atts ) {
        ob_start();

        $thumbnail_size = ''; // possible sizes: thumbnail, medium, medium_large, large
        if ( (int) $extra_atts['columns'] > 1 ) {
            $thumbnail_size = 'large';
        }

        foreach ( $posts as $post ) { ?>
            <article class="brz-article">
                <h2><a href="<?php echo get_permalink( $post->ID ); ?>"><?php echo get_the_title( $post ); ?></a></h2>

                <div class="brz-post-thumbnail">
                    <?php echo get_the_post_thumbnail( $post, $thumbnail_size ); ?>
                </div>

                <div class="brz-post-description">
                    <?php echo $this->getPostExcerpt( $post ); ?>
                </div>

                <?php if ( $extra_atts['display_date'] ) { ?>
                    <div class="brz-post-date">
                        <?php echo get_the_date( "", $post ); ?>
                    </div>
                <?php } ?>

                <?php if ( $extra_atts['display_author'] ) { ?>
                    <div class="brz-post-author">
                        <a rel="author" href="<?php echo get_author_posts_url( $post->post_author ); ?>"><span itemprop="name"><?php echo get_the_author_meta( 'display_name', $post->post_author ); ?></span></a>
                    </div>
                <?php } ?>
            </article>
            <?php
        }

        return ob_get_clean();
    }

    private function getPostExcerpt( $post ) {
        if ( ! empty( $post->post_excerpt ) ) {
            // if !empty excerpt
            return $post->post_excerpt;
        }

        $the_excerpt    = strip_tags( strip_shortcodes( $post->post_content ) ); // Strips tags and shortcodes
        $excerpt_length = 50; // Sets excerpt length by word count, default in WP is 55
        $words          = explode( ' ', $the_excerpt, $excerpt_length + 1 );

        if ( count( $words ) > $excerpt_length ) {
            array_pop( $words );
            $the_excerpt = implode( ' ', $words ); // put in excerpt only the number of word that is set in $excerpt_length
        }

        return $the_excerpt;
    }
}
