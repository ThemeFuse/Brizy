<?php


class Brizy_Editor_EntityTest extends  \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
	}


	/**
	 * @throws ReflectionException
	 */
	public function testExceptionForInvalidPostId() {
		$this->expectException( 'Exception' );
		$stub = $this->getMockForAbstractClass( 'Brizy_Editor_Entity', [ 1 ] );
	}

	/**
	 * @throws ReflectionException
	 */
	public function testExceptionForUnsupportedPostId() {

		$id = wp_insert_post( [
			'post_type' => 'unsuported'
		] );

		$this->expectException( 'Exception' );
		$stub = $this->getMockForAbstractClass( 'Brizy_Editor_Entity', [ $id ] );
	}

	/**
	 * @throws ReflectionException
	 */
	public function testWithSupportedPostId() {

		$id = wp_insert_post( [
			'post_title'  => 'Some title',
			'post_type'   => 'page',
			'post_parent' => 100,
			'post_status' => 'publish'
		] );

		$stub = $this->getMockForAbstractClass( 'Brizy_Editor_Entity', [ $id ] );
		$this->assertEquals( $id, $stub->getWpPostId(), 'It should return the wp post id' );
		$this->assertInstanceOf( WP_Post::class, $post = $stub->getWpPost(), 'It should return the correct instance of post' );
		$this->assertEquals( $id, $post->ID, 'It should return the correct instance of post' );
		$this->assertEquals( 100, $stub->getWpPostParentId(), 'It should return the correct parent id' );
	}

	public function testDataVersionSave() {

		$id = wp_insert_post( [
			'post_title'  => 'Some title',
			'post_type'   => 'page',
			'post_parent' => 100,
			'post_status' => 'publish'
		] );

		update_post_meta( $id, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, 0 );

		$stub = $this->getMockForAbstractClass( 'Brizy_Editor_Entity', [ $id ] );
		$stub->setDataVersion( 1 );
		$stub->save();

		$dataVersion = get_post_meta( $id, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, true );

		$this->assertEquals( 1, $dataVersion, 'It should increment the dataVersion' );

	}

	public function testInvalidDataVersionSave() {

		$id = wp_insert_post( [
			'post_title'  => 'Some title',
			'post_type'   => 'page',
			'post_parent' => 100,
			'post_status' => 'publish'
		] );

		update_post_meta( $id, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, 2 );

		$this->expectException('Exception');

		$stub = $this->getMockForAbstractClass( 'Brizy_Editor_Entity', [ $id ] );
		$stub->setDataVersion( 2 );
		$stub->save();
	}


}