var SelectedCryptoTab = Config.DefaultCryptoPage;
var ActionTab = null;
$(".cryptotab-"+SelectedCryptoTab).css({"display":"block"});
$(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]').addClass('crypto-header-footer-item-selected');

var CryptoData = [];
CryptoData.Portfolio = 0;
CryptoData.Worth = 1000;
CryptoData.WalletId = null;
CryptoData.History = [];

function SetupCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Wallet: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg);" class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg);" class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Value change</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$'+change.PreviousWorth+'</span> to <span style="font-size: 1.3vh;">$'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';

            $(".cryptotab-course-list").append(Element);
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("$"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("$"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function UpdateCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Wallet: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green; font-weight: bolder;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg); "class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg); "class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Value change</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$'+change.PreviousWorth+'</span> to <span style="font-size: 1.3vh;">$'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';

            $(".cryptotab-course-list").append(Element);
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("$"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("$"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function RefreshCryptoTransactions(data) {
    $(".cryptotab-transactions-list").html("");
    if (data.CryptoTransactions.length > 0) {
        data.CryptoTransactions = (data.CryptoTransactions).reverse();
        $.each(data.CryptoTransactions, function(i, transaction){
            var Title = "<span style='color: green; font-weight: bolder;'>"+transaction.TransactionTitle+"</span>"
            if (transaction.TransactionTitle == "Sold" || transaction.TransactionTitle == "Transferred") {
                Title = "<span style='color: red; font-weight: bolder;'>"+transaction.TransactionTitle+"</span>"
            }
            var Element = '<div class="cryptotab-transactions-block"> <i class="fas fa-exchange-alt"></i> <span class="cryptotab-transactions-block-title">'+Title+'</span> <span class="cryptotab-transactions-block-happening">'+transaction.TransactionMessage+'</span></div>';

            $(".cryptotab-transactions-list").append(Element);
        });
    }
}

$(document).on('click', '.crypto-header-footer-item', function(e){
    e.preventDefault();

    var CurrentTab = $(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]');
    var SelectedTab = this;
    var HeaderTab = $(SelectedTab).data('cryptotab');

    if (HeaderTab !== SelectedCryptoTab) {
        $(CurrentTab).removeClass('crypto-header-footer-item-selected');
        $(SelectedTab).addClass('crypto-header-footer-item-selected');
        $(".cryptotab-"+SelectedCryptoTab).css({"display":"none"});
        $(".cryptotab-"+HeaderTab).css({"display":"block"});
        SelectedCryptoTab = $(SelectedTab).data('cryptotab');
    }
});

$(document).on('click', '.cryptotab-general-action', function(e){
    e.preventDefault();

    var Tab = $(this).data('action');

    $(".crypto-action-page").css({"display":"block"});
    $(".crypto-action-page").animate({
        left: 0,
    }, 300);
    $(".crypto-action-page-"+Tab).css({"display":"block"});
    QB.Phone.Functions.HeaderTextColor("black", 300);
    ActionTab = Tab;
});

$(document).on('click', '#cancel-crypto', function(e){
    e.preventDefault();

    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    QB.Phone.Functions.HeaderTextColor("white", 300);
});

function CloseCryptoPage() {
    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    QB.Phone.Functions.HeaderTextColor("white", 300);
}

$(document).on('click', '#buy-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-buy-crypto-input-coins").val();
    var Price = Math.ceil(Coins * CryptoData.Worth);

    if ((Coins !== "") && (Price !== "")) {
        if (QB.Phone.Data.PlayerData.money.bank >= Price) {
            $.post('https://ef-phone/BuyCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    QB.Phone.Data.PlayerData.money.bank = parseInt(QB.Phone.Data.PlayerData.money.bank) - parseInt(Price);
                    QB.Phone.Notifications.Add("fas fa-university", "QBank", "&#36; "+Price+",- has been withdrawn from your balance!", "#badc58", 2500);
                } else {
                    QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough money..", "#badc58", 1500);
                }
            });
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough money..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!", "#badc58", 1500);
    }
});

$(document).on('click', '#sell-crypto', function(e){
    e.preventDefault();
    if(e.handled !== true) {
        e.handled = true;

    var Coins = $(".crypto-action-page-sell-crypto-input-coins").val();
    var Price = Math.ceil(Coins * CryptoData.Worth);

    if ((Coins !== "") && (Price !== "")) {
        if (CryptoData.Portfolio >= parseInt(Coins)) {
            $.post('https://ef-phone/SellCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    QB.Phone.Data.PlayerData.money.bank = parseInt(QB.Phone.Data.PlayerData.money.bank) + parseInt(Price);
                    QB.Phone.Notifications.Add("fas fa-university", "QBank", "&#36; "+Price+",- has been added to your balance!", "#badc58", 2500);
                } else {
                    QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
                }
            });
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!", "#badc58", 1500);
    }
    CloseCryptoPage();
    e.handled = false;
}
});

$(document).on('click', '#transfer-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-transfer-crypto-input-coins").val();
    var WalletId = $(".crypto-action-page-transfer-crypto-input-walletid").val();

    if ((Coins !== "") && (WalletId !== "")) {
        if (CryptoData.Portfolio >= Coins) {
            if (WalletId !== CryptoData.WalletId) {
                $.post('https://ef-phone/TransferCrypto', JSON.stringify({
                    Coins: Coins,
                    WalletId: WalletId,
                }), function(CryptoData){
                    if (CryptoData == "notenough") {
                        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
                    } else if (CryptoData == "notvalid") {
                        QB.Phone.Notifications.Add("fas fa-university", "Crypto", "this Wallet-ID doesn't exist!", "#badc58", 2500);
                    } else {
                        UpdateCryptoData(CryptoData)
                        CloseCryptoPage()
                        QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You transferred "+Coins+",- to "+WalletId+"!", "#badc58", 2500);
                    }
                });
            } else {
                QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You can't transfer to yourself..", "#badc58", 2500);
            }
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!!", "#badc58", 1500);
    }
});

// $(".crypto-action-page-buy-crypto-input-money").keyup(function(){
//     var MoneyInput = this.value
//     $(".crypto-action-page-buy-crypto-input-coins").val((MoneyInput / CryptoData.Worth).toFixed(6));
// }); 


$(".crypto-action-page-buy-crypto-input-coins").keyup(function(){
    var MoneyInput = this.value
    var MoneyAmount = Math.ceil(CryptoData.Worth * MoneyInput)

    $(".crypto-action-page-buy-crypto-input-money").html(MoneyAmount+" Dollars");
});

// $(".crypto-action-page-sell-crypto-input-money").keyup(function(){
//     var MoneyInput = this.value
//     $(".crypto-action-page-sell-crypto-input-coins").val((MoneyInput / CryptoData.Worth).toFixed(6));
// }); 


$(".crypto-action-page-sell-crypto-input-coins").keyup(function(){
    var MoneyInput = this.value
    var MoneyAmount = Math.ceil(CryptoData.Worth * MoneyInput)

    $(".crypto-action-page-sell-crypto-input-money").html(MoneyAmount+" Dollars");
});
