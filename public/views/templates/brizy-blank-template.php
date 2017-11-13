<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}
?>
<html>
<head>
    <title><?php wp_title() ?></title>
	<?php do_action('wp_head') ?>
</head>
<body class="brz-ed brz">
<?php while ( have_posts() ) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
</body>
</html>
