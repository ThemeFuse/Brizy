<?php

class Brizy_Editor_Editor_ModuleGroups_SingleProvider implements Brizy_Editor_Editor_ModuleGroups_ProviderInterface
{

    use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

    public function supportContext($context)
    {
        return $this->isTemplateType($context, 'single') || $this->isPostType($context, 'post') || $this->isMode($context, 'page');
    }

    public function collect($context)
    {
        return [
            new Brizy_Editor_Editor_ModuleGroups_ModuleGroup('single', [
                "WPFeaturedImage",
                "PostTitle",
                "PostExcerpt",
                $this->isTemplateType($context, 'single') ? "WPPostContent" : null, // if is singleTemplate
                "WPPostInfo",
                "WPBreadcrumbs",
	            $this->isTemplateType($context, 'single') || $this->isPostType($context, 'post') ? "WPPostNavigation" : null, // if it is singleTemplate or postType
	            "Posts"
            ], $this->isMode($context, 'page') ? 475 : 100 ),
        ];
    }
}