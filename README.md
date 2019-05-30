# Brizy - Page Builder
Contributors: themefuse<br>
Requires at least: 4.5<br>
Tested up to: 5.2.1<br>
Requires PHP: 5.4<br>
Stable tag: 1.0.81<br>
License: GPLv3<br>
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Creating WordPress pages should be fast & easy. Brizy is the most user-friendly visual page builder in town! No designer or developer skills required. The only tools you'll need to master are clicks and drags.

More details on: https://brizy.io 

## Description 

https://vimeo.com/263343966

Creating WordPress pages should be fast & easy. [Brizy](https://brizy.io/) is the most user-friendly visual page builder in town! No designer or developer skills required. The only tools you'll need to master are clicks and drags.

## Highlights

### Smart & clutter free
Most page builders crowd all the options for a specific element in remote sidebars, making it hard to focus on the task at hand. We show only what's needed, front & centre, close to the element you're editing.

### Intuitive Drag & Drop
Moving content elements, columns or rows is a breeze with our intuitive Drag & Drop feature. Just grab and drag them to the desired position and everything will instantly fall into place.

### Design Elements
Text, buttons, images, icons, video, maps and many more are ready to help you create your page design in a snap.

### Over 150 pre-made blocks
Blocks are pre-made designs that you can add to your page, ready to be customised. This will enable you to create the main structure of your page in a matter of minutes, while also ensuring that it looks awesome.

### Over 4000 icons included
Available in both Outline and Glyph versions, even the most demanding icon needs are covered. Quickly find the icons you're after by filtering through categories or searching by keywords.

### Undo / Redo
Don't worry if you make a mistake or delete something that you shouldn't have. With Undo you can get everything back.

### Global styling
Ever wanted to change all the similar colors in your web page with a single click? With Brizy, you can! Not only that, but you can change all texts that share the same properties in one go, as well.

### Mobile Friendly
Switch instantly to Mobile View mode, where you can make changes that will only apply to this type of devices. This gives you the power to differentiate your page design and optimise for smaller screens.

### Cloud auto-save
The progress you're making while building your page is always backed up in the cloud, so you'll never lose your work.

### Liked Brizy?
- Join our [Facebook Group](https://www.facebook.com/groups/brizy).

## Bug reports

We strive to make Brizy to be awesome and user friendly, though sometimes it's impossible to avoid bugs.
A bug means "something is broken" or is not working as it should.

In order to offer you an effective support and fix for an issue, please follow the below guidelines before submitting a bug report:

#### Explore Known Issues

Has your issue already been reported? Check the [Issues page](https://github.com/ThemeFuse/Brizy/issues).

If your issue has already been reported, great! It will be reviewed in an upcoming release.

#### Submitting a Bug Report

You can report the issue via [Issues page](https://github.com/ThemeFuse/Brizy/issues).
A good bug report includes full details to easily understand the issue you are having and the exact steps to reproduce if it is a bug.


## Installation

### Minimum Requirements

* WordPress 4.5 or greater
* PHP version 5.4 or greater
* MySQL version 5.0 or greater

### We recommend your host supports:

* PHP version 7.0 or greater
* MySQL version 5.6 or greater
* WP Memory limit of 64 MB or greater (128 MB or higher is preferred)

### Installation

1. Install using the WordPress built-in Plugin installer, or Extract the zip file and drop the contents in the `wp-content/plugins/` directory of your WordPress installation.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Go to Pages > Add New
4. Press the 'Edit with Brizy' button.

### How to integration in your plugin
Do not use the html from post_content.
That content is updated only to support some seo plugins.

To correctly get the compiled post html use the code below:

```
$post    = Brizy_Editor_Post::get( $post_id );
$html = new Brizy_Editor_CompiledHtml( $post->get_compiled_html() );

// the <head> content
// the $headHtml contains all the assets the page needs
$headHtml = apply_filters( 'brizy_content', $html->get_head(), Brizy_Editor_Project::get(), $post->get_wp_post() );

// the <body> content
$bodyHtml = apply_filters( 'brizy_content', $html->get_body(), Brizy_Editor_Project::get(), $post->get_wp_post() );
```





### Terms of Service

[Terms of use](https://brizy.io/terms/)
[Privacy policy](https://brizy.io/privacy/)

## Changelog

### 1.0.81 - 2019-05-29 ###
* Fixed: Popup option not working for certain users
* Fixed: Url for Go to pro button

### 1.0.80 - 2019-05-28 ###
* Fixed: Section Make it a Slider option
* Fixed: Hotkeys not working in Global blocks
* Fixed: Slider dots options not working with certain WordPress themes
* Fixed: Undo / Redo

### 1.0.79 - 2019-05-27 ###
* Fixed: Brizy template for front page

### 1.0.78 - 2019-05-23 ###
* Fixed: Blank template and template loading

### 1.0.77 - 2019-05-23 ###
* New: Added hover transition option for Icon and Button
* Improved: Set a minimum height to Embed and WordPress elements
* Improved: Migrated Line and Progress to a new CSS system meant to clean up the DOM
* Improved: Sql queries
* Fixed: Menu not working when having more than one in a page
* Fixed: Form number filed triggering validation error when empty but not required
* Fixed: Vertical align in column
* Fixed: Image optimize submit settings
* Fixed: Autosave for globals and saved block


### 1.0.76 - 2019-05-14 ###
* Fixed: Guafrette warning in Path class

### 1.0.75 - 2019-05-10 ###
* New: Integrated Shortpixel image optimizer
* Improved: Lowered the max brizy revision count
* Improved: Delete old autosave posts
* Improved: Changed max brizy revision count value to 30
* Fixed: Optimized delete auto saved posts code
* Fixed: Removed random image names (works only for new image uploads)
* Fixed Create global blocks
* Fixed Create attachment post for block images
* Fixed: Autoptimeze plugin breaks our css


### 1.0.74 - 2019-04-23 ###
* New: Box Shadow option for Button, Icon, Soundcloud, Embed, Header, Footer
* Improved: Disabled Overlay Color option for Video when it has an image cover
* Improved: Return draft posts in Add rule form for template
* Fixed: Carousel toolbar not opening
* Fixed: Embed Border option not working properly
* Fixed: Section Dividers not respecting global color palette values
* Fixed: Background Video option not working in preview in certain instances
* Fixed: Screenshots for Global and Saved blocks not being displayed

### 1.0.73 - 2019-04-19 ###
* Fixed: Publish button not working for certain users
* Fixed: Fixed clear cache method
* Fixed: Undo / Redo

### 1.0.72 - 2019-04-18 ###
* Fixed: Project meta value setter

### 1.0.71 - 2019-04-18 ###
* Fixed: Activate license form

### 1.0.70 - 2019-04-18 ###
* New: Box Shadow option for Icon, Image, Video, Map, Column, Row
* New: Hover transition option for Image
* New: Removed autosave feature when you edit pages
* Improved: Editor performance regressions caused by Context Menu
* Fixed: Chrome warnings regarding scroll passive events
* Fixed: Icon selection popup scrollbar
* Fixed: Slider in rtl mode
* Fixed: Shift+Z shortcut in RichText

### 1.0.69 - 2019-04-09 ###
* New: White label support
* Fixed: Removed the migration per post
* Fixed: Form deserialization

### 1.0.68 - 2019-04-03 ###
* Fixed: RichText losing focus after typing pauses

### 1.0.67 - 2019-04-01 ###
* New: Added shortcuts for various actions
* New: Row and Column link options
* New: Video and Embed border options
* Improved: Right click shortcuts
* Fixed: Preview in IE 11
* Fixed: Image custom CSS option in preview
* Fixed: Archives sort order in preview

### 1.0.66 - 2019-03-28 ###
* Fixed: Form integrations
* Fixed: Back to WordPress button in classic editor
* Fixed: Project dependencies

### 1.0.65 - 2019-03-21 ###
* New: Block Adder UI
* New: Map and Soundcloud border options
* New: Added spacing for cloneable elements (Button, Icon, etc.) on mobile and tablet
* Improved: Custom CSS option
* Improved: Link option tabs order
* Improved: Network optimizations for block screenshots
* Improved: Base64 encode compiled HTML
* Fixed: Stop playing videos inside closed popups
* Fixed: Video cover position
* Fixed: Animations in Safari
* Fixed: Images that are added via Embed option CSS
* Fixed: Screenshot API refactoring
* Fixed: Form serialization
* Fixed: Compatibility SG optimizer
* Fixed: Compile post flag refactoring

### 1.0.64 - 2019-03-07 ###
* Fixed: Autoloader compatibility

### 1.0.63 - 2019-03-06 ###
* Fixed: Fixed the image cropper

### 1.0.62 - 2019-03-06 ###
* New: Border Styles on mobile and tablet for all containers (Sections, Row, Column)
* New: Added wp language placeholder
* New: Added facebook placeholders
* Fixed: Vertical align option on mobile
* Fixed: SectionFooter toolbar icon that shows that it’s a global block missing
* Fixed: Increased the image quality to 100%
* Fixed: The edit with Brizy buttons
* Fixed: Removed template select for posts
* Fixed: Added compatibility with phastpress
* Fixed: Removed redirect_to_mapped_domain function handled on the hook template_redirect

### 1.0.61 - 2019-02-21 ###
* New: Added column revert option for tablet and mobile device modes
* New: Added filters for support and upgrade to pro urls
* Fixed: Crash when making a block global
* Fixed: Video not working at preview with certain themes
* Fixed: Featured image focal point for Gutenberg
* Fixed: Thumbnail for downloaded media
* Fixed: Hide Gutenberg blocks and show the Brizy button

### 1.0.60 - 2019-02-18 ###
* New: Added gradient to backgrounds
* New: Added hover to backgrounds
* Fixed: Background parallax at preview
* Fixed: RichText sometimes removing newline characters
* Fixed: Disabled Row duplicate and delete when inside popup via context menu
* Fixed: Access to rule api
* Fixed: Compatibility with WebCraftic Clearfy plugin
* Fixed: Fixed group options for template rules

### 1.0.59 - 2019-01-29 ###
* Fixed: Wordpress integration for forms

### 1.0.58 - 2019-01-29 ###
* Fixed: Unable to add background images
* Fixed: Migration instance class check

### 1.0.57 - 2019-01-25 ###
* New: Forms and Form Integration support
* Fixed: Block screenshots being made on mobile device mode
* Fixed: Block screenshots not aligning properly in the anchor link option
* Fixed: Backgrounds with parallax not working in editor when in mobile device

### 1.0.56 - 2019-01-18 ###
* New: Added block screenshots in browsers that support it (Chrome, Firefox, Safari to a lesser extent)
* New: Possibility to add custom names to anchor links
* New: Compatibility Litespeed plugin
* New: Added API methods to get/save block screenshots
* Improved: Changed the rule manager to work with different posts
* Improved: Changed the rule api to accept json instead of form-urlencoded values
* Fixed: Remove actions that play with js scripts
* Fixed: Fixed the regexp for head extraction
* Fixed: Fixed page assets url
* Fixed: Used hideSiteUrl on save compiled html to db
* Fixed: Video not being able to go fullscreen
* Fixed: Impossible to add global colors to RichText links
* Fixed: Impossible to change margin to less than -100
* Fixed: Lightbox z-index conflict with header blocks
* Fixed: Check every request for multiple urls by Brizy_Editor_Http_Response
* Fixed: Changed signature of do_action of register API methods brizy_register_api_methods
* Fixed: Added config texts filter
* Fixed: Version check for Gutenberg compatibility 

### 1.0.54 - 2019-01-11 ###
* New: Added block screenshots in browsers that support it
* New: Possibility to add custom names to anchor links
* New: Compatibility litespeed plugin
* New: Added api methods to get/save block screenshots
* Fixed: Impossible to add global colors to RichText links
* Fixed: Impossible to change margin to less than -100
* Fixed: Lightbox z-index conflict with header blocks
* Fixed: Remove actions that play with js scripts
* Fixed: Check every request for multiple urls by Brizy_Editor_Http_Response
* Fixed: Fixed the regexp for head extraction

### 1.0.53 - 2018-12-14 ###
* Fixed: Unable to delete Global blocks
* Fixed: Brizy buttons for Wordpress 5

### 1.0.52 - 2018-12-07 ###
* FIxed: Brizy buttons for Gutemberg

### 1.0.51 - 2018-12-06 ###
* New: Columns can now be resizes in mobile device mode
* Fixed: Tempate fixes
* Fixed: Dynamic content fixes
* Fixed: Removed wpautop filter
* Fixed: Added favicon

### 1.0.50 - 2018-11-30 ###
* Fixed: RichText error in certain blocks
* Fixed: Animation delay
* Fixed: Link animation on click
* Fixed: Disable autoptimize plugin when editor is open
* Fixed: Exclude jQuery

### 1.0.49 - 2018-11-27 ###
* Fixed: Image height conflicts with certain plugins
* Fixed: Slider video background height
* Fixed: Animation class name

### 1.0.48 - 2018-11-26 ###
* Fixed: Fixed autoload for some users

### 1.0.47 - 2018-11-23 ###
* New: Added Column resize in tablet mode
* Fixed: NaN showing in RichText toolbar line-height option in tablet and mobile modes
* Fixed: Animations z-index issues on preview
* Fixed: Iframe with scroll css issue in tablet and mobile modes
* Fixed: Fixed css that made deleting Global and Saved blocks or very hard
* Fixed: Fixed notices layout
* Fixed: Added author list in internal url list
* Fixed: Added display type on placeholders
* Fixed: Fixed compatibility with WP 5.0

### 1.0.46 - 2018-11-13 ###
* Updated: Removed browser restriction overlay
* Improved: Typography inputs can now be edited using the keyboard
* Improved: Added revision limits for brizy posts. By default we store 100 revisions.
* Fixed: Cursor jumping when editing RichText url
* Fixed: Crash when changing device mode with certain themes
* Fixed: Removed title attribute from images
* Fixed: ImagePicker option styling
* Fixed: Added missing justify option to RichText alignment on tablet
* Fixed: Editor config
* Fixed: Added versioning for plugin assets

### 1.0.45 - 2018-11-09 ###
* Fixed: Fixed editor and plugin version in project
* Fixed: Missing Saved and Global blocks that were started from BLANK BLOCK

### 1.0.44 - 2018-11-06 ###
* Fixed: Section slider icons at export

### 1.0.43 - 2018-11-05 ###
* Improved: Refactored the content module

### 1.0.42 - 2018-11-01 ###
* New: Added tablet mode
* Improved: Added warning when the theme does not use the_content filter
* Fixed: Typography toolbar styles

### 1.0.41 - 2018-10-29 ###
* New: Added mobile body class
* Fixed: Preview url for all pages template
* Fixed: Carousel at export

### 1.0.40 - 2018-10-26 ###
* New: Added context (right click) menu for most elements
* Improved: Button and Icon groups are now vertically centered
* Improved: Toolbar options styling
* Improved: Added percentage to Image toolbar zoom option
* Fixed: Import posts/projects
* Fixed: Execute do_shortcodes on page content
* Fixed: Brizy Menu for unsupported posts
* Fixed: Compatibility fixes for gutemberg, autoptimize and w3-total-cache
* Fixed: Class autoloader fix
* Fixed: Updated project API
* Fixed: Image url problems when using WPML
* Fixed: Image missing alt and title attributes
* Fixed: CSS Corrupted file compression issue with Siteground
* Fixed: Forms stop sending other requests if one is already in progress
* Fixed: Nucleo icon font issue
* Fixed: Duplicate media
* Fixed: Ignore template rules for deleted templates
* Fixed: Fixed template rules for deleted templates

### 1.0.39 - 2018-10-11 ###
* Fixed: Section background image for mobil
* Fixed: Gutemberg compatilbility
* Fixed: User role and capability checker
* Fixed: Fixed feed pages

### 1.0.38 - 2018-10-03 ###
* New: Added migration module
* New: Migrate project to custom post

### 1.0.37 - 2018-10-03 ###
* New: Added migration module
* New: Migrate project to custom post

### 1.0.36 - 2018-10-01 ###
* Fixed: Add Elements from left sidebar broken order

### 1.0.35 - 2018-09-28 ###
* New: Added justify to alignment options for RichText
* Updated: RichText font size limit was increased up to 300
* Fixed: Section with slider enabled Full Height option
* Fixed: Fixed select2 compatibility
* Fixed: Remove Content-Length header when returning assets
* Fixed: Fixed the_Excerpt recursion
* Fixed: Fixed icons urls


### 1.0.34 - 2018-09-24 ###
* Improved: Added redundant config urls

### 1.0.33 - 2018-09-22 ###
* Fixed: Editor crash bug

### 1.0.32 - 2018-09-21 ###
* Improved: Removed taxonomies from config
* Fixed: Carousel incorrect large width on mobile

### 1.0.31 - 2018-09-19 ###
* Improved: Reduced the number of divs generated by the editor
* Fixed: Form submit toolbar not showing for certain users
* Fixed: Preview for draft posts

### 1.0.30 - 2018-09-17 ###
* Updated: Carousel library that is used in the editor (react-slick)
* Fixed: Display keys instead of blank texts in the editor when missing translations

### 1.0.29 - 2018-09-14 ###
* Improved: Laid some groundwork for future pro features
* Improved: Use native query to get the attachment by uid
* Fixed: Mobile Tabs content Scroll
* Fixed: The conflict with Live composer builder
* Fixed: The conflict with Wp copyright plugin
* Fixed: The insert content filter
* Fixed: Changed the UrlBuilder and CromMedia classe to depend on post id 
* Fixed: Filter the texonomies that does not have any terms
* Fixed: Image crop on dynamic content placeholders

### 1.0.28 - 2018-09-10 ###
* Fixed: Brizy templates preview when the user was not logged in

### 1.0.27 - 2018-09-06 ###
* Improved: CSS transition for Section padding resizer
* Improved: Show a special overlay for unsupported browsers instead of loading the editor
* Fixed: External links that were broken by previous update
* Fixed: RichText font families that were broken by previous update
* Fixed: Do not show Upgrade to Pro option when Pro is enabled
* Fixed: ColorPicker option in advanced options (right sidebar) being cut by overflow

### 1.0.26 - 2018-08-30 ###
* New: Added get_taxonomies api method
* Improved: Links will not open a new tab by default
* Improved: Toolbar labels color contrast for better readability
* Improved: Device mode popover styles
* Improved: Icons popup categories dropdown styles
* Improved: Modified the crop proxy to accept attachemt ids and uid hashes
* Improved: Added custom preview urls for templates
* Fixed: Image LightBox cursor style (set to zoom-in)
* Fixed: Text space for ordered and unordered lists
* Fixed: Line css conflicts with certain WordPress themes
* Fixed: Refresh permalink cache
* Fixed: Bug fixes on template module
* Fixed: Fixed templates for user with limited access or no acccess
* Fixed: Fixed the rule class in template module
* Fixed: Fixed the compile check for templates

### 1.0.25 - 2018-08-22 ###
* New: Added Featured Image option in LeftSidebar
* New: Added Upgrade to Pro option in LeftSidebar
* New: Added Submit an Issue option in LeftSidebar
* New: Added Brizy Templates
* New: Added Image LightBox

### 1.0.24 - 2018-08-07 ###
* Fixed: Upload path for windows installs

### 1.0.23 - 2018-08-06 ###
* Fixed: RichText word-break in Firefox
* Fixed: Added twig file system cache to avoid using eval function.
* Fixed: Disabled Expect header for compiler requests
* Fixed: Improved the preview page
* Fixed: Filter content only on main request regardles of what page type we show the content

### 1.0.22 - 2018-08-02 ###
* Improved: Removed duplicate code that updates the needs_compile flag when the globals is updated
* Improved: Added validation of global JSON object
* Fixed: Editor loading animation wouldn’t end when certain plugins were installed

### 1.0.21 - 2018-07-30 ###
* Improved: Smooth scroll for internal WordPress menu links
* Improved: Text for link nofollow option
* Fixed: The editor should now work with performance optimization plugins
* Fixed: Color styles for form fields
* Fixed: EmbedCode height consistent with content
* Fixed: RichText hyphens
* Fixed: Used body_class in body tag in brizy-blank-template.php
* Fixed: Fixed the inline json for editor
* Fixed: Admin url fix for wpengine hosting

### 1.0.20 - 2018-07-24 ###
* New: Added  option to external links
* New: Check the PHP version and stop the plugin if the required php version is not meet
* Improved: Added font subsets (e.g., arabic, bengali, cyrillic)
* Improved: Video element will be loaded after click on it’s preview image
* Improved: Reduced  tooltip animation delay for better UX
* Improved: Clicking on a Tabs element handle on mobile will scroll the document to the top of it’s content
* Fixed: PHP compatibility fix
* Fixed: jQuery conflicts at preview
* Fixed: Some Image element resize / crop issues
* Fixed: Linking to global blocks should now work as expected
* Fixed: Section slider styles in Safari and some conflicts with host theme’s styles
* Fixed: RichText tags (i.e., p, span, a, em) & figure tag style conflicts with the host theme (edited)

### 1.0.19 - 2018-07-16 ###
* New: Added box shadow option for various elements
* New: Added hamburger option for Menu
* New: Revisions support
* New: Image resize integration
* New: Settings page redesign
* Improved: Image resizing will now happen locally in WP instead of on Brizy servers
* Improved: IconBox, Form, Tabs, Accordion toolbar looks like Row Column ones
* Improved: Added tooltips for sidebar elements
* Fixed: Corrected Countdown preview bug
* Fixed: Corrected Form integration url
* Fixed: Fixed the upload urls
* Fixed: Fixed https value in 
* Fixed: Other minor bugs

### 1.0.18 - 2018-06-28 ###
* Fixed: Fixed asset proxy url

### 1.0.17 - 2018-06-27 ###
* Fixed: Form email field validation
* Fixed: Section auto generated ids anchor problems
* Fixed: Video not being able to go full screen 
* Fixed: Other minor bugs

### 1.0.16 - 2018-06-25 ###
* Fixed: Changed the way we store the data in db
* Fixed: Submit form for guests
* Fixed: Form serialization
* Fixed: Clean the logs table when the plugin is deactivated


### 1.0.15 - 2018-06-18 ###
* New: Added new icons
* Fixed: Fixed the scripts that hide the editor
* Fixed: Update page script
* Fixed: A bunch of small bugs

### 1.0.14 - 2018-06-14 ###
* Fixed: update global values request

### 1.0.13 - 2018-06-13 ###
* Fixed: Removed signature and token check

### 1.0.12 - 2018-06-13 ###
* New: Added WordPress form integration
* New: Added FontWeight and LetterSpacing for RichText element on Mobile
* Improved: Section toolbar shows a special icon if the block is global
* Improved: Section toolbar Save button feedback when clicked
* Fixed: Button text editing on Safari
* Fixed: Other minor bugs
* Fixed: Changed the the_content filter
* Fixed: Do not check the signature of the user if it's a local user
* Fixed: Removed from email and name from form class

### 1.0.11 - 2018-06-11 ###
* Improved: Trigger post change when project global data is updated
* Fixed: Brizy editor now works properly on SiteGround
* Fixed: Fixed page title for editor page


### 1.0.10 - 2018-06-11 ###
* Fixed: Changelogs in readme files
* Fixed: Back compatibility issues

### 1.0.9 - 2018-06-08 ###
* New: Added saved and global blocks
* New: Paddings and margins now accept values in percent
* Fixed: Form number input type not accepting negative and decimal values
* Fixed: Form submit text editing in Firefox
* Fixed: RichText element align on mobile
* Fixed: Other minor bugs
* Fixed: Removed functions.php
* Fixed: Store the platform credentials in plugin config to avoid one platform request

### 1.0.8 - 2018-06-06 ###
* New: Added saved and global blocks
* New: Added Form element integrations
* New: Paddings and margins now accept values in percent
* Fixed: Form submit text editing in Firefox
* Fixed: RichText element align on mobile
* Fixed: Other minor bugs

### 1.0.7 - 2018-05-30 ###
* New: Made the editor translatable
* New: Added 3 new svg icons for wp shortcodes
* Improved: Image element drag resizer now works better
* Improved: Added the possibility to enable/disable logs
* Fixed: Video element autoplay
* Fixed: Vertical align for row and column elements
* Fixed: Some issues with text element and undo / redo
* Fixed: Force all posts to be compiled on next view if the globals has been updated
* Fixed: Removed autoformat for wordpress content
* Fixed: Other minor bugs


### 1.0.6 - 2018-05-24 ###
* New: Disabled all platform api calls
* New: Added resizing via drag for Section paddings
* New: Added resizing via drag for various elements (Image, Map, Spacer, etc.)
* Fixed: Other minor bugs

### 1.0.5 - 2018-05-22 ###
* New: Added WooCommerce elements

### 1.0.4 - 2018-05-21 ###
* Fixed: Fixed array declaration syntax to support older php versions

### 1.0.3 - 2018-05-21 ###
* New: Added basic animations
* New: Added spacing option to Menu element
* Fixed: Other minor bugs

### 1.0.2 - 2018-05-15 ###
* New: Added cover option to Video element
* Improved: Updated readme files
* Improved: Clicking on a anchor will trigger a smooth transition to the target
* Improved: Tabs element with long labels will look better on mobile
* Improved: Better support for retina displays
* Fixed: Other minor bugs
* Fixed: Capability access to edit/save brizy posts
* Fixed: Settings page
* Fixed: Recompile page after plugin update
* Fixed: The default title of the newly created pages will be "Brizy #{ID}" format
* Fixed: Save compiler version at compile time
* Fixed: Media asset proxy

### 1.0.1 - 2018-05-11 ###
* Fixed: Reconfigured the page compiler

### 1.0.0 - 2018-05-08 ###
* New: Added keyword shortcuts for undo / redo
* Improved: Navigation will return empty if the menu name is null
* Improved: Added support for custom type posts
* Improved: Updated the plugin name
* Improved: Disabled leave confirmation when editing with brizy is clicked
* Fixed: Long compile page requests
* Fixed: Changed page compilation
* Fixed: Responsive issues
* Fixed: Scroll speed in Firefox
* Fixed: Other minor bugs

### 0.2.5 - 2018-04-27  ### 
* Fixed: Publish/Update button

### 0.2.0 - 2018-04-13 ### 
* Fixed: Bug Fixes

### 0.1.0 - 2018-04-12 ###
* New: Initial Beta Release
