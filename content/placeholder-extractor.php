<?php


/**
 * @deprecated
 *
 * Class Brizy_Content_PlaceholderExtractor
 */
class Brizy_Content_PlaceholderExtractor
{

    /**
     * @var Brizy_Content_Providers_AbstractProvider
     */
    private $provider;


    /**
     * BrizyPro_Content_PlaceholderExtractor constructor.
     *
     * @param Brizy_Content_Providers_AbstractProvider $provider
     */
    public function __construct($provider)
    {
        $this->provider = $provider;
    }

    private static function getPlaceholderRegexExpression()
    {
        return "/(?<placeholder>{{\s*(?<placeholderName>.+?)(?<attributes>(?:\s+)((?:\w+\s*=\s*(?:'|\"|\&quot;|\&apos;)(?:.[^\"']*|)(?:'|\"|\&quot;|\&apos;)\s*)*))?}}(?:(?<content>.*?){{\s*end_(\g{placeholderName})\s*}})?)/ims";;
    }

    public static function stripPlaceholders($content)
    {
        $expression = self::getPlaceholderRegexExpression();
        return preg_replace($expression, '', $content);
    }

    /**
     * @param $content
     *
     * @return array
     */
    public function extract($content)
    {

        $placeholders = array();
        $expression = self::getPlaceholderRegexExpression();

        $matches = array();

        preg_match_all($expression, $content, $matches);

        if (count($matches['placeholder']) == 0) {
            return array($placeholders, $content);
        }

        foreach ($matches['placeholder'] as $i => $name) {

            $hasPlaceholder = $this->provider->getPlaceholder($matches['placeholderName'][$i]);

            // ignore unknown placeholders
            if (!$hasPlaceholder) {
                continue;
            }

	        $placeholder = new \BrizyPlaceholders\ContentPlaceholder(
		        $matches['placeholderName'][$i],
		        $matches['placeholder'][$i],
		        $this->getPlaceholderAttributes($matches['attributes'][$i]),
		        $matches['content'][$i]
	        );

	        $placeholders[] = $placeholder;

            $pos = strpos($content, $placeholder->getPlaceholder());

            $length = strlen($placeholder->getPlaceholder());

            if ($pos !== false) {
                $content = substr_replace($content, $placeholder->getUid(), $pos, $length);
            }
        }
        return array($placeholders, $content);
    }

    /**
     * Split the attributs from attribute string
     *
     * @param $attributeString
     *
     * @return array
     */
    private function getPlaceholderAttributes($attributeString)
    {
        $attrString = trim($attributeString);
        $attrMatches = array();
        $attributes = array();
        preg_match_all("/(\w+)\s*=\s*(?<quote>'|\"|\&quot;|\&apos;)(.*?)(\g{quote})/mi", $attrString, $attrMatches);

        if (isset($attrMatches[0]) && is_array($attrMatches[0])) {
            foreach ($attrMatches[1] as $i => $name) {
                $attributes[$name] = $attrMatches[3][$i];
            }
        }

        return $attributes;
    }

}
