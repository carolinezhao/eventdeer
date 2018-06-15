// detail.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        queryid: '',
        event: [],
        isDisplay: false, // 默认为从程序主入口进入，不显示该元素
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
    }
})