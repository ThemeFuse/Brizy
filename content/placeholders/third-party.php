<?php 

class Brizy_Content_Placeholders_ThirdParty extends Brizy_Content_Placeholders_Simple {

	/**
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function getValue( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder ) {

		$attributes = $contentPlaceholder->getAttributes();
		$id = $attributes['id'];
		$v = json_decode($attributes['v'], true);

		$third_party = null;
		foreach( apply_filters( 'brizy_third-party_elements', array() ) as $tmp ) {
			if ( $tmp['id'] === $id ) {
				$third_party = $tmp;
				break;
			}
		};

		if (!$third_party) {
			// TODO: throw some error, or return 400
		}
		
		$twig = new Twig_Environment(new Twig_Loader_String());
		return $twig->render(
			$third_party['html'],
			array_merge($v, array( 'apiData' => call_user_func( $third_party['dataApi'], $v )))
		);
	}
}