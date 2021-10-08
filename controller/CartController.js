const express = require('express');
const model = require('../models/model');
const random = require('../random');
const router = express.Router();
module.exports = router;

router.get('/', async (req, res) =>{
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
    var cart = await model.getRelatedItems('Carts', options);
    console.log('cart', cart);
    res.render('cart/index_cart', {cart: cart, title: 'Cart'});
});


//-------------------ADD CART-------------------
router.post('/add', async (req, res) =>{
    var obj = req.body;
    var addedProduct = [];
    
    if(req.cookies['tokenUser']){ 
        //nếu có sign in thì sẽ có cookie tokenUser
        //và sẽ add sản phẩm, đánh dấu bằng 'userid' thay vì cartid     
        var u = await model.getItemByToken('Session', req.cookies.tokenUser);
        if(u){
            obj['userid'] = u['userid'];
            addedProduct = await model.getRelatedItems('Carts', {userid: obj['userid'], pid: obj['pid']});       
            var options = {userid: obj['userid']};
            //gán bằng giá trị userid cho biến options để tìm sản phẩm trong cart của user
            //khi tính tổng sản phẩm trong giỏ hàng
        }
        else{//↓↓thêm trường hợp có cookies tokenUser nhưng tìm được user,
            //do có thể database bị xóa, hoặc chạy code ở 1 database khác 
            obj['cartid'] = random.randomString(32);
            res.cookie('cartid', obj['cartid'], {maxAge: 1000 * 3600 * 24 * 7});
            var options = {cartid: obj['cartid']}; //sử dụng khi tính tổng sản phẩm trong giỏ hàng
        }
    }
    else if(req.cookies['cartid']){ //trường hợp không có sign in nhưng có cookie cartid do được add trước đó
        obj['cartid'] = req.cookies['cartid'];

        addedProduct = await model.getRelatedItems('Carts', {cartid: obj['cartid'], pid: obj['pid']});
        console.log('addedProduct: ', addedProduct);

        var options = {cartid: obj['cartid']}; //(sử dụng khi tính tổng sản phẩm trong giỏ hàng)
    }
    else{ //nếu chưa có cookie cartid thì gắn cookie cho cartid của obj
        obj['cartid'] = random.randomString(32);
        res.cookie('cartid', obj['cartid'], {maxAge: 1000 * 3600 * 24 * 7});

        var options = {cartid: obj['cartid']}; //sử dụng khi tính tổng sản phẩm trong giỏ hàng
    };


//trường hợp sản phẩm đó đã được add to cart trước rồi, thông qua tìm kiếm bằng pid
    if(addedProduct.length){
        var [a] = addedProduct;
        console.log(a);

        a['quantity'] = eval(`${a['quantity']} + ${obj['quantity']}`);
        //gán lại biến quantity cộng thêm giá trị của obj['quantity']
        //do quantity khi xuất ra có thể là string nên dùng eval để biến thành biểu thức toán học
        
        var ret = await model.editItem('Carts', {_id: a['_id'], quantity: a['quantity']});
        console.log(ret);
    }
    else{
        console.log('add cart: ', obj);
        var ret = await model.addItem('Carts', obj);
        console.log(ret);
    };
    
//tính tổng sản phẩm giỏ hàng
    var arr = await model.getRelatedItems('Carts', options);
    if(arr.length){
        var numBasket = eval(arr.map(item => item.quantity).join('+'));   
        console.log('numBasket: ', numBasket);
    }
    res.json(numBasket);
});


//-------------------DELETE CART-------------------
router.post('/delete', async (req, res) =>{
    console.log('delete cart: ', req.body);
    var ret = await model.deleteItem('Carts', req.body);
    console.log(ret);
    res.json(ret);
});


//-------------------EDIT CART-------------------
router.post('/edit', async (req, res) =>{
    console.log('edit cart: ', req.body);
    var ret = await model.editItem('Carts', req.body);
    console.log(ret);

    //↓↓ trả lại số lượng sản phẩm mới sau khi edit
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

    var arr = await model.getRelatedItems('Carts', options);
    if(arr.length){
        var numBasket = eval(arr.map(item => item.quantity).join('+'));   
        console.log('numBasket: ', numBasket);
    }
    res.json(numBasket);
});


//-------------------ADD ORDER-------------------
router.post('/order', async (req, res) =>{
    console.log('order: ', req.body);
    var o = req.body;
    delete o['all']; //xóa key 'all', vì nó không cần thiết

    if(req.cookies['tokenUser']){
        var u = await model.getItemByToken('Session', req.cookies.tokenUser);
        if(u){
            o['userid'] = u['userid'];
        }
        else{
            o['cartid'] = req.cookies['cartid']; 
        } 
    }
    else if(req.cookies['cartid']){
        o['cartid'] = req.cookies['cartid']; 
        //gán thêm biến cartid để có thể lấy obj nằm trong collection 'Orders' thông qua cookie cartid
    }    
    console.log(o);
    
    var ret = await model.addItem('Orders', o);
    console.log('add Orders: ', ret.result);
    res.redirect('/invoice/checkout');
})