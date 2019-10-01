<?php


class Brizy_Editor_Editor_EditorTest extends \Codeception\Test\Unit {


	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	/**
	 * @var Brizy_Editor_Editor_Editor
	 */
	protected $editor;

	/**
	 * @Override
	 */
	protected function _before() {

		$postId = $this->tester->havePostInDatabase( [
			'post_type'   => 'post',
			'post_status' => 'publish',
		] );

		$this->editor = new Brizy_Editor_Editor_Editor( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( $postId ) );
	}

	public function testRoles() {
		$config = $this->editor->config();
		$this->tester->assertArrayHasKey( 'availableRoles', $config['wp'], 'It should contain availableRoles key.' );

		$all_roles = wp_roles()->roles;
		$all_roles = apply_filters( 'editable_roles', $all_roles );
		$roles     = [];
		foreach ( $all_roles as $role => $details ) {
			$sub['role'] = esc_attr( $role );
			$sub['name'] = translate_user_role( $details['name'] );
			$roles[]     = $sub;
		}

		$this->tester->assertEquals( $roles, $config['wp']['availableRoles'], 'It should contain the available roles' );
	}
}
