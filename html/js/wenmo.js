$(document).on('click', '.paytm-send-money-btn', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#paytm-box-new-for-give').fadeIn(350);
});

$(document).on('click', '#paytm-send-money-ended', function(e){
    e.preventDefault();
    var ID = $(".paytm-input-one").val();
    var Amount = $(".paytm-input-two").val();
    var Reason = $(".paytm-input-three").val();
    if ((ID && Amount && Reason) != "" && (ID && Amount) >= 1){
        $.post('https://ef-phone/paytm_givemoney_toID', JSON.stringify({
            ID: ID,
            Amount: Amount,
            Reason: Reason,
        }));
        
        ClearInputNew()
        $('#paytm-box-new-for-give').fadeIn(350);
    }
});

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "ChangeMoney_paytm":
                var date = new Date();
                var Times = date.getHours()+":"+date.getMinutes();
                var AddOption = '<div style="color: '+event.data.Color+';" class="paytm-form-style-body">'+event.data.Amount+'<div class="paytm-time-class-body">'+Times+'</div>'+
                                    '<div style="color: #a8a8a8;">'+event.data.Reason+'</div>'+
                                '</div>'

                    $('.paytm-list').prepend(AddOption);
            break;
        }
    })
});