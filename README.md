# Brizy - Page Builder
Contributors: themefuse<br>
Requires at least: 4.5<br>
Tested up to: 4.9<br>
Requires PHP: 5.4<br>
Stable tag: 1.0.25<br>
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

### Terms of Service

[Terms of use](https://brizy.io/terms/)
[Privacy policy](https://brizy.io/privacy/)

## Changelog

### 1.0.25 - 2018-08-22 ###
* New: Added Featured Image option in LeftSidebar
* New: Added Upgrade to Pro option in LeftSidebar
* New: Added Submit an Issue option in LeftSidebar
* New: Added Brizy Templates
* Fixed: Image LightBox minor issues

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
