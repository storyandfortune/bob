/* here's where we use waypoints */


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


    /* -- bind -------------------------------- */

    $(window).on('scroll', function () {
        console.log($(this).scrollTop());
    });

    $("#shopify-section-header nav .list-menu li").bind('click', function () {
        if ($("#shopify-section-header:not(.sticky)")) {
            console.log($('#header-top').position().top);
            $("html, body").animate({ scrollTop: 1200 }, "slow");
            return false;
        }
    });

    $("#shopify-section-header nav .list-menu li").bind('dblclick', function () {
        window.location.href = $(this).data("link");
    });


    $('#big-boy-footer').bind('click', function () {
        $('#big-boy-footer').toggleClass('up');
    });

    /*-- scroll to top ---*/
    $("#totop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });




});


