// feedback.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp();

Page({
    formSubmit: function (event) {
        console.log(event);
        // 获取表单提交的内容
        let content = event.detail.value.content;
        console.log(content);

        // 声明类型
        let Feedback = AV.Object.extend('Feedback');
        // 新建对象
        var feedback = new Feedback();
        // 设置名称
        feedback.set('username', 'caroline');
        feedback.set('content', content);

        feedback.save().then(function (feedback) {
            console.log('objectId is ' + feedback.id);
        }).catch(console.error);
    }
})