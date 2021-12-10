/// <reference path="../lib/jquery/dist/jquery.js" />

document.write('<script src="../js/loadwatermark.js?_t='+new Date().getTime()+'"><\/script>');
document.write("<script src='../js/site.js'></script>");
document.write("<script src='../js/common.js?_t = " + new Date().getTime() +"'></script>");
document.write("<script src='../lib/jquery-base64/jquery.base64.js?_t = " + new Date().getTime() +"'></script>");

var config;
var docInital = function (frameId, configData) {
    config = configData;
    var docQueryInfo = getUrlQueryInfo();
    var onlineUrl = docOnlineUrlBuilder(docQueryInfo);
    $('#' + frameId)[0].setAttribute('src', onlineUrl);
}

var displayWaterMark = function () {
    var startrow = 1;
    var userId = getParamString('userid');
    var userName = decodeURIComponent(getParamString('username'));
    var extension = getParamString('extension');
    var inFrame = getParamString('inFrame');

    // pdf从第0行开始显示水印，office从第1行开始
    if (extension == ".pdf") {
        startrow = 0;
    }
    load_wm(userName, startrow );
    // watermark({
    //     watermark_txt: userName,
    //     watermark_y_space: 160,
    //     watermark_x_space: 120,//水印x轴间隔
    //     watermark_startrow: startrow,
    //     watermark_rows: inFrame ? 999 : 20
    // });
}

var getTicket = function () {
    var ticket = '';
    var inFrame = getParamString('inFrame');
    var queryUrl = String.format('{0}/{1}?application={2}&UserId={3}&signtureContent={4}&signture={5}',
        config.docOnline.voucherUrl,
        'WOPI',
        getParamString('application'),
        getParamString('userid'),
        encodeURIComponent(getQueryString('params')),
        encodeURIComponent(getQueryString('signture')));

    // var queryUrl = ''
    // if(inFrame) {
    //     queryUrl = String.format('{0}/{1}?{2}',
    //       config.docOnline.voucherUrl,
    //       'WOPI',
    //       window.location.search.substr(1).replace('&inFrame=1',''));
    // }else{
    //     queryUrl = String.format('{0}/{1}?{2}',
    //       config.docOnline.voucherUrl,
    //       'WOPI',
    //       window.location.search.substr(1));
    // }
    $.ajax({
        url: queryUrl,
        type: "POST",
        async: false,
        success: function (result) {
            ticket = result;
        },
        error: function (res) {
            if(res.status === 401 || res.status == 0) {
                location.href = '/preview/page/error.html'
            }
        }
    });
    return ticket;
}


var docOnlineUrlBuilder = function (queryInfo) {
    //var extension = getQueryString('extension');
    if (queryInfo.extension == '.pdf') {
        return pdfOnlineUrlBuilder(queryInfo);
    }
    else {
        return officeOnlineUrlBuilder(queryInfo);
    }
}

var pdfOnlineUrlBuilder = function (queryInfo) {
    var onlineUrl = String.format("{0}{1}?Ticket={2}&UserId={3}&Signture={4}&Mode={5}&application={6}&fileId={7}&extension={8}",
        window.location.origin,
        window.location.pathname.replace('DocOnline', 'pdfOnline'), 
        queryInfo.ticket, 
        queryInfo.userId,
        queryInfo.signture,
        queryInfo.mode,
        queryInfo.application,
        queryInfo.fileId,
        queryInfo.extension);
    return onlineUrl;
}

var officeOnlineUrlBuilder = function (queryInfo) {

    var wopiQuery = String.format("{0}/wopi/files/{1}?UserId={2}&Signture={3}&Ticket={4}&Mode={5}&application={6}&fileId={1}&extension={7}",
        queryInfo.wopiUrl,
        queryInfo.fileId,
        queryInfo.userId,
        queryInfo.signture,
        queryInfo.ticket,
        queryInfo.mode,
        queryInfo.application,
        queryInfo.extension);
    wopiQuery = encodeURIComponent(wopiQuery);
    var onlineUrl = String.format("{0}/{1}WOPISrc={2}",
        queryInfo.onlineUrl,
        queryInfo.docView,
        wopiQuery);

    return onlineUrl;
}

var getUrlQueryInfo = function () {
    var tiecket=getTicket();
    var extension=getParamString('extension');
    var queryInfo = {
        fileId: getParamString('fileid'),
        userId: getParamString('userid'),
        userName: getParamString('username'),
        signture: getParamString('signture'),
        ticket: tiecket,
        wopiUrl: config.docOnline.wopiUrl,
        onlineUrl: config.docOnline.officeWebAppsUrl,
        docView: getDocUrl(extension),
        mode: getParamString('mode'),
        application: getParamString('application'),
        extension: extension
    };

    return queryInfo;
}

var getDocUrl = function (extension) {
    if (extension == '.docx') {
        return 'wv/wordviewerframe.aspx?';
    }

    if (extension == '.pdf') {
        //  return 'wv/wordviewerframe.aspx?PdfMode=1&';
        return 'page/pdfonline.html?';
    }

    if (extension == '.xlsx') {
        return 'x/_layouts/xlviewerinternal.aspx?';
    }

    if (extension == '.pptx') {
        return 'p/PowerPointFrame.aspx?';
    }
}
