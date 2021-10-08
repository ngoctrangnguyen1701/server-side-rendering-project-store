const express = require('express');
const router = express.Router();
const model = require('../models/model.js');
module.exports = router;

router.get('/', async (req, res) =>{
    var arr = await model.getItems('Categories');
    //console.log('arrCategories', arr);
    res.render('category/category_home', {arrCategories: arr});
});

router.get('/add', async (req, res) =>{
    res.render('category_add');
});

router.post('/add', async (req, res) =>{
    console.log('add: ', req.body);
    if(typeof req.body.category === 'string'){     
        var result = await model.addItem('Categories', req.body);
        console.log(result);
    }
    else{
        var add = req.body.category;
        for(var i in add){
            add[i] = {
                category: add[i]    //gán lại giá trị cho phần tử trong mảng 'add' thành 1 object
            }
        }
        console.log(add); 
        var result = await model.addItems('Categories', add);
        console.log(result);
    }
    res.redirect('/category');
});

router.post('/delete', async (req, res) =>{
    console.log('delete: ', req.body);
    if(typeof req.body['_id'] === 'string'){
        var result = await model.deleteItem('Categories', req.body);
        console.log(result);
        res.json(result);
    }
    else{
        var result = await model.deleteItems('Categories', req.body['_id']);
        //req.body['_id'] chỉ lấy mảng '_id'
        console.log(result);
        res.json(result);
    }
});

router.post('/edit', async (req, res) =>{
    console.log('edit: ', req.body);
    var result = await model.editItem('Categories', req.body);
    res.json(result);
});

