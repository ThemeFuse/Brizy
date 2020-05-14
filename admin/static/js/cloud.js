jQuery(document).ready(function ($) {

    var BrizyCloud = {
        form: null,
        pageUrl: null,
        init: function (form) {
            BrizyCloud.form = form;
            BrizyCloud.pageUrl = form.attr('action');
            form.find('select[name=brizy-cloud-use-container]').on('change', BrizyCloud.containerChange)
        },
        containerChange: function (e) {
            var value = e.target.value;
            $.ajax({
                url: Brizy_Admin_Data.url,
                data: {action: 'brizy-cloud-projects', container: value}
            }).done(function (response) {
                var select = BrizyCloud.form
                    .find('select[name=brizy-cloud-use-project]');

                select
                    .find('option[value!=0]')
                    .remove();

                for (var i = 0; i < response.data.length; i++) {
                    select.append('<option value="'+response.data[i].id+'">'+response.data[i].name+'</option>')
                }
            });
        }
    };

    $(function () {
        BrizyCloud.init($('#cloud-form'));
    });
});


