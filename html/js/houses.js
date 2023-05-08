var SelectedHousesTab = "myhouses";
var CurrentHouseData = {};
var HousesData = {};

$(document).on('click', '.houses-app-header-tab', function(e){
    e.preventDefault();
    var CurrentHouseTab = $("[data-housetab='"+SelectedHousesTab+"']");
    var Data = $(this).data('housetab');

    if (Data !== SelectedHousesTab) {
        $(".house-app-" + $(CurrentHouseTab).data('housetab') + "-container").css("display", "none");
        $(".house-app-" + Data + "-container").css("display", "block");
        $(CurrentHouseTab).removeClass('houses-app-header-tab-selected');
        $("[data-housetab='"+Data+"']").addClass('houses-app-header-tab-selected');
        SelectedHousesTab = Data
    }
});

$(document).on('click', '.myhouses-house', function(e){
    e.preventDefault();

    var HouseData = $(this).data('HouseData');
    CurrentHouseData = HouseData;
    $(".myhouses-options-container").fadeIn(150);
    $(".myhouses-options-header").html(HouseData.label);
});

$(document).on('click', '#myhouse-option-close', function(e){
    e.preventDefault();

    $(".myhouses-options-container").fadeOut(150);
});

function SetupPlayerHouses(Houses) {
    $(".house-app-myhouses-container").html("");
    HousesData = Houses;
    if (Houses.length > 0) {
        $.each(Houses, function(id, house){
            var TotalKeyholders = 0;
            if (house.keyholders !== undefined && house.keyholders !== null) {
                TotalKeyholders = (house.keyholders).length;
            }
            var HouseDetails = '<i class="fas fa-key"></i>&nbsp;&nbsp;' + TotalKeyholders + '&nbsp&nbsp&nbsp&nbsp<i class="fas fa-warehouse"></i>&nbsp;&nbsp;&nbsp;<i class="fas fa-times"></i>';
            if (house.garage.length > 0) {
                HouseDetails = '<i class="fas fa-key"></i>&nbsp;&nbsp;' + TotalKeyholders + '&nbsp&nbsp&nbsp&nbsp<i class="fas fa-warehouse"></i>&nbsp;&nbsp;&nbsp;<i class="fas fa-check"></i>';
            }
            var elem = '<div class="myhouses-house" id="house-' + id + '"><div class="myhouse-house-icon"><i class="fas fa-home"></i></div> <div class="myhouse-house-titel">' + house.label + ' | Tier ' + house.tier + '</div> <div class="myhouse-house-details">' + HouseDetails + '</div> </div>';
            $(".house-app-myhouses-container").append(elem);
            $("#house-" + id).data('HouseData', house)
        });
    }
}

var AnimationDuration = 200;

$(document).on('click', '#myhouse-option-transfer', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys', function(e){
    $(".keys-container").html("");
    if (CurrentHouseData.keyholders !== undefined && CurrentHouseData.keyholders !== null) {
        $.each(CurrentHouseData.keyholders, function(i, keyholder){
            if (keyholder !== null && keyholder !== undefined) {
                var elem;
                if (keyholder.citizenid !== QB.Phone.Data.PlayerData.citizenid) {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span> <div class="house-key-delete"><i class="fas fa-trash"></i></div> </div>';
                } else {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">(Me) ' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span></div>';
                } 
                $(".keys-container").append(elem);
                $('#holder-' + i).data('KeyholderData', keyholder);
            }
        });
    }
    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '.house-key-delete', function(e){
    e.preventDefault();
    var Data = $(this).parent().data('KeyholderData');

    $.each(CurrentHouseData.keyholders, function(i, keyholder){
        if (Data.citizenid == keyholder.citizenid) {
            CurrentHouseData.keyholders.splice(i);
        }
    });

    $.each(HousesData, function(i, house){
        if (house.name == CurrentHouseData.name) {
            HousesData[i].keyholders = CurrentHouseData.keyholders;
        }
    });

    SetupPlayerHouses(HousesData);

    $(this).parent().fadeOut(250, function(){
        $(this).remove();
    });

    $.post('https://ef-phone/RemoveKeyholder', JSON.stringify({
        HolderData: Data,
        HouseData: CurrentHouseData,
    }));
});

function shakeElement(element){
    $(element).addClass('shake');
    setTimeout(function(){
        $(element).removeClass('shake');
    }, 500);
};

$(document).on('click', '#myhouse-option-transfer-confirm', function(e){
    e.preventDefault();
        
    var NewBSN = $(".myhouse-option-transfer-container-citizenid").val();

    $.post('https://ef-phone/TransferCid', JSON.stringify({
        newBsn: NewBSN,
        HouseData: CurrentHouseData,
    }), function(CanTransfer){
        if (CanTransfer) {
            $(".myhouses-options").animate({
                left: 0
            }, AnimationDuration);
        
            $(".myhouse-option-transfer-container").animate({
                left: 35+"vw"
            }, AnimationDuration);

            setTimeout(function(){
                $.post('https://ef-phone/GetPlayerHouses', JSON.stringify({}), function(Houses){
                    SetupPlayerHouses(Houses);
                    $(".myhouses-options-container").fadeOut(150);
                });
            }, 100);
        } else {
            QB.Phone.Notifications.Add("fas fa-home", "Houses", "This is an invalid CSN-number", "#27ae60", 2500);
            shakeElement(".myhouse-option-transfer-container");
            $(".myhouse-option-transfer-container-citizenid").val("");
        }
    });
});

$(document).on('click', '#myhouse-option-transfer-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});
