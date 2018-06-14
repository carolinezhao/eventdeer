// me.js

const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断是否可用

        lists: [{
            bindtap: '',
            name: '提醒列表',
            icon: 'icon-list'
        }, {
            bindtap: 'openFeedback',
            name: '反馈与建议',
            icon: 'icon-feedback'
        }, {
            bindtap: '',
            name: '设置',
            icon: 'icon-setting'
        }]
    },
    onLoad: function () {
    },
    getUserInfo: function (e) {
        // <button bindgetuserinfo="getUserInfo"></button>
        // 点击该按钮时，会返回获取到的用户信息，回调的 detail 与 wx.getUserInfo(OBJECT) 返回的一致。
        console.log('tap button to get');
        console.log(e);
        let userInfo = e.detail.userInfo;
        // 设置本页
        this.setData({
            userInfo: userInfo,
            hasUserInfo: true
        })
        // 设置全局
        app.globalData.userInfo = userInfo;
        // 保存到数据库
        const user = AV.User.current();
        if (user) {
            user.set(userInfo).save().then(user => {
                // 数据库中的用户信息更新
                app.globalData.user = user.toJSON();
                console.log(app.globalData.user);
            }).catch(console.error);
        }
        // 设置过期时间？
    },
    openFeedback: function (params) {
        if (!this.data.hasUserInfo) {
            wx.showModal({
                title: '提示',
                content: '请您先登录',
                showCancel: false,
                confirmText: '知道了'
            })
        } else {
            wx.navigateTo({
                url: '../feedback/feedback',
                success: function (res) {
                    console.log(res);
                }
            })
        }
    },
    logout: function () {
        if (!this.data.hasUserInfo) {
            wx.showModal({
                title: '提示',
                content: '您还没有登录',
                showCancel: false,
                confirmText: '知道了'
            })
        } else {
            this.setData({
                userInfo: {},
                hasUserInfo: false
            })
            app.globalData.userInfo = null;
            // 退出登录时还应该删除哪些数据？app.globalData.user？？
            console.log(app.globalData);
        }
    },
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    }
})