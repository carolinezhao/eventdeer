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
        this.getCurrentDate();

        // LeanCloud
        // 获取并设置 courseSets
        this.queryCourses();
        // 获取并设置 events
        this.queryEvents();
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    getCurrentDate: function () {
        let currentDate = (new Date()).toDateString();
        this.setData({
            currentDate: currentDate
        })
    },
    queryCourses: function () {
        console.log('queryCourses starts');
        let queryCourses = new AV.Query('Courses');
        // 查询时间：今日零点-明日零点
        queryCourses.greaterThanOrEqualTo('time', app.queryTime('today'));
        queryCourses.lessThan('time', app.queryTime('tomorrow'));

        queryCourses.ascending('time')
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
                    course.time = app.formatTime(course.time);
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
                        default:
                            break;
                    }
                }
                // 设置数据，渲染到页面
                this.setData({
                    courseSets: [{
                        courseType: type1,
                        courses: arrType1,
                        courseNum: arrType1.length
                    }, {
                        courseType: type2,
                        courses: arrType2,
                        courseNum: arrType2.length
                    }, {
                        courseType: type3,
                        courses: arrType3,
                        courseNum: arrType3.length
                    }]
                })
                console.log(this.data.courseSets);
            })
            .catch(console.error);
    },
    queryEvents: function () {
        console.log('queryEvents starts');
        let queryEvents = new AV.Query('Events');
        // 查询时间：今日零点-明日零点
        queryEvents.greaterThanOrEqualTo('time', app.queryTime('today'));
        queryEvents.lessThan('time', app.queryTime('tomorrow'));

        queryEvents.ascending('time')
            .find()
            .then(events => {
                // let arrEvents = [];
                // for (let item of events) {
                //     let event = item.attributes;
                //     event.time = app.formatTime(event.time, event.duration);
                //     arrEvents.push(event);
                // }
                
                let arrEvents = events.map(item => {
                    let event = item.attributes;
                    event.time = app.formatTime(event.time, event.duration);
                    return event;
                })
                this.setData({
                    events: arrEvents
                })       
                console.log(this.data.events);
            })
            .catch(console.error);
    }
})