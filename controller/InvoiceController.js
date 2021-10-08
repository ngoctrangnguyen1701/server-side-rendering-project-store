const { ObjectId } = require('bson');
const express = require('express');
const model = require('../models/model');
const router = express.Router();
module.exports = router;


router.get('/dictrict/:pid', async (req, res) =>{
    var arrRelatedDictricts = await model.getRelatedItems('Districts', {pid: req.params['pid']});
    //console.log('arrRelatedDictricts: ', arrRelatedDictricts)
    res.json(arrRelatedDictricts);
});

router.get('/ward/:did', async (req, res) =>{
    var arrRelatedWards = await model.getRelatedItems('Wards', {did: req.params['did']});
    //console.log('arrRelatedWards: ', arrRelatedWards)
    res.json(arrRelatedWards);
});


//-------------------GET CHECK OUT-------------------
router.get('/checkout', async (req, res) =>{
    var arrProvinces = await model.getItems('Provinces');
    //console.log(arrProvinces);

    if(req.cookies['tokenUser']){
        var u = await model.getItemByToken('Session', req.cookies.tokenUser);
        if(u){
            var options = {userid: u['userid']};
        }
        else{
            var options = {cartid: req.cookies.cartid};
        }
    }
    else if(req.cookies['cartid']){
        var options = {cartid: req.cookies.cartid};
    }
    var arr = await model.getRelatedItems('Orders', options);
    //console.log(arr);
    var obj_order = arr.pop(); 
    console.log(obj_order);
    //lấy được obj_order là phần tử cuối cùng trong mảng arr, đồng thời xóa cái phần tử này ra khỏi mảng ban đầu
    //để ứng với những trường hợp bấm check out rồi quay lại giỏ hàng, 
    //chỉnh sửa rồi bấm btn-check-out thì sẽ add thêm 1 obj_order vào collection 'Orders'


    /* giá trị nằm trong order của collection 'Orders' là giá trị của key '_id' nằm trong collection 'Carts'*/    
    if(Array.isArray(obj_order['order'])){
        var orderProduct = await model.getItemById('Carts', obj_order['order']);
    }
    else{
        var a = await model.getItemById('Carts', obj_order['order']);
        //nếu có 1 sản phẩm được order thì biến nó thành mảng có 1 phần tử, 
        //để xử lý code chung với khi orderProduct là mảng
        var orderProduct = [a]; 
    }
    console.log('orderProduct: ', orderProduct);
    
    var info = {
        title: 'Check out',
        arrProvinces: arrProvinces,
        orderProduct: orderProduct,
        buy: obj_order.buy,
        pay: obj_order.pay
    };
    
    res.render('invoice/checkout', info);

    //↓↓ xóa các phần tử trong mảng arr còn lại sau khi sử dụng pop()
    var delete_id = arr.map(item => item._id);
    //console.log('delete_id: ', delete_id);
    var ret = await model.deleteItems('Orders', delete_id);
    console.log(ret);
});

router.post('/checkout', async (req, res) =>{
    //console.log('check out: ', req.body);
    var o = req.body;

    //↓↓↓ thêm tên province, district, ward cho biến o
    var p = await model.getItemById('Provinces', o['pid'], false),
        d = await model.getItemById('Districts', o['did'], false),
        w = await model.getItemById('Wards', o['wid'], false);
    o['province'] = p['name'];
    o['district'] = d['name'];
    o['ward'] = w['name'];

    console.log('check out(after): ', o);
    
    var ret = await model.addItem('Invoices', o);
    console.log(ret);

    if(req.cookies['tokenUser']){
        var u = await model.getItemByToken('Session', req.cookies.tokenUser);
        if(u){
            var options = {userid: u['userid']};
        }
        else{
            var options = {cartid: req.cookies.cartid};
        }
    }
    else if(req.cookies['cartid']){
        var options = {cartid: req.cookies.cartid};
    }

    var arr = await model.getRelatedItems('Orders', options);
    //console.log(arr);
    var obj_order = arr.pop(); 
    console.log(obj_order);

    /* giá trị nằm trong order của collection 'Orders' là giá trị của key '_id' nằm trong collection 'Carts'*/    
    if(Array.isArray(obj_order['order'])){
        var orderProduct = await model.getItemById('Carts', obj_order['order']);
    }
    else{
        var a = await model.getItemById('Carts', obj_order['order']);
        //nếu có 1 sản phẩm được order thì biến nó thành mảng có 1 phần tử, 
        //để xử lý code chung với khi orderProduct là mảng
        var orderProduct = [a]; 
    }
    //console.log('orderProduct: ', orderProduct);
    
    var delete_orderProduct = orderProduct.map(item => item['_id']);
    //tạo 1 mảng chứa các phần tử là các giá trị của '_id'
    
    for (const i of orderProduct) {        
        delete i['_id']; 
        //xóa cái key '_id' có sẵn trong mỗi obj của mảng orderProduct,
        //để nó tự tạo ra 1 cái '_id' mới khi add vào 1 collection khác của mongodb
        i['iId'] = o['_id']; 
        // --> thêm cho mỗi cái obj trong mảng orderProduct 1 cái key 'iId' (invoice id) với value là o['_id]
    }
    console.log('orderProduct(after): ', orderProduct);

    var ret = await model.addItems('InvoiceDetail', orderProduct);
    console.log('add InvoiceDetail: ', ret);

    //sau khi đã add các item trong orderProduct vào InvoiceDetail thì phải xóa các item đó trong collection 'Carts' và 'Orders'
    var ret = await model.deleteItems('Carts', delete_orderProduct);
    console.log('delete_orderProduct: ', ret.result);

    var ret = await model.deleteItem('Orders', obj_order);
    console.log('delete_obj_order: ', ret.result);

    res.json(o['_id']);
});


//-------------------INVOICE DETAILS-------------------
router.get('/detail/:id', async (req, res) =>{    
    var id = req.params['id'];
    var o = await model.getItemById('Invoices', id);
    //console.log(o);
    var details = await model.getRelatedItems('InvoiceDetail', {iId: ObjectId(id)});
    //để xài được ObjectId ở đây phải require('bson');
    //const { ObjectId } = require('bson');
    //console.log(details);
    var info = {
        information: o,
        details: details,
        title: 'Invoice Detail'
    }
    res.render('invoice/detail', info);
});


//-------------------DELETE INVOICE-------------------
router.get('/delete/:id', async (req, res) =>{
    var id = req.params['id'];

    var ret = await model.deleteItem('Invoices', id);
    console.log('delete invoice: ', ret.result);

    var ret = await model.deleteItems('InvoiceDetail', false, {iId: ObjectId(id)});
    console.log('delete invoice detail: ', ret.result);

    res.render('invoice/delete', {text: 'No invoice', title: 'Delete Invoice'});
});


//-------------------SEARCH INVOICE-------------------
router.get('/search', async (req, res) =>{
    res.render('invoice/search', {title: 'Search Invoice'});
})

router.post('/search', async (req, res) =>{
    console.log(req.body);
    var arr = await model.getRelatedItems('Invoices', req.body)
    //console.log(arr);
    res.json(arr);
});

router.get('/search/detail/:id', async (req, res) =>{
    var id = req.params['id'];
    var o = await model.getItemById('Invoices', id);
    //console.log(o);
    var details = await model.getRelatedItems('InvoiceDetail', {iId: ObjectId(id)});
    //console.log(details);
    var info = {
        information: o,
        details: details,
        title: 'Search Invoice'
    }
    res.render('invoice/search_detail', info);
})
