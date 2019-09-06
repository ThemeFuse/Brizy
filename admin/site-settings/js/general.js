// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"))
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod)
    else // Plain browser env
        mod(CodeMirror)
})(function(CodeMirror) {
    "use strict"

    CodeMirror.defineOption("autoRefresh", false, function(cm, val) {
        if (cm.state.autoRefresh) {
            stopListening(cm, cm.state.autoRefresh)
            cm.state.autoRefresh = null
        }
        if (val && cm.display.wrapper.offsetHeight == 0)
            startListening(cm, cm.state.autoRefresh = {delay: val.delay || 250})
    })

    function startListening(cm, state) {
        function check() {
            if (cm.display.wrapper.offsetHeight) {
                stopListening(cm, state)
                if (cm.display.lastWrapHeight != cm.display.wrapper.clientHeight)
                    cm.refresh()
            } else {
                state.timeout = setTimeout(check, state.delay)
            }
        }
        state.timeout = setTimeout(check, state.delay)
        state.hurry = function() {
            clearTimeout(state.timeout)
            state.timeout = setTimeout(check, 50)
        }
        CodeMirror.on(window, "mouseup", state.hurry)
        CodeMirror.on(window, "keyup", state.hurry)
    }

    function stopListening(_cm, state) {
        clearTimeout(state.timeout)
        CodeMirror.off(window, "mouseup", state.hurry)
        CodeMirror.off(window, "keyup", state.hurry)
    }
});

function bindFormInputEvents( parent ) {
    // CodeMirror call
    $( ".codemirror-editor", parent ).each( function () {
        var editorId = $( this ).attr( "id" );
        var mode = $( this ).attr( "data-mode" );
        var element = document.getElementById( editorId );

        var editor = CodeMirror.fromTextArea( element, {
            mode: mode,
            lineNumbers: false,
            lineWrapping: true,
            scrollbarStyle: "null",
            commentBlankLines: true,
            autoRefresh: 400
        } ).on( 'change', function ( cm ) {
            element.value = cm.getValue();
        } );

    } );

    $( '.submit', parent ).on( 'click', function () {
        var form = $( this ).parents( 'form:first' );
        submitForm( form );
    } );

    $( ".upload-file-btn > input", parent ).change( function () {
        var inputFileVal = $( this ).val();
        $( '.brz-favicon-path-text' ).text( inputFileVal );
        $( 'input[name="favicon_id"]' ).val( '' );
        $( '.sett-favicon-th img' ).hide();
        $( '.brz-remove-favicon' ).show();
    } );
}

jQuery(document).ready(function ($) {
    "use strict";

    // Disable Empty Links
    $( 'a[href="#"]' ).click( function ( event ) {
        event.preventDefault();
    } );

    $( '#modal' ).modal( 'show' );

    // Click settings icon in menu & open settings form
    $( '.pages-list-actions__icon__settings' ).on( 'click', function () {
        var $this = $( this ),
            $thisParent = $this.parents( '.content_row' ),
            firstItemOffsetTop = $( '#nestedDD .content_row:first' ).offset().top,
            menuOption = $thisParent.find( '.menuRowOptions' ),
            formOptionHeight = menuOption.height(),
            $thisParentOffsetTop = $thisParent.offset().top;

        //$('#nestedDD .content_row').removeClass('active-option');
        $thisParent.toggleClass( 'active-option' );

        // Calculate offset & set position
        menuOption.css( {
            "top": '-' + (
                $thisParentOffsetTop - firstItemOffsetTop
            ) + 'px'
        } );
        if ( $thisParentOffsetTop > firstItemOffsetTop + formOptionHeight ) {
            $thisParent.addClass( 'optionAuto' );
            menuOption.css( {"top": 'auto'} );
        }

        // Close IF click outside dropdown
        $( document ).mouseup( function ( e ) {
            if ( !$this.is( e.target ) && $this.has( e.target ).length === 0 && menuOption.has( e.target ).length === 0 ) {
                $thisParent.removeClass( "active-option" );
            }
        } );
    } );

    // Tabs
    $( '.brz-ed-tab-item' ).on( 'click', function () {
        var tabNameAttr = $( this ).attr( 'data-tab-name' );

        if ( !$( this ).hasClass( 'brz-ed-popup-two-sidebar-list-active' ) ) {
            $( '.brz-ed-tab-item' ).removeClass( 'brz-ed-popup-two-sidebar-list-active' );
            $( this ).addClass( 'brz-ed-popup-two-sidebar-list-active' );

            $( '.brz-ed-popup-two-body__content > .brz-ed-scroll-pane' ).fadeOut( 0 ).removeClass( 'brz-ed-scroll-pane-active' );
            $( '.brz-ed-popup-two-body__content' ).find( '#' + tabNameAttr ).fadeIn( 0 ).addClass( 'brz-ed-scroll-pane-active' );
        }
    } );

    $( '.brz-ed-popup-two-tab-item' ).on( 'click', function () {
        var pageNameAttr = $( this ).attr( 'data-page-name' );
        var dashNameAttr = $( this ).attr( 'data-dash-name' );

        if ( !$( this ).hasClass( 'brz-ed-popup-two-tab-item-active' ) ) {
            $( '.brz-ed-popup-two-tab-item' ).removeClass( 'brz-ed-popup-two-tab-item-active' );
            $( this ).addClass( 'brz-ed-popup-two-tab-item-active' );

            $( '.brz-ed-popup-two-body__content > .brz-ed-scroll-pane' ).fadeOut( 0 ).removeClass( 'brz-ed-scroll-pane-active' );
            $( '.brz-ed-popup-two-body__content' ).find( '#' + pageNameAttr ).fadeIn( 0 ).addClass( 'brz-ed-scroll-pane-active' );

            $( '.brz-ed-popup-two-sidebar > .modal_dash' ).fadeOut( 0 ).removeClass( 'active' );
            $( '.brz-ed-popup-two-sidebar' ).find( '#' + dashNameAttr ).fadeIn( 0 ).addClass( 'active' );

            $( '.brz-ed-tab-item' ).removeClass( 'brz-ed-popup-two-sidebar-list-active' );
            $( '#' + dashNameAttr + ' > .brz-ed-tab-item:first' ).addClass( 'brz-ed-popup-two-sidebar-list-active' );
        }
    } );

    $( '.brz-ed-popup-two-tab-item' ).children( ":first" ).trigger( 'click' );

    $( '.brz-remove-favicon' ).on( 'click', function () {
        $( '.upload-file-btn > input' ).val( '' );
        $( 'input[name="favicon_id"]' ).val( '' );
        $( '.brz-favicon-path-text' ).text( '' );
        $( '.sett-favicon-th img' ).hide();
        $( this ).hide();
    } );

    bindFormInputEvents();
});
