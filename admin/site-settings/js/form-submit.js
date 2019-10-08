function submitForm(form) {
    var $form = $(form);
    var parentPanelId = $form.parents('.brz-ed-scroll-pane:first').attr('id');
    var formData = new FormData();
    var actionUrl = $form.attr('action');


    $form.find('input,textarea,select').each(function () {

        var $this = $(this);
        var type = $this.attr('type');
        var name = $this.attr('name');

        if (type === 'file') {
            var file = $this[0].files[0];
            if (file) {
                formData.append(name, file, file.name);
            }
        } else {
            formData.append(name, $this.val())
        }

    });

    $.ajax({
        type: 'POST',
        processData: false,
        contentType: false,
        url: actionUrl,
        data: formData
    }).done(function (data) {

        var parents = $form.parents('.brz-ed-scroll-pane:first');
        parents.html(
            $(data).find('#' + parentPanelId).html()
        );

        bindFormInputEvents(parents);

        parents.find('.site-settings-wrap:first').prepend("<div class=\"alert alert-success\" role=\"alert\">Settings saved!</div>");
    }).fail(function () {
        var parents = $form.parents('.brz-ed-scroll-pane:first');
        parents.find('.site-settings-wrap:first').prepend("<div class=\"alert alert-error\" role=\"alert\">Save settings failed!</div>");
    })
}