<?php
/**
 * Template Name: Blank Template
 */
?>
<?php if (!defined('ABSPATH')) {
	die('Direct access forbidden.');
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php while (have_posts()) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
<?php wp_footer(); ?>
</body>
</html>
