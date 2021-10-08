const express = require('express');
const router = express.Router();
const model = require('../models/model.js');
module.exports = router;

router.get('/', async (req, res) =>{
    var arr = await model.getItems('Brands');
    //console.log('arrBrands', arr);
    res.render('brand/brand_home', {arrBrands: arr});
});

router.get('/add', async (req, res) =>{
    res.render('brand_add');
});


router.post('/add', async (req, res) =>{
    console.log('add: ', req.body);
    if(typeof req.body.brand === 'string'){     
        var result = await model.addItem('Brands', req.body);
        console.log(result);
    }
    else{
        var add = req.body.brand;
        for(var i in add){
            add[i] = {
                brand: add[i]    //gán lại giá trị cho phần tử trong mảng 'add' thành 1 object
            }
        }
        console.log(add); 
        var result = await model.addItems('Brands', add);
        console.log(result);
    }
    res.redirect('/brand');
});

router.post('/delete', async (req, res) =>{
    console.log('delete: ', req.body);
    if(typeof req.body['_id'] === 'string'){
        var result = await model.deleteItem('Brands', req.body);
        console.log(result);
        res.json(result);
    }
    else{
        var result = await model.deleteItems('Brands', req.body['_id']);
        //req.body['_id'] chỉ lấy mảng '_id'
        console.log(result);
        res.json(result);
    }
});

router.post('/edit', async (req, res) =>{
    console.log('edit: ', req.body);
    var result = await model.editItem('Brands', req.body);
    res.json(result);
});

