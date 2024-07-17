<?php

class Brizy_Parser_DomPquery implements Brizy_Parser_DomInterface
{

    private $dom;

    /**
     * @param string $html
     */
    public function __construct($html)
    {
        $this->dom = Brizy_Parser_Pquery_Pquery::parseStr($html);
    }

    /**
     * @inheritDoc
     */
    public function remove($tag, $cssClass)
    {
        $this->dom->remove("$tag.$cssClass");
    }

    /**
     * @inheritDoc
     */
    public function appendText($tag, $cssClass, $text)
    {
        $this->dom->query(".$cssClass")->after($text);
    }

    public function appendHtml($targetTag, $cssClass, $html)
    {
        $this->dom->query(".$cssClass")->after($html);
    }

    /**
     * @inheritDoc
     */
    public function getHtml()
    {
        return $this->dom->body();
	}

	public function getBody() {
		return $this->dom->body();
    }
}