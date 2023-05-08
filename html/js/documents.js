var DocEndtitle = null
var DocEndtext = null
var DocEndid = null
var DocEndcitizenid = null

$(document).on('click', '.documents-tupe-text-btn', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#documents-box-new-add-new').fadeIn(350);
});

$(document).on('click', '#documents-save-note-for-doc', function(e){
    e.preventDefault();
    var Title = $(".documents-input-title").val();
    var Text = $("#documents-textarea").val();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();

    if ((Title &&Text ) != ""){
        $.post('https://ef-phone/documents_Save_Note_As', JSON.stringify({
            Title: Title,
            Text: Text,
            Time: Times,
            Type: "New",
        }));
        ClearInputNew()
        $("#documents-textarea").val("");
        $('#documents-box-new-add-new').fadeOut(350);
    }
});

function LoadGetNotes(){
    $(".documents-list").html("");
    $(".documents-dropdown-menu").html("");
    $(".documents-select span").html("<span>Select a Note</span>");

    var AddOption = '<div class="casino-text-clear">Nothing Here!</div>'+
                    '<div class="casino-text-clear" style="font-size: 500%;color: #0d1218c0;"><i class="fas fa-frown"></i></div>'
    $('.documents-list').append(AddOption);

    $.post('https://ef-phone/GetNote_for_Documents_app', JSON.stringify({}), function(HasNote){
        if(HasNote){
            AddDocuments(HasNote)
        }
    });
}

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "DocumentRefresh":
                LoadGetNotes()
            break;
        }
    })
});

function AddDocuments(data){
    $(".documents-list").html("");
    $(".documents-dropdown-menu").html("");
    $(".documents-select span").html("<span>Select a Note</span>");

    var AddOption = '<div class="casino-text-clear">Nothing Here!</div>'+
                    '<div class="casino-text-clear" style="font-size: 500%;color: #0d1218c0;"><i class="fas fa-frown"></i></div>'
    $('.documents-list').append(AddOption);


    DocEndtitle = null
    DocEndtext = null
    DocEndid = null
    DocEndcitizenid = null

    for (const [k, v] of Object.entries(data)) {
        var firstLetter = v.title.substring(0, 1);  
        var Fulltext = firstLetter.toUpperCase()+(v.title).replace(firstLetter,'')

        var AddOption = '<li id="documents-click-for-data" data-title="'+v.title+'" data-text="'+v.text+'" data-id="'+v.id+'" data-csn="'+v.citizenid+'">'+Fulltext+'</li>';

        $('.documents-dropdown-menu').append(AddOption);
    }
}

$(document).on('click', '#documents-click-for-data', function(e){
    e.preventDefault();
    $(".documents-list").html("");
    DocEndtitle = $(this).data('title')
    DocEndtext = $(this).data('text')
    DocEndid = $(this).data('id')
    DocEndcitizenid = $(this).data('csn')
    
    var AddOption = '<div class="document-body-class-body-main">'+
                        '<div class="document-body-class-title"><b>Title: </b>'+DocEndtitle+'</div>'+
                        '<textarea id="documents-textarea-new" spellcheck="false" required placeholder="Text" maxlength="300">'+DocEndtext+'</textarea>'+
                        '<div class="documents-body-btn-class">'+
                            '<div class="documents-body-btn-one"><i class="fas fa-edit"></i></div>'+
                            '<div class="documents-body-btn-two"><i class="fas fa-trash"></i></div>'+
                        '</div>'+
                    '</div>';

    $('.documents-list').append(AddOption);
});

$('.documents-dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.documents-dropdown-menu').slideToggle(300);
});

$('.documents-dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.documents-dropdown-menu').slideUp(300);
});

$(document).on('click', '.documents-dropdown .documents-dropdown-menu li', function(e) {
    $(this).parents('.documents-dropdown').find('span').text($(this).text());
    $(this).parents('.documents-dropdown').find('input').attr('value', $(this).attr('id'));
});

$(document).on('click', '.documents-body-btn-one', function(e){
    e.preventDefault();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    var NewText = $("#documents-textarea-new").val();
    if(NewText != ""){
        $.post('https://ef-phone/documents_Save_Note_As', JSON.stringify({
            Title: DocEndtitle,
            Text: NewText,
            Time: Times,
            ID: DocEndid,
            CSN: DocEndcitizenid,
            Type: "Update",
        }));
    }
});

$(document).on('click', '.documents-body-btn-two', function(e){
    e.preventDefault();

    $.post('https://ef-phone/documents_Save_Note_As', JSON.stringify({
        ID: DocEndid,
        Type: "Delete",
    }));
});