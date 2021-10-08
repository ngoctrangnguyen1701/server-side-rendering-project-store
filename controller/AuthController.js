const express = require('express');
const router = express.Router();
const model = require('../models/model.js');
const random = require('../random.js')

module.exports = router;

//------------SIGN UP---------------
router.get('/signup', (req, res) =>{
    res.render('auth/signup', {layout: 'layout-dark no nav', title: 'Sign up'});
});

router.post('/signup', async (req, res) =>{
    console.log('signup: ', req.body);
    var result = await model.addItem('Members', req.body);
    console.log(result);
    res.redirect('/auth/signin');
});

router.get('/signin', (req, res) =>{
    res.render('auth/signin', {layout: 'layout-dark no nav', title: 'Sign in'})
});


//------------SIGN IN---------------
router.post('/signin', async (req, res) =>{
    var signin = req.body;
    console.log('signin: ', signin);
    user = await model.signin('Members', {username: signin['username'], password: signin['password']});
    //do có thêm key 'remember' nên tìm chỉ cần dùng username và password
    
    if(user){
        console.log('user: ', user);
        var token = random.randomString(32);
        var isExpire;
        if(signin['remember']){
            res.cookie('tokenUser', token, {maxAge: 1000 * 3600 * 24 * 30});
            isExpire = true;                                    
        }
        else{
            res.cookie('tokenUser', token);
            isExpire = false;
        }

        //↓↓↓ add vào collection 'Session',
        //để khi request vào trang web có thể lấy lên được user,
        //thông qua cái req.cookies (token) đã lưu vào key 'token'
        var o = {
            token: token,
            isExpire: isExpire,
            username: user['username'], 
            userid: user['_id']
        }
        var ret = await model.addItem('Session', o);
        console.log('sessionItem: ', ret);
        
        res.redirect('/');
    }
    else{
        res.render('auth/signin', {layout: 'layout-dark no nav', error: 'Username or password is incorrect'});
    }
});


//------------SIGN OUT---------------
router.get('/signout', async (req, res) =>{
    if(req.cookies['tokenUser']){
        console.log('deleteToken: ', req.cookies['tokenUser']);
        var ret = await model.deleteToken('Session', req.cookies['tokenUser']);
        console.log(ret);
        res.clearCookie('tokenUser');
        //xóa cái giá trị cookie (token) dùng để requset vào trang web trong collection 'session',
        //và xóa lun cái cookie đã lưu ở trình duyệt
    }
    res.redirect('/auth/signin');
})

