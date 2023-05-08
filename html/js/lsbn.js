
LoadLSBNEvent = function() {
    var PlayerJob = QB.Phone.Data.PlayerData.job.name;
    if (PlayerJob == "reporter"){
        $(".lsbn-send-news-for-chat").css({"display":"block"});
    } else {
        $(".lsbn-send-news-for-chat").css({"display":"none"});
    }

    $(".lsbn-list").html("");
    $.post('https://ef-phone/GetLSBNchats', JSON.stringify({}));
}

$(document).on('click', '.lsbn-send-news-for-chat', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#lsbn-box-new-add-text').fadeIn(350);
});

$(document).on('click', '#lsbn-submit-to-send-text', function(e){
    e.preventDefault();

    var Text = $(".lsbn-input-yek").val();
    var Image = $(".lsbn-input-doo").val();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getHours()+":"+date.getMinutes();

    if((Text && Image) != ""){
        $.post('https://ef-phone/Send_lsbn_ToChat', JSON.stringify({
            Type: "Image",
            Text: Text,
            Image: Image,
            Time: Times,
        }));
        ClearInputNew()
        $('#lsbn-box-new-add-text').fadeOut(350);
    }else if (Text != ""){
        $.post('https://ef-phone/Send_lsbn_ToChat', JSON.stringify({
            Type: "Text",
            Text: Text,
            Time: Times,
        }));
        ClearInputNew()
        $('#lsbn-box-new-add-text').fadeOut(350);
    }
});

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "AddNews":
                AddNewsLSBN(event.data.data)
            break;
        }
    })
});


AddNewsLSBN = function(data) {
    for (const [k, v] of Object.entries(data)) {
        if(v.Type == "Text"){
            var AddOption = '<div class="lsbn-chat-style-main">'+v.Text+
                                '<div class="lsbn-chat-time-style">'+v.Time+'</div>'
                            '</div>';

            $('.lsbn-list').prepend(AddOption);
        }else if(v.Type == "Image"){
            var AddOption = '<div class="lsbn-chat-style-main">'+
                                '<img class="lsbn-chat-to-image-style" src="'+v.Image+'">'+
                                '<div>'+v.Text+'</div>'+
                                '<div class="lsbn-chat-time-style">'+v.Time+'</div>'+
                            '</div>';

            $('.lsbn-list').prepend(AddOption);
        }
    }
}

$(document).on('click','.lsbn-chat-to-image-style', function (){
    let source = $(this).attr('src')
    QB.Screen.popUp(source);
});