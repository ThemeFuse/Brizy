<?php


class Brizy_Editor_FunnelPage extends Brizy_Editor_Post
{
    use Brizy_Admin_Funnels_PositionAware;

    const BRIZY_FUNNEL_META = 'brizy-funnel-meta';

    static protected $instance = null;

    /**
     * @param $apost
     *
     * @return Brizy_Editor_Post|mixed
     * @throws Exception
     */
    public static function get( $apost ) {

        $wp_post_id = $apost;
        if ( $apost instanceof WP_Post ) {
            $wp_post_id = $apost->ID;
        }

        if ( isset( self::$instance[ $wp_post_id ] ) ) {
            return self::$instance[ $wp_post_id ];
        }

        return self::$instance[ $wp_post_id ] = new self( $wp_post_id );
    }

    /**
     * Clear all cached instances;
     */
    public static function cleanClassCache() {
        self::$instance = array();
    }
}