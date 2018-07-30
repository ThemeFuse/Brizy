var jQuery = require('jquery');
var Config = require('visual/global/Config');

var INTERVAL = {
    day: 'last10',
    week: 'last12',
    month: 'last12'
};

var API_METHODS = {
    traffic: 'VisitsSummary',
    mobile: 'DevicesDetection',
    refferers: 'Referrers',
    popular: 'PopularContent',
    search: 'SearchEngineQueries'
};

var API_URL = '/app/access/analytics?url=';


export default function (options) {

    function getProject() {
        return Config.get('project');
    }
    function getBaseHost() {
        return Config.get('urls').base;
    }
    function getProjectHash() {
        return Config.get('encryptedData')['metrics'];
    }
    var url =
        'api/'        + API_METHODS[options.method] +
        '/period/'    + options.period +
        '/date/'      + INTERVAL[options.period] +
        '/project/'   + getProject();


    jQuery.ajax({
        type: 'GET',
        url: getBaseHost() + API_URL + encodeURIComponent(url),
        success: function (data) {
            options.success(data);
        },
        beforeSend: function (request)
        {
            request.setRequestHeader('X-Signature-Hmac-SHA256', getProjectHash());
        },
        error: function (error) {
            options.error(error);
        }
    })
};
