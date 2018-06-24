// index.js

// calendar
import initCalendar, {
    getSelectedDay,
    jumpToToday
} from 'calendar';

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        // 页面数据
        ifShowCalender: false,
        currentDate: '',
        selectedDate: '',
        isSelected: false,
        location: 'Haidian',
        phone: '6666-8888',
        // 数据库数据
        courseSets: [],
        events: [],
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

        // Set Current Date
        this.setCurrentDate();

        // LeanCloud
        // 获取并设置 courseSets 和 events
        // 自动查询区间：今日零点-明日零点
        this.queryCourses('today', 'tomorrow');
        this.queryEvents('today', 'tomorrow');
    },
    onShow: function () {
        console.log('show page');
        // 切回此页面后自动跳转到今天
        this.setData({
            selectedDate: '',
            isSelected: false
        })
        // 自动查询区间：今日零点-明日零点
        this.queryCourses('today', 'tomorrow');
        this.queryEvents('today', 'tomorrow');

        // 日历
        this.calendar();
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    setCurrentDate: function () {
        let currentDate = (new Date()).toDateString();
        this.setData({
            currentDate: currentDate
        })
    },
    queryCourses: function (startTime, endTime) {
        console.log('queryCourses starts');
        let queryCourses = new AV.Query('Courses');
        queryCourses.greaterThanOrEqualTo('time', app.queryTime(startTime));
        queryCourses.lessThan('time', app.queryTime(endTime));

        queryCourses.ascending('time')
            .find()
            .then(courses => {
                console.log(courses);
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
                    course.time = app.displayTime(course.time);
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
    queryEvents: function (startTime, endTime) {
        console.log('queryEvents starts');
        let queryEvents = new AV.Query('Events');
        queryEvents.greaterThanOrEqualTo('time', app.queryTime(startTime));
        queryEvents.lessThan('time', app.queryTime(endTime));

        queryEvents.ascending('time')
            .find()
            .then(events => {
                // let arrEvents = [];
                // for (let item of events) {
                //     let event = item.attributes;
                //     event.time = app.displayTime(event.time, event.duration);
                //     arrEvents.push(event);
                // }

                let arrEvents = events.map(item => {
                    let event = item.attributes;
                    event.time = app.displayTime(event.time, event.duration);
                    return event;
                })
                this.setData({
                    events: arrEvents
                })
                console.log(this.data.events);
            })
            .catch(console.error);
    },
    onShareAppMessage: function (res) {
        // 页面内转发按钮
        if (res.from === 'button') {
            console.log(res.target);
        }
        // 右上角转发菜单
        if (res.from === 'menu') {}
        return {
            title: '今日活动安排',
            path: '',
            imageUrl: ''
        }
    },
    calendar: function () {
        // 日历配置，没有则不能显示。
        initCalendar({
            // multi: true, // 是否开启多选,
            disablePastDay: false, // 是否禁选过去日期
            /**
             * 选择日期后执行的事件
             * @param { object } currentSelect 当前点击的日期
             * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
             */
            afterTapDay: (currentSelect, allSelectedDays) => {
                console.log('当前点击的日期', currentSelect);
                // console.log('当前点击的日期是否有事件标记: ', currentSelect.hasTodo || false);
                // allSelectedDays && console.log('选择的所有日期', allSelectedDays);
                console.log('getSelectedDay方法', getSelectedDay());

                // 显示选择的日期，并查询当天事件               
                this.setSelected(currentSelect);
            },
            /**
             * 日期点击事件（此事件会完全接管点击事件）
             * @param { object } currentSelect 当前点击的日期
             * @param { object } event 日期点击事件对象
             */
            // onTapDay(currentSelect, event) {
            //   console.log(currentSelect);
            //   console.log(event);
            // },
            /**
             * 日历初次渲染完成后触发事件，如设置事件标记
             */
            // afterCalendarRender() {
            // },
        });
    },
    setSelected: function (obj) {
        let startTimeStr = `${obj.year}/${obj.month}/${obj.day}`,
            endTimeStr = `${obj.year}/${obj.month}/${obj.day + 1}`;
        console.log(startTimeStr, endTimeStr);
        let selectedDate = (new Date(startTimeStr)).toDateString();
        if (selectedDate === this.data.currentDate) {
            this.setData({
                selectedDate: '',
                isSelected: false
            })
        } else {
            this.setData({
                selectedDate: selectedDate,
                isSelected: true
            })
        }
        // 根据点击日期查询
        this.queryCourses(startTimeStr, endTimeStr);
        this.queryEvents(startTimeStr, endTimeStr);
    },
    jump: function () {
        console.log('jump to today');
        // 日历功能：跳转至今天
        jumpToToday();
        this.setData({
            selectedDate: '',
            isSelected: false
        })
        // 自动查询区间：今日零点-明日零点
        this.queryCourses('today', 'tomorrow');
        this.queryEvents('today', 'tomorrow');
    },
    toggleCalendar: function () {
        this.setData({
            ifShowCalender: !this.data.ifShowCalender,
        })
    }
})