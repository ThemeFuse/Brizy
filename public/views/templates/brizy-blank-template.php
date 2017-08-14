<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}
?>

<html>
<head>
    <title><?php wp_title() ?></title>
	<?php wp_head() ?>
</head>
<body class="bbm">
<?php while ( have_posts() ) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
<?php wp_footer() ?>
</body>
</html>
