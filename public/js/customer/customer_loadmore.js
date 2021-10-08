var page = 1
$('#btn-load-more').click(function(e){
    page++
    console.log('page', page)
    $.get(`/customer/json/${page}`, (data, status) =>{
        console.log(data);
        console.log(status);
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

        if(page >= data['page_number']){
            $('#btn-load-more').hide();
        }
    }); 
})