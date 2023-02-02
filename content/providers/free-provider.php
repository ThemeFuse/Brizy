<?php

use BrizyPlaceholders\ContentPlaceholder;
use \BrizyPlaceholders\Registry;

class Brizy_Content_Providers_FreeProvider extends Brizy_Content_Providers_AbstractProvider
{
    public function __construct() {

	    $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple( 'Internal Display Block By User Role', 'display_by_roles', function ( Brizy_Content_Context $context, ContentPlaceholder $contentPlaceholder ) {

		    $attrs = $contentPlaceholder->getAttributes();

		    if ( ! empty( $attrs['roles'] ) ) {
			    $roles     = explode( ',', $attrs['roles'] );
			    $userRoles = (array) wp_get_current_user()->roles;

                if ( in_array( 'logged', $roles ) && is_user_logged_in() ) {
	                $userRoles[] = 'logged';
                }

			    if ( Brizy_Editor_User::is_user_allowed() ) {

				    if ( ! empty( $_GET['role'] ) ) {

					    if ( $_GET['role'] === 'default' ) {
						    $roles[]     = 'default';
						    $userRoles[] = 'default';
					    } else {
						    $userRoles = [];

						    if ( $_GET['role'] == 'not_logged' ) {

							    if ( in_array( 'not_logged', $roles ) ) {
								    $roles[]     = 'default';
								    $userRoles[] = 'default';
							    }
						    } else {
							    $userRoles[] = $_GET['role'];
						    }
                        }
				    }
			    }

			    if ( in_array( 'not_logged', $roles ) ) {

				    $roles = array_diff( $roles, [ 'not_logged' ] );

				    if ( is_user_logged_in() ) {
					    if ( ! array_intersect( $roles, $userRoles ) ) {
						    return '';
					    }
				    }
			    } else {
				    if ( ! array_intersect( $roles, $userRoles ) ) {
					    return '';
				    }
			    }
		    }

		    $replacer = new \BrizyPlaceholders\Replacer( $context->getProvider() );

		    return $replacer->replacePlaceholders( $contentPlaceholder->getContent(), $context );
	    } ) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_ImageTitleAttribute('Internal Title Attributes', 'brizy_dc_image_title') );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_ImageAltAttribute('Internal Alt Attributes', 'brizy_dc_image_alt') );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_UniquePageUrl('Uniquer page url', 'brizy_dc_current_page_unique_url') );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('WP Language', 'brizy_dc_page_language', get_locale()) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('Ajax Url', 'brizy_dc_ajax_url', admin_url('admin-ajax.php')) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Permalink() );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_sidebar', function ($context, $contentPlaceholder) {

            $attrs = $contentPlaceholder->getAttributes();

            $id = isset($attrs['id']) ? $attrs['id'] : null;

            if ($id) {
                ob_start();

                dynamic_sidebar($id);

                return ob_get_clean();
            }

            return '';
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_navigation', function ($context, $contentPlaceholder) {

            $attrs = $contentPlaceholder->getAttributes();

            return $attrs['name'] ? wp_nav_menu(array('menu' => $attrs['name'], 'echo' => false)) : '';
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_post_field', function ($context, $contentPlaceholder) {

            $attrs = $contentPlaceholder->getAttributes();

            $post = ($context = Brizy_Content_ContextFactory::getGlobalContext()) ? $context->getWpPost() : get_post();

            if (!$post || !isset($attrs['property'])) {
                return '';
            }

            return $this->filterData($attrs['property'], $post);
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_post_info', function () {

            $post = ($context = Brizy_Content_ContextFactory::getGlobalContext()) ? $context->getWpPost() : get_post();

            if ( $post ) {
                $commentsCount      = get_approved_comments( $post->ID, [ 'count' => true ] );
                $params             = [];
                $params['author']   = get_the_author_meta( 'display_name', $post->post_author );
                $params['date']     = get_the_date( '', $post );
                $params['time']     = get_the_time( '', $post );
                $params['comments'] = sprintf( _n( '%s comment', '%s comments', $commentsCount, 'brizy' ), number_format_i18n( $commentsCount ) );

                return Brizy_Editor_View::get( BRIZY_PLUGIN_PATH . '/public/views/post-info', $params );
            }

            return '';
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_posts', function ($context, $contentPlaceholder) {

            $atts = $contentPlaceholder->getAttributes();

            // shortcode to use in page: {{editor_posts posts_per_page="5" category="1,2" orderby="date" order="DESC" columns="1" display_date="1" display_author="1"}}

            // this array is used as default values for displayPosts
            $extra_atts = array(
                "columns" => 1,
                "display_date" => 1,
                "display_author" => 1,
            );

            $extra_atts = array_merge($extra_atts, $atts);

            $posts = $this->getPosts($atts);

            return $this->displayPosts($posts, $extra_atts);
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('Product Page', 'editor_product_page', function ($context, $contentPlaceholder) {

            $atts = $contentPlaceholder->getAttributes();

//	            if ( ! empty( $atts['id'] ) ) {
//		            $product_data = get_post( $atts['id'] );
//		            $product = ! empty( $product_data ) && in_array( $product_data->post_type, [ 'product', 'product_variation' ] ) ? wc_setup_product_data( $product_data ) : false;
//	            }

            if (empty($atts['id']) && current_user_can('manage_options')) {
                return __('Please set a valid product', 'brizy');
            }

            $this->setScriptDependency('brizy-preview', ['zoom', 'photoswipe', 'flexslider', 'wc-single-product']);

            // Avoid infinite loop. There's a call of the function the_content() in the woocommerce/single-product/tabs/description.php
            remove_filter('the_content', [Brizy_Admin_Templates::instance(), 'filterPageContent'], -12000);

            $html = do_shortcode('[product_page id="' . $atts['id'] . '"]');

            add_filter('the_content', [Brizy_Admin_Templates::instance(), 'filterPageContent'], -12000);

            return $html;
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('Products Page', 'editor_product_products', function ($context, $contentPlaceholder) {

            $atts = $contentPlaceholder->getAttributes();

            $shortcodeAttributes = [];

            if (isset($atts['limit'])) {
                $shortcodeAttributes[] = sprintf("limit=\"%d\"", (int)$atts['limit']);
            }
            if (isset($atts['columns'])) {
                $shortcodeAttributes[] = sprintf("columns=\"%d\"", (int)$atts['columns']);
            }
            if (isset($atts['category'])) {
                $shortcodeAttributes[] = sprintf("category=\"%s\"", $atts['category']);
            }
            if (isset($atts['orderby'])) {
                $shortcodeAttributes[] = sprintf("orderby=\"%s\"", $atts['orderby']);
            }
            if (isset($atts['order'])) {
                $shortcodeAttributes[] = sprintf("order=\"%s\"", $atts['order']);
            }

            $shortcodeAttributes = implode(' ', $shortcodeAttributes);

            return do_shortcode('[products ' . $shortcodeAttributes . ' ]');
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_product_default_cart', function () {
            return do_shortcode('[woocommerce_cart]');
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_product_checkout', function () {
            return do_shortcode('[woocommerce_checkout]');
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_product_my_account', function () {
            return do_shortcode('[woocommerce_my_account]');
        }) );
        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple('', 'editor_product_order_tracking', function () {
            return do_shortcode('[woocommerce_order_tracking]');
        }) );

        $this->registerPlaceholder( new Brizy_Content_Placeholders_Simple(__( 'WooCommerce Notices', 'brizy' ), 'editor_woo_notice', function () {
            return wc_print_notices( true );
        }, self::CONFIG_KEY_TEXT ) );
    }

    private function filterData($property, $post)
    {
        switch ($property) {
            case 'post_title':
                return get_the_title($post);
            case 'post_excerpt':
                return get_the_excerpt($post);
            case 'post_content':
                return get_the_content($post);
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
        global $pages;

        // not sure why this is null (this happens on author pages.. maybe there are more)
        //
        if (is_null($pages))
            $pages = [];

        $raw_excerpt = $text;
        if ('' == $text) {

            $post = get_post($post);
            $text = get_the_content('', false, $post);


            $text = strip_shortcodes($text);
            $text = excerpt_remove_blocks($text);

            /** This filter is documented in wp-includes/post-template.php */
            $text = apply_filters('the_content', $text);
            $text = str_replace(']]>', ']]&gt;', $text);


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
            $excerpt_more = apply_filters('excerpt_more', ' ' . '[&hellip;]');
            $text = wp_trim_words($text, $excerpt_length, $excerpt_more);
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

    private function getPosts($atts)
    {
        // here are default posts arguments: https://codex.wordpress.org/Template_Tags/get_posts
        // maybe here we need to change some attributes, unset or add something before make query
        $posts = get_posts($atts);

        return $posts;
    }

    private function displayPosts($posts, $extra_atts)
    {
        ob_start();

        $thumbnail_size = ''; // possible sizes: thumbnail, medium, medium_large, large
        if ((int)$extra_atts['columns'] > 1) {
            $thumbnail_size = 'large';
        }

        foreach ($posts as $post) { ?>
            <article class="brz-article">
                <h2><a href="<?php echo get_permalink($post->ID); ?>"><?php echo get_the_title($post); ?></a></h2>

                <div class="brz-post-thumbnail">
                    <?php echo get_the_post_thumbnail($post, $thumbnail_size); ?>
                </div>

                <div class="brz-post-description">
                    <?php echo $this->getPostExcerpt($post); ?>
                </div>

                <?php if ($extra_atts['display_date']) { ?>
                    <div class="brz-post-date">
                        <?php echo get_the_date("", $post); ?>
                    </div>
                <?php } ?>

                <?php if ($extra_atts['display_author']) { ?>
                    <div class="brz-post-author">
                        <a rel="author" href="<?php echo get_author_posts_url($post->post_author); ?>"><span
                                    itemprop="name"><?php echo get_the_author_meta('display_name', $post->post_author); ?></span></a>
                    </div>
                <?php } ?>
            </article>
            <?php
        }

        return ob_get_clean();
    }

    private function getPostExcerpt($post)
    {
        if (!empty($post->post_excerpt)) {
            // if !empty excerpt
            return $post->post_excerpt;
        }

        $the_excerpt = strip_tags(strip_shortcodes($post->post_content)); // Strips tags and shortcodes
        $excerpt_length = 50; // Sets excerpt length by word count, default in WP is 55
        $words = explode(' ', $the_excerpt, $excerpt_length + 1);

        if (count($words) > $excerpt_length) {
            array_pop($words);
            $the_excerpt = implode(' ', $words); // put in excerpt only the number of word that is set in $excerpt_length
        }

        return $the_excerpt;
    }
}
