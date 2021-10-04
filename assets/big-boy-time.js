/* here's where we use waypoints */


$(document).ready(function () {



    /* Waypoints --------------------------------------------------------- */

    /* sticky header */
    var StickyHeader = $('#header-top').waypoint(function (direction) {


        if (direction === "down") {
            console.log('add sticky');
            $('#shopify-section-header').addClass('sticky');
        }
        else {
            console.log('remove sticky');
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








    $('#big-boy-footer').bind('click', function () {
        $('#big-boy-footer').toggleClass('up');
    });

    /* ------------------------------------------ */

    /*-- scroll to top ---*/
    $("#totop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});


