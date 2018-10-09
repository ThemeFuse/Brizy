jQuery(document).ready(function () {
    var label = Brizy_Admin_Data.usesBrizy == 1 ? Brizy_Admin_Data.labels['backToWordpress'] : Brizy_Admin_Data.labels['editWithBrizy'];
    var url = Brizy_Admin_Data.usesBrizy == 1 ? Brizy_Admin_Data.urls['disableBrizy'] : Brizy_Admin_Data.urls['enableBrizy'];
    $('.editor-header-toolbar').append('<a href="' + url + '">' + label + '</a>')
});