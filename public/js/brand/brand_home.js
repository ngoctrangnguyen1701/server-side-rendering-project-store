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
        var name = this.closest('td').previousElementSibling.previousElementSibling.innerText;
        console.log(name);
        if(confirm(`Are you sure delete ${name}?`)){
            var id_Delete = $(this).attr('value');
            console.log(id_Delete);
            var that = this; //gán thẻ <i> cho biến that
            console.log(this)
            $.post('/brand/delete', {_id: id_Delete}, function(data, status){
                $(that).closest('tr').remove(); 
                console.log($(that));
                
                alert(`You already delete ${name}`)
                console.log(data);
                console.log(status);
                order(); //chạy lại số thứ tự bằng hàm order
            });
        }
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

        if(confirm(`Are you sure delete ${id_Delete.length} brand?`) && id_Delete.length > 0){
            $.post('/brand/delete', {_id: id_Delete}, function(data, status){
                //console.log(data); 
                console.log(status);
                console.log('deletedCount:', data['deletedCount'])
                alert(`You already delete ${data['deletedCount']} brand`);
                
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


    //------------EDIT------------------
    $('.fa-edit').click(function(){
        console.log($(this));
        $(this).toggleClass('far fa-edit');
        $(this).toggleClass('far fa-save');
        
        var edit = this.className == 'far fa-save';
        console.log('edit', edit);

        var id = $(this).attr('value');
        console.log(id); 

        var brandCell = this.parentNode.previousElementSibling;
        brandCell.style.backgroundColor = '';

        var name = brandCell.innerText;
        console.log(name);
        brandCell.contentEditable = edit;

        if(edit){
            brandCell.style.backgroundColor = 'yellow';
        };


        var beforeEdit = $(this).closest('tr').find('.brandName');
        console.log('beforeEdit: ', beforeEdit.val())

        if(beforeEdit.val() !== name){
            if(confirm(`Change ${beforeEdit.val()} => ${name} ?`)){
                $.post('/brand/edit', {_id: id, brand: name}, function(data, status){
                    console.log(status);
                    alert(`Updated: ${beforeEdit.val()} => ${name}`);
                    beforeEdit.val(name);
                });
            }
            else{
                brandCell.innerText = beforeEdit.val();
            }
        }
    })
});


