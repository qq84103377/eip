
document.write("<script src='../js/site.js'></script>");
document.write("<script src='../js/common.js'></script>");
document.write("<script src='../lib/jquery/dist/jquery.min.js'></script>");
document.write("<script src='../lib/jpdf/pdf.js'></script>");
document.write("<script src='../lib/jpdf/pdf.worker.js'></script>");
document.write("<script src='../lib/jpdf/pdfh5.js'></script>");

var config;

var jpdfInital = function (containid, configData) {
    config = configData;
    var docQueryInfo = getUrlQueryInfo();
    var onlineUrl = pdfOnlineUrlBuilder(docQueryInfo);
    var pdfh5 = new Pdfh5('#' + containid, {
        pdfurl: onlineUrl
    });

    //pdf准备开始渲染，此时可以拿到pdf总页数
    pdfh5.on("ready", function () {
        console.log("pdf准备开始渲染，总页数：" + this.totalNum)
    });
    //监听pdf渲染成功
    pdfh5.on("success", function (time) {
        time = time / 1000
        console.log("pdf渲染完成，总耗时" + time + "秒");
        var ifm = window.parent.document.getElementById("myiframe");

        // ifm.height = document.documentElement.clientHeight * 0.99;
        var pdfDom = document.getElementsByClassName('pdfViewer')[0] || null
        if(pdfDom){
            ifm.style.height = pdfDom.clientHeight + 'px'
        }
        let rmsCtn = window.parent.window.parent.document.getElementById('rms-ctn')
        if(rmsCtn) rmsCtn.style.height = pdfDom.clientHeight + 'px'
        //滚动到第3页
        // pdfh5.goto(3);
    });
}


var pdfOnlineUrlBuilder = function (queryInfo) {
    //http://localhost:7064/wopi/files/7d789ff8-4326-4210-a014-b5095b022c97/contents?mode=realtime
    var onlineUrl = String.format("{0}/wopi/files/{1}/contents?{2}", queryInfo.pdfUrl, queryInfo.fileId, window.location.search.substr(1));
    return onlineUrl;
}

var getUrlQueryInfo = function () {
    var queryInfo = {
        fileId: getQueryString('fileid'),
        wopiUrl: config.docOnline.wopiUrl,
        pdfUrl: config.docOnline.pdfUrl
    };

    return queryInfo;
}
