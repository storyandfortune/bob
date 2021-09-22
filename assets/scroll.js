/* here's where we use waypoints */


$(document).ready(function () {

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

});


