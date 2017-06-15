<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

try {
	$editor = new BitBlox_WP_Editor( new BitBlox_WP_Post( get_the_ID() ) );
} catch ( BitBlox_WP_Exception $exception ) {
	return;
}

$editor->load();
?>
<html>
<head>
	<?php wp_head() ?>
</head>
<body>
<?php wp_footer() ?>
</body>
</html>