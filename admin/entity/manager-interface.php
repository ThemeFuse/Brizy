<?php

interface Brizy_Admin_Entity_ManagerInterface {

    public function getEntities( $args );

	public function getEntity( $args );

	public function createEntity( $uid, $status='publish', $parent=null );

	public function deleteEntity( Brizy_Editor_Entity $entity, $force_delete=false );
}