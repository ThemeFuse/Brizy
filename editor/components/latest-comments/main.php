<?php


class Brizy_Editor_Components_LatestComments_Main extends Brizy_Editor_Components_Abstract_Component {
	/**
	 * @return string
	 */
	public function getId() {
		return 'LatestComments';
	}

	/**
	 * @return mixed
	 */
	public function getConfig() {
		return array(
			'id'           => $this->getId(),
			'title'        => 'Latest Comments',
			'icon'         => 'nc-save-section',
			'hasData'      => true,
			'html'         => $this->getHtmlTemplate(),
			'css'          => $this->getCssTemplate(),
			'defaultValue' => array(
				'avatarSize'    => '48',
				'avatarRadius'  => 'rounded',
				'avatarSpacing' => '10',
				'contentColor'  => 'black',
				'numComments'   => '3'
			),
			'dataApiKeys'  => array( 'numComments' )
		);
	}

	/**
	 * @return mixed
	 */
	public function getData() {
		$data = array(
			array(
				'author'  => 'vjeux',
				'content' => 'I’m so excited to announce that 100% of the enormous Facebook JavaScript codebase is now using prettier! It’s pretty crazy that it only took a year and two months since the first prettier commit!',
				'avatar'  => 'https://pbs.twimg.com/profile_images/758422091347603456/_tIflgtD_bigger.jpg'
			),
			array(
				'author'  => 'Jason Miller',
				'content' => 'My mentions are 97% bird puns how\'s your Sunday going',
				'avatar'  => 'https://pbs.twimg.com/profile_images/983777756147343360/LQqydtiV_bigger.jpg'
			),
			array(
				'author'  => 'Addy Osmani',
				'content' => 'Third-party JavaScript weighing you down? Defer it until you can trim it. The Telegraph deferred *all* third-party scripts. 3s faster visual completeness & better Lighthouse perf scores.',
				'avatar'  => 'https://pbs.twimg.com/profile_images/1053159168197111808/8eipWrau_bigger.jpg'
			),
			array(
				'author'  => 'Dan Abramov',
				'content' => 'If you have a question about the future of React, ask it in this thread and I’ll try my best to answer! I can’t know the future but I have some idea of what we’re working on and why. No question is too simple!',
				'avatar'  => 'https://pbs.twimg.com/profile_images/1096807971374448640/rVCDhxkG_bigger.png'
			),
			array(
				'author'  => 'William Candillon',
				'content' => 'SVG Morphing with React Native Reanimated is not perfect yet but it\'s getting there, I will investigate Android support as well as Rotational Path morphing for smoother effects.',
				'avatar'  => 'https://pbs.twimg.com/profile_images/563279207648600065/MGQxMS4G_bigger.jpeg'
			),
		);

		shuffle( $data );

		$v = $this->getContext()->getV();

		return array_slice( $data, 0, $v['numComments'] );
	}

	/**
	 * @return string[]
	 */
	public function getAssets() {
		return [
			plugins_url( 'toolbar.js', __FILE__ )
		];
	}

	/**
	 * @return false|string
	 */
	protected function getHtmlTemplate() {
		return file_get_contents( dirname( __FILE__ ) . '/html-template.html.twig' );
	}

	/**
	 * @return false|string
	 */
	protected function getCssTemplate() {
		return file_get_contents( dirname( __FILE__ ) . '/css-styles.html.twig' );
	}
}