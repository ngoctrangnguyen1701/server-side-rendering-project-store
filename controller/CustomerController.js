const express = require('express');
const router = express.Router();
const model = require('../models/model.js');
module.exports = router;

var size = 100;
//router '/customer/loadmore' phải ghi lên trước router /'customer/:page?',
//nếu không javascript sẽ đọc nhầm loadmore là router params của /'customer/:page?'
router.get('/loadmore', async (req, res) =>{
    var arr = await model.getItems('Customers', 500);
    res.render('customer/customer_loadmore', {arrCustomers: arr});
});

router.get('/json/:page', async (req, res) =>{
    var page = parseInt(req.params['page']);
    var arr = await model.getItems('Customers', 500, page);
    var count = await model.count('Customers');
    var page_number = Math.ceil(count / 500);
    res.json({arr, page_number});
});


router.get('/autoload', async (req, res) =>{
    var arr = await model.getItems('Customers', 500);
    res.render('customer/customer_autoload', {arrCustomers: arr});
});

router.get('/datatables', async (req, res) =>{
    var arr = await model.getItems('Customers');
    res.render('customer/customer_datatables', {arrCustomers: arr});
});

router.get('/:page?', async (req, res) =>{ //:page?   -> dấu chấm hỏi có nghĩa là có hoặc không có router params
    console.log(req.params['page']);
    var count = await model.count('Customers');
    var page_number = Math.ceil(count / size);
    var page = 1;
    if(req.params['page'] !== undefined){
        page = parseInt(req.params['page'].slice(4));
    };
    
    var arr = await model.getItems('Customers', size, page);
    res.render('customer/customer_home', {arrCustomers: arr, page_number: page_number, page: page});
});


