<?php
/**
 * Template Name: Blank Template
 */

if (!defined('ABSPATH')) {
	die('Direct access forbidden.');
}

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php
        if ( ! current_theme_supports( 'title-tag' ) ) {
            echo '<title>' . wp_get_document_title() . '</title>';
        }

        wp_head();
	?>
</head>
<body <?php body_class(); ?>>
    <?php
        do_action( 'wp_body_open' );

            if ( is_category() || is_archive() || is_tag() || is_404() || is_search() || is_home() ) {
                do_action( 'brizy_template_content' );
            } else {
                while ( have_posts() ) { the_post();

                    if ( post_password_required() ) {
	                    echo get_the_password_form();
                    } else {
                        the_content();
                    }
                }
            }

        wp_footer();
    ?>
</body>
</html>
