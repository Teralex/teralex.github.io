/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    jQuery(function () {
        
        jQuery('.leftline').delay(3000).animate({"margin-left": 0}, 3000, 'linear', function () {
            jQuery('.linetext').fadeIn('slow');
        });

    });
});