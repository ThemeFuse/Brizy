<?php defined( 'ABSPATH' ) or die();

$selectedTab = isset( $_REQUEST['tab'] ) ? esc_attr( $_REQUEST['tab'] ) : 'replacer';
?>

<div class="wrap">
	<h1><?php _e( 'Tools', 'brizy' ); ?></h1>

	<h2 class="nav-tab-wrapper">
		<a href="<?php echo menu_page_url( Brizy_Editor::prefix( '-tools' ), false ) . '&tab=replacer' ?>" class="nav-tab<?php echo ( $selectedTab == 'replacer' ? ' nav-tab-active' : '' ) ?>">
			<?php _e( 'Replace URL', 'brizy' ); ?>
		</a>
	</h2>
    <?php if ( $selectedTab == 'replacer' ) : ?>
        <div id="tab-replace_url" class="brz-settings-form-page brz-active">
            <h2><?php _e( 'Replace URL', 'brizy' ); ?></h2>
            <div>
                <?php printf( __( '<strong>Important:</strong> It is strongly recommended that you <a target="_blank" href="%s">backup your database</a> before using Replace URL.', 'brizy' ), 'https://wordpress.org/support/article/wordpress-backups/' ); ?>
            </div>
            <table class="form-table">
                <tbody>
                    <tr class="brz_replace_url">
                        <th scope="row"><?php _e( 'Update Site Address (URL)', 'brizy' ); ?></th>
                        <td>
                            <div id="brz_replace_url">
                                <div>
                                    <input type="text" name="from" placeholder="http://old-url.com" class="medium-text">
                                    <input type="text" name="to" placeholder="http://new-url.com" class="medium-text">
                                    <button class="button brz-button-spinner" id="brz-replace-url-button">
	                                    <?php _e( 'Replace URL', 'brizy' ); ?>
                                    </button>
                                </div>
                                <p class="description">
	                                <?php printf( __( "Enter your old and new URLs for your WordPress installation, to update all %s data (Relevant for domain transfers or move to 'HTTPS').", 'brizy' ), ucfirst( __bt( 'brizy', 'Brizy' ) ) ); ?>
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>