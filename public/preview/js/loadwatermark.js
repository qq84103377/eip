
document.write('<script src="../js/watermark.js?_t='+new Date().getTime()+'"><\/script>');

var show_wm=function(content, startrow){
    var config={};
    config.watermark_txt=content;
    config.watermark_x=20;
    config.watermark_y=0+startrow*40;
    config.watermark_rows=20;
    config.watermark_cols = 20;
    config.watermark_x_space = 160;
    config.watermark_y_space = 100;
    config.watermark_fontsize='24px';
    config.watermark_alpha = 0.3;
    config.watermark_width = 240;
    config.watermark_height = 120;
    config.watermark_angle=30;
    config.watermark_id='show_wm_div_id';          //水印总体的id
    config.watermark_prefix='show_mask_div_id';    //小水印的id前缀
    //all push
    console.log(config, 'config')
    watermark.load(config);
}

var hide_wm=function(content, startrow){
    var config={};
    config.watermark_txt=content;
    config.watermark_x=80;
    config.watermark_y=40+startrow*40;;
    config.watermark_rows=20;
    config.watermark_cols=20;
    config.watermark_x_space=160;
    config.watermark_y_space=100;
    config.watermark_fontsize='18px';
    config.watermark_alpha=0.004;
    config.watermark_width=240;
    config.watermark_height=120;
    config.watermark_angle=15;
    config.watermark_id='hide_wm_div_id';          //水印总体的id
    config.watermark_prefix='hide_mask_div_id';    //小水印的id前缀
    //all push
    console.log(config, 'config')
    watermark.load(config);
}

var load_wm=function(content, startrow){
    show_wm(content, startrow);
    hide_wm(content, startrow);
}

//var loadDefault_wm = function (content, startrow = 0) {
//    watermark({
//        watermark_txt: content,
//        watermark_y_space: 60,
//        watermark_x_space: 120,//水印x轴间隔
//        watermark_startrow: startrow
//    });
//}
