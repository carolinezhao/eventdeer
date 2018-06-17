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

        // 活动信息-边框
        ctx.setStrokeStyle('blue');
        ctx.strokeRect(boxStartX, boxStartY, boxWidth, boxHeight);
        // 活动信息-头图
        ctx.drawImage('../../img/picnic.jpg', imageStatX, imageStatY, contentWidth, imageHeight);
        // 活动信息-文字
        ctx.setFontSize(20);
        this.createFillText(ctx, this.data.event, textStartX, textStartY, textMaxWidth, textLineGap);

        // 分享人
        ctx.setFontSize(12);
        ctx.fillText(`shared by ${this.data.nickName}`, 20, 430);

        // 小程序码

        // must-end-with
        // ctx.draw(); // test
        ctx.draw(false, (options) => this.getTempFilePath(options));
    },
    createFillText: function (ctx, obj, x, y, maxWidth, gap) {
        // obj 不是全部属性都显示
        ctx.fillText(obj.title, x, y, maxWidth);
        ctx.fillText(obj.date, x, y += gap, maxWidth);
        ctx.fillText(obj.time, x, y += gap, maxWidth);
        ctx.fillText(obj.location, x, y += gap, maxWidth);
        ctx.fillText(obj.detail, x, y += gap, maxWidth);
    },
    getTempFilePath: function (options) {
        console.log(options);
        // 在 draw 回调里调用该方法才能保证图片导出成功。
        wx.canvasToTempFilePath({
            canvasId: 'event-detail',
            fileType: 'jpg', // 'jpg' or 'png'(default)
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