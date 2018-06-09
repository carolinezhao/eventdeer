// detail.js

// LeanCloud
const AV = require('../../libs/av-weapp-min.js');

const app = getApp()

Page({
    data: {
        queryid: '',
        event: []
    },
    onLoad: function (param) {
        // param 是由上一页传递过来的内容
        console.log(param);
        // 设置查询内容
        this.setReceivedData(param);
        // 查询并设置详情
        this.queryTargetEvent();
    },
    setReceivedData: function(param) {
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
    }
})