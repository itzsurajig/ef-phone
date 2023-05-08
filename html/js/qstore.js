var TemplatePassword = "4qxbZ38vpXG6jnCFmQsCdzQ5hcZ9j2dCnfTYnjYWDwgL9KYANzjpx6T6f74MWh2E";
var CurrentApp = null;
var IsDownloading = false;

SetupAppstore = function(data) {
    $(".store-apps").html("");
    $.each(data.StoreApps, function(i, app){
        if (data.PhoneData.InstalledApps[i] == null || data.PhoneData.InstalledApps[i] == undefined) {
            if(app.blockedjobs != QB.Phone.Data.PlayerJob.name){
                var elem = '<div class="storeapp" id="app-'+i+'" data-app="'+i+'"><div class="storeapp-icon"><i class="'+app.icon+'"></i></div><div class="storeapp-title">'+app.title+'</div> <div class="storeapp-creator">'+app.creator+'</div><div class="storeapp-download"><i class="fas fa-download"></i></div></div>'
                $(".store-apps").append(elem);
                app.app = i;
                $("#app-"+i).data('AppData', app);
            }
        } else {
            var elem = '<div class="storeapp" id="app-'+i+'" data-app="'+i+'"><div class="storeapp-icon"><i class="'+app.icon+'"></i></div><div class="storeapp-title">'+app.title+'<span style="font-size: 1vh;"> - Geïnstalleerd</span></div> <div class="storeapp-creator">'+app.creator+'</div><div class="storeapp-remove"><i class="fas fa-trash"></i></div></div>'
            $(".store-apps").append(elem);
            app.app = i;
            $("#app-"+i).data('AppData', app);
        }
    });
}

$(document).on('click', '.storeapp-download', function(e){
    e.preventDefault();

    var AppId = $(this).parent().attr('id');
    var AppData = $("#"+AppId).data('AppData');

    $(".download-progressbar-fill").css("width", "0%");

    CurrentApp = AppData.app;

    if (AppData.password) {
        $(".download-password-container").fadeIn(150);
    }
});

$(document).on('click', '.storeapp-remove', function(e){
    e.preventDefault();

    var AppId = $(this).parent().attr('id');
    var AppData = $("#"+AppId).data('AppData');

    var applicationSlot = $(".phone-applications").find('[data-appslot="'+AppData.slot+'"]');
    $(applicationSlot).html("");
    $(applicationSlot).css({
        "background-color":"transparent"
    });
    $(applicationSlot).prop('title', "");
    $(applicationSlot).removeData('app');
    $(applicationSlot).removeData('placement');

    $(applicationSlot).tooltip("destroy");

    QB.Phone.Data.Applications[AppData.app] = null;

    $.post('https://ef-phone/RemoveApplication', JSON.stringify({
        app: AppData.app
    }));
    setTimeout(function(){
        $.post('https://ef-phone/SetupStoreApps', JSON.stringify({}), function(data){
            SetupAppstore(data); 
        });
    }, 100);
});

$(document).on('click', '.download-password-accept', function(e){
    e.preventDefault();

    var FilledInPassword = $(".download-password-input").val();

    if (FilledInPassword == TemplatePassword) {
        $(".download-password-buttons").fadeOut(150);
        IsDownloading = true;
        $(".download-password-input").attr('readonly', true);

        $(".download-progressbar-fill").animate({
            width: "100%",
        }, 5000, function(){
            IsDownloading = false;
            $(".download-password-input").attr('readonly', false);
            $(".download-password-container").fadeOut(150, function(){
                $(".download-progressbar-fill").css("width", "0%");
            });

            $.post('https://ef-phone/InstallApplication', JSON.stringify({
                app: CurrentApp,
            }), function(Installed){
                if (Installed) {
                    var applicationSlot = $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]');
                    var blockedapp = IsAppJobBlocked(Installed.data.blockedjobs, QB.Phone.Data.PlayerJob.name)
                    if ((!Installed.data.job || Installed.data.job === QB.Phone.Data.PlayerJob.name) && !blockedapp) {
                        $(applicationSlot).css({"background-color":Installed.data.color});
                        var icon = '<i class="ApplicationIcon '+Installed.data.icon+'" style="'+Installed.data.style+'"></i>';
                        if (Installed.data.app == "meos") {
                            icon = '<img src="./img/politie.png" class="police-icon">';
                        }
                        $(applicationSlot).html(icon+'<div class="app-unread-alerts">0</div>');
                        $(applicationSlot).prop('title', Installed.data.tooltipText);
                        $(applicationSlot).data('app', Installed.data.app);
            
                        if (Installed.data.tooltipPos !== undefined) {
                            $(applicationSlot).data('placement', Installed.data.tooltipPos)
                        }
                    }
                    $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]').tooltip();

                    var AppObject = $(".phone-applications").find("[data-appslot='"+Installed.data.slot+"']").find('.app-unread-alerts');

                    if (Installed.data.Alerts > 0) {
                        $(AppObject).html(Installed.data.Alerts);
                        $(AppObject).css({"display":"block"});
                    } else {
                        $(AppObject).css({"display":"none"});
                    }
                    QB.Phone.Data.Applications[Installed.data.app] = Installed.data;

                    setTimeout(function(){
                        $.post('https://ef-phone/SetupStoreApps', JSON.stringify({}), function(data){
                            SetupAppstore(data);
                            $(".download-password-input").attr('readonly', false);
                            $(".download-progressbar-fill").css("width", "0%");
                            $(".download-password-buttons").show();
                            $(".download-password-input").val("");
                        });
                    }, 100);
                }
            });
        });
    }
});

$(document).on('click', '.download-password-deny', function(e){
    e.preventDefault();

    $(".download-password-container").fadeOut(150);
    CurrentApp = null;
    IsDownloading = false;
});