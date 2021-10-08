const express = require('express');
const model = require('../models/model');
const router = express.Router();

module.exports = router;

//------------SORT CATEGORY---------------
router.get('/cat/:cid/:type/:page?', async (req, res) =>{
    var cid = req.params['cid'];
    var type = parseInt(req.params['type']);

    var arrProducts = await model.sort('Products', {price: type}, {cid: cid});
    console.log(arrProducts);

    var category = await model.getItemById('Categories', cid);

    var size = 3;
    var page = 1;
    var count = arrProducts.length;
    var page_number = Math.ceil(count / size);
    if(req.params['page']){
        page = req.params['page'];
    }

    var sort = type == 1 ? 'Price ascending' : 'Price descending';

    var start = (page * size) - size;
    var end = page * size;
    console.log('sort', sort, `slice(${start}, ${end})`);

    var info = {
        arrProducts: arrProducts.slice(start, end), 
        title: category['category'], //chỉ lấy giá trị của key category
        link: `/sort/cat/${cid}/${type}`, //thay đổi link ở class 'page-item' khi có sort
        page_number: page_number,
        sortById: `cat/${cid}/`, //đặt thêm biến sortId nếu khách hàng muốn sort theo category
        sort: sort, //thêm sort để bỏ lên thẻ <input>,
        default: `/cat/${cid}/page/1` //thêm link default để trở về sắp xếp mặc định
    };

    res.render('home/index', info);    
});


//------------SORT BRAND---------------
router.get('/brand/:bid/:type/:page?', async (req, res) =>{
    var bid = req.params['bid'];
    var type = parseInt(req.params['type']);

    var arrProducts = await model.sort('Products', {price: type}, {bid: bid});
    console.log(arrProducts);

    var brand = await model.getItemById('Brands', bid);

    var size = 3;
    var page = 1;
    var count = arrProducts.length;
    var page_number = Math.ceil(count / size);
    if(req.params['page']){
        page = req.params['page'];
    }

    var sort = type == 1 ? 'Price ascending' : 'Price descending';

    var start = (page * size) - size;
    var end = page * size;
    console.log('sort', sort, `slice(${start}, ${end})`);

    var info = {
        arrProducts: arrProducts.slice(start, end), 
        title: brand['brand'], //chỉ lấy giá trị của key brand
        link: `/sort/brand/${bid}/${type}`, //thay đổi link ở class 'page-item' khi có sort
        page_number: page_number,
        sortById: `brand/${bid}/`, //đặt thêm biến sortId nếu khách hàng muốn sort theo brand
        sort: sort, //thêm sort để bỏ lên thẻ <input>,
        default: `/brand/${bid}/page/1` //thêm link default để trở về sắp xếp mặc định
    };

    res.render('home/index', info);    
});


//------------SORT SEARCH---------------
router.get('/search/:type/:page?', async (req, res) =>{
    var search = req.query['search'];
    console.log('search: ',search);

    var type = parseInt(req.params['type']);
    var match = {$regex: new RegExp(`.*${search}.*`, 'i')};

    var arrProducts = await model.getRelatedItems('Products', {product: match});
    console.log('sort search', arrProducts);

    arrProducts.sort(function(a, b) {
        return parseFloat(a.price) - parseFloat(b.price);
    });
    if(type == -1){
        arrProducts.reverse();
    }
    console.log('sort search22222222222222222', arrProducts);

    var size = 3;
    var page = 1;
    var count = arrProducts.length;
    var page_number = Math.ceil(count / size);
    if(req.params['page']){
        page = req.params['page'];
    }

    var sort = type == 1 ? 'Price ascending' : 'Price descending';      

    var start = (page * size) - size;
    var end = page * size;
    console.log('sort', sort, `slice(${start}, ${end})`);

    var info = {
        title: 'HOME',
        link: `sort/search/${type}`,       
        arrProducts: arrProducts.slice(start, end),
        page_number: page_number,
        search: search,
        sortBySearch: `?search=${search}`, //?search  --> do name của thẻ <input> trong form search là 'search'
        sort: sort, //thêm sort để bỏ lên thẻ <input>,
        default: `/search?search=${search}` //thêm link default để trở về sắp xếp mặc định
    }
    res.render('home/index', info);  
})


//------------SORT---------------
router.get('/:type/:page?', async (req, res) =>{
    var type = parseInt(req.params['type']);
    //--> giá trị của type nhận được đổi thành Number để có thể sử dụng kiểu $sort bên mongdodb
    var arrProducts = await model.sort('Products', {price: type});
    
    var size = 9;
    var page = 1;
    var count = arrProducts.length;
    var page_number = Math.ceil(count / size);
    console.log('page_number: ', page_number, 'size: ', size);

    var sort = type == 1 ? 'Price ascending' : 'Price descending';      

    if(req.params['page']){
        page = req.params['page'];
    }

    //slice(start, end)     không bao gồm vị trí cuối cùng
    //lấy 9 phần tử (tương đương với size = 9),
    //page = 1, slice(0,9) (9 phần tử đầu) ---> 1*9 - 9 = 0, 1*9 = 9
    //page = 2, slice(9,18) (9 phần tử tiếp theo) --> 2*9 - 9 = 9, 2*9 = 18
    
    var start = (page * size) - size;
    var end = page * size;
    console.log('sort', sort, `slice(${start}, ${end})`);

    var info = {
        title: 'HOME',         
        arrProducts: arrProducts.slice(start, end),            
        page_number: page_number,
        link: `/sort/${type}`,
        sort: sort, //thêm sort để bỏ lên thẻ <input>
        default: '/page/1' //thêm link default để trở về sắp xếp mặc định
    };

    res.render('home/index', info);
})