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

    $(".list").niceScroll({cursorwidth: '6px', cursorfixedheight: '50', cursorcolor: "#e8e8e8", cursoropacitymax: '0.4', autohidemode: true, zindex: 999});
    $("#images").niceScroll({cursorwidth: '6px', cursorfixedheight: '50', cursorcolor: "#e8e8e8", cursoropacitymax: '0.4', autohidemode: true, zindex: 999});

    var step = 1;
    function setStep(el) {
        $("#step" + step).removeClass('active').addClass('closed');
        $("#step" + step).find('img').attr("src", "images/arr_down.png");
        ;

        step = Number(el.id.replace(/\D+/g, ""))

        if (step == 2) {
            $('.type2').css({"background": "url(images/GIF_ok7.gif) 100% 100%  no-repeat", "background-size": "cover"});
        }

        $("#step" + step).addClass('active');
        $("#step" + step).find('img').attr("src", "images/active_arr.png");



    }
});