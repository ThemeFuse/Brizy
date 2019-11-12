<?php


class Brizy_Editor_EntityTest extends \Codeception\Test\Unit {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

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


}