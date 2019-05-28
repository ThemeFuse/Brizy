<div class="brizy-news">
    <?php echo $news; ?>
</div>

<div class="brizy-posts">
	<?php echo $posts ?>
</div>

<p class="brizy-dashboard-widget-footer">

    <a href="https://www.brizy.io/blog/" target="_blank">
        <?php _e( 'Blog', 'brizy' ); ?>&nbsp;
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a>
    |
    <a href="https://support.brizy.io/hc/en-us" target="_blank">
		<?php _e( 'Help', 'brizy' ); ?>&nbsp;
        <span aria-hidden="true" class="dashicons dashicons-external"></span>
    </a>
	<?php if ( ! class_exists( 'BrizyPro_Main' ) ) : ?>
    |
    <a href="<?php echo Brizy_Config::GO_PRO_DASHBOARD_URL; ?>" target="_blank" class="brizy-dashboard-widget-footer__go-pro">
		<?php _e( 'Go PRO', 'brizy' ); ?>&nbsp;
        <svg height="20" width="20">
            <path d="M13,7 L12,7 L12,4.73333333 C12,2.6744 10.206,1 8,1 C5.794,1 4,2.6744 4,4.73333333 L4,7 L3,7 C2.448,7 2,7.41813333 2,7.93333333 L2,14.0666667 C2,14.5818667 2.448,15 3,15 L13,15 C13.552,15 14,14.5818667 14,14.0666667 L14,7.93333333 C14,7.41813333 13.552,7 13,7 Z M10,5 L12,5 L12,7 L10,7 L6,7 L6,5 C6,3.897 6.897,3 8,3 C9.103,3 10,3.897 10,5 Z" fill-rule="nonzero"/>
        </svg>
    </a>
	<?php endif; ?>
</p>