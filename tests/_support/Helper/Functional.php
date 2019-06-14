<?php

namespace Helper;

// here you can define custom actions
// all public methods declared in helper class will be available in $I

use Brizy_Admin_Fonts_Main;

class Functional extends \Codeception\Module {

	/**
	 * @param $count
	 * @param $fontFamily
	 * @param $weights
	 * @param $type
	 * @param string $status
	 *
	 * @throws \Codeception\Exception\ModuleException
	 */
	public function haveManyFontsInDataBase( $count, $fontFamily, $weights, $type, $status = 'publish' ) {


		$db = $this->getModule( 'WPDb' );

		$fontFamily = 'proxima_nova_';

		for ( $i = 1; $i <= $count; $i ++ ) {
			$fontId = $db->havePostInDatabase( [
				'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
				'post_title'  => $fontFamily . $i,
				'post_name'   => $fontFamily . $i,
				'post_status' => $status,
				'meta_input'  => [
					'brizy_post_uid'  => 'gffbf00297b0b4e9ee27af32a7b79c333' . $i,
					'brizy-font-type' => $type
				],
			] );

			foreach ( (array) $weights as $weigth => $types ) {
				foreach ( (array) $types as $$type ) {

					$db->havePostInDatabase( [
						'post_type'   => 'attachment',
						'post_status' => 'publish',
						'post_parent' => $fontId,
						'meta_input'  => [
							'brizy-font-weight'    => $weigth,
							'brizy-font-file-type' => $type
						],
					] );
				}
			}
		}

	}
}
