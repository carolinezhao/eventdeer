// dicover.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        eventSets: []
    },
    onLoad: function () {
        // 获取并设置 eventSets
        this.queryComingEvents();
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
    openDetailPage: function (params) {
        wx.navigateTo({
            url: '../detail/detail',
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
    queryComingEvents: function () {
        let query = new AV.Query('Events');
        query.equalTo('party', true);
        query.greaterThanOrEqualTo('time', app.queryTime('tomorrow'));

        query.ascending('time')
            .find()
            .then(events => {
                let countType1 = 'Within a week',
                    countType2 = 'Later in this month',
                    countType3 = 'Next month';
                let arrGroup1 = [],
                    arrGroup2 = [],
                    arrGroup3 = [];
                for (let item of events) {
                    let event = item.attributes;
                    let countType = this.countDown(event.time);
                    event.date = app.displayDate(event.time);
                    event.time = app.displayTime(event.time, event.duration);
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
    }

})