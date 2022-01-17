<?php if ( is_array( $news ) ) : ?>
    <div class="brizy-overview__feed">
        <h3 class="brizy-overview__heading">
            <?php _e( 'News & Updates', 'brizy' ); ?>
        </h3>
        <ul class="brizy-overview__posts">
			<?php foreach ( $news as $item ) : ?>
                <li class="brizy-overview__post">
                    <a href="<?php echo esc_url( $item['url'] ); ?>" class="brizy-overview__post-link" target="_blank">
                        <span class="brizy-overview__badge"><?php _e( 'New', 'brizy' ); ?></span>
						<?php echo strip_tags( $item['title'] ); ?>
                    </a>
                    <p class="brizy-overview__post-description"><?php echo strip_tags( $item['excerpt'] ); ?></p>
                </li>
			<?php endforeach; ?>
        </ul>
    </div>
<?php else : ?>
    <p>
        <?php echo is_string( $news ) ? $news : __( 'No News', 'brizy' ); ?>
    </p>
<?php endif; ?>