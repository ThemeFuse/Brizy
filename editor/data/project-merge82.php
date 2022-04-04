<?php

class Brizy_Editor_Data_ProjectMerge82 implements Brizy_Editor_Data_ProjectMergeStrategyInterface {
	private function mergeFonts( $fonts, $newFonts, $key = "family" ) {
		$result = $fonts;

		foreach ( $newFonts->data as $newFont ) {
			$exist = false;

			foreach ( $fonts->data as $font ) {
				if ( $font->$key === $newFont->$key ) {
					$exist = true;
				}
			}

			if ( ! $exist ) {
				$result->data[] = $newFont;
			}
		}

		return $result;
	}

	public function merge( $projectData1, $projectData2 ) {

		if ( count( get_object_vars( $projectData1 ) ) == 0 ) {
			return $projectData2;
		}

		$result                = $projectData1;
		$result->selectedKit   = $projectData2->selectedKit;
		$result->selectedStyle = $projectData2->selectedStyle;

		if ( empty( $result->styles ) ) {
			$result->styles = $projectData2->styles;
		} else {

			$resultStyles = [];
			foreach ( $result->styles as $style ) {
				$resultStyles[ $style->id ] = $style;
			}

			foreach ( $projectData2->styles as $style ) {
				$resultStyles[ $style->id ] = $style;
			}

			$result->styles = array_values( $resultStyles );
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
			if ( ! isset( $result->fonts->blocks ) ) {
				$result->fonts->blocks = $projectData2->fonts->blocks;
			} else {
				$result->fonts->blocks = $this->mergeFonts( $projectData2->fonts->blocks, $projectData2->fonts->blocks );
			}
		}

		// fonts -> google
		if ( isset( $projectData2->fonts->google ) ) {
			if ( ! isset( $result->fonts->google ) ) {
				$result->fonts->google = $projectData2->fonts->google;
			} else {
				$result->fonts->google = $this->mergeFonts( $projectData2->fonts->google, $projectData2->fonts->google );
			}
		}

		// fonts -> upload
		if ( isset( $projectData2->fonts->upload ) ) {
			if ( ! isset( $result->fonts->upload ) ) {
				$result->fonts->uploud = $projectData2->fonts->upload;
			} else {
				$result->fonts->upload = $this->mergeFonts( $projectData2->fonts->upload, $projectData2->fonts->upload, "id" );
			}
		}

		return $result;
	}
}
