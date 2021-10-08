var page = 1;
var page_number = 2; 
// cho đại page_number 1 số nào đó lớn hơn page để page_number không bị undefined
$(window).scroll(function(){
    //console.log('--------------------------------------------');
    //console.log('$(window).scrollTop()', $(window).scrollTop());
    //console.log('$(window).height()', $(window).height());
    //console.log('$(document).height()', $(document).height());
    
    //page < page_number   : để khi page lớn hơn page_number thì sẽ ngưng chạy câu lệnh trong điều kiện
    if(page < page_number && $(window).scrollTop() + $(window).height() >= $(document).height()){
        page++;
        console.log('page', page);
        $.get(`/customer/json/${page}`, (data, status) =>{
            console.log(data);
            console.log(status);
            page_number = data['page_number']; //gán lại giá trị cho biến page_number bằng số trang lấy được từ phía server
            console.log('page_number', page_number);
            for(var i of data['arr']){
                $(sheet).append(`<tr>
                                    <td style="display: none;">${i._id}</td>
                                    <td>${i.id}</td>
                                    <td>${i.fn}</td>
                                    <td>${i.ln}</td>
                                    <td>${i.eml}</td>
                                    <td>${i.tel}</td>
                                    <td>${i.strt}</td>
                                    <td>${i.cty}</td>
                                    <td>${i.stat}</td>
                                    <td>${i.zipc}</td>
                                </tr>`)
            }
        })
    }
})
    