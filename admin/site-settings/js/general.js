function bindFormInputEvents(parent) {
    // CodeMirror call
    $(".codemirror-editor", parent).each(function () {
        var editorId = $(this).attr("id");
        var mode = $(this).attr("data-mode");
        var element = document.getElementById(editorId);

        CodeMirror.fromTextArea(element, {
            mode: mode,
            lineNumbers: false,
            lineWrapping: true,
            scrollbarStyle: "null",
            commentBlankLines: true,
        }).on('change', function (cm) {
            element.value = cm.getValue();
        })

    });

    $('.submit', parent).on('click', function () {
        var form = $(this).parents('form:first');
        submitForm(form);
    });

    // File Upload
    $(".upload-file-btn > input", parent).change(function () {
        var inputFileVal = $(this).val();
        $('.sett-favicon-path').text(inputFileVal);
    });
}

jQuery(document).ready(function ($) {
    "use strict";

    var screenRes = $(window).width();


    // Sortable call
    var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

    for (var i = 0; i < nestedSortables.length; i++) {
        new Sortable(nestedSortables[i], {
            group: 'nested',
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65
        });
    }

    // Click settings icon in menu & open settings form
    $('.pages-list-actions__icon__settings').on('click', function () {
        var $this = $(this),
            $thisParent = $this.parents('.content_row'),
            firstItemOffsetTop = $('#nestedDD .content_row:first').offset().top,
            menuOption = $thisParent.find('.menuRowOptions'),
            formOptionHeight = menuOption.height(),
            $thisParentOffsetTop = $thisParent.offset().top;

        //$('#nestedDD .content_row').removeClass('active-option');
        $thisParent.toggleClass('active-option');

        // Calculate offset & set position
        menuOption.css({"top": '-' + ($thisParentOffsetTop - firstItemOffsetTop) + 'px'});
        if ($thisParentOffsetTop > firstItemOffsetTop + formOptionHeight) {
            $thisParent.addClass('optionAuto');
            menuOption.css({"top": 'auto'});
        }
        ;

        // Close IF click outside dropdown
        $(document).mouseup(function (e) {
            if (!$this.is(e.target) && $this.has(e.target).length === 0 && menuOption.has(e.target).length === 0) {
                $thisParent.removeClass("active-option");
            }
        });
    });

    // Delete Sortable row if click on remove
    $(".content_row .menu_actions .pages-list-actions__icon").on("click", function () {
        $(this).closest('.menu_row').remove();
    });

    // Open & Close Account Settings
    $(".account-dropdown").on("click", function () {
        var $this = $(this),
            $thisParents = $this.parents(".account-dropdown-wrap"),
            dropdown = $thisParents.find(".dropdown-menu"),
            $thisChild = dropdown.find(".account");

        $thisParents.toggleClass("opened");
        dropdown.toggleClass("show");

        // Close IF click outside dropdown
        $(document).mouseup(function (e) {
            if (
                !$thisParents.is(e.target) &&
                $thisParents.has(e.target).length === 0
            ) {
                $thisParents.removeClass("opened")
                dropdown.removeClass("show");
                $('.add-new-account').removeClass('add-item');
            }
        });

        $thisChild.not('.add-new-account').on("click", function () {
            $thisParents.removeClass("opened")
            dropdown.removeClass("show");
            $('.add-new-account').removeClass('add-item');
        });
    });
    // Delete if click on trash
    $(".dropdown-menu .pages-list-actions__icon").on("click", function () {
        $(this).parents('.account').remove();
    });
    // Change placeholder when click on opion
    $(".dropdown-menu .account").not('.add-new-account').on("click", function () {
        var text = $(this).find(".account-name").text();
        var placeholder = $('.account-dropdown-wrap .account-dropdown span')


        $(placeholder).empty();
        $(placeholder).html(text);
        $(placeholder).addClass('selected');
        $('.menu-head .menu-head-btn').addClass('selected');
    });

    // Disable Empty Links
    $('a[href="#"]').click(function (event) {
        event.preventDefault();
    });

    $('#modal').modal('show');

    // Tabs
    $('.brz-ed-tab-item').on('click', function () {
        var tabNameAttr = $(this).attr('data-tab-name');

        if (!$(this).hasClass('brz-ed-popup-two-sidebar-list-active')) {
            $('.brz-ed-tab-item').removeClass('brz-ed-popup-two-sidebar-list-active');
            $(this).addClass('brz-ed-popup-two-sidebar-list-active');

            $('.brz-ed-popup-two-body__content > .brz-ed-scroll-pane').fadeOut(0).removeClass('brz-ed-scroll-pane-active');
            $('.brz-ed-popup-two-body__content').find('#' + tabNameAttr).fadeIn(0).addClass('brz-ed-scroll-pane-active');
        }
    });


    // Menu Load
    $('.brz-ed-popup-two-tab-item').on('click', function () {
        var pageNameAttr = $(this).attr('data-page-name');
        var dashNameAttr = $(this).attr('data-dash-name');

        if (!$(this).hasClass('brz-ed-popup-two-tab-item-active')) {
            $('.brz-ed-popup-two-tab-item').removeClass('brz-ed-popup-two-tab-item-active');
            $(this).addClass('brz-ed-popup-two-tab-item-active');

            $('.brz-ed-popup-two-body__content > .brz-ed-scroll-pane').fadeOut(0).removeClass('brz-ed-scroll-pane-active');
            $('.brz-ed-popup-two-body__content').find('#' + pageNameAttr).fadeIn(0).addClass('brz-ed-scroll-pane-active');

            $('.brz-ed-popup-two-sidebar > .modal_dash').fadeOut(0).removeClass('active');
            $('.brz-ed-popup-two-sidebar').find('#' + dashNameAttr).fadeIn(0).addClass('active');

            $('#settingsDash > .brz-ed-tab-item').removeClass('brz-ed-popup-two-sidebar-list-active');
            $('#settingsDash > li:first-child').addClass('brz-ed-popup-two-sidebar-list-active');
        }
    });

    bindFormInputEvents();

});
