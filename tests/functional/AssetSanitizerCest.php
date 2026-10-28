<?php

class AssetSanitizerCest {

	private function file( $name, $url ) {
		return [
			'name'    => $name,
			'score'   => 1,
			'content' => [ 'type' => 'file', 'url' => $url, 'attr' => [] ],
			'pro'     => false,
		];
	}

	private function urls( $assets ) {
		return array_map( function ( $asset ) {
			return $asset['content']['url'];
		}, $assets );
	}

	public function externalScriptFilesAreDroppedTest( FunctionalTester $I ) {
		$sanitizer = new Brizy_Editor_AssetSanitizer();

		$assets = $sanitizer->sanitizeAssets( [
			'freeScripts' => [
				'main'    => $this->file( 'main', 'https://evil.example/main.js' ),
				'generic' => [
					$this->file( 'evil', 'https://evil.example/x.js' ),
					$this->file( 'relative', '//evil.example/y.js' ),
					$this->file( 'font', 'https://fonts.bunny.net/x.js' ),
					$this->file( 'ok', '/wp-content/plugins/brizy/public/editor-build/ok.js' ),
				],
			],
		] );

		// the main asset cannot be dropped, so it is emptied with its keys intact
		$I->assertEquals( '', $assets['freeScripts']['main']['content']['url'] );
		$I->assertEquals( [ 'type', 'url', 'attr' ], array_keys( $assets['freeScripts']['main']['content'] ) );
		$I->assertEquals( [ '/wp-content/plugins/brizy/public/editor-build/ok.js' ], $this->urls( $assets['freeScripts']['generic'] ) );
	}

	public function fontStylesheetsAreKeptTest( FunctionalTester $I ) {
		$sanitizer = new Brizy_Editor_AssetSanitizer();

		$assets = $sanitizer->sanitizeAssets( [
			'freeStyles' => [
				'main'      => $this->file( 'main', '/wp-content/plugins/brizy/public/editor-build/a.css' ),
				'pageFonts' => [
					$this->file( 'bunny', 'https://fonts.bunny.net/css?family=Lato' ),
					$this->file( 'evil', 'https://evil.example/a.css' ),
				],
			],
		] );

		$I->assertEquals( '/wp-content/plugins/brizy/public/editor-build/a.css', $assets['freeStyles']['main']['content']['url'] );
		$I->assertEquals( [ 'https://fonts.bunny.net/css?family=Lato' ], $this->urls( $assets['freeStyles']['pageFonts'] ) );
	}
}
