<?php

class Brizy_ThirdParty_Context {
  public static function getForEditor() {
    return array(
      'is_editor' => true
    );
  }

  public static function getForPreview() {
    return array(
      'is_editor' => false
    );
  }
}