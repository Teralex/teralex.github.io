$(document).ready(function () {
    $(".banner > img").show();
    $(".next").bind({
        click: function () {
            //$(".inv-nav-circle:contains(" + inviteObject.step + ")").addClass('active');
            setStep(this);
        }
    });
    var step = 1;
    function setStep(el) {
        $("#step" + step).removeClass('active').addClass('closed');
        $("#step" + step).find('img').attr("src", "images/arr_down.png");
        ;

        step = Number(el.id.replace(/\D+/g, ""))

        $("#step" + step).addClass('active');
        $("#step" + step).find('img').attr("src", "images/active_arr.png");
        ;
    }
});