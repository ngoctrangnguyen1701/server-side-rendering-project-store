const express = require('express');
const model = require('../models/model');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();

module.exports = router;

router.get('/piechart', async (req, res) =>{
    var arr = await model.group('Products', {_id: '$cid', total: {$sum: 1}});
    //console.log('arr chart: ', arr);

    for (const i of arr) {
        var name = await model.getItemById('Categories', i['_id']);
        i['category'] = name['category'];        
    }
    console.log('arr chart(after): ', arr);
    res.render('chart/pie_chart', {arr: arr});
});

router.get('/donut', async (req, res) =>{
    res.render('chart/donut');
});

router.post('/donut', async (req, res) =>{
    var arr = await model.group('Products', {_id: '$cid', total: {$sum: 1}});
    for (const i of arr) {
        var name = await model.getItemById('Categories', i['_id']);
        i['category'] = name['category'];        
    };
    res.json(arr);
});

router.get('/import', async (req, res) =>{
    var arr = [];
    fs.createReadStream('./data/AAPL.csv')
    .pipe(csv())
    .on('data', (data) => arr.push(data))
    .on('end', async () => {
        //console.log(arr);

        //↓↓↓ biến giá trị thành số trước khi add vào collection
        for (const i of arr) {
            i['Date'] = new Date(i['Date']); //chuyển giá trị của key 'Date' từ string sang date
            i['Open'] = parseFloat(i['Open']);
            i['High'] = parseFloat(i['High']);
            i['Low'] = parseFloat(i['Low']);
            i['Close'] = parseFloat(i['Close']);
            i['Adj Close'] = parseFloat(i['Adj Close']);
        }

        var ret = await model.removeAll('Stock');
        // xóa dữ liệu đã được add trước đó trong collection 'Stock',
        //để tránh trường hợp vào lại trang /chart/import sẽ bị add thêm dữ liệu (cả mới lẫn cũ) trong file .csv
        console.log('removeAll: ', ret);
        var ret = await model.addItems('Stock', arr);
        console.log(ret);
    });
    res.redirect('/chart/candlesticks');
});


router.get('/candlesticks', async (req, res) =>{
    var arr = await model.getItems('Stock');    

    var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
    for (const i of arr) {
        i['Date'] = i['Date'].toLocaleDateString('en-US', options);
        //biến trị typeof 'date' thành string theo qui ước của locale hiện tại (en-US),
        //để file candlesticks.hbs có thể đọc key 'date'
    };
    var start = arr[0]['Date'];
    var end = arr[arr.length - 1]['Date'];
    
    var title = `Data from ${start} to ${end}`;
    res.render('chart/candlesticks', {arr: arr, title: title});
});

router.post('/candlesticks', async (req, res) =>{
    console.log('date', req.body);
    var start = new Date(req.body.start);
    var end = new Date(req.body.end);
    //biến giá trị chuỗi thành typeof date, để sử dụng trong collection

    var related = {Date: {$gte: start, $lte: end}};
    var arr = await model.getRelatedItems('Stock', related);
    //console.log(arr);
    
    var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
    for (const i of arr) {
        i['Date'] = i['Date'].toLocaleDateString('en-US', options);
        //biến trị typeof 'date' thành string theo qui ước của locale hiện tại (en-US)
        //để file candlesticks.hbs có thể đọc key 'date'
    };
    var title = `Data form ${start.toLocaleDateString('en-US', options)} to ${end.toLocaleDateString('en-US', options)}`
    res.render('chart/candlesticks', {arr: arr, title: title});
})
