$(document).ready(function(){
    $('#addOne').submit(function(event){
        if(addOne['brand'].value == ''){
            event.preventDefault();
            $(this).find('.message').text('No data')
        }
    });

    $('#formAdd').submit(function(event){
        event.preventDefault();
        var brand = formAdd['brand'].value;
        console.log(brand);
        if(brand !== ''){
            var input = `<label style="margin:5px 16px 5px 0">
                        <input name="brand" value="${brand}" style="margin-right:2px" readonly>
                        <i class="fas fa-trash-alt"></i>
                    </label>
        `;
            $('.addMany-items').append(input);

            $('.fa-trash-alt').click(function(){
            this.closest('label').remove();
            });
        }
        else{
            $(this).find('.message').text('No data');
        }
    });


    $('#addMany').submit(function(e){
        if(addMany['brand']){  //nếu có thẻ <input name="brand"> thì không có lệnh gì hết, event của form diễn ra theo mặc định
            
        }
        else{
            e.preventDefault();  //ngược lại thì sẽ là ngăn chặn mặc định
            $('#formAdd').find('.message').text('No data');
        }
    });
})



