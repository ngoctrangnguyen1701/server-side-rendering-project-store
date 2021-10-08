function getDitricts(id){
    $(formInput['district']).html(''); 
    $(formConfirm['did']).html('');    

    $.get(`/invoice/dictrict/${id}`, (data) =>{
        //console.log(data);        
        for(var i of data){
            var html = `<option value="${i._id}">${i.name}</option>`;
            $(formInput['district']).append(html);
            $(formConfirm['did']).append(html);            
        }

        //↓↓↓ chạy hàm getWards sau khi đã load dữ liệu các district thành công
        getWards($(formInput['district']).val());
    })
};

function getWards(id){
    $(formInput['ward']).html('');
    $(formConfirm['wid']).html('');
    
    $.get(`/invoice/ward/${id}`, (data) =>{
        //console.log(data);        
        for(var i of data){
            var html = `<option value="${i._id}">${i.name}</option>`;
            $(formInput['ward']).append(html);
            $(formConfirm['wid']).append(html);            
        }        
    })
}; 

getDitricts($(formInput['province']).val());
//console.log($(formInput['province']).val());

/* getWards($(district).val());
console.log($(district).val()); */
// $(district).val() lúc này chưa có giá trị nên hàm getWards sẽ chạy ra mảng rỗng

$(formInput['province']).change(function(){
    var pid = $(this).val();
    console.log('pid: ', pid);
    getDitricts(pid);
});

$(formInput['district']).change(function(){
    var did = $(this).val();
    console.log('did: ', did);
    getWards(did);
});


//---------------KIỂM TRA formInput TRƯỚC KHI BẬT MODAL------------------------------
var information = {};
$(formInput).submit(function(e){
    e.preventDefault();
    var error = $('.error');
    //console.log(error);
    var isError = false;

    for(var i = 0; i < error.length; i++){
        var v = $(error[i]).prev().val();
        //console.log(v);
        $(error[i]).text('');
        if(v == ''){
            $(error[i]).text('Please input your information');
            isError = true;
        }
    }
    if(isError == false){
        $('#modal-report').modal('show');
        $(formInput).addClass('bg-blur-modal');
        $('.your-cart').addClass('bg-blur-modal');

        //thêm dữ liệu vào biến obj information
        information = {
            fullname: $(formInput['fullname']).val(),
            email: $(formInput['email']).val(),
            phone: $(formInput['phone']).val(),
            pid: $(formInput['province']).val(),
            did: $(formInput['district']).val(),
            wid: $(formInput['ward']).val(),
            address: $(formInput['address']).val(),
            note: $(formInput['note']).val(),
            buy: $('#buy-product').text(),
            pay: $('#total').text()         
        }
        console.log('information: ', information);

        //thêm dữ liệu vào formConfirm
        $(formConfirm['fullname']).val(information['fullname']);
        $(formConfirm['email']).val(information['email']);
        $(formConfirm['phone']).val(information['phone']);
        $(formConfirm['pid']).val(information['pid']);        
        $(formConfirm['did']).val(information['did']);        
        $(formConfirm['wid']).val(information['wid']);        
        $(formConfirm['address']).val(information['address']);
        $(formConfirm['note']).val(information['note']);
        
    }
});


//---------------------tạo hiệu ứng làm mờ khi tắt mở modal của formConfirm---------------------
function notBlur(){
    $(formInput).removeClass('bg-blur-modal');
    $('.your-cart').removeClass('bg-blur-modal');
};

$('body').click(notBlur);
//khi click vào thẻ body thì formInput sẽ xóa đi class="bg-blur-modal",
//nhưng khi click vào modal-content, do nó nằm bên trong thẻ body nên hàm click sẽ chạy làm mất class gây mờ
//nên phải chặn sự kiện nổi bọt (lan truyền) khi ckich vào modal-content
$('.modal-content').click(function(e){
    e.stopPropagation();
});

$('.btn-cancel').click(notBlur);

$('#modal-report').keydown(function(e){
    if(e.which == 27){ //27 là số thứ tự keydown của phím Escape
        notBlur();
    }
});


//---------------formConfirm KHI GỬI ĐẾN SERVER------------------------------
$(formConfirm['pid']).attr('disabled', true);  
$(formConfirm['did']).attr('disabled', true);
$(formConfirm['wid']).attr('disabled', true);
//chỉnh cho thẻ <select> không lựa chọn được

$(formConfirm).submit(function(e){
    e.preventDefault();
    $.post('/invoice/checkout', information, (data) =>{
        console.log('post OK');
        console.log(data);
        $('#modal-success').modal('show');
        $('#invoice-detail').attr('href', `/invoice/detail/${data}`);
    })
})


//---------------Quay về trang chủ------------------------------
function returnHome(){
    window.location.href = "/";    
}

$('#modal-success').click(returnHome);
$('#modal-success').keydown(function(e){
    //console.log(e.key);
    //console.log(e.which);
    if(e.which == 27){ //27 là số thứ tự keydown của phím Escape
        returnHome();
    }
})
//do đã viết chặn sự kiện lan truyền của .modal-content ở dòng 118 nên không cần viết lại ở modal success này