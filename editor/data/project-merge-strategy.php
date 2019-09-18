<?php

class Brizy_Editor_Data_ProjectMergeStrategy {

	/**
	 * @param $version
	 *
	 * @return Brizy_Editor_Data_ProjectMergeStrategyInterface
	 */
	static public function getMergerInstance( $version ) {
		if ( version_compare( $version, '1.0.81' ) <= 0 ) {
			return new Brizy_Editor_Data_ProjectMerge81();
		}

		return new Brizy_Editor_Data_ProjectMerge82();
	}

	/**
	 * This code needs to be updated if the project data will change.
	 *
	 * @param $version
	 *
	 * @return bool
	 */
	static public function checkVersionCompatibility( $version ) {
		if ( version_compare( $version, '1.0.81' ) > 0 && version_compare( $version, BRIZY_VERSION ) <= 0 ) {
			return true;
		}

		return false;
	}
}