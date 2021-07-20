<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var int $id ;
 * @var Brizy_Editor_Post $post ;
 */

$state     = $is_using_brizy ? 'disable' : 'enable';
$className = $is_using_brizy ? 'brizy-button--default' : 'brizy-button--primary';
$edit_url  = esc_url( set_url_scheme( admin_url( 'admin-post.php?action=_brizy_admin_editor_' . $state . '&post=' . $post->ID ) ) );
?>
    <div class="brizy-buttons is-classic-editor">
        <?php
            if ( $is_using_brizy ) {
                ?>
                <a class="brizy-button brizy-button--primary enable-brizy-editor" href="<?php echo $edit_url; ?>">
                    <?php echo __( 'Back to WordPress Editor', 'brizy' ) ?>
                </a>
                <?php
            } else {
                ?>
                <a href="<?php echo $edit_url;?>" class="button button-primary button-large enable-brizy-editor">
		            <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                </a>
                <?php
            }
        ?>
    </div>
<?php
if ( $is_using_brizy ) {
	?>
    <style>
        #post-status-info {
            display: none;
        }
    </style>

    <div class="brizy-editor">
        <div class="brizy-buttons brizy-buttons-gutenberg">
            <a href="<?php echo $url;?>" class="">
                <div class="button button-primary button-large">
				    <?php printf( esc_html__( 'Edit with %s', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
                </div>
            </a>
        </div>
    </div>
	<?php
}
?>