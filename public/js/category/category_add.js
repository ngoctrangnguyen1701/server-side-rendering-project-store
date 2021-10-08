$(document).ready(function(){
    $('#addOne').submit(function(event){
        if(addOne['category'].value == ''){
            event.preventDefault();
            $(this).find('.message').text('No data')
        }
    });


    $('#formAdd').submit(function(event){
        event.preventDefault();
        var category = formAdd['category'].value;
        console.log(category);
        if(category !== ''){
            var input = `<label style="margin:5px 16px 5px 0">
                        <input name="category" value="${category}" style="margin-right:2px" readonly>
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
        if(addMany['category']){  //nếu có thẻ <input name="category"> thì không có lệnh gì hết, event của form diễn ra theo mặc định
            
        }
        else{
            e.preventDefault();  //ngược lại thì sẽ là ngăn chặn mặc định
            $('#formAdd').find('.message').text('No data');
        }
    });
})



