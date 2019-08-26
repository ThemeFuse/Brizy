<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
			wp_print_head_scripts();
			wp_print_styles();
		?>
	</head>
	<body class="brz brz-ed modal-open">

		<?php do_action( 'brizy_site_settings_popup_html' ); ?>
		<?php wp_print_footer_scripts(); ?>

	</body>
</html>