<?php

class Brizy_Editor_Data_ProjectMerge82 implements Brizy_Editor_Data_ProjectMergeStrategyInterface {
	private function mergeFonts( $fonts, $newFonts, $key = "family" ) {
		$result = $fonts;

		foreach ( $result->data as $font ) {
			foreach ( $newFonts->data as $newFont ) {
				if ( $font[ $key ] === $newFont[ $key ] ) {
					continue;
				} else {
					$result->data[] = $newFont;
				}
			}
		}

		return $result;
	}

	public function merge( $projectData1, $projectData2 ) {

		$result = $projectData1;

		// selected Kit
		$result->selectedKit = $projectData2->selectedKit;

		// selected Style
		$result->selectedStyle = $projectData2->selectedStyle;

		// merge styles
		foreach ( $projectData2->styles as $i => $style ) {
			foreach ( $result->styles as $j => $resultStyle ) {
				if ( $style->id === $resultStyle->id ) {
					$result->styles[ $j ] = $style;
				} else {
					$result->styles[] = $style;
				}
			}
		}

		// extraFontStyles
		$result->extraFontStyles = array_merge(
			(array) ( $result->extraFontStyles ),
			(array) ( $projectData2->extraFontStyles )
		);

		// font
		$result->font = $projectData2->font;

		// fonts
		// fonts -> config
		$result->fonts->config = $this->mergeFonts( $result->fonts->config, $projectData2->fonts->config );

		// fonts -> blocks
		if ( isset( $projectData2->fonts->blocks ) ) {
			$resultBlocks          = ( isset( $result->fonts->blocks ) ) ? $result->fonts->blocks : array( 'data' => array() );
			$result->fonts->blocks = $this->mergeFonts( $resultBlocks, $projectData2->fonts->blocks );
		}

		// fonts -> google
		if ( isset( $projectData2->fonts->google ) ) {
			$resultGoogle          = ( isset( $result->fonts->google ) ) ? $result->fonts->google : array( 'data' => array() );
			$result->fonts->google = $this->mergeFonts( $resultGoogle, $projectData2->fonts->google );
		}

		// fonts -> upload
		if ( isset( $projectData2->fonts->upload ) ) {
			$resultUpload          = ( isset( $result->fonts->upload ) ) ? $result->fonts->upload : array( 'data' => array() );
			$result->fonts->upload = $this->mergeFonts( $resultUpload, $projectData2->fonts->upload, "id" );
		}

	}
}
