
document.write("<script src='../lib/jquery/dist/jquery.js'></script>");

var defaultConfig = '../js/config.json?_t=' + new Date().getTime();

var getConfiguration = function (configPath, action) {
    var request = new XMLHttpRequest();
    request.open("get", configPath);
    request.send(null);
    request.onload = function () {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            action(json);
        }
    }
}
