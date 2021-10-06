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


    $("#shopify-section-header nav .list-menu li").bind('click', function (e) {

        var element = $(this);

        if (!$("#shopify-section-header").hasClass('sticky')) {

            e.preventDefault();

            $("html, body").animate({
                scrollTop: 1200
            }, {
                duration: 1100,
                complete: function () {
                    var d = $(element).find('details');
                    $(d).prop('open', true);
                    console.log(d);
                }
            });
        }
        else {
            console.log('normal');
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


