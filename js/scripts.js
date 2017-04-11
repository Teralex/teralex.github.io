$(document).ready(function(){

	//Opens "become a partner" form if the URl is naturalint.com/?partner
	if (window.location.search == "?partner") {
		openPartnerForm();
	}


	jQuery.validator.addMethod("validEmail", function(value, element) {
	    if(value == '') 
	        return true;
	    var temp1;
	    temp1 = true;
	    var ind = value.indexOf('@');
	    var str2=value.substr(ind+1);
	    var str3=str2.substr(0,str2.indexOf('.'));
	    if(str3.lastIndexOf('-')==(str3.length-1)||(str3.indexOf('-')!=str3.lastIndexOf('-')))
	        return false;
	    var str1=value.substr(0,ind);
	    if((str1.lastIndexOf('_')==(str1.length-1))||(str1.lastIndexOf('.')==(str1.length-1))||(str1.lastIndexOf('-')==(str1.length-1)))
	        return false;
	    str = /(^[a-zA-Z0-9]+[\._-]{0,1})+([a-zA-Z0-9]+[_]{0,1})*@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,3})$/;
	    temp1 = str.test(value);
	    return temp1;
	}, "Please enter valid email.");

	$.validator.addMethod("valueNotEquals", function(value, element, arg){
		return arg != value;
	}, "This field is required.");


	customForm.lib.domReady(function(){
		customForm.customForms.replaceAll();
	});

	$('.video-list .img, .banner .banner-hold, .visual, .video-poster, .team figure, .benefit-item .img, .uniqe-block .decor, .visual-box .col').each(function() {
		var $el = $(this).find('> img');
		if ($el.length) {
			$(this).css('background-image', 'url(' + $el.attr('src') + ')');
		}
	});

	$('.btn-play').has('span').addClass('type2');

	var beforeOpenFormOffset_ = 0;
	$('.btn-partner').on('click', function(e) {
		e.preventDefault();
		
		if ($('body').is('.opened-partner')) {
			closePartnerForm();
		} else {
			openPartnerForm();
		}
	});

	$('.contact-us-form').on('click', function(e) {
		e.preventDefault();

		if ($('body').is('.opened-partner')) {
			closePartnerForm();
		} else {
			var originText = $(this).parent().parent().find('h3').html(),
				selectElm = $('#lbl-04'),
				container = selectElm.closest('.col'),
				selectionSpan = selectElm.closest('.sel-hold').find('.select-area .center'),
				newOption = selectElm.find('option').filter(function(){
					 return $(this).html().toLowerCase() === originText.toLowerCase()
				});

			openPartnerForm();

			if(newOption.length) {
				selectElm.val(newOption.val());
				selectionSpan.text(newOption.text());
				container.addClass('filled');
				selectElm.click();
			}
		}
	});

	$('#header .partner-form select').on('change', function() {
		if ($(this).val() == '0') {
			$(this).siblings('.select-area').removeClass('text-active').closest('.col').removeClass('filled');
		} else {
			$(this).siblings('.select-area').addClass('text-active').closest('.col').addClass('filled');
		}
	});

	$('#header .partner-form .form-control').on('keyup', function() {
		if ($(this).val().length === 0) {
			$(this).removeClass('text-active').closest('.col').removeClass('filled');
		} else {
			$(this).addClass('text-active').closest('.col').addClass('filled');
		}
	});

	$('#header .btn-menu').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('opened-menu');
		closePartnerForm();
	});

	$('#header .partner-form .btn-close').on('click', function(e) {
		e.preventDefault();
		closePartnerForm();
	});
	fixedMenuOffet();

	$('.fixed-menu a').on('click', function(e) {
		e.preventDefault();
		var $this = $(this);
		goTo($this);
	});

	$('.banner').has('.brand').addClass('with-brand');

	$(window).on('resize', function() {
		partnerFormMaxHeight();

		if ($(window).outerWidth() > 767) {
			closeMobileMenu();
		}
		isMobile();
		checkParallax();
	});

	$(window).on('scroll', function() {
		$(window).scrollTop() > $('#header').outerHeight() ? $('#header .btn-partner').addClass('btn-orange') : $('#header .btn-partner').removeClass('btn-orange');
	});

	$(window).on('load scroll', function(){
		$(window).scrollTop() > ($(window).height()/2 - $('.fixed-menu').outerHeight()/2) ? $('.fixed-menu').removeClass('type2') : $('.fixed-menu').addClass('type2');
	});
	if ($('#menu-01').length) {
		$('body').scrollspy({
			target: '#menu-01',
			offset: function() {
				return $('#header').outerHeight();
			}()
		});
		$('#menu-01').on('activate.bs.scrollspy', function () {
			var activeSection = $(this).find("li.active a").attr("href");

			if ($(activeSection).is(".dark-section")) {
				$('.fixed-menu').addClass('type2');
			} else {
				$('.fixed-menu').removeClass('type2');
			}
		});
	}

	$('.benefit-item .video a.img').on('click', function(e) {
		e.preventDefault();
		var $par = $(this).closest('.video'),
			$video = $(this).siblings('video')[0];

		$par.addClass('playing');
		$video.onended = function() {
			$par.removeClass('playing');
		};
		$video.play();
	});

	$('.join-form .text .btn-clear').on('click', function() {
		$(this).closest('.text').find('input').val('');
		$(this).closest('.text').removeClass('text-focus');
		return false;
	});
	$('.join-form .text .form-control').on('keyup', function () {
		$(this).filter(function () {
			this.value == '' ? $(this).closest('.text').removeClass('text-focus') : $(this).closest('.text').addClass('text-focus');
		});
	});
	$('.join-form .btn-reset').on('click', function(e) {
		$(this).closest('.join-form').removeClass('open-apply').find('.text').removeClass('text-focus');
		$(this).closest('form')[0].reset();
		return false;
	});

	$('.join-form .sel-hold').prev('label').addClass('hidden-lbl');
	
	$('.join-form form').each(function() {
		var $form = $(this);
		
		var validator = $form.validate({
			invalidHandler: function(obj){
				$(this).find('select.required').prev().removeClass('select-error')
				$(this).find('select.error').prev().addClass('select-error');
			},
			highlight: function(element, errorClass, validClass) {
				$(element).addClass(errorClass).removeClass(validClass).parent().addClass().addClass(errorClass).removeClass(validClass);
				$(element).closest('.join-form').addClass(errorClass).removeClass(validClass);
				var error_ = $(element).attr('data-error');
				$(element).attr('placeholder',error_);
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).removeClass(errorClass).addClass(validClass).parent().removeClass(errorClass).addClass(validClass);
				if (validator.numberOfInvalids() == 0){
					$(element).closest('.join-form').removeClass(errorClass).addClass(validClass);
				}
			},
			submitHandler: function(form) {
				console.log(form);
			},
			rules: {
				'name': {
					required: true
				},
				'lastname':{
					required: true
				},
				'phone':{
					required: true,
					pattern: /^[\d-]+$/
				},
				'email': {
					required: true,
					validEmail: true
				}
			}
		});
	});

	$('.statistics .stat-list').appear().on('appear', function(event, $all_appeared_elements) {
		$all_appeared_elements.closest('.statistics').addClass('appeared');
	});

	$('.benefits-block .benefits').appear().on('appear', function(event, $all_appeared_elements) {
		$all_appeared_elements.closest('.benefits-block').addClass('appeared');
	});
	$('.benefits-block .benefits > li').appear().on('appear', function(event, $all_appeared_elements) {
		$all_appeared_elements.addClass('appeared');
	});
	
	$('.testimonials-block .testimonials').appear().on('appear', function(event, $all_appeared_elements) {
		$all_appeared_elements.closest('.testimonials-block').addClass('appeared');
	});

	$('.partner-form .btn-reset').on('click', function() {
		$(this).closest('.partner-form').find('.form-control').removeClass('text-active').closest('.col').removeClass('filled');
		var $el = $(this).closest('.partner-form').find('.select-area').removeClass('text-active').siblings('select');
		$el.closest('.col').removeClass('filled');
		$el.each(function() {
			var $this = $(this);
			$(this).find('option[value="0"]').prop('selected', 'selected');
			$(this).siblings('.select-area').click();
			setTimeout(function() {
				$this.siblings('.select-area').click();
			}, 50);
		});
		$(this).closest('form')[0].reset();
		closePartnerForm();

		return false;
	});
	$('.partner-form form').each(function() {
		var $form = $(this);

		$form.find('.form-control').on('focus', function() {
			$(this).parent().addClass('text-focus');
		}).on('blur', function() {
			$(this).parent().removeClass('text-focus');
		});
		
		var validator = $form.validate({
			errorPlacement: function(error, element){
				if (element.is('select')) {
					error.appendTo(element.closest('.sel-hold').parent());
				} else {
					error.appendTo(element.parent());
				}
			},
			highlight: function(element, errorClass, validClass) {
				$(element).addClass(errorClass).removeClass(validClass).parent().addClass().addClass(errorClass).removeClass(validClass);
				$(element).closest('.partner-form').addClass(errorClass).removeClass(validClass);
				
				if ($(element).is('select')) {
					$(element).siblings('.select-area').addClass(errorClass).removeClass(validClass);
				}
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).removeClass(errorClass).addClass(validClass).parent().removeClass(errorClass).addClass(validClass);
				if ($(element).is('select')) {
					$(element).siblings('.select-area').removeClass(errorClass).addClass(validClass);
				}
				if (validator.numberOfInvalids() == 0){
					$(element).closest('.partner-form').removeClass(errorClass).addClass(validClass);
				}
			},
			submitHandler: function(form) {
				//console.log(form);
				//console.log($(this));
				//console.log($(this.currentForm));
				var contactForm = $(this.currentForm);
				contactForm.after('<p class="sending">Sending...</p>');
				contactForm.hide();
				var myData = new FormData(contactForm[0]);
				//myData.append('position_name', $('[name=position] option:selected', contactForm).text());


				$.ajax({
					url: 'server/contact-new.php',
					//data: $('[name=cv]', $(this.currentForm)).attr('files'),
					data: myData,
					cache: false,
					contentType: false,
					processData: false,
					type: 'POST',
					success: function (data) {
						$('.sending').remove();
						contactForm.prevAll('h3').hide();
						contactForm.replaceWith(data);
						if (typeof window.google_trackConversion != 'undefined') {
							window.google_trackConversion({
								google_conversion_id: 1007895195,
								google_conversion_language: "en",
								google_conversion_format: "3",
								google_conversion_color: "ffffff",
								google_conversion_label: "6zClCNfOuGcQm4XN4AM",
								google_remarketing_only: false
							});
						}
					}

				});


			},
			rules: {
				'name': {
					required: true
				},
				'email': {
					required: true,
					validEmail: true
				},
				'phone':{
					required: true,
					pattern: /^[\d-]+$/
				},
				'category':{
					valueNotEquals: "0"
				}
			}
		});
	});

	$('.testimonials').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
		responsive: [{
			breakpoint: 767,
			settings: {
				arrows: false,
				dots: true
			}
		}]
	});
	$('.list').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		autoplay: true,
		autoplaySpeed: 4000,
		responsive: [{
			breakpoint: 767,
			settings: {
				arrows: false,
			}
		}]
	});
	

	
	$('.benefits .text').dotdotdot({
		watch: true
	});

	function isMobile() {
		if ($(window).width() < 768) {
			$('#footer .list').hide();
			
		} else {
			$('#footer .list').show();
			$('#footer .col h4').removeClass('.open')
		}
	}
	isMobile();

	$('#footer .col h4').on('click', function(){
		if ($(window).width() < 768) {
			$(this).siblings('.list').stop().slideToggle(300).parent('.col').toggleClass('open').siblings('.col').removeClass('open').find('.list').stop().slideUp(300);
		}
	});

	$('.benefits .text, .visual-box .text').dotdotdot({
		watch: true
	});

	if ($('.video-list').length) {
		$('.video-list figure').on('mouseenter', function() {
			$(this).find('video')[0].play();
		}).on('mouseleave', function() {
			$(this).find('video')[0].pause();
		});
	}

	checkParallax();

	$('.banner .btn-play').on('click', function(e) {
		e.preventDefault();

		var popId = $(this).attr('href');
		openFullVideo(popId);
	});
	$('.fullvideo .btn-close').on('click', function(e) {
		e.preventDefault();
		var popId = $(this).closest('.fullvideo').attr('id');
		closeFullVideo(popId);
	});
	$('.fullvideo .btn-control').on('click', function(e) {
		e.preventDefault();
		var $video = $(this).closest('.fullvideo').find('video')[0];

		togglePlayPause($video);
	});
	videos();
});
$(window).on('resize', function() {
	var ix_ = 1;
	$('.statistics .stat-list li').each(function () {
		$(this).removeClass('row-01 row-02 row-03 row-04 row-05');
		if($(this).prev().length && $(this).position().top != $(this).prev().position().top && $(this).removeClass('first-in-row')) {
			$(this).addClass('first-in-row').next();
			ix_++;
		} else{
			$(this).removeClass('first-in-row');
		}
		$(this).addClass('row-0' + ix_);
	});
});
$(window).load(function(){
	var ix_ = 1;
	$(this).removeClass('row-01 row-02 row-03 row-04 row-05');
	$('.statistics .stat-list li').each(function () {
		if($(this).prev().length && $(this).position().top != $(this).prev().position().top) {
			$(this).addClass('first-in-row').next().removeClass('first-in-row');
			ix_++;
		}
		$(this).addClass('row-0' + ix_);
	});
});

function partnerFormMaxHeight() {
	var wh = $(window).outerHeight(),
		hh = $('#header').outerHeight();

	$('#header .partner-form').css('height', (wh - hh));
}

function closeMobileMenu() {
	$('body').removeClass('opened-menu');
}

function openPartnerForm() {
	beforeOpenFormOffset_ = $(window).scrollTop();
	closeMobileMenu();
	$('body').addClass('opened-partner');
	partnerFormMaxHeight();
}
function closePartnerForm() {
	$('body').removeClass('opened-partner');
	goTo(beforeOpenFormOffset_);
}

function fixedMenuOffet() {
	var $el = $('.fixed-menu');
	$el.css('margin-top', -$el.outerHeight()/2);
}

function goTo($el) {
	var href, hh, offsetTop;

	if ($.isNumeric($el)) {
		offsetTop = $el;
	} else {
		href = $el.attr('href');
		hh = $('#header').outerHeight();
		offsetTop = href === "#" ? 0 : $(href).offset().top - hh;
	}
	$('html, body').stop().animate({
		scrollTop: offsetTop
	}, 500);
}

function checkParallax() {
	var s;
	if ($(window).width() > 1024) {
		s = skrollr.init();
	}
}

function openFullVideo(popId) {
	$('body').addClass('fullvideo-opened');
	var $pop = $(popId),
		$video = $pop.find('video')[0];

	$pop.addClass('opened');
	$video.play();
}

function closeFullVideo(popId) {
	var $pop = $('#' + popId),
		$video = $pop.find('video')[0];

	$video.pause();
	$video.currentTime = 0;
	$pop.removeClass('opened');
	$('body').removeClass('fullvideo-opened');
}

function togglePlayPause($video) {
	if ($video.paused || $video.ended) {
		$video.play();
	} else {
		$video.pause();
	}
}

function updateProgressBar(popId) {
	var $pop = $('#' + popId),
		$video = $pop.find('video')[0],
		$progressBar = $pop.find('.progress'),
		percentage = Math.floor((100 / $video.duration) * $video.currentTime);

	$progressBar.find('.value').css('width', percentage + '%');
}

function videos() {
	$('.fullvideo').each(function() {
		var $pop = $(this),
			popId = $pop.attr('id'),
			$video = $pop.find('video')[0];

			$video.addEventListener("playing", function() {
				$pop.addClass('playing').removeClass('ended paused');
			});
			$video.addEventListener("ended", function() {
				$pop.addClass('ended').removeClass('playing paused');
			});
			$video.addEventListener("pause", function() {
				$pop.addClass('paused').removeClass('ended playing');
			});
			$video.addEventListener('timeupdate', function() {
				updateProgressBar(popId);
			}, false);
	});
}

window.comeetInit = function() {
	COMEET.init({
		"token":       "1715C47357355C45C4A17CF9CF9735",
		"company-uid": "71.001",
		"company-name": "Natural Intelligence",
		"color":       "278fe6",
		"font-size":   "13px",
		"thankyou-url": "http://www.naturalint.com/careers"
	});
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "//www.comeet.co/careers-api/api.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'comeet-jsapi'));


/*    --------------------------- */

$(document).ready(function(){
	$( "a.orange" ).each(function() {
		$(this).on("click", function(){
			if($(".applyjob").is(':hidden'))
			{
				$(".applyjob").show();
			}
			else {
				$(".applyjob").hide();
			}
		});
	});



	$('.fancybox-media').fancybox({
		openEffect : 'none',
		closeEffect : 'none',
		prevEffect : 'none',
		nextEffect : 'none',
		arrows : false,
		helpers : {
			media : {}
		}
	});

	$('[data-fancybox-group]').fancybox({
		wrapCSS: 'fancybox-images-gallery',
		padding: 0,
		margin: $(window).width() > 767 ? 50 : [20,10,20,10],
		nextEffect: 'elastic',
		prevEffect: 'elastic',
		helpers:{
			overlay:{
				css:{
					background: 'rgba(0,0,0,.6)'
				}
			}
		}
	});



	var pathfornav = window.location.pathname;
	var pagefornav = pathfornav.split("/").pop();
	$('.tablet-visible').addClass("active");
	// alert(pagefornav);
	if ( pagefornav != 'undefined' ) {

	    $('.main-nav').find(".active.tablet-visible").removeClass("active");
		$('.main-nav').find("." + pagefornav).addClass("active");
	}

});



function successApply(){
	if (typeof window.google_trackConversion != 'undefined') {
		window.google_trackConversion({
			google_conversion_id: 1007895195,
			google_conversion_language : "en",
			google_conversion_format : "3",
			google_conversion_color : "ffffff",
			google_conversion_label : "6zClCNfOuGcQm4XN4AM",
			google_remarketing_only : false
		});
	}
}

function customMessageOn(event, callback) {
	if ("function" == typeof callback) {
		var filterCallback = function (e) {
			e.data && e.data.event == event && callback(e.data.data)
		};
		window.addEventListener ? window.addEventListener("message", filterCallback, !1) : window.attachEvent("onmessage", filterCallback)
	}
}

customMessageOn("comeet.applyForm.success",successApply);

