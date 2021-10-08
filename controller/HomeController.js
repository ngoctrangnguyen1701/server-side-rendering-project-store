const express = require('express');
const model = require('../models/model');
const router = express.Router();

module.exports = router;

router.get('/', async (req, res) =>{
    var size = 9;
    var count = await model.count('Products');
    var page_number = Math.ceil(count / size);
    console.log('page_number: ', page_number, 'size: ', size);
    var arrProducts = await model.getItems('Products', size);

    var info = {
        title: 'HOME',         
        arrProducts: arrProducts,
        page_number: page_number,
        link: '/page',        
    };
    //console.log('req.cookies', req.cookies);    
    res.render('home/index', info);
});


//------------PAGE---------------
router.get('/page/:num', async (req, res) =>{
    var size = 9;
    var page = req.params['num'];
    var count = await model.count('Products');
    var page_number = Math.ceil(count / size);
    //console.log('page_number: ', page_number, 'size: ', size, 'page: ', page);

    var arrProducts = await model.getItems('Products', size, page);
    var info = {
        title: 'HOME',        
        arrProducts: arrProducts,
        page_number: page_number,
        link: '/page'
    }
    res.render('home/index', info);
});


//------------CATEGORY---------------
router.get('/cat/:cid/page/:num?', async (req, res) =>{
    var cid = req.params['cid'];
    console.log('cat: ', cid);

    var size = 3;
    var a = await model.getRelatedItems('Products', {cid: cid});
    var count = a.length;
    var page_number = Math.ceil(count / size);
    if(req.params['num']){
        page = req.params['num'];
    }
    //console.log('page_number: ', page_number, 'size: ', size, 'page: ', page);

    var arrProducts = await model.getRelatedItems('Products', {cid: cid}, false, size, page);
    //console.log(arrProducts);
    var category = await model.getItemById('Categories', cid);

    var info = {
        arrProducts: arrProducts,
        title: category['category'], //chỉ lấy giá trị của key category
        link: `/cat/${cid}/page`,
        page_number: page_number,
        sortById: `cat/${cid}/` //đặt thêm biến sortId nếu khách hàng muốn sort theo category
    };

    res.render('home/index', info);
});


//------------BRAND---------------
router.get('/brand/:bid/page/:num?', async (req, res) =>{
    var bid = req.params['bid'];
    console.log('brand: ', bid);

    var size = 3;
    var a = await model.getRelatedItems('Products', {bid: bid});
    var count = a.length;
    var page_number = Math.ceil(count / size);
    if(req.params['num']){
        page = req.params['num'];
    }
    //console.log('page_number: ', page_number, 'size: ', size, 'page: ', page);

    var arrProducts = await model.getRelatedItems('Products', {bid: bid}, false, size, page);
    //console.log(arrProducts);
    var brand = await model.getItemById('Brands', bid);

    var info = {
        arrProducts: arrProducts,
        title: brand['brand'], //chỉ lấy giá trị của key brand
        link: `/brand/${bid}/page`,
        page_number: page_number,
        sortById: `brand/${bid}/` //đặt thêm biến sortId nếu khách hàng muốn sort theo brand
    };

    res.render('home/index', info);
});


//------------DETAIL---------------
router.get('/detail/:id', async (req, res) =>{
    console.log('id: ', req.params['id']);
    var product = await model.getItemById('Products', req.params['id']);
    var brand = await model.getItemById('Brands', product['bid']);

    var relatedProducts = await model.getRelatedItems('Products', {cid: product['cid']}, product['_id']);
    console.log('relatedProducts', relatedProducts);

    var sameBrand = await model.getRelatedItems('Products', {bid: product['bid']}, product['_id']);
    console.log('sameBrand', sameBrand);

    var general = {
        product: product,
        brand_name: brand['brand'],
        title: product['product'],
        relatedProducts: relatedProducts,
        sameBrand: sameBrand
    };

    res.render('home/detail', general);
});


//------------SEARCH---------------
router.get('/search/:num?', async (req, res) =>{
    //console.log(req);
    var search = req.query['search'];
    console.log('search: ',search);

    var match = {$regex: new RegExp(`.*${search}.*`, 'i')};
    
    var size = 3;
    var page = 1;
    var a = await model.getRelatedItems('Products', {product: match});
    var count = a.length;
    var page_number = Math.ceil(count / size);
    if(req.params['num']){
        page = req.params['num'];
    }
    console.log('page_number: ', page_number, 'size: ', size, 'page: ', page);
    
    var arrProducts = await model.getRelatedItems('Products', {product: match}, false, size, page);
    console.log('search_result: ', arrProducts);

    var info = {
        title: 'HOME',
        link: 'search',     
        arrProducts: arrProducts,
        page_number: page_number,
        search: search,
        sortBySearch: `?search=${search}`, //?search  --> do name của thẻ <input> trong form search là 'search'
    }
    res.render('home/index', info);    
});

