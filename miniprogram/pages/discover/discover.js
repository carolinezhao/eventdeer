// discover.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        eventSets: []
    },
    onLoad: function () {
        // 获取并设置 eventSets
        // 查询区间：明天零点以后
        this.queryComingEvents('tomorrow');
    },
    openDetailPage: function (params) {
        // console.log(params.currentTarget.dataset);
        // 获取所点击卡片的事件 id
        let queryid = params.currentTarget.dataset.queryid;

        wx.navigateTo({
            url: `../detail/detail?queryid=${queryid}&id=1`,
            success: function (res) {
                console.log('open successfully');
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    queryComingEvents: function (start) {
        let query = new AV.Query('Events');
        query.equalTo('ifDiscover', true);
        query.greaterThanOrEqualTo('startTime', app.formatTime(start));

        query.ascending('startTime')
            .find()
            .then(events => {
                console.log(events);
                let countType1 = 'Within a week',
                    countType2 = 'Later in this month',
                    countType3 = 'Next month';
                let arrGroup1 = [],
                    arrGroup2 = [],
                    arrGroup3 = [];
                for (let item of events) {
                    // attributes 中是手动创建的属性，id 等默认属性和 attributes 同级
                    let id = item.id;
                    let event = item.attributes;
                    let countType = this.countDown(event.startTime);
                    event.date = app.displayDate(event.startTime);
                    event.time = `${app.displayTime(event.startTime)} - ${app.displayTime(event.endTime)}`;
                    event.id = id;
                    switch (countType) {
                        case countType1:
                            arrGroup1.push(event);
                            break;
                        case countType2:
                            arrGroup2.push(event);
                            break;
                        case countType3:
                            arrGroup3.push(event);
                            break;
                        default:
                            break;
                    }
                }
                this.setData({
                    eventSets: [{
                        countDown: countType1,
                        events: arrGroup1,
                        eventNum: arrGroup1.length
                    }, {
                        countDown: countType2,
                        events: arrGroup2,
                        eventNum: arrGroup2.length
                    }, {
                        countDown: countType3,
                        events: arrGroup3,
                        eventNum: arrGroup3.length
                    }]
                })
                console.log(this.data.eventSets);
            })
            .catch(console.error);
    },
    countDown: function (date) {
        let eventMonth = date.getMonth() + 1;
        let eventDate = date.getDate();
        let currentMonth = (new Date()).getMonth() + 1;
        let currentDate = (new Date()).getDate();
        console.log(eventMonth, typeof eventMonth);
        if (eventMonth === currentMonth) {
            if (eventDate - currentDate <= 7) {
                return 'Within a week';
            } else {
                return 'Later in this month';
            }
        } else if (eventMonth > currentMonth) {
            return 'Next month';
        } else {
            // 这种情况不应该出现
            return 'Out of date'
        }
    },
    onShareAppMessage: function (res) {
        // 页面内转发按钮
        if (res.from === 'button') {
            console.log(res.target);
        }
        // 右上角转发菜单
        if (res.from === 'menu') {}
        return {
            title: '近期活动预告',
            path: '',
            imageUrl: ''
        }
    }
})