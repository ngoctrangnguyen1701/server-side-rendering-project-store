const express = require('express');
const router = express.Router();
const model = require('../models/model.js');
module.exports = router;

router.get('/', async (req, res) =>{
    var arr = await model.getItems('Products');
    //console.log('arrproducts', arr);

    var arrBrands = await model.getItems('Brands');
    var arrCategories = await model.getItems('Categories');

    res.render('product/product_home', {arrProducts: arr, arrBrands: arrBrands, arrCategories: arrCategories});
});

router.get('/add', async (req, res) =>{
    var arrCategories = await model.getItems('Categories');
    var arrBrands = await model.getItems('Brands');
    res.render('product/product_add', {arrCategories: arrCategories, arrBrands: arrBrands});
});

router.post('/add', async (req, res) =>{
    console.log('add: ', req.body);
    console.log('add file: ', req.files);


    if(typeof req.body.product === 'string'){   
        if(req.files){ //nếu có req.files (trường hợp phía client không up ảnh thì req.files sẽ bằng null)
            //xử lý hình ảnh lưu vào trong thư mục
            var img = req.files['img'] //lấy cái giá trị của key 'img'
            img.mv('public/images/' + img['name']);
            //.mv(đường dẫn vào thư mục) ở đây chọn thư mục public/images/ kèm theo tên hình ảnh lấy từ thuộc tính name
            req.body['imgUrl'] = img['name'];
            //thêm key 'imgUrl' với value là tên hình ảnh để có thể sử dụng src làm cho hình ảnh hiện trên web client
        }
       
        var result = await model.addItem('Products', req.body);
        console.log(result);
    }
    else{
        var items = [];
        for(var x = 0; x < req.body.product.length; x++){
            items[x] = {};
            //khai báo các phần tử trong mảng items là 1 object,
            // để khi gán giá trị cho key không bị undefined,
            //length của items sẽ bằng với length của các giá trị trong req.body
        };

        for(var key in req.body){
            //console.log(req.body[key]);
            for(var i in req.body[key]){
                items[i][key] = req.body[key][i]; //gán giá trị cho key của từng phần tử object trong mảng items
                //console.log(items[i]);
                //console.log(req.body[key][i]);
            }

        };
        console.log('afterLoop: ', items);

        //---------xử lý hình ảnh--------------
        if(req.files){
            var itemsIsImg = items.filter(item => item.isImg == 'true'); //trả về các item nào có key 'isImg" = 'true'
                                                                    //lưu ý giá trị true, flase của object ở đây là chuỗi, không phải dạng boolean nên phải để trong dấu ''
            console.log('itemsIsImg', itemsIsImg);

            var imgs = req.files['img'] // biến img sẽ là 1 mảng chứa các object của hình ảnh,
                                   // mảng này sẽ có length nhỏ hơn hoặc bằng với req.body.product
                                   // và length sẽ tương ứng với length mà có isImg là true

            if(Array.isArray(imgs)){ // trường hợp chỉ 1 file hình ảnh, thì biến imgs sẽ là 1 object,                                    
                for(var a in imgs){
                    imgs[a].mv('public/images/' + imgs[a]['name']);                    
                    itemsIsImg[a]['imgUrl'] = imgs[a]['name'];                    
                }
            }                                   
            else{  // trường hợp chỉ 1 file hình ảnh, tương tự là mảng itemsIsImg chỉ có 1 phần tử
                imgs.mv('public/images/' + imgs['name']);
                itemsIsImg[0]['imgUrl'] = imgs['name'];
            }
        }
        
        console.log('afterLoop2: ', items); 
        var result = await model.addItems('Products', items);
        console.log(result);
    };

    res.redirect('/product');
}); 

router.get('/delete/:id', async (req, res) =>{
    console.log('delete', req.params['id']);
    var id = req.params['id'];
    var product = await model.getItemById('Products', id);
    var arrCategories = await model.getItems('Categories');
    var arrBrands = await model.getItems('Brands');
    res.json({product, arrCategories, arrBrands});
});


router.post('/delete', async (req, res) =>{
    console.log('delete: ', req.body);
    if(typeof req.body['_id'] === 'string'){
        var result = await model.deleteItem('Products', req.body);
        console.log(result);
        res.redirect('/product');
    }
    else{
        var result = await model.deleteItems('Products', req.body['_id']);
        //req.body['_id'] chỉ lấy mảng '_id'
        console.log(result);
        res.json(result);
    }
});

router.get('/edit/:id', async (req, res) =>{
    var id = req.params['id'];
    var product = await model.getItemById('Products', id);
    res.json(product);
});

router.post('/edit', async (req, res) =>{
    console.log('edit: ', req.body);
    console.log('edit file: ', req.files);

    if(req.files){
        var img = req.files['img'];
        img.mv('public/images/' + img['name']) //lưu vào thư mục
        req.body['isImg'] = 'true'; //nếu không có dòng này thì dù đã cập nhập hình ảnh nhưng nó vẫn lưu lại 'isImg' = 'false'
                                    //dành cho trường hợp từ không có hình ảnh sang có hình ảnh,
        req.body['imgUrl'] = img['name'];
        
    }
    else if(req.body['isImg'] == 'false'){ //trường hợp xóa hình ảnh, hoặc không có hình
        req.body['imgUrl'] = "";
    }

    //↓ nếu description bằng rỗng thì gán trị 'null' cho nó, phòng trường hợp ở client xóa bỏ luôn chữ 'null' khi modal edit
    if(req.body['description'] == ''){
        req.body['description'] = 'null';
    }
    var result = await model.editItem('Products', req.body);
    console.log(result);
    res.redirect('/product');
}); 


