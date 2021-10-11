$(document).ready(function () {

    /* Waypoints --------------------------------------------------------- */
    if ($('body').hasClass('home-page')) {

        /* sticky header */
        var StickyHeader = $('#header-top').waypoint(function (direction) {

            if (direction === "down") {
                $('#shopify-section-header').addClass('sticky');
            }
            else {
                $('#shopify-section-header').removeClass('sticky');
            }

        });

        /* big boy hides */
        var BigBoyHides = $('#big-boy-header').waypoint(function (direction) {

            if (direction === "down") {
                $('#big-boy-header').addClass('hide');
            }
            else {
                $('#big-boy-header').removeClass('hide');
            }

        }, {
            offset: '65%'
        });
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

        console.log('return forms data');

        $.each($('.data'), function (key, value) {
            console.log($(value).attr("name") + " | " + $(value).val());
        });

    }


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

});


