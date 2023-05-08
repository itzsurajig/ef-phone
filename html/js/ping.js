$(document).on('click', '#ping-send', function(e){
    e.preventDefault();
    var IDPlayer = $("#channel").val();
    if (IDPlayer >= 1){
        $.post('https://ef-phone/SendPingPlayer', JSON.stringify({
            id: IDPlayer
        }));
        $("#channel").val("");
    }
});

$(document).on('click', '#ping-accept', function(e){
    e.preventDefault();
    $.post('https://ef-phone/AcceptPingPlayer', JSON.stringify({}));
});

$(document).on('click', '#ping-reject', function(e){
    e.preventDefault();
    $.post('https://ef-phone/rejectPingPlayer', JSON.stringify({}));
});

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "acceptrejectBlock":
                $("#ping-accept").css({"display":"block"});
                $("#ping-reject").css({"display":"block"});
                break;
            case "acceptrejectNone":
                $("#ping-accept").css({"display":"none"});
                $("#ping-reject").css({"display":"none"});
                break;  
        }
    })
});