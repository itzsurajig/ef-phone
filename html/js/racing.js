var OpenedRaceElement = null;

$(document).ready(function(){
    $('[data-toggle="racetooltip"]').tooltip();
});

$(document).on('click', '.racing-race', function(e){
    e.preventDefault();

    var OpenSize = "15vh";
    var DefaultSize = "9vh";
    var RaceData = $(this).data('RaceData');
    var IsRacer = IsInRace(QB.Phone.Data.PlayerData.citizenid, RaceData.RaceData.Racers)

    if (!RaceData.RaceData.Started || IsRacer) {
        if (OpenedRaceElement === null) {
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        } else if (OpenedRaceElement == this) {
            $(this).find('.race-buttons').fadeOut(20);
            $(this).css({"height":DefaultSize});
            OpenedRaceElement = null;
        } else {
            $(OpenedRaceElement).find('.race-buttons').hide();
            $(OpenedRaceElement).css({"height":DefaultSize});
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "The race already started..", "#1DA1F2");
    }
});

function GetAmountOfRacers(Racers) {
    var retval = 0
    $.each(Racers, function(i, racer){
        retval = retval + 1
    });
    return retval
}

function IsInRace(CitizenId, Racers) {
    var retval = false;
    $.each(Racers, function(cid, racer){
        if (cid == CitizenId) {
            retval = true;
        }
    });
    return retval
}

function IsCreator(CitizenId, RaceData) {
    var retval = false;
    if (RaceData.SetupCitizenId == CitizenId) {
        retval = true;
    }
    return retval;
}

function SetupRaces(Races) {
    $(".racing-races").html("");
    if (Races.length > 0) {
        Races = (Races).reverse();
        $.each(Races, function(i, race){
            var Locked = '<i class="fas fa-unlock"></i> Not started yet';
            if (race.RaceData.Started) {
                Locked = '<i class="fas fa-lock"></i> Started';
            }
            var LapLabel = "";
            if (race.Laps == 0) {
                LapLabel = "SPRINT"
            } else {
                if (race.Laps == 1) {
                    LapLabel = race.Laps + " Lap";
                } else {
                    LapLabel = race.Laps + " Laps";
                }
            }
            var InRace = IsInRace(QB.Phone.Data.PlayerData.citizenid, race.RaceData.Racers);
            var Creator = IsCreator(QB.Phone.Data.PlayerData.citizenid, race);
            var Buttons = '<div class="race-buttons"> <div class="race-button" id="join-race" data-toggle="racetooltip" data-placement="left" title="Join"><i class="fas fa-sign-in-alt"></i></div>';
            if (InRace) {
                if (!Creator) {
                    Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Quit"><i class="fas fa-sign-out-alt"></i></div>';
                } else {
                    if (!race.RaceData.Started) {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="start-race" data-toggle="racetooltip" data-placement="left" title="Start"><i class="fas fa-flag-checkered"></i></div><div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Quit"><i class="fas fa-sign-out-alt"></i></div>';
                    } else {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Quit"><i class="fas fa-sign-out-alt"></i></div>';
                    }
                }
            }
            var Racers = GetAmountOfRacers(race.RaceData.Racers);
            var element = '<div class="racing-race" id="raceid-'+i+'"> <span class="race-name"><i class="fas fa-flag-checkered"></i> '+race.RaceData.RaceName+'</span> <span class="race-track">'+Locked+'</span> <div class="race-infomation"> <div class="race-infomation-tab" id="race-information-laps">'+LapLabel+'</div> <div class="race-infomation-tab" id="race-information-distance">'+race.RaceData.Distance+' m</div> <div class="race-infomation-tab" id="race-information-player"><i class="fas fa-user"></i> '+Racers+'</div> </div> '+Buttons+' </div> </div>';
            $(".racing-races").append(element);
            $("#raceid-"+i).data('RaceData', race);
            if (!race.RaceData.Started) {
                $("#raceid-"+i).css({"border-bottom-color":"#34b121"});
            } else {
                $("#raceid-"+i).css({"border-bottom-color":"#b12121"});
            }
            $('[data-toggle="racetooltip"]').tooltip();
        });
    }
}

$(document).ready(function(){
    $('[data-toggle="race-setup"]').tooltip();
});

$(document).on('click', '#join-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('https://ef-phone/IsInRace', JSON.stringify({}), function(IsInRace){
        if (!IsInRace) {
            $.post('https://ef-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: Data.RaceId,
                Joined: true,
            }), function(InDistance){
                if (InDistance) {
                    $.post('https://ef-phone/IsBusyCheck', JSON.stringify({
                        check: "editor"
                    }), function(IsBusy){
                        if (!IsBusy) {
                            $.post('https://ef-phone/JoinRace', JSON.stringify({
                                RaceData: {
                                    ...Data,
                                    RaceId
                                },
                            }));
                            $.post('https://ef-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                                SetupRaces(Races);
                            });
                        } else {
                            QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You're in a editor..", "#1DA1F2");
                        }
                    });
                }
            })
        } else {
            QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You're already in a race..", "#1DA1F2");
        }
    });
});

$(document).on('click', '#quit-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('https://ef-phone/LeaveRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('https://ef-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

$(document).on('click', '#start-race', function(e){
    e.preventDefault();

    
    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('https://ef-phone/StartRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('https://ef-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}


/*Dropdown Menu*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$(document).on('click', '.dropdown .dropdown-menu li', function(e) {
    $.post('https://ef-phone/GetTrackData', JSON.stringify({
        RaceId: $(this).attr('id')
    }), function(TrackData){
        if ((TrackData.CreatorData.charinfo.lastname).length > 8) {
            TrackData.CreatorData.charinfo.lastname = TrackData.CreatorData.charinfo.lastname.substring(0, 8);
        }
        var CreatorTag = TrackData.CreatorData.charinfo.firstname.charAt(0).toUpperCase() + ". " + TrackData.CreatorData.charinfo.lastname;

        $(".racing-setup-information-distance").html('Distance: '+TrackData.Distance+' m');
        $(".racing-setup-information-creator").html('Creator: ' + CreatorTag);
        if (TrackData.Records.Holder !== undefined) {
            if (TrackData.Records.Holder[1].length > 8) {
                TrackData.Records.Holder[1] = TrackData.Records.Holder[1].substring(0, 8) + "..";
            }
            var Holder = TrackData.Records.Holder[0].charAt(0).toUpperCase() + ". " + TrackData.Records.Holder[1];
            $(".racing-setup-information-wr").html('WR: ' + secondsTimeSpanToHMS(TrackData.Records.Time) + ' ('+Holder+')');
        } else {
            $(".racing-setup-information-wr").html('WR: N/A');
        }
    });

    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

$(document).on('click', '#setup-race', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: 0
    }, 300);

    $.post('https://ef-phone/GetRaces', JSON.stringify({}), function(Races){
        if (Races !== undefined && Races !== null) {
            $(".dropdown-menu").html("");
            $.each(Races, function(i, race){
                if (!race.Started && !race.Waiting) {
                    var elem = '<li id="'+race.RaceId+'">'+race.RaceName+'</li>';
                    $(".dropdown-menu").append(elem);
                }
            });
        }
    });
});

$(document).on('click', '#create-race', function(e){
    e.preventDefault();
    $.post('https://ef-phone/IsAuthorizedToCreateRaces', JSON.stringify({}), function(data){
        if (data.IsAuthorized) {
            if (!data.IsBusy) {
                $.post('https://ef-phone/IsBusyCheck', JSON.stringify({
                    check: "race"
                }), function(InRace){
                    if (!InRace) {
                        $(".racing-create").fadeIn(200);
                    } else {
                        QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You're in a race..", "#1DA1F2");
                    }
                });
            } else {
                QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You're already setting up a track..", "#1DA1F2");
            }
        } else {
            QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You don't have rights to make Race Tracks..", "#1DA1F2");
        }
    });
});

$(document).on('click', '#racing-create-accept', function(e){
    e.preventDefault();
    var TrackName = $(".racing-create-trackname").val();

    if (TrackName !== "" && TrackName !== undefined && TrackName !== null) {
        TrackName = DOMPurify.sanitize(TrackName , {
            ALLOWED_TAGS: [], 
            ALLOWED_ATTR: []
        });
        if (TrackName == '') TrackName = 'What are you trying?'
        $.post('https://ef-phone/IsAuthorizedToCreateRaces', JSON.stringify({
            TrackName: TrackName
        }), function(data){
            if (data.IsAuthorized) {
                if (data.IsNameAvailable) {
                    $.post('https://ef-phone/StartTrackEditor', JSON.stringify({
                        TrackName: TrackName
                    }));
                    $(".racing-create").fadeOut(200, function(){
                        $(".racing-create-trackname").val("");
                    });
                } else {
                    QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "This name is not available..", "#1DA1F2");
                }
            } else {
                QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You don't have any rights to create Race Tracks..", "#1DA1F2");
            }
        });
    } else {
        QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You have to enter a track name..", "#1DA1F2");
    }
});

$(document).on('click', '#racing-create-cancel', function(e){
    e.preventDefault();
    $(".racing-create").fadeOut(200, function(){
        $(".racing-create-trackname").val("");
    });
});

$(document).on('click', '#setup-race-accept', function(e){
    e.preventDefault();

    var track = $('.dropdown').find('input').attr('value');
    var laps = $(".racing-setup-laps").val();

    $.post('https://ef-phone/HasCreatedRace', JSON.stringify({}), function(HasCreatedRace){
        if (!HasCreatedRace) {
            $.post('https://ef-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: track,
                Joined: false,
            }), function(InDistance){
                if (InDistance) {
                    if (track !== undefined || track !== null) {
                        if (laps !== "") {
                            $.post('https://ef-phone/CanRaceSetup', JSON.stringify({}), function(CanSetup){
                                if (CanSetup) {
                                    $.post('https://ef-phone/SetupRace', JSON.stringify({
                                        RaceId: track,
                                        AmountOfLaps: laps,
                                    }))
                                    $(".racing-overview").animate({
                                        left: 0+"vh"
                                    }, 300)
                                    $(".racing-setup").animate({
                                        left: -30+"vh"
                                    }, 300, function(){
                                        $(".racing-setup-information-distance").html('Select a Track');
                                        $(".racing-setup-information-creator").html('Select a Track');
                                        $(".racing-setup-information-wr").html('Select a Track');
                                        $(".racing-setup-laps").val("");
                                        $('.dropdown').find('input').removeAttr('value');
                                        $('.dropdown').find('span').text("Select a Track");
                                    });
                                } else {
                                    QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "There can't be any ..", "#1DA1F2");
                                }
                            });
                        } else {
                            QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "Fill in an amount of laps..", "#1DA1F2");
                        }
                    } else {
                        QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You haven't selected a track..", "#1DA1F2");
                    }
                }
            })
        } else {
            QB.Phone.Notifications.Add("fas fa-flag-checkered", "Racing", "You already have a race active..", "#1DA1F2");
        }
    });
});

$(document).on('click', '#setup-race-cancel', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: -30+"vh"
    }, 300, function(){
        $(".racing-setup-information-distance").html('Select a Track');
        $(".racing-setup-information-creator").html('Select a Track');
        $(".racing-setup-information-wr").html('Select a Track');
        $(".racing-setup-laps").val("");
        $('.dropdown').find('input').removeAttr('value');
        $('.dropdown').find('span').text("Select a Track");
    });
});

$(document).on('click', '.racing-leaderboard-item', function(e){
    e.preventDefault();

    var Data = $(this).data('LeaderboardData');

    $(".racing-leaderboard-details-block-trackname").html('<i class="fas fa-flag-checkered"></i> '+Data.RaceName);
    $(".racing-leaderboard-details-block-list").html("");
    $.each(Data.LastLeaderboard, function(i, leaderboard){
        var lastname = leaderboard.Holder[1]
        var bestroundtime = "N/A";
        var place = i + 1;
        if (lastname.length > 10) {
            lastname = lastname.substring(0, 10) + "..."
        }
        if (leaderboard.BestLap !== "DNF") {
            bestroundtime = secondsTimeSpanToHMS(leaderboard.BestLap);
        } else {
            place = "DNF"
        }
        var elem = '<div class="row"> <div class="name">' + ((leaderboard.Holder[0]).charAt(0)).toUpperCase() + '. ' + lastname + '</div><div class="time">'+bestroundtime+'</div><div class="score">'+ place +'</div> </div>';
        $(".racing-leaderboard-details-block-list").append(elem);
    });
    $(".racing-leaderboard-details").fadeIn(200);
});

$(document).on('click', '.racing-leaderboard-details-back', function(e){
    e.preventDefault();

    $(".racing-leaderboard-details").fadeOut(200);
});

$(document).on('click', '.racing-leaderboards-button', function(e){
    e.preventDefault();

    $(".racing-leaderboard").animate({
        left: -30+"vh"
    }, 300)
    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300)
});

$(document).on('click', '#leaderboards-race', function(e){
    e.preventDefault();

    $.post('https://ef-phone/GetRacingLeaderboards', JSON.stringify({}), function(Races){
        if (Races !== null) {
            $(".racing-leaderboards").html("");
            $.each(Races, function(i, race){
                if (race.LastLeaderboard.length > 0) {
                    var elem = '<div class="racing-leaderboard-item" id="leaderboard-item-'+i+'"> <span class="racing-leaderboard-item-name"><i class="fas fa-flag-checkered"></i> '+race.RaceName+'</span> <span class="racing-leaderboard-item-info">Click for more details</span> </div>'
                    $(".racing-leaderboards").append(elem);
                    $("#leaderboard-item-"+i).data('LeaderboardData', race);
                }
            });
        }
    });

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300)
    $(".racing-leaderboard").animate({
        left: 0+"vh"
    }, 300)
});
