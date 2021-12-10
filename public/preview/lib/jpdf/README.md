**pdfh5.js 基于pdf.js和jQuery，web/h5/移动端PDF预览手势缩放插件。**

- **注意：本地绝对路径地址不能加载，跨域问题用代理或者服务端解决。**
- **svg模式渲染存在缺陷，只能渲染普通pdf，带签名、印章的可能会渲染不全，报错，pdf.js官方目前没有给出解决方案**
- **canvas模式本质是图片，默认进去的时候，图片在手机端被缩放，不是原分辨率，所以失真模糊。所以需要放大查看pdf**
- [pdfh5博客主页](https://www.gjtool.cn/)
- [pdfh5项目GitHub地址](https://github.com/gjTool/pdfh5)



代码示例：

```

<body>
    <div id="app">
        <div class="text-wrapper">
            <div class="how-to"><span>正在加载中，请您耐心等待...</span></div>
        </div>

    </div>
    <div id="demo"></div>
    <script src="../lib/jpdf/jquery-2.1.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="../lib/jpdf/pdf.js"></script>
    <script src="../lib/jpdf/pdf.worker.js"></script>
    <script src="../lib/jpdf/pdfh5.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        var pdfh5;
      //  var pdfPath = "./pdfDemo.pdf";
        var pdfUrl = "http://localhost:7064/wopi/files/7d789ff8-4326-4210-a014-b5095b022c97/contents?mode=realtime";
        $(function () {
            $("#app").remove()
            $("#demo").show()
            var pdfh5 = new Pdfh5('#demo', {
                pdfurl: pdfUrl
            });
            //  pdfh5 = new Pdfh5('#demo', {
            //        pdfurl: "git.pdf",
            // background:{
            // 	image:"url('pdfh5.png')",
            // 	repeat:"no-repeat",
            // 	position:"left top",
            // 	size:"40px 40px"
            // },
            //       URIenable: true //开启浏览器地址栏file参数获取
            //   });
            // new Pdfh5('#demo2', {
            // 	pdfurl: "222.pdf"
            // });
            // new Pdfh5('#demo3', {
            // 	pdfurl: "git.pdf"
            // });
            // setTimeout(() => {
            //     var pdfh5 = new Pdfh5('#demo', {
            //         pdfurl: "https://www.gjtool.cn/pdfh5/git.pdf"
            //     });
            //     setTimeout(() => {
            //         var pdfh5 = new Pdfh5('#demo', {
            //             pdfurl: "1.pdf"
            //         });
            //         setTimeout(() => {
            //             var pdfh5 = new Pdfh5('#demo', {
            //                 pdfurl: "test.pdf"
            //             });
            //             pdfh5.on("complete", function (status, msg, time) {
            //                 console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
            //             })
            //         }, 5000);
            //     }, 5000);
            // }, 5000);

            //配置项参数 renderType:"svg" 渲染模式为svg，默认canvas
            // var pdfh5 = new Pdfh5('#demo', {
            //     pdfurl: "./default.pdf",
            //     renderType:"svg"
            // });

            //配置项参数 lazy:true 开启懒加载，默认是false,不开启懒加载
            // var pdfh5 = new Pdfh5('#demo', {
            //     pdfurl: "./default.pdf",
            //     lazy:true
            // });

            //配置项参数 URIenable:true 开启获取地址栏file参数，获取地址栏pdf路径?file=xxx.pdf，默认false不开启
            // var pdfh5 = new Pdfh5('#demo', {
            //     URIenable:false,
            //     pdfurl: "./default.pdf"
            // });

            //配置项参数 是否显示小部件 顶部绿色加载进度条loadingBar 左上角页码显示pageNum 右下角回到顶部按钮backTop  默认显示
            //		var pdfh5 = new Pdfh5('#demo', {
            // 			 loadingBar: false,
            //           pageNum:false,
            //           backTop:false
            // 		});

            //配置项参数data，文件流形式传入  pdfurl和data二选一
            //		var pdfh5 = new Pdfh5('#demo', {
            // 			data: data
            // 		});

            //配置项参数scrollEnable:false不允许pdf滚动,true允许pdf滚动  默认允许
            //		var pdfh5 = new Pdfh5('#demo', {
            // 			scrollEnable:false,//是否允许pdf滚动
            // 			pdfurl: url
            // 		});
            //pdfh5.scrollEnable(true)允许pdf滚动,pdfh5.scrollEnable(false)不允许pdf滚动

            //配置项参数zoomEnable:false不允许pdf手势缩放,true允许pdf手势缩放  默认允许
            //		var pdfh5 = new Pdfh5('#demo', {
            // 			zoomEnable:false,//是否允许pdf手势缩放
            // 			pdfurl: url
            // 		});
            //pdfh5.zoomEnable(true)允许pdf手势缩放，pdfh5.zoomEnable(false)不允许pdf手势缩放

            //pdfh5还原、销毁（附带回调函数）：   pdfh5.reset pdfh5.destroy
            //pdfh5显示、隐藏（附带回调函数）：   pdfh5.show pdfh5.hide

            //pdf准备开始渲染，此时可以拿到pdf总页数
            pdfh5.on("ready", function () {
                console.log("pdf准备开始渲染，总页数：" + this.totalNum)
            })
            //监听pdf渲染成功
            pdfh5.on("success", function (time) {
                time = time / 1000
                console.log("pdf渲染完成，总耗时" + time + "秒");
                //滚动到第3页
                // pdfh5.goto(3);
            })
            //监听pdf渲染失败
            // pdfh5.on("error", function (time) {
            //     console.log("渲染失败，总耗时" + time + "毫秒")
            // })
            //监听完成事件，加载失败、渲染成功都会触发
            //  pdfh5.on("complete", function (status, msg, time) {
            //     console.log("状态：" + status + "，信息：" + msg + "，总耗时：" + time + "毫秒，总页数：" + this.totalNum)
            // })
            //on方法,监听事件： 开始初始化 init 准备渲染pdf ready 加载完成 complete 加载失败 error 加载成功 success 渲染pdf中 render
            // 缩放zoom   滚动scroll 显示show  隐藏hide 还原reset 销毁destroy  允许缩放zoomEnable 允许滚动scrollEnable

            //pdfh5支持在线预览
            //http://www.gjtool.cn/pdfh5/pdf.html?file=http://www.gjtool.cn/pdfh5/default.pdf
        })
    </script>
</body>
```

