<?php

interface Brizy_Parser_DomInterface
{

    /**
     * @param string $tag
     * @param string $cssClass
     *
     * @return void
     */
    public function remove($tag, $cssClass);

    /**
     * @param string $tag
     * @param string $cssClass
     * @param string $text
     *
     * @return void
     */
    public function appendText($tag, $cssClass, $text);

    public function appendHtml($targetTag, $cssClass, $html);/**
	 * Get modified HTML
	 *
	 * @return string
	 */
	public function getHtml();

	public function getBody();
}