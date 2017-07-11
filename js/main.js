function addMargin() {
    window.scrollTo(0, window.pageYOffset - 100);
}
window.addEventListener('hashchange', addMargin);

var menuIcon = document.querySelector( "#nav-toggle" )
var menu = document.querySelector('.mobile-menu');

var popup = document.getElementById('popup');
var popupInner = document.querySelector('.popup-inner__overlay');



var link = document.querySelector('.link');


function hide(){
    menu.classList.toggle( 'show-menu' );
    console.log('test');
}

menuIcon.addEventListener( 'click', function() {
 menu.classList.toggle( 'show-menu' );
});

// popup__close.addEventListener( 'click', function() {
//     popup.classList.toggle( 'popup-close' ) = !popup.classList.toggle( 'popup-close' );
// });

function showPopup(){
    popup.classList.toggle( 'show-popup' );
}
function showInnerPopup(){
    popupInner.classList.toggle( 'show-popup-inner__overlay' );
}
function hidePopup(){
    popup.classList.toggle('show-popup');
}
function hideInnerPopup(){
     popupInner.classList.toggle('show-popup-inner__overlay');
}