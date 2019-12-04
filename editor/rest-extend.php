<?php

/**
 * This class will add all the images that are used by brizy in a post
 *
 * Class Brizy_Editor_RestExtend
 */
class Brizy_Editor_RestExtend {

	/**
	 * Brizy_Editor_RestExtend constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', function () {
			register_rest_field( Brizy_Editor::get()->supported_post_types(), 'brizy_media', array(
				'get_callback'    => function ( $page ) {
					$uid = get_post_meta( $page['id'], 'brizy_post_uid', true );

					return $this->get_page_attachments( $uid );
				},
				'update_callback' => function ( $karma, $comment_obj ) {
					return true;
				},
				'schema'          => array(
					'description' => __( 'Birzy attached media' ),
					'type'        => 'array'
				),
			) );
		} );
	}

	private function get_page_attachments( $uid ) {
		global $wpdb;
		$query = $wpdb->prepare(
			"SELECT 
					pm.*
				FROM 
					{$wpdb->prefix}postmeta pm 
				    JOIN {$wpdb->prefix}postmeta pm2 ON pm2.post_id=pm.post_id AND pm2.meta_key='brizy_post_uid' AND pm2.meta_value=%s
				WHERE pm.meta_key='brizy_attachment_uid'
				GROUP BY pm.post_id", $uid );

		$results         = $wpdb->get_results( $query );
		$attachment_data = array();
		foreach ( $results as $row ) {
			$attachment        = get_post( (int) $row->post_id );
			$attachment_data[] =
				[
					'id'   => (int) $row->post_id,
					'url'  => wp_get_attachment_url( (int) $row->post_id ),
					'name' => basename( $attachment->guid ),
					'meta' => [
						'brizy_attachment_uid' => get_post_meta( (int) $row->post_id, 'brizy_attachment_uid', true ),
						'brizy_post_uid'       => get_post_meta( (int) $row->post_id, 'brizy_post_uid' )
					]
				];
		}

		return $attachment_data;
	}
}