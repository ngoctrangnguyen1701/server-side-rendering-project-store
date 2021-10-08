$(document).ready(function(){
    function order() {
        var no = document.querySelectorAll('.no');
        for(var i = 0; i < no.length; i++){
            no[i].innerText = i+1
        };
    };
    
    order(); //chạy số thứ tự bằng hàm order


    //-------------delete One---------------------------
    $('.deleteOne').click(function(){
        var id = $(this).attr('value');
        console.log(id);
        $.get('/product/delete/' + id, function(data, status){           
            $(deleteItem).modal('show');
            //↓↓ bỏ giá trị có được từ data sang thẻ <input> để hiển thị ra
            formDeleteOne['_id'].value = data.product['_id'];
            formDeleteOne['product'].value = data.product['product'];

            for(x of data.arrCategories){
                if(x['_id'] == data.product['cid']){
                    formDeleteOne['category-name'].value = x['category'];
                    break;
                }
            }
            for(y of data.arrBrands){
                if(y['_id'] == data.product['bid']){
                    formDeleteOne['brand-name'].value = y['brand'];
                    break;
                }
            }
            formDeleteOne['price'].value = data.product['price'];
            formDeleteOne['quantity'].value = data.product['quantity'];
            formDeleteOne['description'].value = data.product['description'];

            
            if(data.product['imgUrl']){
                $(deleteItem).find('img').attr('src', `/images/${data.product['imgUrl']}`);
                $(deleteItem).find('img').attr('style', 'display: block');
                $(deleteItem).find('p').attr('style', 'display: none');
            }
            else{
                $(deleteItem).find('img').attr('style', 'display: none'); //để không bị hiển thị hình lỗi
                $(deleteItem).find('p').attr('style', 'display: block; color: grey');
            }
        });
        
    });



    //-----------delete Many----------------------------------------
    $('#form').submit(function(e){
        e.preventDefault(); 
        var id_Delete = [];
        var input_Delete = [];
        for(var i = 0; i < form['_id'].length; i++){
            if(form['_id'][i].checked == true){
                id_Delete.push(form['_id'][i].value); //lấy vaule của những thẻ <input> được tích
                input_Delete.push(form['_id'][i]);
            }
        }

        console.log(id_Delete); 
        console.log(input_Delete); 
        if(confirm(`Are you sure delete ${id_Delete.length} product?`) && id_Delete.length > 0){
            $.post('/product/delete', {_id: id_Delete}, function(data, status){
                console.log('deletedCount:', data['deletedCount'])
                alert(`You already delete ${data['deletedCount']} product`);
                
                //sau khi thành công xóa các dòng <tr> chứa các thẻ <input> trong input_Delete
                for(var x in input_Delete){
                    input_Delete[x].closest('tr').remove();
                };

                order(); //chạy lại số thứ tự bằng hàm order
            })
        }      
    })


    $('.deleteMany').click(function(){
        $('.deleteMany-show').toggle();
    });



    //-------------Edit One---------------------------
    $('.editOne').click(function(){
        var id = $(this).attr('value');
        $.get('/product/edit/' + id, function(data, status){
            $(editItem).modal('show');
            //áp dụng cách chạy vòng lặp cho thẻ <select> nằm trong modal edit khi render ra file product_home
            //↓↓ bỏ giá trị có được từ data sang thẻ <input> để hiển thị ra
            formEditOne['_id'].value = data['_id'];
            formEditOne['product'].value = data['product'];
            formEditOne['cid'].value = data['cid']; 
            formEditOne['bid'].value = data['bid'];
            //vẫn bỏ giá trị cho thẻ <select> để nó vào đúng với cái phần đã chọn trước đó,
            //thông qua thằng giá trị id tương ứng
            formEditOne['price'].value = data['price'];
            formEditOne['quantity'].value = data['quantity'];
            formEditOne['description'].value = data['description'];
            formEditOne['isImg'].value = data['isImg'];
            

            if(data['imgUrl']){
                $(editItem).find('img').attr('src', `/images/${data['imgUrl']}`);
                $(editItem).find('img').attr('style', 'display: block');
                $(editItem).find('p').attr('style', 'display: none');
                $(editItem).find('span').attr('style', 'display: block');
                $('.btn-delete-img').attr('style', 'display: block');
            }
            else{
                $(editItem).find('img').attr('style', 'display: none'); //để không bị hiển thị hình lỗi
                $(editItem).find('p').attr('style', 'display: block; color: grey');
                $(editItem).find('span').attr('style', 'display: none');
                $('.btn-delete-img').attr('style', 'display: none');
            }
        })
    });

    $('.btn-delete-img').click(function(){
        if(confirm('Are you sure delete this image')){
            $(editItem).find('img').attr('style', 'display: none'); //để không bị hiển thị hình lỗi
            $(editItem).find('p').attr('style', 'display: block; color: grey');
            $(editItem).find('span').attr('style', 'display: none');
            $('.btn-delete-img').attr('style', 'display: none');
            formEditOne['isImg'].value = 'false';
        }      
    })
})
