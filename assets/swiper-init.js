

/*  photo slide shows -----------------------------------*/

if ($('.swiper-photos').length) {
    var swiper = new Swiper(".swiper-photos", {
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
        },
        loop: true,
        effect: "fade",
        navigation: {
            nextEl: ".photo-button-next",
            prevEl: ".photo-button-prev",
        },
    });
}


/*  featured product slide shows -----------------------*/

if ($('.swiper-featured').length) {
    var swiper = new Swiper(".swiper-featured", {
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
        },
        loop: true,
        speed: 1000,
        onTransitionEnd: function(swiper){
          swiper.params.speed = 1000;
        },
        onTouchStart: function(swiper){
          swiper.params.speed = 400;
        },
        onTransitionStart: function (swiper) {
          swiper.params.speed = 400;  
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".featured-pagination",
        },
        navigation: {
            nextEl: ".featured-button-next",
            prevEl: ".featured-button-prev",
        },
    });
}