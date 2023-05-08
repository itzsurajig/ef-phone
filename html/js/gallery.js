function setUpGalleryData(Images){
    $(".gallery-images").html("");
    if (Images != null) {
        $.each(Images, function(i, image){
            var Element = '<div class="gallery-image"><img src="'+image.image+'" alt="'+image.citizenid+'" class="tumbnail"></div>';
            
            $(".gallery-images").append(Element);
            $("#image-"+i).data('ImageData', image);
        });
    }
}

$(document).on('click', '.tumbnail', function(e){
    e.preventDefault();
    let source = $(this).attr('src')
    // QB.Screen.popUp(source)
    $(".gallery-homescreen").animate({
        left: 30+"vh"
    }, 200);
    $(".gallery-detailscreen").animate({
        left: 0+"vh"
    }, 200);
    SetupImageDetails(source);
});

$(document).on('click', '.image', function(e){
    e.preventDefault();
    let source = $(this).attr('src')
    QB.Screen.popUp(source)
});


$(document).on('click', '#delete-button', function(e){
    e.preventDefault();
    let source = $('.image').attr('src')

    setTimeout(() => {
        $.post('https://ef-phone/DeleteImage', JSON.stringify({image:source}), function(Hashtags){
            setTimeout(()=>{
                $('#return-button').click()
                $.post('https://ef-phone/GetGalleryData', JSON.stringify({}), function(data){
                    setTimeout(()=>{
                            setUpGalleryData(data);
                        
                    },200)
                });
            },200)
        })
        
    }, 200);
});


function SetupImageDetails(Image){
    $('#imagedata').attr("src", Image);
}
let postImageUrl="";
function SetupPostDetails(){
}


$(document).on('click', '#make-post-button', function(e){
    e.preventDefault();
    let source = $('#imagedata').attr('src')
    postImageUrl=source

    // QB.Screen.popUp(source)
    $(".gallery-detailscreen").animate({
        left: 30+"vh"
    }, 200);
    $(".gallery-postscreen").animate({
        left: 0+"vh"
    }, 200);
    SetupPostDetails();
});


$(document).on('click', '#return-button', function(e){
    e.preventDefault();

    $(".gallery-homescreen").animate({
        left: 00+"vh"
    }, 200);
    $(".gallery-detailscreen").animate({
        left: -30+"vh"
    }, 200);
});

$(document).on('click', '#returndetail-button', function(e){
    e.preventDefault();
    returnDetail();
    
});

function returnDetail(){
    $(".gallery-detailscreen").animate({
        left: 00+"vh"
    }, 200);
    $(".gallery-postscreen").animate({
        left: -30+"vh"
    }, 200);
}


$(document).on('click', '#tweet-button', function(e){
    e.preventDefault();
    var TweetMessage = $("#new-textarea").val();
    var imageURL = postImageUrl
    if (TweetMessage != "") {
        var CurrentDate = new Date();
        $.post('https://ef-phone/PostNewTweet', JSON.stringify({
            Message: TweetMessage,
            Date: CurrentDate,
            Picture: QB.Phone.Data.MetaData.profilepicture,
            url: imageURL
        }), function(Tweets){
            QB.Phone.Notifications.LoadTweets(Tweets);
        });
        var TweetMessage = $("#new-textarea").val(' ');
        $.post('https://ef-phone/GetHashtags', JSON.stringify({}), function(Hashtags){
            QB.Phone.Notifications.LoadHashtags(Hashtags)
        })
        // QB.Phone.Animations.TopSlideUp(".twitter-new-tweet-tab", 450, -120);
        returnDetail()
    } else {
        QB.Phone.Notifications.Add("fab fa-twitter", "Twitter", "Fill a message!", "#1DA1F2");
    };
    $('#tweet-new-url').val("");
    $("#tweet-new-message").val("");
});


$(document).on('click', '#advert-button', function(e){
    e.preventDefault();
    var Advert = $("#new-textarea").val();
    let picture = postImageUrl;

    if (Advert !== "") {
        $(".advert-home").animate({
            left: 0+"vh"
        });
        $(".new-advert").animate({
            left: -30+"vh"
        });
        if (!picture){
            $.post('https://ef-phone/PostAdvert', JSON.stringify({
                message: Advert,
                url: null
            }));
            returnDetail()
        }else {
            $.post('https://ef-phone/PostAdvert', JSON.stringify({
                message: Advert,
                url: picture
            }));
            returnDetail()
        }
        $("#new-textarea").val(' ');
    } else {
        QB.Phone.Notifications.Add("fas fa-ad", "Advertisement", "You can\'t post an empty ad!", "#ff8f1a", 2000);
    }
});

