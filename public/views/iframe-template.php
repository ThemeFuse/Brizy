<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}


?>

<iframe id="blocks-iframe" class="mode-desktop" srcdoc='
            <html>
                <head>
                    <link href="visual/wireframes.css" rel="stylesheet">

                    <link href="assets/css/main.css" rel="stylesheet">


                    <link href="visual/editor.css" rel="stylesheet">

                    <link rel="prefetch" href="assets/fonts/icons/outline/icons.svg">
                    <link rel="prefetch" href="assets/fonts/icons/glyph/icons.svg">

                    <script src="//use.typekit.net/ueo0lzq.js"></script>
                    <script>try { Typekit.load(); } catch(e) {}</script>
                </head>
                <body class="bbm">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react-with-addons.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore-min.js"></script>

                    <script src="visual/wireframes.editor.js"></script>

                    <script src="visual/editor.vendor.js"></script>
                    <script>
                        var __VISUAL_CONFIG__ = {};
                        var __SHORTCODES_CONFIG__ = {};
                    </script>

                    <script src="assets/js/shortcodes-config.js"></script>

                    <script src="visual/editor.dev.js"></script>
                </body>
            </html>
        '/>