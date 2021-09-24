if ($('.swiper-container').length) {
    var swiper = new Swiper(".swiper-container", {
        lazy: {
            //  tell swiper to load images before they appear
            loadPrevNext: true,
            // amount of images to load
            loadPrevNextAmount: 2,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
