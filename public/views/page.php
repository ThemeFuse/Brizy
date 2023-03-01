<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?php echo $page_title; ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
	    <?php foreach ( $styles as $styleUrl ): ?>
            <link rel="stylesheet" href="<?php echo $styleUrl; ?>">
	    <?php endforeach; ?>
	    <?php echo $favicon; ?>
        <style id="brz-ed-page-curtain-style">@keyframes spin{100%{transform:rotate(360deg)}}.brz-ed-page-curtain{position:fixed;left:0;right:0;top:0;bottom:0;background-color:#141923;z-index:1000}.brz-ed-page-spinner,.brz-ed-page-spinner:after,.brz-ed-page-spinner:before{content:"";position:absolute;top:50%;left:50%;border:3px solid transparent;border-radius:50%;animation:spin 1s linear infinite}.brz-ed-page-spinner{width:100px;height:100px;margin:-50px 0 0 -50px;border-top-color:#22b0da;animation-duration:2.5s}.brz-ed-page-spinner:after{width:80px;height:80px;margin:-40px 0 0 -40px;border-right-color:#ed2164;animation-duration:2s}.brz-ed-page-spinner:before{width:60px;height:60px;margin:-30px 0 0 -30px;border-bottom-color:#fff}.brz-ed-load-error{display:none;width:70%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;text-align:center}.brz-ed-load-error p:first-child{font-size:30px;margin-bottom:20px}.brz-ed-load-error p:last-child{font-size:18px}.brz-ed-load-error code{background-color:gray;padding:1px;font-size:15px}.brz-ed-page-curtain.has-load-error .brz-ed-page-spinner{display:none}.brz-ed-page-curtain.has-load-error .brz-ed-load-error{display:block}</style>
    </head>
    <body class="brz brz-ed" style="margin: 0;">
        <div class="brz-ed-page-curtain">
            <div class="brz-ed-page-spinner"></div>
            <div class="brz-ed-load-error">
                <p>Sorry, Brizy could not load</p>
                <p>Your theme must use the <code>the_content</code> filter in order for Brizy to work</p>
            </div>
        </div>
        <iframe id="brz-ed-iframe" class="brz-iframe brz-ed-iframe--desktop" style="border: 0; width: 100%; min-height: 100vh; margin: 0 auto;" src="<?php echo $iframe_url; ?>"></iframe>
        <?php foreach ( $scripts as $scriptUrl ): ?>
            <script src="<?php echo $scriptUrl; ?>"></script>
        <?php endforeach; ?>
    </body>
</html>
