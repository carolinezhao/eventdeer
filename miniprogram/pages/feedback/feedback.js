// feedback.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp();

Page({
    data: {
        formContent: ''
    },
    checkIfSubmit: function (event) {
        wx.showModal({
            title: '提示',
            content: '您确认提交吗？',
            confirmText: '确定',
            success: (res) => {
                if (res.confirm) {
                    // 用 function 声明的作用域内 this 不指向目标函数
                    this.formSubmit(event);
                } else if (res.cancel) {
                    // 
                }
            }
        })
    },
    formSubmit: function (event) {
        console.log(event);
        // 获取表单提交的内容
        let content = event.detail.value.content;
        console.log(content);
        // 获取微信登录用户名
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
            // 创建了 id 表示在数据库中保存成功
            console.log('objectId is ' + feedback.id);
            wx.showModal({
                title: '提示',
                content: '提交成功。感谢您的反馈与建议。',
                confirmText: '完成',
                cancelText: '再写一个',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1, // 回退前 delta(默认为1) 页面
                            success: function (res) {
                                // success
                            }
                        })
                    } else if (res.cancel) {
                        // 清空表单内容
                        this.setData({
                            formContent: ''
                        })
                    }
                }
            })
        }).catch(error => {
            console.log(error);
            wx.showToast({
                title: '提交失败，请您稍后重试。',
                mask: 'true',
                icon: 'none'
            })
        });
    }
})