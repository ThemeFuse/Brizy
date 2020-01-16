<?php


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
        return "/(?<placeholder>{{\s*(?<placeholderName>.+?)(?<attributes>(?:\s+)((?:\w+\s*=\s*'(?:.[^']*|)'\s*)*))?}}(?:(?<content>.*?){{\s*end_(\g{placeholderName})\s*}})?)/ims";;
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
            $placeholders[] = $placeholder = new Brizy_Content_ContentPlaceholder(
                $matches['placeholderName'][$i],
                $matches['placeholder'][$i],
                $this->getPlaceholderAttributes($matches['attributes'][$i]),
                $matches['content'][$i]
            );

            $hasPlaceholder = $this->provider->getPlaceholder($placeholder->getName());

            // ignore unknown placeholders
            if (!$hasPlaceholder) {
                continue;
            }

            $pos = strpos($content, $placeholder->getPlaceholder());

//			if ( function_exists( 'mb_strpos' ) ) {
//				$pos          = mb_strpos( utf8_encode( $content ), utf8_encode($placeholder->getPlaceholder()) );
//			}

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
        preg_match_all("/(\w+)\s*=\s*'([^']*)'/mi", $attrString, $attrMatches);

        if (isset($attrMatches[0]) && is_array($attrMatches[0])) {
            foreach ($attrMatches[1] as $i => $name) {
                $attributes[$name] = $attrMatches[2][$i];
            }
        }

        return $attributes;
    }

}