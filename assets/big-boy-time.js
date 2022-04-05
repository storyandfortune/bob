$(document).ready(function () {

    // shop slug hack -------------------------------------------------
    if($.url('path') === "/shop"){
        window.location.href = "/collections/all"
    }

    /* disable waypoints on resize, enable & refresh when finished */

    var resizing, footerOffset, logoOffset;

    var setOffsets = function(){
        /* mobile offset needs to be different */
        if(Waypoint.viewportWidth() < 990){
            footerOffset = '99%';
            logoOffset = '30%';
        }else{
            footerOffset = 'bottom-in-view';
            logoOffset = '15%';
        }
        
    }

    var setHero = function(){
        
        var top = $(window).scrollTop();
        if ($('body').hasClass('home-page') && !top) {
            $('.hero-scroll').css('height', (window.innerHeight - 117));
            $(window).scrollTop(0); 
        }
        setOffsets();
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
            offset: '35%'
        });
        

        /* Logo hides */
        var LogoHides = $('#MainContent').waypoint(function (direction) {

            if (direction === "down") {
                $('#shopify-section-header').addClass('sticky');
            }
            else {
                $('#shopify-section-header').removeClass('sticky');
            }

        }, {
            offset: logoOffset
        });

        
         window.onresize = function(){
            resize();
         };


         // watch mobile drawer on homepage
         var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.attributeName === "open") {
                  scrollToID("#MainContent");
              }
            });
          });

          
         var element = document.querySelector('#mobile-menu-drawer');
         observer.observe(element, {
            attributes: true //configure it to listen to attribute changes
          });

    }

  
    var BigBoyBottom = $('#big-boy-footer').waypoint(function (direction) {

        if (direction === "down") {
            $('#big-boy-footer').addClass('up');
        }
        else {
            $('#big-boy-footer').removeClass('up');
        }

    }, {
        offset: footerOffset
    });
   
   
    /* forms ------------------------------------ */

    var formsData = function () {

        $("form").removeClass("error");
        $(".data").removeClass("inc");  

        var isMarketing;
        if($(".bob-page-content").hasClass('instagram')){
            isMarketing = 1;
        }else{
            isMarketing = 0;
        }

        var d = {
            "webform":true,
            "form": $("h3.title").text().trim(),
            "marketing":isMarketing,
            "fields": []
        };

        var post = false;
        var check = 0;

        $.each($('.data'), function (key, value) {
            var v = { "name": "", "value": "" };
            // radio
            if($(value).attr("type") === "radio"){
                if( $(value).is(":checked") ){ 
                    v.name = $(value).attr("name");
                    v.value = $(value).val();
                }
            }
            else{
                v.name = $(value).attr("name");
                v.value = $(value).val().trim();
            }
       

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

                console.log(msg);

                try {
                    if (msg.message === "success") {
                        // submit --------------------------------------------
                        $("form").removeClass("error");
                        $(".data").removeClass("inc");
    
                        $(".conformation h3").html("Thanks !");
                        $(".conformation p").html("We will be contacting you shortly.");
    
                    }
                    else {
                        $(".conformation h3").html("Opps !");
                        $(".conformation p").html("Something went wrong.");
                    }

                  } catch (error) {
                    console.log(error);
                    $(".conformation h3").html("Opps !");
                    $(".conformation p").html("Something went wrong.");
                  }

            }).fail(function() {
                $(".conformation h3").html("Opps !");
                $(".conformation p").html("Something went wrong.");
            });
        }
        else{
          $("form").addClass("error"); 
        }

        $("html, body").animate({ scrollTop: 0 }, "fast");

    }

    $('.data').on('focus', function(){
        $(this).removeClass('inc');
    });


    if ($(".bob-page-content").hasClass("form")) {

        $('button').on('click', function (e) {
            e.preventDefault();
            formsData();
        });

    }

    /* -- on -------------------------------- */

    // scroll to jigger-rig should update admin with the ability to assign id's to sections
    var scrollToID = function (id, e) {

        if ($('body').hasClass('home-page') && !$("#shopify-section-header").hasClass('sticky')) {

            if(e){
                 e.preventDefault();
            }

            $("html, body").animate({
                scrollTop: ($(id).offset().top - 117)
            }, {
                duration: 1100
            }).promise().done(function () {

            });
        }
        else {
            console.log('normal');
        }

        return false;
    }
    

    // double click go to page.
    $("#shopify-section-header nav .list-menu li").on('dblclick', function (e) {
        window.location.href = $(this).data('link');
    });

    $("#shopify-section-header nav .list-menu li").css("cursor", "pointer");
    $("#shopify-section-header nav .list-menu li.nav-history").on('touchstart click', function (e) {
        scrollToID("#history", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-menus").on('touchstart click', function (e) {
        scrollToID("#menus", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-events").on('touchstart click', function (e) {
        scrollToID("#events", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-photos").on('touchstart click', function (e) {
        scrollToID("#photos", e);
    });

    $("#shopify-section-header nav .list-menu li.nav-shop").on('touchstart click', function (e) {
        var id = $("section[id*='featured_products']");
        scrollToID(id, e);
    });


    // trigger scroll up on big boy click
    $('#big-boy-header').css("cursor", "pointer");

    $('#big-boy-header').on('touchstart click', function () {

        console.log('big boy clicked');
        $("html, body").animate({
            scrollTop: ($("#MainContent").offset().top - 120)
        }, {
            duration: 1100
        });
        return false;
    });

    // toggle big boy hiding
    $('#big-boy-footer').css("cursor", "pointer");
    $('#big-boy-footer').on('touchstart click', function () {
        $('#big-boy-footer').toggleClass('up');
    });

    /*-- scroll to top ---*/
    $("#totop").css("cursor", "pointer");
    $("#totop").on('touchstart click', function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    // new product media ------------------------------- */
    if($('.new-media').length){

        // switch detail image.
        $('.new-media .product__media-thumb-list li').css("cursor", "pointer");
        $('.new-media .product__media-thumb-list li').on('touchstart click', function(){
            var media = $(this).data('src');
            $('.new-media .product_media-detail').data('src', media);
            $('.new-media .product_media-detail img').attr('src', media);
        });
        
        if(window.innerHeight > 720){

            // open modal
            $('.new-media .product_media-detail').css("cursor", "pointer");
            $('.new-media .product_media-detail').on('touchstart click', function(){
                var media = $(this).data('src');
                $('.new-product-modal .product-modal-image').css("background-image", "url(" + media + ")");
                $('html').addClass('modal');
            });

            //close modal
            $('.new-product-modal .close-product').css("cursor", "pointer");

            $('.new-product-modal .close-product').on('touchstart click' , function(){
                $('html').removeClass('modal');
            });

        }

   
    }

    if( $('.size-details').length ){

        $('.size-details').on('touchstart click', function(){
            $('html').addClass('size-modal');
        });

        //close modal
        $('.new-size-modal .close-product').css("cursor", "pointer");
        $('.new-size-modal .close-product').on('touchstart click' , function(){
            $('html').removeClass('size-modal');
        });
        
    }

    //in-line products
    var productMarkup = function(id, title, image, link){
        console.log('insert product');
        var html = `<a class="appened-product" href="` + link + `" />
                            <div class="appened-image" style="background-image: url(` + image  + `) "></div>
                            <div class="title">` + title + `</div>
                    </a>`;

        $('#'+id).append(html);
    }

    document.location.origin;

    if($('.inline-product').length){

        $('.inline-product').each(function( index ) {

                var id = this.id;
                var apiUrl = document.location.origin + '/collections/all/products/'+ this.id +'.json';

                var request = $.ajax({
                    url: apiUrl,
                    method: "GET",
                    dataType: "json"
                });

                request.done(function( json ) {
                    productMarkup(id, json.product.title, json.product.image.src, document.location.origin +`/products/`+ json.product.handle);
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                });

        });

    
    }

    if($('.inline-collection').length){

        $('.inline-collection').each(function( index ) {

            var id = this.id;
            var apiUrl = document.location.origin + '/collections/'+ this.id +'/products.json';

            var request = $.ajax({
                url: apiUrl,
                method: "GET",
                dataType: "json"
            });

            request.done(function( json ) {
                $.each( json.products, function( index, value ){
                     productMarkup(id, value.title, value.images[0].src, document.location.origin +`/products/`+ value.handle);
                });
           
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
            });

        });

    }


    // inline random
    if($('.inline-random-product').length){

    
        $('.inline-random-product').each(function( index ) {

            var id = this.id;
            var apiUrl = document.location.origin + '/products.json';

            var request = $.ajax({
                url: apiUrl,
                method: "GET",
                dataType: "json"
            });

            request.done(function( json ) {


                let rand = Math.random() * json.products.length;
                rand = Math.floor(rand);

                console.log(json.products[rand]);

                productMarkup(id, json.products[rand].title, json.products[rand].images[0].src, document.location.origin +`/products/`+ json.products[rand].handle);
            
           
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
            });


        });

    }

});