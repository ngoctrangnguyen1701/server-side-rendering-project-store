const mongodb = require('mongodb');
const { options } = require('../controller/ChartController');
const url = 'mongodb://localhost:27017';
const opt = { useUnifiedTopology: true };

//--------------tạo function chung lấy dữ liệu từ mongodb---------------------
async function data (collection){
    if(typeof collection === 'string'){
        var client = await mongodb.MongoClient(url, opt).connect();
        var data = await client.db('Store_Project').collection(collection);
        return data;
    }
    else{
        console.warn('collection name must be a STRING');
    }
};

exports.addItem = async (collection, obj) =>{
    var useData = await data(collection);
    var ret = await useData.insertOne(obj);
    return ret;
};

exports.addItems = async (collection, arr_contain_obj) =>{
    var useData = await data(collection);
    var ret = await useData.insertMany(arr_contain_obj);
    return ret;
};

exports.deleteItem = async (collection, id_or_obj_contain_id) =>{
    var useData = await data(collection);
    var param = id_or_obj_contain_id;

    if(typeof param !== 'string'){ 
        param = param['_id'];
    }

    var ret = await useData.deleteOne({_id: mongodb.ObjectID(param)});
    return ret;
};

exports.deleteItems = async (collection, arr_contain_id, options = {}) =>{
    var useData = await data(collection);

    if(arr_contain_id){
        for(var i in arr_contain_id){
            arr_contain_id[i] = mongodb.ObjectID(arr_contain_id[i]);            
        }
        //console.log(arr_contain_id);
        var ret = await useData.deleteMany({_id: {$in: arr_contain_id}});
    }
    else{
        var ret = await useData.deleteMany(options);
    }
    return ret;
};

exports.editItem = async (collection, obj_contain_id = {}) =>{
    var id = obj_contain_id['_id'];
    var {_id, ...rest} = obj_contain_id; // ...rest : tạo object mới không bao gồm key '_id'
    console.log('rest' ,rest);

    var useData = await data(collection);
    var ret = await useData.updateOne({_id: mongodb.ObjectID(id)}, {$set: rest});
    return ret;
};

exports.getItemById = async (collection, id_or_arr_contain_id, useObjecId = true) =>{
    var useData = await data(collection);
    var param = id_or_arr_contain_id;
    var obj;
    if(useObjecId){
        if(typeof param === 'string'){
            obj = await useData.findOne({_id: mongodb.ObjectID(param)});
        }
        else{
            for (const i in param) {
                param[i] = mongodb.ObjectID(param[i]);                 
            }
            obj = await useData.find({_id: {$in: param}}).toArray();
        }
    }
    else{
        obj = await useData.findOne({_id: param});
    }
    return obj;
};

/* 
vd: limit(50) (mỗi lần xuất ra là 50 item),
limit(50).skip(0) -> xuất ra item số 1 đến 50, tương đương page = 1
limit(50).skip(50) -> xuất ra item 51 đến 100, tương đương page = 2
limit(50).skip(100) -> xuất ra item 101 đến 150, tương đương page = 3
*/
exports.getItems = async (collection, size, page = 1) =>{
    var useData = await data(collection);
    if(size){
        if(typeof size !== 'number'){
            console.warn('size(limit) must be a number')
        }
        else{                       
            var arr = await useData.find()
                    .limit(size).skip(size * (page - 1)).toArray();                
        }
    }
    else{
        var arr = await useData.find().toArray();
    }
    return arr;
};

exports.count = async (collection) =>{
    var useData = await data(collection);
    var ret = await useData.countDocuments();
    return ret;
};

exports.signin = async (collection, obj) =>{
    var useData = await data(collection);
    var ret = await useData.findOne(obj);
    return ret;
};

//Khi sử dụng cookie để request user
exports.getItemByToken = async (collection, token) =>{
    var useData = await data(collection);
    var obj = await useData.findOne({token: token});
    return obj;
};

exports.deleteToken = async (collection, token) =>{
    var useData = await data(collection);
    var ret = await useData.deleteOne({token: token});
    return ret;
};
//-----------------------------------------


exports.getRelatedItems = async (collection, related = {}, not_inclue_id, size, page = 1) =>{
    var useData = await data(collection);
    var arr;
    if(not_inclue_id){
        arr = await useData.find({...related, _id: {$ne: mongodb.ObjectID(not_inclue_id)}}).toArray();
    }
    else{
        if(size){
            arr = await useData.find(related)
            .limit(size).skip(size * (page - 1)).toArray();
        }
        else{
            arr = await useData.find(related).toArray();
        }
    }
    return arr;
}


//------------GROUP---------------
//xài ở ChartController.js
exports.group = async (collection, options = {}) =>{
    var useData = await data(collection);
    var arr = await useData.aggregate([{$group: options}]).toArray();
    return arr;
};
//---------------------------

exports.removeAll = async (collection) =>{
    var useData = await data(collection);
    var ret = await useData.remove();
    return ret;
} 


//------------SORT---------------
exports.sort = async (collection, sort = {}, match = {}) =>{
    var useData = await data(collection);
    if(match){
        var arr = await useData.aggregate([
            {$match: match},
            {$sort: sort}
        ]).toArray();
    }
    else{
        var arr = await useData.aggregate([{$sort: options}]).toArray();
    }    
    return arr;
};