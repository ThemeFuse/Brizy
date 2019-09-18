<?php

class Brizy_Editor_Data_ProjectMerge81 implements Brizy_Editor_Data_ProjectMergeStrategyInterface {

	/**
	 * @param $projectData1
	 * @param $projectData2
	 *
	 * @return mixed
	 */
	public function merge( $projectData1, $projectData2 ) {
		// MERGE STYLES

		// 1. merge extra fonts
		$projectData1->extraFonts = array_unique(
			array_merge(
				(array) ( isset( $projectData1->extraFonts ) ? $projectData1->extraFonts : array() ),
				(array) ( isset( $projectData2->extraFonts ) ? $projectData2->extraFonts : array() )
			)
		);

		// 2. merge extra fonts styles
		if ( ! isset( $projectData1->styles ) ) {
			$projectData1->styles = (object) array( '_extraFontStyles' => array() );
		}

		$projectData1->styles->_extraFontStyles = array_merge(
			(array) ( isset( $projectData1->styles->_extraFontStyles ) ? $projectData1->styles->_extraFontStyles : array() ),
			(array) ( isset( $projectData2->styles->_extraFontStyles ) ? $projectData2->styles->_extraFontStyles : array() )
		);


		$projectData1->styles->default = $projectData2->styles->default;

		if ( $projectData2->styles && isset( $projectData2->styles->_selected ) ) {
			$selected                        = $projectData2->styles->_selected;
			$projectData1->styles->_selected = $selected;
			if ( $selected ) {
				$projectData1->styles->$selected = $projectData2->styles->$selected;
			}
		}

		return $projectData1;
	}
}