<?php


trait Brizy_Admin_Funnels_PositionAware
{
    protected $funnelMeta;

    /**
     * @return mixed
     */
    public function getFunnelMeta()
    {
        return $this->funnelMeta;
    }

    /**
     * @param mixed $funnelMeta
     *
     * @return Brizy_Admin_Funnels_PositionAware
     */
    public function setFunnelMeta($funnelMeta)
    {
        $this->funnelMeta = $funnelMeta;

        return $this;
    }

    protected function loadInstanceData() {
        parent::loadInstanceData();

        $this->funnelMeta  = get_metadata( 'post', $this->getWpPostId(), Brizy_Editor_FunnelPage::BRIZY_FUNNEL_META, true );
    }

    /**
     * @return array|mixed
     */
    public function jsonSerialize() {
        $data =  parent::jsonSerialize();
        $data['funnelMeta'] = $this->getFunnelMeta();
        $data['postType'] = $this->getWpPost()->post_type;
	    $data['editUrl'] = $this->edit_url();
        return $data;
    }


    public function createResponse( $fields = array() ) {

        $data  = parent::createResponse($fields);
        $data['funnelMeta'] = $this->getFunnelMeta();
        $data['postType'] = $this->getWpPost()->post_type;
        $data['editUrl'] = $this->edit_url();
        return $data;
    }

    public function saveStorage()
    {
        parent::saveStorage();

        update_metadata( 'post', $this->getWpPostId(), Brizy_Editor_FunnelPage::BRIZY_FUNNEL_META, $this->funnelMeta );
    }
}
