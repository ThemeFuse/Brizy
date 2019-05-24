<?php

class BlockTest extends \Codeception\Test\Unit {

	// tests

	/**
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function test_save() {

		$data         = base64_encode('test');
		$data_decoded = 'test';

		$id    = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test' ] );
		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->set_compiler_version( '1' );
		$block->set_editor_version( '2' );
		$block->save();

		unset( $block );

		$block = new Brizy_Editor_Block( $id );

		$this->assertInstanceOf( "Brizy_Editor_BlockPosition", $block->getPosition(), "setPosition should return a Brizy_Editor_BlockPosition instance " );
		$this->assertEquals( $data_decoded, $block->get_editor_data(), "It should return decoded data" );
		$this->assertEquals( "1", $block->get_compiler_version() );
		$this->assertEquals( "2", $block->get_editor_version() );
	}

	/**
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function test_jsonSerialize() {

		$data         = base64_encode('test');
		$data_decoded = 'test';

		echo $id    = wp_insert_post( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, 'post_title' => 'Test 2' ] );

		$block = new Brizy_Editor_Block( $id );
		$block->setPosition( new Brizy_Editor_BlockPosition( "left", 1 ) );
		$block->set_editor_data( $data );
		$block->save();

		unset( $block );

		$block = new Brizy_Editor_Block( $id );

		$json_serialize = $block->jsonSerialize();

		var_dump($json_serialize);

		$this->assertTrue( isset($json_serialize['rules']),'Rule data is not returned in json serialize data' );
		$this->assertTrue( isset($json_serialize['position']),'Position data is not returned in json serialize data' );
		$this->assertTrue( isset($json_serialize['editor_data']),'Editor data is not returned in json serialize data' );
		$this->assertEquals( $json_serialize['editor_data'],$data_decoded,'Editor data is not decoded' );
	}
}
