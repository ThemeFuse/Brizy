<?php

class Brizy_Parser_DomDocument implements Brizy_Parser_DomInterface
{

    private $dom;

    const ENCODING_TAG = '<?xml encoding="UTF-8">';

    /**
     * @param string $html
     */
    public function __construct($html)
    {

        $dom = new DOMDocument();

        libxml_use_internal_errors(true);

        // $html = mb_convert_encoding( $html, 'HTML-ENTITIES', 'UTF-8' );

        $dom->loadHTML(self::ENCODING_TAG.$html, LIBXML_NOERROR);

        $this->dom = $dom;
    }

    /**
     * @inheritDoc
     */
    public function remove($tag, $cssClass)
    {

        $xpath = new DOMXPath($this->dom);

        /** @var DOMElement $e */
        foreach ($xpath->query('//'.$tag.'[contains(attribute::class, "'.$cssClass.'")]') as $e) {
            $e->parentNode->removeChild($e);
        }

        foreach ($xpath->query('//footer[contains(attribute::class, "brz-footer")]') as $e) {
            $e->parentNode->removeChild($e);
        }

        $dom = new self($xpath->document->saveHTML());

        $this->dom = $dom->dom;
    }

    public function showdomnode(DOMNode $domNode, DOMElement $domeElement)
    {
        foreach ($domNode->childNodes as $node) {
            print $node->nodeName.':'.$node->nodeValue.'<br>';
            if ($node->hasChildNodes()) {
                $this->showdomnode($node);
            }
        }
    }

    /**
     * @inheritDoc
     */
    public function appendText($tag, $cssClass, $text)
    {
        $textNode = $this->dom->createTextNode($text);
        $xpath = new DOMXPath($this->dom);

        /** @var DOMElement $e */
        foreach ($xpath->query('//*[contains(attribute::class, "'.$cssClass.'")]') as $e) {
            $e->appendChild($textNode);
        }

        $dom = new self($xpath->document->saveHTML());

        $this->dom = $dom->dom;
    }

    public function appendHtml($targetTag, $cssClass, $html)
    {
        $xpath = new DOMXPath($this->dom);
        $nodes = $this->createNodesFromHTML($xpath->document, trim($html));
        /** @var DOMElement $e */
        foreach ($xpath->query('//*[contains(attribute::class, "'.$cssClass.'")]') as $e) {

            foreach ($nodes as $node) {
                $e->appendChild($node);
            }
        }

        $dom = new self($xpath->document->saveHTML());

        $this->dom = $dom->dom;
    }

    private function createNodesFromHTML($doc, $html)
    {
        $nodes = array();
        $d = new DOMDocument();
        $d->loadHTML("<html><body>{$html}</body></html>");
        $child = $d->documentElement->firstChild->firstChild;
        while ($child) {
            $nodes[] = $doc->importNode($child, true);
            $child = $child->nextSibling;
        }

        return $nodes;
    }

    /**
     * @inheritDoc
     */
    public function getHtml()
    {
        return str_replace( self::ENCODING_TAG, '', $this->dom->saveHTML() );
	}

	public function getBody() {
		$body = $this->dom->getElementsByTagName('body')->item(0);
		return implode(array_map([$body->ownerDocument,"saveHTML"], iterator_to_array($body->childNodes)));
	}
}