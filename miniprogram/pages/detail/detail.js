// detail.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        queryid: '',
        event: {},
        hasUserInfo: false,
        isDisplayButton: false, // 默认为从程序主入口进入，不显示该元素
        isDisplayCanvas: false,
        // isDisplayCanvas: true, // test
        // nickName: '',
        nickName: 'rabbit', // test
        tempFilePath: '' // 图片临时路径
    },
    onLoad: function (param) {
        // param 是由上一页传递过来的内容
        console.log(param);
        // 根据场景值显示不同内容
        this.checkScene();
        // 设置查询内容
        this.setReceivedData(param);
        // 查询并设置详情
        this.queryTargetEvent();

        // if (app.globalData.userInfo) {
        //     let nickname = app.globalData.userInfo.nickName;
        //     this.setData({
        //         hasUserInfo: true,
        //         nickname: nickname
        //     })
        // }

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
                isDisplay: true
            })
        }
        console.log(this.data.isDisplay);
    },
    setReceivedData: function (param) {
        this.setData({
            queryid: param.queryid
        })
    },
    queryTargetEvent: function () {
        console.log('query starts');
        let query = new AV.Query('Events');
        query.equalTo('objectId', this.data.queryid);

        query.ascending('time')
            .find()
            .then(events => {
                let event = events[0].attributes;
                event.date = app.displayDate(event.time);
                event.time = app.displayTime(event.time, event.duration);
                this.setData({
                    event: event
                })
                console.log(this.data.event);
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
        // canvas 不能读取页面元素
        // canvas 中元素的单位都是 px

        // 创建对象
        let ctx = wx.createCanvasContext('event-detail');
        console.log(ctx);
        console.log('create image');

        let canvasWidth = 300, // css
            canvasHeight = 450; // css

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
            textLineGap = 25,
            textMaxWidth = contentWidth - textLeftGap * 2;

        let codeWidth = 43 * 1.2,
            codeHeight = codeWidth,
            codeTopGap = 12,
            codeStartX = boxStartX + boxWidth - codeWidth - 5,
            codeStartY = boxStartY + boxHeight + codeTopGap;

        let signatureX = boxStartX,
            signatureY = codeStartY + codeHeight - 5;

        // 活动信息-边框
        ctx.setStrokeStyle('#8E8E93');
        ctx.setLineWidth(boxBorderWidth);
        ctx.setLineDash([3, 2]);
        ctx.strokeRect(boxStartX, boxStartY, boxWidth, boxHeight); // 不填充的矩形

        // 活动信息-头图
        ctx.drawImage('../../img/picnic.jpg', imageStatX, imageStatY, contentWidth, imageHeight);

        // 活动信息-文字
        ctx.setFontSize(15);
        console.log(textMaxWidth);
        let obj = this.data.event;
        // 选择展示 obj 部分属性
        let arr = [obj.title, obj.date, obj.time, obj.location, obj.detail];
        arr.forEach((item) => {
            this.createFillText(ctx, item, textStartX, textStartY, textMaxWidth, textLineGap);
            textStartY += textLineGap;
        })

        // 分享人
        // ctx.font = 'style(italic) weight(bold) size family';
        ctx.font = 'normal normal 11px Roboto';
        ctx.fillText(`shared by ${this.data.nickName}`, signatureX, signatureY);

        // 小程序码 (按照43像素的整数倍缩放，效果最佳)
        ctx.drawImage('../../img/qrcode.jpg', codeStartX, codeStartY, codeWidth, codeHeight);

        // must-end-with
        // ctx.draw(); // test
        ctx.draw(false, (options) => this.getTempFilePath(options));
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
                console.log(item, index, tempStr, tempTextWidth);
                // 界限比较模糊，某些特殊情况的显示可能会有问题
                if ((maxWidth - tempTextWidth < averLetterWidth) || (index === (len - 1))) {
                    ctx.fillText(tempStr, x, y, maxWidth);
                    lineArr.push(tempStr); // 按划分好的行存入数组，用于限制行数显示
                    y += gap;
                    tempStr = '';
                    // 字符串中的自动换行：iOS 可显示，Andriod 和开发者工具不显示。
                }
            })
            console.log(lineArr);
            // a failed solution: 中英文所占宽度不同，一个字符串的 width 和 length 不是成比例的。
        }
    },
    getTempFilePath: function (options) {
        console.log(options);
        // 在 draw 回调里调用该方法才能保证图片导出成功。
        wx.canvasToTempFilePath({
            // 输出图片默认为：canvas宽/高 * 屏幕像素密度
            canvasId: 'event-detail',
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
    }
})