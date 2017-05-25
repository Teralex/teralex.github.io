$(document).ready(function () {
    $(".banner > img").show();
    $(".next").bind({
        click: function () {
            //$(".inv-nav-circle:contains(" + inviteObject.step + ")").addClass('active');
            setStep(this);
        }
    });
    $(".trash").bind({
        mouseenter: function (e) {
            $(".trash img").attr("src", "images/trash.png");
        },
        mouseleave: function (e) {
            $(".trash img").attr("src", "images/trashcan_blue.png");
        },
    });
    $(".pencil").bind({
        mouseenter: function (e) {
            $(".pencil img").attr("src", "images/pencil_white.png");
        },
        mouseleave: function (e) {
            $(".pencil img").attr("src", "images/pencil.png");
        },
    });

    $(".list").niceScroll({cursorwidth: '6px', cursorfixedheight: '50', cursorcolor: "#8c8d8d", cursoropacitymax: '0.4', autohidemode: true, zindex: 999});
    $("#collections #images").niceScroll({cursorwidth: '6px', cursorfixedheight: '50', cursorcolor: "#8c8d8d", cursoropacitymax: '0.4', autohidemode: true, zindex: 999});

   $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });

    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );


    var step = 1;
    function setStep(el) {
        $("#step" + step).removeClass('active').addClass('closed');
        $("#step" + step).find('img').attr("src", "images/arr_down.png");
        ;

        step = Number(el.id.replace(/\D+/g, ""))

        if (step == 2) {
            $('.type2').css({"background": "url(images/GIF_ok9.gif) 100% 100%  no-repeat", "background-size": "cover"});
        }

        $("#step" + step).addClass('active');
        $("#step" + step).find('img').attr("src", "images/active_arr.png");



    }
});