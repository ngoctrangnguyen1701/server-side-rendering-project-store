const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const home = require('./controller/HomeController');
const category = require('./controller/CategoryController');
const brand = require('./controller/BrandController');
const product = require('./controller/ProductController');
const customer = require('./controller/CustomerController');
const auth = require('./controller/AuthController');
const cart = require('./controller/CartController');
const invoice = require('./controller/InvoiceController');
const chart = require('./controller/ChartController');
const sort = require('./controller/SortController');
const helpers = require('handlebars-helpers');
const math = helpers.math(); //để có thể sử dụng các phép toán
const model = require('./models/model')


const app = express();

//handlebars
app.engine('hbs', handlebars({
    defaultLayout: 'layout-dark',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.listen(5000, () =>{   
    console.log(`-----------------------------------------------------------`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); //file static
app.use(fileUpload()); //sử dụng các hàm của express-fileupload
app.use(cookieParser());

app.use(async (req, res, next) =>{
    var arr = [];
    if(req.cookies['tokenUser']){
        //console.log(req.cookies['tokenUser']);
        var u = await model.getItemByToken('Session', req.cookies['tokenUser']);
        //console.log(u);
        if(u){
            res.locals['user'] = u['username'];
            var options = {userid: u['userid']};
            arr = await model.getRelatedItems('Carts', options);                    
        }
        else{
            var options = {cartid: req.cookies.cartid};
            arr = await model.getRelatedItems('Carts', options);
        }
    }
    else if(req.cookies['cartid']){
        var options = {cartid: req.cookies.cartid};
        arr = await model.getRelatedItems('Carts', options);          
    }

    //↓↓ tính số lượng trong giỏ hàng    
    if(arr.length){ //nếu sản phẩm trong giỏ hàng
        var numBasket = eval(arr.map(item => item.quantity).join('+'));
        res.locals['numBasket'] = numBasket; //lưu biến ở local để có thể sử dụng toàn trang web 
    }

    //↓↓↓Xuất category và brand trên nav-var để xài toàn trang web
    var arrCategories = await model.getItems('Categories');
    var arrBrands = await model.getItems('Brands');
    res.locals['arrCategories'] = arrCategories;
    res.locals['arrBrands'] = arrBrands;
    next(); //next() để nó chạy ra, qua cái tiếp theo
});

app.use('/', home);
app.use('/category', category);
app.use('/brand', brand);
app.use('/product', product);
app.use('/customer', customer);
app.use('/auth', auth);
app.use('/cart', cart);
app.use('/invoice', invoice);
app.use('/chart', chart);
app.use('/sort', sort);




