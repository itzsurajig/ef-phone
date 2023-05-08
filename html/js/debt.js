var ENDreason = null
var ENDamount = null
var ENDsenderCSN = null
var ENDsenderName = null
var ENDKey = null

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "billRefresh":
                LoadbillJob();
            break;
        }
    })
});


function LoadbillJob(){
    $(".bill-list").html("");
    var AddOption = '<div class="casino-text-clear">Nothing Here!</div>'+
                    '<div class="casino-text-clear" style="font-size: 500%;color: #0d1218c0;"><i class="fas fa-frown"></i></div>'
    $('.bill-list').append(AddOption);
    $.post('https://ef-phone/GetHasBills_bill', JSON.stringify({}), function(HasTable){

        if(HasTable){
            AddToDebitList(HasTable)
        }
    });
}

function AddToDebitList(data){
    $(".bill-list").html("");
    if(data){
        for (const [k, v] of Object.entries(data)) {
            var AddOption = '<div class="bill-form-style-body" style="color: whitesmoke;"><i style="color: whitesmoke;" class="fas fa-user"></i> '+v.sender+' | '+
                                '<div style="display: inline; color: #6cac59;"> <i class="fas fa-dollar-sign"></i>'+v.amount+'</div>'+
                                '<div data-key="'+v.id+'" data-senderN="'+v.sender+'" data-reason="'+v.reason+'" data-amount="'+v.amount+'" data-sendercsn="'+v.sendercitizenid+'" class="bill-btn-for-check-data"><i class="fas fa-search-dollar"></i></div>'+
                            '</div>'
            $('.bill-list').append(AddOption);
        }
    }
}

$(document).on('click', '.bill-create-bill-btn', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#bill-box-new-for-add').fadeIn(350);
});

$(document).on('click', '#bill-create-bill-ended', function(e){
    e.preventDefault();
    var ID = $(".bill-input-one").val();
    var Amount = $(".bill-input-two").val();
    var Reason = $(".bill-input-three").val();
    if ((ID && Amount && Reason) != "" && (ID && Amount) >= 1){
        $.post('https://ef-phone/SendBillForPlayer_bill', JSON.stringify({
            ID: ID,
            Amount: Amount,
            Reason: Reason,
        }));
        ClearInputNew()
        $('#bill-box-new-for-add').fadeOut(350);
    }else{
        QB.Phone.Notifications.Add("fas fa-exclamation-circle", "System", "Fields are incorrect")
    }

});



$(document).on('click', '.bill-btn-for-check-data', function(e){
    e.preventDefault();
    ENDreason = $(this).data('reason');
    ENDamount = $(this).data('amount');
    ENDsenderCSN = $(this).data('sendercsn');
    ENDsenderName = $(this).data('sendern');
    ENDKey = $(this).data('key');

    $(".bill-show-one").html('<i style="color: whitesmoke;" class="fas fa-clipboard"></i> '+ENDreason);
    $(".bill-show-two").html('<i class="fas fa-dollar-sign"></i>'+ENDamount);
    $(".bill-show-three").html('<i style="color: whitesmoke;" class="fas fa-user"></i> '+ENDsenderName);

    ClearInputNew()
    $('#bill-box-new-for-accept').fadeIn(350);
});

$(document).on('click', '#bill-create-bill-accept', function(e){
    e.preventDefault();
    var PlyMoney = QB.Phone.Data.PlayerData.money.bank;

    if(PlyMoney >= ENDamount){
        $.post('https://ef-phone/debit_AcceptBillForPay', JSON.stringify({
            id: ENDKey,
            Amount: ENDamount,
            CSN: ENDsenderCSN,
        }));
        ClearInputNew()
        $('#bill-box-new-for-accept').fadeOut(350);
        $('.phone-home-container').click();
    }
});