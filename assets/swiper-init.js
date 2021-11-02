if ($('.swiper-photos').length) {
    var swiper = new Swiper(".swiper-photos", {
        lazy: {
            //  tell swiper to load images before they appear
            loadPrevNext: true,
            // amount of images to load
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
