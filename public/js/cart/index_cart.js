var order = $(formOrder['order']);
//console.log(order);


//-----------------CHỌN SELECT ALL-------------------------
function selectAll(a){
    //console.log(order);
    if(a.checked){
        for(var i = 0; i < order.length; i++){
            order[i].checked = true;
        }
    }
    else{
        for(var i = 0; i < order.length; i++){
            order[i].checked = false;
        }
    }
    total(); //sau khi chạy hàm selectAll() thì chạy lại hàm total();
};


//-----------------TOTAL-------------------------
function total(b){
    var sum = 0;
    var buy = 0;
    for (let i = 0; i < order.length; i++) {
        if(order[i].checked){            
            var amount = $(order[i]).closest('tr').find('.amount').text();
            var quantity_buy = $(order[i]).closest('tr').find('.quantity').val();
            //console.log(amount, quantity_buy);

            sum += parseInt(amount);
            buy += parseInt(quantity_buy);
        }        
    }
    console.log('sum: ', sum, 'buy: ', buy);
    //$(total).text(sum); 
    //nếu gọi id 'total' theo tên biến như thế này thì sẽ bị trùng với tên function 'total',
    //khiến cho hàm total sẽ bị lặp lại hoài
    $('#total').text(sum);
    $(formOrder['pay']).val(sum);
    $('#buy-product').text(buy);
    $(formOrder['buy']).val(buy);

    //nếu bỏ tích thẻ <input> check box nào đó
    //console.log(b);
    if(b){
        if(b.checked == false){        
            $(formOrder['all'])[0].checked = false;            
        };
    }
    
    //nếu không chọn sản phẩm nào hết
    if(sum == 0){
        $('#btn-check-out').css({display: "none"})
    }
    else{
        $('#btn-check-out').css({display: "block"})
    }
}
total(); //chạy hàm total() khi load trang web


//-----------------THAY ĐỔI QUANTITY-------------------------
$('.quantity').change(function(){
    var quantity = parseFloat($(this).val());
    console.log('quantity', quantity);
    if(quantity % parseInt(quantity) !== 0 || quantity < 1 || quantity > 20){
        //quantity không chia hết cho parseInt của chính nó, hoặc nhỏ hơn 1, hoặc lớn hơn 20
        alert('Quantity must be integer (1 ~ 20)');
    }
    else{
        var id = $(this).closest('tr').find('.id').val();
        console.log('id: ', id);

        var amount = $(this).closest('tr').find('.amount');
        var price = $(this).closest('tr').find('.price').text();

        $.post('/cart/edit', {_id: id, quantity: quantity}, data =>{
            amount.text(eval(quantity * price));
            $('#num-basket').text(data);
            total(); //chạy lại hàm total()
        })
    }  
});


//-----------------XÓA ITEM-------------------------
$('.fa-trash').click(function(){
    var name = $(this).closest('tr').find('.name').text();
    console.log('name: ', name);

    var id = $(this).closest('tr').find('.id').val();
    console.log('id: ', id);
    if(confirm(`Are you delete ${name}?`)){
        $.post('/cart/delete', {_id: id}, data =>{
            console.log(data);
            alert(`Deleted ${name}`);
            location.reload();
        })
    }
});


//kiểm tra giá trị quantity trước khi nhấn check out
$('#btn-check-out').click(function(e){
    for(var i = 0; i < $('.quantity').length; i++){
        var quantity = parseFloat($($('.quantity')[i]).val());
        if(quantity % parseInt(quantity) !== 0 || quantity < 1 || quantity > 20){            
            alert('Quantity must be integer (1 ~ 20)');
            e.preventDefault();
        }
    }
});



