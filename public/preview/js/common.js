
/// <reference path="../lib/jquery/dist/jquery.js" />
/// <reference path="../lib/jquery-base64/jquery.base64.js" />


var getQueryString = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

var getParamString = function (name) {
    var params = getQueryString('params');
    var encParams=$.base64.atob(params);
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = encParams.match(reg);
    if (r != null) {
        var value = r[2];
        value = escape(value);
        return unescape(value);
    }
    return null;
}

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
