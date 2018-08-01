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
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php while (have_posts()) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
<?php wp_footer(); ?>
</body>
</html>
