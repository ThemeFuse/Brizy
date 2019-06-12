<?php

class Brizy_ThirdParty_LatestComments_Main {
  public static function init() {
    add_action('brizy_editor_enqueue_scripts', 'Brizy_ThirdParty_LatestComments_Main::enqueue_toolbar_js');
    add_filter('brizy_third-party_elements', 'Brizy_ThirdParty_LatestComments_Main::register_element');
  }

  public static function enqueue_toolbar_js() {
    wp_enqueue_script(
      'brizy-tp-latest-comments',
      plugins_url('toolbar.js', __FILE__),
      array('brizy-editor'),
      null,
      true
    );
  }

  public static function register_element($elements) {
    $html = '
<div class="tp-latest-comments" >
  {% for comment in apiData %}
    <div class="tp-comment">
      <img data-brz-toolbar="avatar" class="tp-comment-avatar" src="{{ comment.avatar }}">
      <div class="tp-comment-content">
        <div class="tp-comment-author">{{ comment.author }}</div>
        <div data-brz-toolbar="content" class="tp-comment-text">{{ comment.content }}</div>
      </div>
    </div>
  {% endfor %}
</div>';

    $css = '
& .tp-latest-comments {
  background: white;
  color: {{ contentColor }};
}
& .tp-comment {
  display: flex;
  width: 500px;
  padding: 10px;
  margin: 0 auto;
}
& .tp-comment-avatar {
  width: {{ avatarSize }}px;
  height: {{ avatarSize }}px;
  border-radius: {{ avatarRadius == "rounded" ? 50 : 0 }}%;
  margin-right: {{ avatarSpacing }}px;
}
& .tp-comment-author {
  margin-bottom: 5px;
  font-weight: bold;
}';

    $elements[] = array(
      'id'                 => 'LatestComments',
      'title'              => 'Latest Comments',
      'icon'               => 'nc-save-section',
      'html'               => $html,
      'css'                => $css,
      'defaultValue'       => array(
        'avatarSize'       => '48',
        'avatarRadius'     => 'rounded',
        'avatarSpacing'    => '10',
        'contentColor'     => 'black',
        'numComments'      => '3'
      ),
      'dataApi'            => "Brizy_ThirdParty_LatestComments_Main::data_api",
      'dataApiKeys'        => array( 'numComments' )
    );

    return $elements;
  }

  public static function data_api($v) {
    $data = array(
      array(
        'author'  => 'vjeux',
        'content' => 'I’m so excited to announce that 100% of the enormous Facebook JavaScript codebase is now using prettier! It’s pretty crazy that it only took a year and two months since the first prettier commit!',
        'avatar'  => 'https://pbs.twimg.com/profile_images/758422091347603456/_tIflgtD_bigger.jpg'
      ),
      array(
        'author'  => 'Jason Miller',
        'content' => 'My mentions are 97% bird puns how\'s your Sunday going',
        'avatar'  => 'https://pbs.twimg.com/profile_images/983777756147343360/LQqydtiV_bigger.jpg'
      ),
      array(
        'author'  => 'Addy Osmani',
        'content' => 'Third-party JavaScript weighing you down? Defer it until you can trim it. The Telegraph deferred *all* third-party scripts. 3s faster visual completeness & better Lighthouse perf scores.',
        'avatar'  => 'https://pbs.twimg.com/profile_images/1053159168197111808/8eipWrau_bigger.jpg'
      ),
      array(
        'author'  => 'Dan Abramov',
        'content' => 'If you have a question about the future of React, ask it in this thread and I’ll try my best to answer! I can’t know the future but I have some idea of what we’re working on and why. No question is too simple!',
        'avatar'  => 'https://pbs.twimg.com/profile_images/1096807971374448640/rVCDhxkG_bigger.png'
      ),
      array(
        'author'  => 'William Candillon',
        'content' => 'SVG Morphing with React Native Reanimated is not perfect yet but it\'s getting there, I will investigate Android support as well as Rotational Path morphing for smoother effects.',
        'avatar'  => 'https://pbs.twimg.com/profile_images/563279207648600065/MGQxMS4G_bigger.jpeg'
      ),
    );

    shuffle($data);
    return array_slice($data, 0, $v['numComments']);
  }

}