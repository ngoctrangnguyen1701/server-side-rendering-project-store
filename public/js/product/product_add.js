$(document).ready(function(){
    var line = $('#sheet').html();     
    //console.log(line);

    $('#addLine').click(function () {
        $('#sheet').append(line);
        //console.log($(sheet))
    });

    $('#addManyLine').click(function(){
        var lineNumber = prompt('Input number of line which you want to add?')
        
        if(lineNumber.match(/^[0-9]{1,3}$/)){ //tập hợp các chữ số 0 đến 9, độ dài chuỗi là từ 1 đến 3 kí tự
            for(var i = 0; i < lineNumber; i++){
                $('#sheet').append(line);
            }
        }
        else{
            alert('Input must be a number from 1 to 999');
        }
    });


    var errorRows;
    $('#formAdd').submit(function(e){
        var img = $(formAdd['img']);
        var isImg = $(formAdd['isImg']);
        console.log(img.length);
        console.log(isImg.length);

        for(var i = 0; i < img.length; i++){
            if(img[i]['files'].length < 1){
                //img[i]['files'] = {name: 'null'}; //gán giá trị cho thuộc tính 'files' sẽ bị báo lỗi không convert được
                isImg[i].value = false;
            }
            else{
                isImg[i].value = true;
            }
        }

        //↓↓ kiểm tra giá trị rỗng trước khi gửi tới server
        var message = $('.message');
        var product = $(formAdd['product']);
        var price = $(formAdd['price']);
        var quantity = $(formAdd['quantity']);       
        
        console.log(message.length, product.length, price.length, quantity.length);
        //test xem các mảng có độ dài bằng nhau không

        errorRows = []; //gán giá trị lại cho biến thành array rỗng,
        //vì đã đặt biến ra bên ngoài #formAdd submit
        //nếu không làm vậy thì errorRows.push cứ push thêm vào các dòng lỗi, 
        //và sẽ có trường hợp dòng lỗi được sửa rùi nhưng vẫn còn nằm trong mảng errorRows


        for(var i = 0; i < message.length; i++){
            message[i].style.display = 'none';
            if(product[i].value == '' || price[i].value == '' || quantity[i].value == ''){
                e.preventDefault();
                message[i].style.display = 'block';
                errorRows.push($('.rowMessage')[i], $('.rowInput')[i]);
            }
        }
        console.log('errorRows', errorRows);

        //--> nếu description nào rỗng thì phải gán giá trị mặc định cho nó
        var description = $(formAdd['description']);
        for(var i = 0; i < description.length; i++){
            if(description[i].value == ""){
                description[i].value = 'null';
            }
        }

        //↓↓ sau khi kiểm tra không còn giá trị rỗng
        if(errorRows.length == 0){
            var accept = confirm(`You will add ${message.length} product?`);
            if(accept){}
            else{
                e.preventDefault();
            }
        }
    });

    
    //xóa các dòng rows có error
    $('#btn-delete-rows-errors').click(function(){
        if(confirm('Are you sure delete rows with errors?')){
            console.log('errorRows', errorRows);
            for(var i in errorRows){
            errorRows[i].remove();
            }
        }
    });
})
