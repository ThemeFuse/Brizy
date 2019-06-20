<?php

class Brizy_Content_Placeholders_Component extends Brizy_Content_Placeholders_Simple {

	/**
	 * @param Brizy_Content_Context $context
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 *
	 * @return mixed|string
	 * @throws Twig_Error_Loader
	 * @throws Twig_Error_Runtime
	 * @throws Twig_Error_Syntax
	 */
	public function getValue( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder ) {

		$attributes = $contentPlaceholder->getAttributes();
		$id         = $attributes['id'];
		$v          = json_decode( $attributes['v'], true );

		$context = new Brizy_Editor_Components_Context();
		$context->setV( $v );
		$context->setIsEditor( false );

		$component = Brizy_Public_Components::instance()->getComponent( $id );
		$component->setContext( $context );

		if ( $component ) {

			$twig = new Twig_Environment( new Brizy_Editor_Components_TwigLoader( $component ) );

			return $twig->render( 'template', array_merge( $v, array( 'apiData' => $component->getData() ) ) );

		} else {
			return '';
		}
	}
}