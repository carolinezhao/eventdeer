// index.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        // 页面数据
        currentDate: '',
        location: 'Haidian',
        phone: '6666-8888',
        // 数据库数据
        courseSets: [],
        events: [],
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        // Get Current Date
        let currentDate = (new Date()).toDateString();
        this.setData({
            currentDate: currentDate
        })

        // LeanCloud
        // 获取并设置 courseSets
        let query1 = new AV.Query('Courses');
        // 查询当天
        query1.greaterThanOrEqualTo('time', this.queryTime('start'));
        query1.lessThan('time', this.queryTime('end'));

        query1.ascending('time')
            .find()
            .then(courses => {
                let type1 = 'FTClass',
                    type2 = 'Extend',
                    type3 = 'GroupChat';
                let arrType1 = [],
                    arrType2 = [],
                    arrType3 = [];
                for (let item of courses) {
                    // attributes 是 LeanCloud 自动生成的，拿到的数据都放在这个属性中。
                    let course = item.attributes;
                    let type = course.type;
                    course.time = this.formatTime(course.time);
                    switch (type) {
                        case type1:
                            // 这里直接 push(item) 页面也能渲染一样的结果？
                            arrType1.push(course);
                            break;
                        case type2:
                            arrType2.push(course);
                            break;
                        case type3:
                            arrType3.push(course);
                            break;
                    }
                }
                let length1 = arrType1.length,
                    length2 = arrType2.length,
                    length3 = arrType3.length;
                // 设置数据，渲染到页面
                this.setData({
                    courseSets: [{
                        courseType: type1,
                        courses: arrType1,
                        courseNum: length1
                    }, {
                        courseType: type2,
                        courses: arrType2,
                        courseNum: length2
                    }, {
                        courseType: type3,
                        courses: arrType3,
                        courseNum: length3
                    }]
                })
                console.log(this.data.courseSets);
            })
            .catch(console.error);

        // 获取并设置 events
        let query2 = new AV.Query('Events');
        query2.greaterThanOrEqualTo('time', this.queryTime('start'));
        query2.lessThan('time', this.queryTime('end'));

        query2.ascending('time')
            .find()
            .then(events => {
                let arrEvents = [];
                for (let item of events) {
                    let event = item.attributes;
                    event.time = this.formatTime(event.time, event.duration);
                    arrEvents.push(event);
                }
                this.setData({
                    events: arrEvents
                })
                console.log(this.data.events);
            })
            .catch(console.error);

    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    formatTime: function (timeObj, duration) {
        // console.log(typeof duration);
        let hour = timeObj.getHours();
        let courseTime;
        // course 对象中没有 duration；event 对象中的 duration 默认为 1，也可能大于 1.
        if (duration == undefined) {
            courseTime = `${hour}:00`;
        } else {
            courseTime = `${hour}:00-${hour + duration}:00`
        }
        return courseTime;
    },
    queryTime: function (string) {
        let currentYear = (new Date()).getFullYear();
        let currentMonth = (new Date()).getMonth();
        let currentDate = (new Date()).getDate();
        let tmrDate = (new Date()).getDate() + 1;
        // 当天零点
        let startTime = new Date(currentYear, currentMonth, currentDate);
        // 次日零点
        let endTime = new Date(currentYear, currentMonth, tmrDate);
        switch (string) {
            case 'start':
                return startTime;
            case 'end':
                return endTime;
        }
    }
})