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

<?php if ( is_category() || is_archive() || is_tag() || is_404() || is_search() || is_home() ) : ?>
	<?php do_action( 'brizy_template_content' ); ?>
<?php else: ?>
	<?php while ( have_posts() ) : the_post() ?>
		<?php the_content() ?>
	<?php endwhile ?>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
