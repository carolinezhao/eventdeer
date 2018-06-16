// detail.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        queryid: '',
        event: [],
        isDisplay: false, // 默认为从程序主入口进入，不显示该元素
        hasUserInfo: false,
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

        if (app.globalData.userInfo) {
            let nickname = app.globalData.userInfo.nickName;
            this.setData({
                hasUserInfo: true,
                nickname: nickname
            })
        }

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
        if (!this.data.hasUserInfo) {
            app.toLogin();
        } else {
        // 创建对象
        let ctx = wx.createCanvasContext('event-detail');
        console.log('create image');
        // detail-page 内容，小程序码，分享人
        // canvas 不能读取页面元素
        ctx.setFontSize(20);
        ctx.fillText(`shared by ${this.data.nickName}`, 20, 30);
        // ctx.setTextAlign('left');

        // ctx.draw(); // test
        ctx.draw(false, (options) => this.getTempFilePath(options));
        }
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