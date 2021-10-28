<?php

use BrizyPlaceholders\PlaceholderInterface;
use BrizyPlaceholders\RegistryInterface;

class Brizy_Content_PlaceholderProvider implements RegistryInterface
{

    /**
     * @var array of implements Brizy_Editor_Content_PlaceholdersProviderInterface
     */
    protected $providers = array();

    /**
     * @var array
     */
    static private $cache_grouped_placeholders = null;
    static private $cache_all_placeholders = null;

    /**
     * BrizyPro_Content_ProviderPlaceholders constructor.
     *
     * $context: for back compatibility
     *
     * @param Brizy_Content_Context $context
     */
    public function __construct($context = null)
    {
        $this->providers[] = new Brizy_Content_Providers_FreeProvider();
        $this->providers = apply_filters('brizy_providers', $this->providers, null);
    }

    /**
     * @return array
     */
    public function getPlaceholders()
    {
        $out = array();

        if (self::$cache_all_placeholders) {
            return self::$cache_all_placeholders;
        }

        foreach ($this->providers as $provider) {
            $out = array_merge($out, $provider->getPlaceholders());
        }

        self::$cache_all_placeholders = $out;

        return $out;
    }


    /**
     * @return array
     */
    public function getGroupedPlaceholders()
    {
        if (self::$cache_grouped_placeholders) {
            return self::$cache_grouped_placeholders;
        }

        $result = array();

        foreach ($this->providers as $provider) {

            foreach ($provider->getPlaceholders() as $placeholder) {

                if($placeholder->getGroup())
                {
                    $result[ $placeholder->getGroup() ][]  = $placeholder;
                }
            }
        }

        return apply_filters('brizy_placeholders', self::$cache_grouped_placeholders = $result);
    }

	public function getGroupedPlaceholdersForApiResponse() {
		$groups = $this->getGroupedPlaceholders();
		$result = [];
		foreach ( $groups as $group => $entries ) {

			$result[ $group ] = array_map( function ( $entry ) {

				$placeholder = [
					'placeholder' => '{{' . $entry->getPlaceholder() . '}}',
					'label'       => $entry->getLabel(),
					'display'     => $entry->getDisplay()
				];

				return apply_filters( 'editor_placeholder_data', $placeholder, $entry );
			}, $entries );
		}

		return $result;
	}

    /**
     * @param $name
     * @return \BrizyPlaceholders\PlaceholderInterface
     */
//    public function getPlaceholder($name)
//    {
//        return $this->getPlaceholderSupportingName($name);
//    }

    /**
     * @inheritDoc
     */
//    public function getPlaceholdersByGroup($groupName)
//    {
//        $getGroupedPlaceholders = $this->getGroupedPlaceholders();
//
//        if (isset($getGroupedPlaceholders[$groupName])) {
//            return $getGroupedPlaceholders[$groupName];
//        }
//    }

    /**
     * @inheritDoc
     */
    public function getPlaceholderSupportingName($name)
    {
        foreach ($this->providers as $provider) {
            if($instance = $provider->getPlaceholderSupportingName($name)) {
                return $instance;
            }
        }
    }

    public function registerPlaceholder(PlaceholderInterface $instance)
    {
        throw new Exception('Try to use a specific registry to register the placeholder');
    }
}
