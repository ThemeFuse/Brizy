<?php
/**
 * Template Name: Blank Template
 */
?>
<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}
?>
<!DOCTYPE html>
<html>
<head>
	<?php wp_head(); ?>
</head>
<body class="brz">
<?php while ( have_posts() ) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
<?php wp_footer(); ?>
</body>
</html>
