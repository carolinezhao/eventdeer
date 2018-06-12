// feedback.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp();

Page({
    data: {},
    formSubmit: function (event) {
        console.log(event);
        // 获取表单提交的内容
        let content = event.detail.value.content;
        console.log(content);
        // 获取微信登录用户名
        console.log(app.globalData.user);
        let username = app.globalData.user.nickName;

        // 声明类型
        let Feedback = AV.Object.extend('Feedback');
        // 新建对象
        let feedbacks = new Feedback();
        // 设置属性
        feedbacks.set('username', username);
        feedbacks.set('center', 'Haidian');
        feedbacks.set('content', content);

        feedbacks.save().then(feedback => {
            console.log('objectId is ' + feedback.id);
        }).catch(console.error);
    }
})