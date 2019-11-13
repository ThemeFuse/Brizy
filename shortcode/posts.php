<?php

class Brizy_Shortcode_Posts extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'posts';
	}

	/**
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 */
	public function render( $atts, $content = null ) {
		// shortcode to use in page: [brizy_posts posts_per_page="5" category="1,2" orderby="date" order="DESC" columns="1" display_date="1" display_author="1"]

		// this array is used as default values for displayPosts
		$extra_atts = array(
			"columns"        => 1,
			"display_date"   => 1,
			"display_author" => 1,
		);
		$extra_atts = array_merge( $extra_atts, $atts );

		$posts = $this->getPosts( $atts );

		return $this->displayPosts( $posts, $extra_atts );
	}

	public function getPosts( $atts ) {
		// here are default posts arguments: https://codex.wordpress.org/Template_Tags/get_posts
		// maybe here we need to change some attributes, unset or add something before make query
		$posts = get_posts( $atts );

		return $posts;
	}

	public function displayPosts( $posts, $extra_atts ) {
		ob_start();

		$thumbnail_size = ''; // possible sizes: thumbnail, medium, medium_large, large
		if ( (int) $extra_atts['columns'] > 1 ) {
			$thumbnail_size = 'large';
		}

		foreach ( $posts as $post ) { ?>
			<article class="brz-article">
				<h2><a href="<?php echo get_permalink( $post->ID ); ?>"><?php echo get_the_title( $post ); ?></a></h2>

				<div class="brz-post-thumbnail">
					<?php echo get_the_post_thumbnail( $post, $thumbnail_size ); ?>
				</div>

				<div class="brz-post-description">
					<?php echo $this->getPostExcerpt( $post ); ?>
				</div>

				<?php if ( $extra_atts['display_date'] ) { ?>
					<div class="brz-post-date">
						<?php echo get_the_date( "", $post ); ?>
					</div>
				<?php } ?>

				<?php if ( $extra_atts['display_author'] ) { ?>
					<div class="brz-post-author">
						<a rel="author" href="<?php echo get_author_posts_url( $post->post_author ); ?>"><span itemprop="name"><?php echo get_the_author_meta( 'display_name', $post->post_author ); ?></span></a>
					</div>
				<?php } ?>
			</article>
		<?php
		}

		return ob_get_clean();
	}

	public function getPostExcerpt( $post ) {
		if ( ! empty( $post->post_excerpt ) ) {
			// if !empty excerpt
			return $post->post_excerpt;
		}

		$the_excerpt    = strip_tags( strip_shortcodes( $post->post_content ) ); // Strips tags and shortcodes
		$excerpt_length = 50; // Sets excerpt length by word count, default in WP is 55
		$words          = explode( ' ', $the_excerpt, $excerpt_length + 1 );

		if ( count( $words ) > $excerpt_length ) {
			array_pop( $words );
			$the_excerpt = implode( ' ', $words ); // put in excerpt only the number of word that is set in $excerpt_length
		}

		return $the_excerpt;
	}
}