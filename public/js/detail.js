$(formCartAdd).submit(function(e){
    e.preventDefault(); //chặn sự kiện mặc định của thẻ <form> để viết cái post theo ý mình
    var obj = {};
    obj['pid'] = formCartAdd['pid'].value;
    obj['product'] = formCartAdd['product'].value;
    obj['quantity'] = formCartAdd['quantity'].value;
    obj['price'] = formCartAdd['price'].value;
    obj['imgUrl'] = formCartAdd['imgUrl'].value;
   
    $.post('/cart/add', obj, data =>{
        console.log(data);

        //Animation add to cart-----------------------------------
        $('#cart-img').addClass('sendtocart');
        setTimeout(function(){        
            $('#cart-img').removeClass('sendtocart');
            $('#cart').addClass('shake');
            setTimeout(function(){
                $('#cart').removeClass('shake');
                //sau khi hiệu ứng shake chạy xong sau 0.5s thì số lượng giỏ hàng sẽ thay đổi
                $('#num-basket').text(data);
                $('#num-basket').css({
                    "width": "12px",
                    "height": "12px",
                    "font-size": "10px",
                    "border-radius": "50%",
                    "text-align": "center",
                    "line-height": "12px"
                })
            },500)
        },1000)
    });
});
