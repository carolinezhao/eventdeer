// detail.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        queryid: '',
        event: {},
        isDisplayButton: false, // 默认为从程序主入口进入，不显示该元素
        isDisplayCanvas: false,
        // isDisplayCanvas: true, // test
        deviceInfo: {},
        canvas: {},
        hasUserInfo: false,
        downloadFilePath: '',
        // nickName: '',
        nickName: 'rabbit', // test 
        tempFilePath: '' // 图片临时路径
    },
    onLoad: function (param) {
        // param 是由上一页传递过来的内容
        // console.log(param);

        // ===== 页面基础内容 =====
        // 根据场景值判断是否显示 button
        this.checkScene();
        // 上级页面传来的参数：id 用于查询
        this.setQueryData(param);
        // 查询并设置详情
        this.queryTargetEvent();

        // ===== 用户和设备信息，以备 canvas 使用 =====
        this.setPublicData();

        // test
        // this.drawCanvas();

        //
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    checkScene: function () {
        let scene = app.globalData.scene;
        console.log('scene is:' + scene, typeof scene); // 开发工具里是 string，手机里是 number
        let singlePageScene = [1007, 1008, 1031];
        let isSingle = singlePageScene.some(item => {
            return (item === Number.parseInt(scene))
        })
        if (isSingle) {
            this.setData({
                isDisplayButton: true
            })
        }
        console.log(this.data.isDisplayButton);
    },
    setQueryData: function (param) {
        this.setData({
            queryid: param.queryid
        })
    },
    setPublicData: function () {
        // 获取昵称
        if (app.globalData.userInfo) {
            let nickname = app.globalData.userInfo.nickName;
            // this.setData({
            //     hasUserInfo: true,
            //     nickname: nickname
            // })
        }
        // 获取设备信息 (在 onReady 函数中调用？？)
        wx.getSystemInfo({
            success: (res) => {
                // console.log(res);
                this.setData({
                    deviceInfo: {
                        maxHeight: res.windowHeight,
                        maxWidth: res.windowWidth
                    }
                })
                // console.log(this.data.deviceInfo);
            }
        })
    },
    queryTargetEvent: function () {
        // console.log('query starts');
        let query = new AV.Query('Events');
        query.equalTo('objectId', this.data.queryid);

        query.ascending('startTime')
            .find()
            .then(events => {
                let event = events[0].attributes;
                event.date = app.displayDate(event.startTime);
                event.time = `${app.displayTime(event.startTime)} - ${app.displayTime(event.endTime)}`;
                this.setData({
                    event: event
                })
                // console.log(this.data.event);
            })
            .catch(console.error);
    },
    openDiscoverPage: function (params) {
        // 使用场景：二维码/分享的消息卡片等
        wx.switchTab({ // 跳转到 tabBar 页面
            url: '../discover/discover',
            success: function (res) {
                // success
            }
        })
    },
    onShareAppMessage: function (res) {
        // 页面内转发按钮
        if (res.from === 'button') {
            console.log(res.target);
        }
        // 右上角转发菜单
        if (res.from === 'menu') {}
        return {
            title: '',
            path: '',
            imageUrl: ''
        }
    },
    saveAsImage: function () {
        // if (!this.data.hasUserInfo) {
        //     app.toLogin();
        // } else {
        // // 要改成 css 动画吗？
        this.setData({
            isDisplayCanvas: true
        })
        this.drawCanvas();
        // }
    },
    drawCanvas: function () {
        // canvas 不能读取页面元素的内容，只能通过 js 绘制。
        // canvas 中元素的单位都是 px

        // 根据设备信息设置 canvas 和 container
        // if (!this.data.deviceInfo) {
        // } else {
        let device = this.data.deviceInfo; // 单位为 px
        this.setData({
            // 如果 canvas 采用这种方案，则内容也需要根据比例设置
            canvas: {
                // width: `${device.maxWidth * 0.8}px`,
                // height: `${device.maxHeight * 0.8}px`
            },
        })
        // console.log(this.data.canvas);
        // }

        // 创建对象
        let ctx = wx.createCanvasContext('event-info');
        // console.log(ctx); // 对象信息

        // 这两个变量应与 canvas 的实际宽高保持一致 (上方根据比例设置或CSS)
        let canvasWidth = 300,
            canvasHeight = 450;

        let boxWidth = 260,
            boxHeight = 350,
            boxBorderWidth = 1,
            boxStartX = (canvasWidth - boxWidth) / 2,
            boxStartY = 20;

        let contentWidth = boxWidth - boxBorderWidth * 2,
            imageHeight = 130,
            imageStatX = boxStartX + boxBorderWidth,
            imageStatY = boxStartY + boxBorderWidth;

        let textLeftGap = 10,
            textTopGap = 30,
            textStartX = imageStatX + textLeftGap,
            textStartY = imageStatY + imageHeight + textTopGap,
            textMaxWidth = contentWidth - textLeftGap * 2,
            textLineGap = 20,
            textParaGap = 30;

        let codeWidth = 43 * 1.2,
            codeHeight = codeWidth,
            codeTopGap = 12,
            codeStartX = boxStartX,
            codeStartY = boxStartY + boxHeight + codeTopGap;

        let signatureX = boxStartX + codeWidth + 10,
            signatureY = codeStartY + 25;

        // 边框
        ctx.setStrokeStyle('#8E8E93');
        ctx.setLineWidth(boxBorderWidth);
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(boxStartX, boxStartY, boxWidth, boxHeight); // 不填充的矩形
        
        // 活动信息
        let obj = this.data.event;

        // 绘制网络图片时，要先将网络图片路径保存到本地，再用本地生成的路径绘制。
        this.getOnlineImg(obj.imgUrl);
        // 先把异步拿到的临时路径缓存，然后同步获取该路径。
        let imgUrl = wx.getStorageSync('storageUrl');

        // 活动信息-头图       
        ctx.drawImage(imgUrl, imageStatX, imageStatY, contentWidth, imageHeight);

        // 活动信息-文字
        ctx.setFontSize(15);
        console.log(textMaxWidth);
        // 选择展示 obj 部分属性
        let arr = [obj.title, obj.date, obj.time, obj.location, obj.intro];
        arr.forEach((item, index) => {
            this.createFillText(ctx, item, textStartX, textStartY, textMaxWidth, textLineGap);
            // 设置不同间距
            if (index === 0 || index === 3) {
                textStartY += textParaGap;
            } else {
                textStartY += textLineGap;
            }
        });

        // 签名
        // ctx.font = 'style(italic) weight(bold) size family';
        ctx.font = 'normal normal 11px Roboto';
        ctx.fillText('长按识别小程序码查看更多活动', signatureX, signatureY);
        ctx.fillText(`Shared by ${this.data.nickName}`, signatureX, signatureY + 16);

        // 小程序码 (按照43像素的整数倍缩放，效果最佳)
        ctx.drawImage('../../img/qrcode.jpg', codeStartX, codeStartY, codeWidth, codeHeight);

        // must-end-with
        // ctx.draw(); // test
        ctx.draw(false, (options) => this.getTempFilePath(options));
    },
    getOnlineImg (url) {
        console.log(url);
        wx.downloadFile({ // or getImageInfo
            url: url,
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log(res.tempFilePath);
                    // 异步调用，为保证拿到结果先缓存  
                    wx.setStorage({
                        key: 'storageUrl',
                        data: res.tempFilePath
                    });              
                }
            },
            fail: () => {
                console.log('Failed to get image.');
            }
        })
    },
    createFillText: function (ctx, string, x, y, maxWidth, gap) {
        // 中文字宽度 36，英文字母宽度约为 4-17
        // console.log(ctx.measureText('W').width);
        let averLetterWidth = 20;

        // 一行可容纳文本的最大 canvas 宽度：maxWidth
        // 文本占用的 canvas 宽度
        let textWidth = ctx.measureText(string).width;
        // console.log(textWidth);

        if (textWidth <= maxWidth) {
            ctx.fillText(string, x, y, maxWidth);
        } else {
            let originArr = string.split(''),
                len = originArr.length,
                tempStr = '',
                lineArr = [],
                tempTextWidth;

            originArr.forEach((item, index) => {
                // bad solution: push-->join
                tempStr += item;
                tempTextWidth = ctx.measureText(tempStr).width;
                // console.log(item, index, tempStr, tempTextWidth);
                // 界限比较模糊，某些特殊情况的显示可能会有问题
                if ((maxWidth - tempTextWidth < averLetterWidth) || (index === (len - 1))) {
                    lineArr.push(tempStr); // 按划分好的行存入数组，用于限制行数显示
                    tempStr = '';
                    // 字符串中的自动换行：iOS 可显示，Andriod 和开发者工具不显示。
                }
            });

            console.log(lineArr);
            lineArr.forEach((item, index) => {
                if (index <= 3) {
                    ctx.fillText(item, x, y);
                    y += gap; // 内部间距
                } else if (index === 4) {
                    ctx.fillText('......', x, y);
                }
            })

            // a failed solution: 中英文所占宽度不同，一个字符串的 width 和 length 不是成比例的。
        }
    },
    getTempFilePath: function (options) {
        console.log(options);
        // 在 draw 回调里调用该方法才能保证图片导出成功。
        wx.canvasToTempFilePath({
            // 输出图片默认为：canvas宽/高 * 屏幕像素密度
            canvasId: 'event-info',
            fileType: 'jpg', // 'jpg' or 'png'(default)
            quality: 1,
            success: (res) => {
                console.log(res.tempFilePath);
                this.setData({
                    tempFilePath: res.tempFilePath // 临时文件路径
                })
                this.saveImageToPhotosAlbum();
            }
        })
    },
    saveImageToPhotosAlbum: function () {
        // if (!this.data.tempFilePath) {

        // }

        // 区分：wx.saveFile 保存文件到本地
        // wx.saveImageToPhotosAlbum 保存文件到系统相册
        // 开发者工具：如果没有授权，会自动请求授权；
        // 手机：？
        wx.saveImageToPhotosAlbum({
            filePath: this.data.tempFilePath,
            success: (res) => {
                console.log(res);
                wx.showToast({
                    title: '保存成功',
                    mask: 'true',
                })
            }
        })
    },
    closeCanvas: function () {
        this.setData({
            isDisplayCanvas: false
        })
    },
    openShareMenu () {
        this.setData({
            ifShowMenu: true
        })
    },
    closeShareMenu () {
        this.setData({
            ifShowMenu: false
        })
    }
})