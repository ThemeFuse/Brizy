<?php
/**
 * Template Name: Blank Template
 */
?>
<?php if (!defined('ABSPATH')) {
	die('Direct access forbidden.');
}

echo '<pre style="background:#23282d;z-index:99999999;color:#78FF5B;font-size:14px;position:relative;">';
print_r( 'brizy-blank-template.php' );
echo '</pre>';

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
<?php while (have_posts()) : the_post() ?>
	<?php the_content() ?>
<?php endwhile ?>
<?php wp_footer(); ?>
</body>
</html>
