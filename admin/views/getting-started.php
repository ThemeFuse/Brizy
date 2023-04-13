<?php

if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

?>

<div class="gs_content">
    <div class="gs_container">`
        <div class="gs_title_page"><?php echo sprintf( __('Welcome to %s', 'brizy'), __bt( 'brizy', 'Brizy' ) ) ?></div>
        <div class="gs_subtitle_page"><?php _e('Build no-code WordPress websites fast & easy', 'brizy'); ?></div>
        <?php if ( $isWhiteLabel == 0 ) { ?>
        <video class="gs_video_page" poster="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/Video_Cover.jpg" controls>
            <source src="" type="video/mp4">
            <source src="" type="video/ogg">
            <?php _e('Your browser does not support the video tag.', 'brizy'); ?>
        </video>
        <?php } ?>

        <nav class="gs_nav_menu">
            <span class="gs_menu_tab gs_menu_tab_active" onclick="gs_menu_tab(event, 'gs_content_tab_one')"><?php _e('Start From a Premade Website', 'brizy'); ?></span>
            <span class="gs_menu_tab" onclick="gs_menu_tab(event, 'gs_content_tab_two')"><?php _e('Add Pages on Your Existing Website', 'brizy'); ?></span>
        </nav>

        <div class="gs_content_tab gs_content_tab_one" id="gs_content_tab_one">
            <div class="gs_tab_block">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/1_Go_to_starter_Templates.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('1. Go to Starter Templates', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('Perfect if you want to start with a premade website and go from there. Go to the', 'brizy');?> <strong><?php _e('Starter Templates', 'brizy'); ?></strong> <?php _e('page of the plugin, in the main sidebar.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('View Starter Templates', 'brizy'); ?></div></a>
                </div>
            </div>

            <div class="gs_tab_block gs_tab_block_inverse">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/2_Browse_Websites_Library.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('2. Browse the Websites Library', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('With', 'brizy'); ?> <strong><?php _e('over 150 ready made websites', 'brizy'); ?></strong> <?php _e('& landing pages, our library was carefully crafted by professional designers to let you quickly spin up a new website.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('Browse All Designs', 'brizy'); ?></div></a>
                </div>
            </div>

            <div class="gs_tab_block">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/3_Install_with_1_click.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('3. Install With 1-click', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('When you decided,', 'brizy'); ?> <strong><?php _e('press the Install button.', 'brizy'); ?> </strong><?php _e('This will let you start from a ready made website by installing all content: images, copy, pages, menus & more.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('Install a Ready Made Website', 'brizy'); ?></div></a>
                </div>
            </div>

            <div class="gs_tab_block gs_tab_block_inverse">
                <div>
                    <a href="/wp-admin/edit.php?post_type=page"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/4_Start_editing.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('4. Start Editing Your Website', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('Once the install is done, you can edit any imported page by going to Pages, find the page name and', 'brizy'); ?> <strong><?php _e('press the Edit with button.', 'brizy'); ?></strong></div>
                    <a href="/wp-admin/edit.php?post_type=page"><div class="gs_button_tab"><?php _e('Go to All Pages', 'brizy'); ?></div></a>
                </div>
            </div>


            <div class="gs_content_tab_bottom">
                <?php if ( $isWhiteLabel == 0 ) { ?>
                <div class="gs_tab_block_bottom">
                    <div>
                        <a href=""><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/start-from-premade/Visit_Brizy_Academy.jpg" alt=""></a>
                    </div>
                    <div class="gs_tab_block_bottom_content">
                        <div class="gs_title_tab_bottom"><?php _e('Visit the Brizy Academy', 'brizy'); ?></div>
                        <div class="gs_subtitle_tab_bottom"><?php _e('Follow step by step guides and tutorials on how to build your website and bring your web presence to life.', 'brizy'); ?></div>
                        <a href=""><div class="gs_button_tab_bottom"><?php _e('Visit the Academy', 'brizy'); ?></div></a>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>


        <div class="gs_content_tab gs_content_tab_two" id="gs_content_tab_two">
            <div class="gs_tab_block">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/add-new-pages/1_Go_to_Pages.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('', 'brizy'); ?><?php _e('1. Go to Pages', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('', 'brizy'); ?><?php _e('Perfect if you want to add', 'brizy'); ?> <strong><?php _e('pages', 'brizy'); ?></strong> <?php _e('to your existing website. Go to Pages, in the main sidebar.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('', 'brizy'); ?><?php _e('Create a New Page', 'brizy'); ?></div></a>
                </div>
            </div>

            <div class="gs_tab_block gs_tab_block_inverse">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/add-new-pages/2_Create_new_Page.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('', 'brizy'); ?><?php _e('2. Create a New Page', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('', 'brizy'); ?><?php _e('Add a new page by pressing the', 'brizy'); ?> <strong><?php _e('Add New', 'brizy'); ?></strong> <?php _e('button from the top of the page.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('', 'brizy'); ?><?php _e('Create a New Page', 'brizy'); ?></div></a>
                </div>
            </div>

            <div class="gs_tab_block">
                <div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/add-new-pages/3_Edit_with_Builder.jpg" alt=""></a>
                </div>
                <div>
                    <div class="gs_title_tab"><?php _e('', 'brizy'); ?><?php _e('3. Edit page with the builder', 'brizy'); ?></div>
                    <div class="gs_subtitle_tab"><?php _e('', 'brizy'); ?><?php _e('Press the', 'brizy'); ?> <strong><?php _e('Edit with Builder', 'brizy'); ?></strong> <?php _e('button to load the drag and drop visual builder and start editting your page.', 'brizy'); ?></div>
                    <a href="/wp-admin/admin.php?page=starter-templates"><div class="gs_button_tab"><?php _e('', 'brizy'); ?><?php _e('Create a New Page', 'brizy'); ?></div></a>
                </div>
            </div>


            <div class="gs_content_tab_bottom">
                <?php if ( $isWhiteLabel == 0 ) { ?>
                <div class="gs_tab_block_bottom">
                    <div>
                        <a href=""><img src="<?php echo BRIZY_PLUGIN_URL ?>/admin/static/img/getting-started/brizy-branded/add-new-pages/Visit_Brizy_Academy.jpg" alt=""></a>
                    </div>
                    <div class="gs_tab_block_bottom_content">
                        <div class="gs_title_tab_bottom"><?php _e('', 'brizy'); ?><?php _e('Visit the Brizy Academy', 'brizy'); ?></div>
                        <div class="gs_subtitle_tab_bottom"><?php _e('', 'brizy'); ?><?php _e('Follow step by step guides and tutorials on how to build your website and bring your web presence to life.', 'brizy'); ?></div>
                        <a href=""><div class="gs_button_tab_bottom"><?php _e('', 'brizy'); ?><?php _e('Visit the Academy', 'brizy'); ?></div></a>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>



<?php //Hide admin footer from admin
function change_footer_admin () {return ' ';}
add_filter('admin_footer_text', 'change_footer_admin', 9999);
function change_footer_version() {return ' ';}
add_filter( 'update_footer', 'change_footer_version', 9999);
?>



