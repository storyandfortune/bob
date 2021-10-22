$(document).ready(function () {

    /* disable waypoints on resize, enable & refresh when finished */
    var resizing;

    var setHero = function(){
        if ($('body').hasClass('home-page')) {
            $('.hero-scroll').css('height', (window.innerHeight - 117));
            $(window).scrollTop(0); 
        }
    }

    var endResize = function(){
       Waypoint.enableAll()
       Waypoint.refreshAll();
    }

    var resize = function(){
        setHero();
        Waypoint.disableAll()
        clearTimeout(resizing);
        resizing = setTimeout(endResize, 100);
    }

    setHero();
    
    /* Waypoints --------------------------------------------------------- */
    if ($('body').hasClass('home-page')) {


         // set hero height
         $('.hero-scroll').css('height', (window.innerHeight - 117));

        /* big boy hides */
        var BigBoyHides = $('#big-boy-header').waypoint(function (direction) {

            if (direction === "down") {
                $('#big-boy-header').addClass('hide');
            }
            else {
                $('#big-boy-header').removeClass('hide');
            }

        }, {
            offset: '45%'
        });

        /* Logo hides */
        var BigBoyHides = $('#MainContent').waypoint(function (direction) {

            if (direction === "down") {
                $('#shopify-section-header').addClass('sticky');
            }
            else {
                $('#shopify-section-header').removeClass('sticky');
            }

        }, {
            offset: '15%'
        });


        screen.orientation.addEventListener('change', function() {
            resize();
        });
    
         window.onresize = function(){
            resize();
         };

    }
    
    /* footer big boy coming up */
    var BigBoyBottom = $('#big-boy-footer').waypoint(function (direction) {

        if (direction === "down") {
            $('#big-boy-footer').addClass('up');
        }
        else {
            $('#big-boy-footer').removeClass('up');
        }

    }, {
        offset: 'bottom-in-view'
    });
     
  
    /* forms ------------------------------------ */

    var formsData = function () {

        $("form").removeClass("error");
        $(".data").removeClass("inc");  

        var d = {
            "form": $("h3.title").text().trim(),
            "fields": []
        };

        var post = false;
        var check = 0;

        $.each($('.data'), function (key, value) {
            var v = { "name": "", "value": "" };
            v.name = $(value).attr("name");
            v.value = $(value).val().trim();

            if( $(this).hasClass('required') ){
                if(v.value.length){
                    check++;
                }
                else{
                    $(this).addClass('inc');
                }
            }

            d.fields.push(v);
            delete v;

        });


        if(check === $('.required').length){
            post = true;
        }

        if(post){
            $("form").addClass("complete");
            $(".conformation h3").html("Connecting...");
            $(".conformation p").html("One moment please.");

            $.ajax({
                method: "POST",
                url: "https://mysql.storyandfortune.com/bobs/",
                data: { "data": d }
            }).done(function (msg) {

                m = JSON.parse(msg);
                if (m.message === "success") {
                    // submit --------------------------------------------
                    //console.log(msg);
                    $("form").removeClass("error");
                    $(".data").removeClass("inc");

                    $(".conformation h3").html("Thanks !");
                    $(".conformation p").html("We will be contacting you shortly.");

              
                }
                else {
                    //console.log(msg);
                    $(".conformation h3").html("Opps !");
                    $(".conformation p").html("Something went wrong.");
                }

            });
        }
        else{
          $("form").addClass("error"); 
        }

        $("html, body").animate({ scrollTop: 0 }, "fast");

    }

    $('.data').bind('focus', function(){
        $(this).removeClass('inc');
    });


    if ($(".bob-page-content").hasClass("form")) {

        $('button').bind('click', function (e) {
            e.preventDefault();
            formsData();
        });

    }

    /* -- bind -------------------------------- */

    // scroll to jigger-rig should update admin with the ability to assign id's to sections
    var scrollToID = function (id, e) {

        if ($('body').hasClass('home-page') && !$("#shopify-section-header").hasClass('sticky')) {

            e.preventDefault();

            $("html, body").animate({
                scrollTop: ($(id).offset().top - 117)
            }, {
                duration: 1100
            }).promise().done(function () {

            });;
        }
        else {
            console.log('normal');
        }

        return false;
    }


    // double click go to page.
    $("#shopify-section-header nav .list-menu li").bind('dblclick', function (e) {
        window.location.href = $(this).data('link');
    });


    // scroll to homepage
    $("#shopify-section-header nav .list-menu li.nav-history").bind('click', function (e) {
        scrollToID("#history", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-menus").bind('click', function (e) {
        scrollToID("#menus", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-events").bind('click', function (e) {
        scrollToID("#events", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-photos").bind('click', function (e) {
        scrollToID("#photos", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-shop").bind('click', function (e) {
        var id = $("section[id*='featured_products']");
        scrollToID(id, e);
    });


    // trigger scroll up on big boy click
    $('#big-boy-header').bind('click', function () {
        $("html, body").animate({
            scrollTop: ($("#history").offset().top - 125)
        }, {
            duration: 1100
        });
        return false;
    });

    // toggle big boy hiding
    $('#big-boy-footer').bind('click', function () {
        $('#big-boy-footer').toggleClass('up');
    });

    /*-- scroll to top ---*/
    $("#totop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    // new product media ------------------------------- */
    if($('.new-media').length){

        // switch detail image.
        $('.new-media .product__media-thumb-list li').bind('click', function(){
            var media = $(this).data('src');
            $('.new-media .product_media-detail').data('src', media);
            $('.new-media .product_media-detail img').attr('src', media);
        })
        
        // open modal
        $('.new-media .product_media-detail').bind('click', function(){
            var media = $(this).data('src');
            $('.new-product-modal .product-modal-image').css("background-image", "url(" + media + ")");
            $('html').addClass('modal');
        })

        //close modal
        $('.new-product-modal .close-product').bind('click', function(){
            $('html').removeClass('modal');
        })

   
    }

});


