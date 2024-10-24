$(document).ready(function () {
    
  
    //todo rewrite as objects don't ever do this again.

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
            $('.hero-scroll').css('height', (window.innerHeight - 148));
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

    //setHero();
  
    
    /* Waypoints --------------------------------------------------------- */
    if ($('body').hasClass('home-page')) {

         // set hero height
         $('.hero-scroll').css('height', (window.innerHeight - 148));

        /* big boy hides */
        var BigBoyHides = $('#big-boy-header').waypoint(function (direction) {

            if (direction === "down") {
                $('#big-boy-header').addClass('hide');
                $('.free-shipping').addClass('up');
            }
            else {
                $('#big-boy-header').removeClass('hide');
                $('.free-shipping').removeClass('up');
            }

        }, {
            offset: '35%'
        });
        

        /* Logo hides */
        var bricked = true;
        var LogoHides = $('#MainContent').waypoint(function (direction) {

            if (direction === "down") {
                $('#shopify-section-header').addClass('sticky');
            }
            else {
                $('#shopify-section-header').removeClass('sticky');
                $('#wish-list-drawer').removeClass('on');
            }

        }, {
            offset: logoOffset
        });

        
         window.onresize = function(){
            resize();
         };


    // google analytics click on main nav
    $("#nav .list-menu li").on('click', function (e) {

        var up = $('#shopify-section-header').hasClass('sticky');

    });



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

    }else{
        $('.free-shipping').addClass('up');
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

    var endpointURL;

    if(window.location.hostname === "127.0.0.1"){
        endpointURL = 'http://dev.api/bobs/'
    }
    else{
        endpointURL = 'http://api.storyandfortune.com/bobs/'
    }

    var endpoint = endpointURL + "forms/";

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
                url: endpoint,
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

            }).fail(function(error) {
                console.log(error);
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

    // scroll to 
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


    /* variant_picker --------------------------------- */

    let setVariant = function(radioButtons){
        
        let selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
        let index = selectedIndex;
        let img = $('#variant-switch li[data-indx='+index+'] img').attr('src')

        $('.product_media-detail img').attr('src', img);
    };

    if($('#variant-switch').length){
       let inputName =  $('.variant_picker input').attr('name'); 
       let radioButtons = $(".variant_picker input:radio[name='"+inputName+"']");

       setVariant(radioButtons);

       $('input[type=radio][name='+inputName+']').change(function() {
         setVariant(radioButtons);
       });
       
    }
    

    // new product media ------------------------------- */

    if($('.new-media').length){
        var index = 0;
        var medias = [];
        $( ".new-media .product__media-item" ).each(function(){
            medias.push($(this).data('src'));
        });


        // switch detail image.
        $('.new-media .product__media-thumb-list li').css("cursor", "pointer");
        $('.new-media .product__media-thumb-list li').on('touchstart click', function(){

            index = $(this).data('indx');
            //console.log(index);
            //console.log(medias[index]);
            $('.new-media .product_media-detail').data('src', medias[index]);
            $('.new-media .product_media-detail').data('indx', index);
            $('.new-media .product_media-detail img').attr('src', medias[index]);

        });
        
        if(window.innerHeight > 720){

            // open modal
            $('.new-media .product_media-detail').css("cursor", "pointer");

            $('.new-media .product_media-detail').on('touchstart click', function(){
                //console.log(index);
                var detailImage = $('.new-media .product_media-detail').data('src');
                $('.new-product-modal .product-modal-image').css("background-image", "url(" + detailImage + ")");
                $('html').addClass('modal');
            });

            //close modal
            $('.new-product-modal .close-product').css("cursor", "pointer");

            $('.new-product-modal .close-product').on('touchstart click' , function(){
                $('html').removeClass('modal');
            });

            $('.new-product-modal .nxt-arrw').on('touchstart click' , function(){
                index++;
                if(index >= medias.length){
                    index=0;
                }
                $('.new-product-modal .product-modal-image').css("background-image", "url(" + medias[index] + ")"); 
            });

            $('.new-product-modal .bck-arrw').on('touchstart click' , function(){
                index--;
                if(index < 0){
                    index= medias.length -1;
                }
                $('.new-product-modal .product-modal-image').css("background-image", "url(" + medias[index] + ")");
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

    //in-line products --------------------------------------------- */

    var productMarkup = function(id, title, image, handle){

        const url = document.location.origin;
        const link = url +`/products/`+ handle;
        const html = `<div class="appened-product" role="img" aria-label="`+ title +`"> 
                        <a href="`+ link +`" />
                            <div class="appened-image" style="background-image: url(` + image  + `) " role="img"></div>
                            <div class="title">` + title + `</div> 
                        </a>
                    </div>`;



        $('#'+id).append(html); 
    }
    
    // inline product
    if($('.inline-product').length){

        $('.inline-product').each(function( index ) {

                var handle = this.id;

                var newID = "product-" + Math.floor(Math.random() * 5000);
                $(this).attr("id", newID);

                var apiUrl = document.location.origin + '/collections/all/products/'+ handle +'.json';

                var request = $.ajax({
                    url: apiUrl,
                    method: "GET",
                    dataType: "json"
                });

                request.done(function( json ) {
                    console.log(document.location.origin +`/products/`+ json.product.handle);
                    productMarkup(newID, json.product.title, json.product.image.src, json.product.handle);
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                });

        });

    
    }

    // inline collection
    if($('.inline-collection').length){
        console.log($('.inline-collection'));

        $('.inline-collection').each(function( index ) {

            var handle = this.id;
            var newID = "product-" + Math.floor(Math.random() * 5000);
            $(this).attr("id", newID);

            var apiUrl = document.location.origin + '/collections/'+ handle +'/products.json';
            var maxItems = $(this).data('max-items');
            var max;

            var request = $.ajax({
                url: apiUrl,
                method: "GET",
                dataType: "json"
            });

            request.done(function( json ) {

                if(maxItems > 0){
                    max = maxItems;
                }
                else{
                    max = json.products.length;
                }
                

                for(i=0; i<max; i++){
                    productMarkup(newID, json.products[i].title, json.products[i].images[0].src, json.products[i].handle);
                }
              
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

                productMarkup(id, json.products[rand].title, json.products[rand].images[0].src, json.products[rand].handle);
            
           
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
            });


        });

    }

     // inline random
     if($('.inline-recent-products').length){

        console.log('recent products');

        // inline recent products
        $('.inline-recent-products').each(function( index ) {

                var id = this.id;
                var maxItems = $(this).data('max-items');
                var apiUrl = document.location.origin + '/products.json';
                var max;

                var request = $.ajax({
                    url: apiUrl,
                    method: "GET",
                    dataType: "json"
                });

                request.done(function( json ) {

                    console.log(json);

                    if(maxItems > 0){
                        max = maxItems;
                    }
                    else{
                        max = 9;
                    }

                    for(let i = 0; i < max; i++){
                        productMarkup(id, json.products[i].title, json.products[i].images[0].src, json.products[i].handle);
                    }
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                });


        });

    }

    //HACK!!!! additonal checkout buttons not showing up.
    if($('#dynamic-checkout-cart').length){
        setTimeout(() => {
            $('#dynamic-checkout-cart').removeAttr("style");
        }, 500);
    
    }

    //HACK!!!! empty div
    setTimeout(() => {
       let emptyDiv = $('body > div:first');
       console.log(emptyDiv);
       $('body > div:first').remove();
      }, 5500);


    /// wish list ----------------------------------------------------------
    $(".header .header__icons .header__icon--heart").on('touchstart click', function () {

         // scroll down on home page before opening wishlist if we are in the hero state.
        if($('body').hasClass('home-page')){
            if($('.home-page #shopify-section-header').hasClass('sticky')){
                $('#wish-list-drawer').toggleClass('on');
            }
            else{
                $("html, body" ).animate({
                    scrollTop: ($("#MainContent").offset().top - 120)
                }, 1100, function() {
                
                    $('#wish-list-drawer').addClass('on');

                });
            } 
        }else{
            $('#wish-list-drawer').toggleClass('on');
        }

    });

    let addToWishlist = function(item){
        const event = new CustomEvent("wishlistAddItem", { detail: item });
        window.dispatchEvent(event);
    }

    $(".add-to-wishlist").on('touchstart click', function () {
       let item = {"handle":$(this).data("handle"), "variant":$('input[name=id]').val()};
       $('#wish-list-drawer').addClass('on');
       addToWishlist(item);
    });
    
});