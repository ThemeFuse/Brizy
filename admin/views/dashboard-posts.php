<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/22/18
 * Time: 3:06 PM
 */
?>
<h3><b></b></h3>
<ul>
	<?php
	if ( count( $posts ) ) {
		foreach ( $posts as $apost ) {

			try {
				$brizy_post = Brizy_Editor_Post::get( $apost );

				if ( ! $brizy_post->uses_editor() ) {
					continue;
				}

				$link = add_query_arg(
					array( Brizy_Editor_Constants::EDIT_KEY => '' ),
					get_permalink( $apost )
				);

				?>
                <li>
                    <a href="<?php echo $link; ?>">
						<?php echo get_the_title( $apost ) ?>
                    </a>
                </li>
				<?php
			} catch ( Exception $e ) {
				continue;
			}
		}
	} else {
		?>
        <p><?php _e('No posts created')?>.</p>
		<?php
	}
	?>
</ul>
