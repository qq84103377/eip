export function watermark_show() {

  // 默认设置
  var defaultSettings={
    watermark_txt: "",
    watermark_x : 150,// 水印起始位置x轴坐标
    watermark_y : 50,// 水印起始位置Y轴坐标
    watermark_cols : 3,// 水印列数
    watermark_rows : 4,// 水印行数
    watermark_x_space : 350,// 水印x轴间隔
    watermark_y_space : 60,// 水印y轴间隔
    watermark_color : '#000000',// 水印字体颜色
    watermark_alpha : 0.1,// 水印透明度
    watermark_fontsize : '20px',// 水印字体大小
    watermark_font : '微软雅黑',// 水印字体
    watermark_width : 120,// 水印宽度
    watermark_height : 70,// 水印长度
    watermark_angle : 20,// 水印倾斜度数
    watermark_dom: document.body,
    watermark_position: 'fixed',
  };
  // 采用配置项替换默认值，作用类似jquery.extend
  if(arguments.length===1&&typeof arguments[0] ==="object" )
  {
    var src=arguments[0]||{};
    for(var key in src)
    {
      if(src[key]&&defaultSettings[key]&&src[key]===defaultSettings[key])
        continue;
      else if(src[key])
        defaultSettings[key]=src[key];
    }
  }

  var oTemp = document.createDocumentFragment();

  //获取页面最大宽度
  var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth); //,window.screen.width

  //获取页面最大长度
  var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight); //,window.screen.height
  // alert();
  // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width *defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
    defaultSettings.watermark_cols = parseInt((page_width-defaultSettings.watermark_x+defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
    defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
  }
  // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
    defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
    defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
  }
  var x;
  var y;
  // alert(2);
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

      var mask_div = document.createElement('div');
      mask_div.id = 'water_mask_div' + i + j;
      mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
      // 设置水印div倾斜显示
      mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.userSelect = "none";
      mask_div.style.pointerEvents = "none";
      mask_div.style.whiteSpace = "nowrap";
      mask_div.style.position = defaultSettings.watermark_position || "fixed";
      mask_div.style.left = x + 'px';
      mask_div.style.top = y + 'px';
      // mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "9999";
      // mask_div.style.border="solid #eee 1px";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      // mask_div.style.filter.alpha.opacity=10
      //alpha(opacity=10)
      mask_div.style.filter="alpha(opacity='10')";

      // mask_div.style.filter.progid="DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.7660444431189777, M12=-0.6427876096865394, M21=0.6427876096865398, M22=0.7660444431189779)";
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.setAttribute("onselectstart","return false;")
      mask_div.setAttribute("unselectable","on")
      mask_div.setAttribute("class","water_mask_div")
      // mask_div.style.progid="DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.866025404, M12=0.5, M21=-0.5, M22=0.866025404)" ;
      // mask_div.style.textAlign = "center";
      // mask_div.style.width = defaultSettings.watermark_width + 'px';
      // mask_div.style.height = defaultSettings.watermark_height + 'px';
      // mask_div.style.display = "block";
      //$(mask_div).rotate({angle:45});
      oTemp.appendChild(mask_div);
    };
  };

  defaultSettings.watermark_dom.appendChild(oTemp);
  // document.body.appendChild(oTemp);

  // 元素删除后复原
  document.addEventListener("DOMNodeRemoved", function () {
    let _target = arguments[0]['target'],
      _id =_target['id'];

    if(_id && _id.indexOf('water_mask_div')==0){
      let _DIV = document.createElement('div'),
        _innerHTML = _target['innerHTML'],
        _style = _target['attributes']['style']['nodeValue'];
      _DIV.id = _id;
      _DIV.style = _style;
      _DIV.innerHTML = _innerHTML;

      document.body.appendChild(_DIV);
    }
  })
}
