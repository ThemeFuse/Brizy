<?php if ( $news ) : ?>
    <div class="brizy-overview__feed">
        <h3 class="brizy-overview__heading">
            <?php echo __( 'News & Updates', 'elementor' ); ?>
        </h3>
        <ul class="brizy-overview__posts">
			<?php foreach ( $news as $item ) : ?>
                <li class="brizy-overview__post">
                    <a href="<?php echo esc_url( $item['url'] ); ?>" class="brizy-overview__post-link" target="_blank">
                        <span class="brizy-overview__badge"><?php echo __( 'New', 'elementor' ); ?></span>
						<?php echo esc_html( $item['title'] ); ?>
                    </a>
                    <p class="brizy-overview__post-description"><?php echo $item['excerpt']; ?></p>
                </li>
			<?php endforeach; ?>
        </ul>
    </div>
<?php else : ?>
    <p><?php _e( 'No News', 'brizy' ); ?></p>
<?php endif; ?>