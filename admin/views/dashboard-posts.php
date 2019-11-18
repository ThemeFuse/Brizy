<?php if ( count( $posts ) ) : ?>
    <div class="brizy-overview__recently-edited">
        <h3 class="brizy-overview__heading">
            <?php _e( 'Recently Edited', 'brizy' ); ?>
        </h3>
        <ul class="brizy-overview__posts">
            <?php foreach ( $posts as $apost ) : ?>
                <li class="brizy-overview__post">
                    <a href="<?php echo esc_url( $apost['edit_url'] ); ?>" class="e-overview__post-link">
                        <?php echo $apost['title']; ?> <span class="dashicons dashicons-edit"></span>
                    </a> <span><?php echo $apost['date']; ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>
