var imagePreloader = {

    // expose list of images that were created to facilitate the load for unit testing
    // purposes
    images: null,

    /*
     * Preloads an array of image url strings (or a single image url string not in an
     * array). Returns a promise that will resolve to an object who's keys are the image
     * urls strings and values are the Image objects or if a single url string was
     * passed as an argument then resolves to a single Image.
     */
    load: function(imagesToLoad, onLoad) {
        imagePreloader.images = [];

        var resolveAsSingleImage = false;
        if (typeof(imagesToLoad) == "string") {
            if (!imagesToLoad) {
                // Blank image
                setTimeout(onLoad, 20);
            }
            imagesToLoad = [imagesToLoad];
            resolveAsSingleImage = true;
        }

        var results = {};
        var remainingImagesToLoad = imagesToLoad.length;
        for (var i = 0; i < imagesToLoad.length; ++i) {
            (function(src) {
                var image = new Image();
                image.src = src;
                imagePreloader.images.push(image);

                $(image).on("load", function() {
                    results[src] = image;
                    if (--remainingImagesToLoad == 0) {
                        onLoad(resolveAsSingleImage ? image : results);
                    }
                });

                $(image).on("error", function() {
                    onLoad(null);
                });
            })(imagesToLoad[i]);
        }
    }
};

// preload all images so they're ready to be used
function imageURL(path) {
    return path;
}

function getLayerComponents(templateId, imageVariantName, readyCallback)
{
    var imageVariant = null;
    $.ajax({
        url: templateId + ".json",
        dataType : "json",
        success: function (data, textStatus) {
            var product = data;

            imageVariant = null;
            for (var i = 0; i < product.images.length; ++i) {
                if (product.images[i].name == imageVariantName) {
                    imageVariant = product.images[i];
                }
            }
            //console.log(imageVariantName, imageVariant);

            if (imageVariant == null) {
                console.error("Could not find image variant '" + imageVariant
                    + "' for template_id: " + templateId);
                readyCallback(null);
            }

            var imagesToLoad = [];
            if (imageVariant.background) {
                imagesToLoad.push(imageURL(imageVariant.background));
            }
            if (imageVariant.foreground) {
                imagesToLoad.push(imageURL(imageVariant.foreground.image));
            }

            for (var i = 0; i < imageVariant.masks.length; ++i) {
                imagesToLoad.push(imageURL(imageVariant.masks[i].mask));
            }

            imagePreloader.load(imagesToLoad, function(images){
                if (imageVariant.background) {
                    imageVariant.background = images[imageURL(imageVariant.background)];
                }

                if (imageVariant.foreground) {
                    imageVariant.foreground.image =
                        images[imageURL(imageVariant.foreground.image)];
                }

                for (var i = 0; i < imageVariant.masks.length; ++i) {
                    imageVariant.masks[i].mask =
                        images[imageURL(imageVariant.masks[i].mask)];
                }

                readyCallback(imageVariant);
            });
        }
    });
}

// ------------------------------------------------------------------------------------------------------------------ //

function drawImage(ctx, img, fitOrFill, x, y, fitWidth, fitHeight, centre, tx, ty, scale,
                   flipHorizontal, rotationDegrees) {
    if (!img) {
        return;
    }

    ctx.save();
    var hRatio = fitWidth / img.width;
    var vRatio = fitHeight / img.height;
    var ratio = fitOrFill == "fit" ? Math.min(hRatio, vRatio) : Math.max(hRatio, vRatio);

    var w = img.width * ratio * scale;
    var h = img.height * ratio * scale;
    var xoff = Math.round(x + tx + (centre ? ((fitWidth - w) / 2) : 0));
    var yoff = Math.round(y + ty + (centre ? ((fitHeight - h) / 2) : 0));

    ctx.translate(xoff + w / 2, yoff + h / 2); // Set the origin to the center of the image
    if (flipHorizontal) {
        ctx.scale(-1, 1);
    }

    ctx.rotate(rotationDegrees * (Math.PI / 180));
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}

function getScaledEnclosingQuad(canvas, mask) {
    var hRatio = canvas.width / mask.mask.width;
    var vRatio = canvas.height / mask.mask.height;
    var scale = Math.min(hRatio, vRatio);

    var q = mask.enclosing_quadrilateral;

    // flip coord system too as pillow in python is opposite to html5 canvas
    var xoff = (canvas.width - (mask.mask.width * scale)) / 2;
    var yoff = (canvas.height - (mask.mask.height * scale)) / 2;
    var quad = {
        bottom_left: [xoff + q.top_left[0] * scale, yoff + q.top_left[1] * scale],
        bottom_right: [xoff + q.top_right[0] * scale, yoff + q.top_right[1] * scale],
        top_left: [xoff + q.bottom_left[0] * scale, yoff + q.bottom_left[1] * scale],
        top_right: [xoff + q.bottom_right[0] * scale, yoff + q.bottom_right[1] * scale],
    };

    quad.width = Math.abs(quad.bottom_right[0] - quad.top_left[0]);
    quad.height = Math.abs(quad.bottom_right[1] - quad.top_left[1]);

    return quad;
}

var cancelObj = {
    cancelled: false,
    cancel: function() {
        this.cancelled = true;
    }
};
var __readyU = false;
var __readyLC = false;
var result = [];

function loadProductImageLayerComponents() {
    if (!activeDocument.templateId) {
        return;
    }

    if (layerComponentsLoadCancelObj) {
        // cancel any previous load request
        layerComponentsLoadCancelObj.cancel();
    }

    cancelObj.cancelled = false;

    ctrl.loading = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    btx.clearRect(0, 0, canvas.width, canvas.height);
    layerComponents = null;
    userImage = null;

    ////console.log(activeDocument.variant, "SEL");
    __readyU  = false;
    __readyLC = false;
    result = [];

    imagePreloader.load(scope.userImageUrl, onLoadedUserImage);
    getLayerComponents(activeDocument.templateId, activeDocument.variant, onLoadedLayerComponents);
    layerComponentsLoadCancelObj = cancelObj;

    /*
    Promise.all([layerComponentsPromise, userImagePromise]).then(
        function (results) {
            if (cancelObj.cancelled) {
                return;
            }

            if (activeDocument.hasBackImage)
                $(".popup-editor .controls-left").show();
            else
                $(".popup-editor .controls-left").hide();

            if (activeDocument.hasSizeChart)
                $(".popup-editor #size-chart").show();
            else
                $(".popup-editor #size-chart").hide();

            if (activeDocument.hasColors) {
                $(".popup-editor .controls-color .color-menu").empty();
                $(".popup-editor .controls-color").show();
                for (var i = 0; i < activeDocument.colors.length; i++)
                {
                    var el = $('<a class="color"></a>');
                    el.css('background', activeDocument.colors[i]);
                    $(".popup-editor .controls-color .color-menu").append(el);
                }
                $(".popup-editor .controls-color .color-menu a").eq(activeDocument.selectedColor).addClass("selected");
            }
            else
                $(".popup-editor .controls-color").hide();

            layerComponents = results[0];
            userImage = results[1];
            canvas.style.cursor = "move";
            ctrl.loading = false;
            render();

            if (scope.userImageUrl && scope.userImageUrl != "") {
                $(".popup-editor .picture-demo").css("background-image", "url(" + scope.userImageUrl + ")");
                $("#image-name").text(scope.userImageUrl); // TODO: baseurl???
            }
            else
            {
                $(".popup-editor .picture-demo").css("background-image", "none");
                $("#image-name").text("");
            }

            console.log("AAAAA", scope.userImageUrl);

            if (cancelObj == layerComponentsLoadCancelObj) {
                layerComponentsLoadCancelObj = null;
            }
        }, function (err) {
            if (cancelObj.cancelled) {
                return;
            }
            console.log(err);
            errorBar.show(err);

            if (cancelObj == layerComponentsLoadCancelObj) {
                layerComponentsLoadCancelObj = null;
            }
        });
    */
}

function onLoadedLayerComponents(res)
{
    if (res) {
        result[0] = res;
        __readyLC = true;
        checkTemplateReady();
    }
}
function onLoadedUserImage(res)
{
    if (res) {
        result[1] = res;
        __readyU = true;
        checkTemplateReady();
    }
}
function checkTemplateReady()
{
    if (__readyLC && __readyU)
        onTemplateReady(result);
}
function onTemplateReady(results)
{
    console.log(results);

    if (cancelObj.cancelled) {
        return;
    }

    if (activeDocument.hasBackImage)
        $(".popup-editor .controls-left").show();
    else
        $(".popup-editor .controls-left").hide();

    if (activeDocument.hasSizeChart) {
        $(".popup-editor #size-chart").attr("href", activeDocument.hasSizeChart);
        $(".popup-editor #size-chart").show();
    }
    else {
        $(".popup-editor #size-chart").hide();
    }

    if (activeDocument.hasColors) {
        $(".popup-editor .controls-color .color-menu").empty();
        $(".popup-editor .controls-color").show();
        for (var i = 0; i < activeDocument.colors.length; i++)
        {
            var el = $('<a class="color"></a>');
            el.css('background', activeDocument.colors[i]);
            $(".popup-editor .controls-color .color-menu").append(el);
        }
        $(".popup-editor .controls-color .color-menu a").eq(activeDocument.selectedColor).addClass("selected");
    }
    else
        $(".popup-editor .controls-color").hide();

    if (activeDocument.hasSizeChart || activeDocument.hasColors)
        $(".popup-editor .mod-product").show();
    else
        $(".popup-editor .mod-product").hide();

    layerComponents = results[0];
    userImage = results[1];
    canvas.style.cursor = "move";
    ctrl.loading = false;
    render();

    if (scope.userImageUrl && scope.userImageUrl != "") {
        $(".popup-editor .picture-demo").css("background-image", "url(" + scope.userImageUrl + ")");
        $("#image-name").text(scope.userImageUrl); // TODO: baseurl???
    }
    else
    {
        $(".popup-editor .picture-demo").css("background-image", "none");
        $("#image-name").text("");
    }

    ///console.log("AAAAA", scope.userImageUrl);
    if (cancelObj == layerComponentsLoadCancelObj) {
        layerComponentsLoadCancelObj = null;
    }
}

function render() {
    if (!ctrl.loading && layerComponents != null) {
        if (canvas.width == 0 || canvas.height == 0) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            setTimeout(render, 20); // try again shortly when hopefully
            // ng-hide/display:none is removed
            return;
        }

        var w = canvas.width;
        var h = canvas.height;

        btx.clearRect(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);

        if (userImage) {
            for (var i = 0; i < layerComponents.masks.length; ++i) {
                var mask = layerComponents.masks[i];
                drawImage(
                    ctx, mask.mask, "fit", 0, 0, w, h, true, 0, 0, 1, false, 0
                );
                ctx.globalCompositeOperation = "source-in";

                var quad = getScaledEnclosingQuad(canvas, mask);

                var tx = toCanvasCoordinateSystem(scope.translateX);
                var ty = toCanvasCoordinateSystem(scope.translateY);
                drawImage(ctx, userImage, "fill", quad.top_left[0],
                    quad.top_left[1], quad.width, quad.height, true,
                    tx, ty, parseFloat(scope.scale), scope.flipHorizontal,
                    -parseInt(scope.rotationDegrees)
                );

                if (layerComponents.masks.length > 1) {
                    ctx.globalCompositeOperation = "source-over";
                }

                // draw enclosing quad
                if (activeDocument.templateId.indexOf("mug") >= 0) {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = "#575656";
                    ctx.beginPath();
                    ctx.moveTo(quad.bottom_left[0], quad.bottom_left[1]);
                    ctx.lineTo(quad.bottom_right[0], quad.bottom_right[1]);
                    ctx.lineTo(quad.top_right[0], quad.top_right[1]);
                    ctx.lineTo(quad.top_left[0], quad.top_left[1]);
                    ctx.closePath();
                    ctx.strokeWidth = 2;
                    ctx.stroke();
                }
            }
        }

        ctx.globalCompositeOperation = "source-over";
        if (layerComponents.foreground) {
            if (layerComponents.foreground.blend_mode == "multiply") {
                ctx.globalCompositeOperation = "multiply";
                drawImage(ctx, layerComponents.foreground.image, "fit", 0, 0,
                    w, h, true, 0, 0, 1, false, 0);
                ctx.globalCompositeOperation = "source-over";
            } else {
                drawImage(ctx, layerComponents.foreground.image, "fit", 0, 0,
                    w, h, true, 0, 0, 1, false, 0);
            }
        }

        btx.globalCompositeOperation = "source-over";

        drawImage(btx, layerComponents.background, "fit", 0, 0, w, h, true, 0,
            0, 1, false, 0);

        if (layerComponents.color_overlay) {
            btx.globalCompositeOperation="source-in";
            btx.fillStyle=scope.colorOverlay;
            btx.fillRect(0, 0, w, h);
        };
    }
}

function initCanvasSize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    background.width = canvas.offsetWidth;
    background.height = canvas.offsetHeight;
    render();
}

function toPrintImageCoordinateSystem(coord) {
    var quad = getScaledEnclosingQuad(canvas, layerComponents.masks[0]);
    var scale = layerComponents.asset_size.width / quad.width;
    return Math.round(scale * coord);
}

function toCanvasCoordinateSystem(coord) {
    var quad = getScaledEnclosingQuad(canvas, layerComponents.masks[0]);
    var scale = quad.width / layerComponents.asset_size.width;
    return Math.round(scale * coord);
}


var ctrl = {};
ctrl.dragging = false;
var lastClientX = 0;
var lastClientY = 0;

ctrl.onMouseMove = function(event) {
    if (layerComponents == null) return;

    if (ctrl.dragging) {
        var canvasDx = event.clientX - lastClientX;
        var canvasDy = event.clientY - lastClientY;

        // convert canvas dx, dy to unscaled product image coordinate system
        var productDx = toPrintImageCoordinateSystem(canvasDx);
        var productDy = toPrintImageCoordinateSystem(canvasDy);

        scope.translateX = parseInt(scope.translateX) + productDx;
        scope.translateY = parseInt(scope.translateY) + productDy;
        lastClientX = event.clientX;
        lastClientY = event.clientY;

        render();
    }
};

ctrl.onMouseDown = function(event) {
    if (layerComponents == null) return;
    ctrl.dragging = true;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
};

ctrl.onMouseUp = function(event) {
    if (layerComponents == null) return;
    ctrl.dragging = false;
};

ctrl.onToggleSideClick = function(event) {
    scope.flipHorizontal = !scope.flipHorizontal;
    render();
    $event.preventDefault();
};

ctrl.onButtonRotateClick = function(event) {
    if (scope.flipHorizontal)
        scope.rotationDegrees = (scope.rotationDegrees - 90) % 360;
    else
        scope.rotationDegrees = (scope.rotationDegrees + 90) % 360;
    render();
    $event.preventDefault();
};

ctrl.onResetTX = function(event) {
    scope.translateX = 0;
    render();
    $event.preventDefault();
};

ctrl.onResetTY = function(event) {
    scope.translateY = 0;
    render();
    $event.preventDefault();
};

ctrl.onScaleChange = function(event){
    scope.scale = event.data.value;
    render();
};

ctrl.onScalePlusClick = function($event) {
    slider.noUiSlider.set(+slider.noUiSlider.get() + 0.05);
    $event.preventDefault();
    scope.scale = slider.noUiSlider.get();
    render();
};

ctrl.hideColorMenu = function(){
    $(".popup-editor .controls-color .color-menu").hide();
};
ctrl.showColorMenu = function($event) {
    $event.preventDefault();
    $(".popup-editor .controls-color .color-menu").toggle();
};
/*ctrl.showSizeChart = function($event) {
    $event.preventDefault();
    window.open(activeDocument.hasSizeChart);
};*/
ctrl.tabsClickChange = function($event) {
    $event.preventDefault();

    $(this).closest(".tabs").find("li").removeClass("active");
    $(this).closest("li").addClass("active");

    $(this).closest(".tabs-container").find(".tab-page").hide();
    $("#page-" + $(this).attr("id")).show();
};

ctrl.changeColorClick = function($event) {
    ctrl.hideColorMenu();
    $event.preventDefault();
    var toSetIndex = $(this).index();
    if (toSetIndex == activeDocument.selectedColor)
        return;

    $(".popup-editor .controls-color .color-menu a").removeClass("selected");
    $(".popup-editor .controls-color .color-menu a").eq(toSetIndex).addClass("selected");

    activeDocument.selectedColor = toSetIndex;
    activeDocument.selectedVariant = activeDocument.variants[toSetIndex];
    activeDocument.templateId = activeDocument.selectedVariant.template_id;

    if (activeDocument.selectedVariant.color)
        scope.colorOverlay = activeDocument.selectedVariant.color;

    loadProductImageLayerComponents();

};

ctrl.changeSideClick = function($event) {
    $(".popup-editor .controls-left div").removeClass("selected");
    $(this).addClass("selected");
    var toSide = $(this).attr("class").indexOf("back") >= 0 ? "back" : "front";
    if (toSide !== activeDocument.side)
    {
        for (var k in activeDocument[activeDocument.side]) if (activeDocument[activeDocument.side].hasOwnProperty(k))
            activeDocument[activeDocument.side][k] = scope[k];

        activeDocument.side = toSide;
        activeDocument.variant = activeDocument.selectedVariant.image_variants[toSide === "front" ? 0 : 1];

        for (var k in activeDocument[activeDocument.side]) if (activeDocument[activeDocument.side].hasOwnProperty(k))
            scope[k] = activeDocument[activeDocument.side][k];

        slider.noUiSlider.set(scope.scale);
        loadProductImageLayerComponents();
    }
};

ctrl.onScaleMinusClick = function($event) {
    $event.preventDefault();

    slider.noUiSlider.set(+slider.noUiSlider.get() - 0.05);
    scope.scale = slider.noUiSlider.get();
    render();
};

var layerComponents = null;
var userImage = null;
var layerComponentsLoadCancelObj = null;
var background = null;
var canvas = null;
var ctx = null;
var btx = null;
var slider = null;

var scope = {
    templateId: null,
    variant: null,

    userImageUrl: null,
    colorOverlay: null,
    scale: 1,
    flipHorizontal: false,
    rotationDegrees: 0,

    // translateX, translateY are values in the product print image coord system
    // NOT the canvas coord system.
    translateX: 0,
    translateY: 0
};

var activeDocument = null;

function showDocument(doc, details, side)
{
    $(".popup-editor").show();

    activeDocument = doc;
    activeDocument.side = side;

    activeDocument.colors = [];
    activeDocument.variants = [];

    //console.log(details.variants);

    activeDocument.hasColors = details.variants[0].color !== null;

    for (var i = 0; i < details.variants.length; i++) {
        if (details.variants[i].is_cover === false)
            continue;

        if (activeDocument.hasColors) {
            if (activeDocument.colors.indexOf(details.variants[i].color) < 0) {
                activeDocument.colors.push(details.variants[i].color);
                activeDocument.variants.push(details.variants[i]);
            }
        }
    }

    var selectedVariant = null;
    for (var i = 0; i < details.variants.length; i++)
    {
        if (details.variants[i].is_cover === false)
            continue;

        if (activeDocument.variant === null)
        {
            selectedVariant = details.variants[i];
            activeDocument.variant = details.variants[i].image_variants[0];
            break;
        }

        if (activeDocument.variant === details.variants[i].image_variants[0])
        {
            selectedVariant = details.variants[i];
            break;
        }
    }

    activeDocument.selectedVariant = selectedVariant;
    activeDocument.templateId = activeDocument.selectedVariant.template_id;
    activeDocument.hasBackImage = selectedVariant.back_image_variant != null;
    activeDocument.hasSizeChart = (selectedVariant.meta && selectedVariant.meta.size_chart_url) ? selectedVariant.meta.size_chart_url : null;

    if (activeDocument.hasColors) {
        activeDocument.selectedColor = activeDocument.colors.indexOf(selectedVariant.color);
        //console.log(activeDocument.colors, activeDocument.selectedColor);
    }

    if (selectedVariant.color)
        scope.colorOverlay = selectedVariant.color;

    for (var k in doc[side]) if (doc[side].hasOwnProperty(k))
        scope[k] = doc[side][k];

    slider.noUiSlider.set(scope.scale);

    $(".popup-editor .controls-left div").removeClass("selected");
    $(".popup-editor .controls-left .control-" + activeDocument.side).addClass("selected");
    loadProductImageLayerComponents();
}

$(function() {
    background = $("canvas")[0];
    canvas = $("canvas")[1];
    ctx = canvas.getContext("2d");
    btx = background.getContext("2d");
    slider = document.getElementById("editor-slider");
    noUiSlider.create(slider, {
        'start': 1,
        'orientation': 'vertical',
        'connect': [false, true],
        'direction': 'rtl',
        'step': 0.05,
        'range': {
            'min': 0.05,
            'max': 2
        }
    });
    slider.noUiSlider.on('slide', function(){
        ctrl.onScaleChange({data:{value: slider.noUiSlider.get()}});
    });

    var connect = slider.querySelectorAll('.noUi-connect');
    var classes = ['c-1-color', 'c-2-color'];
    for ( var i = 0; i < connect.length; i++ )
        connect[i].classList.add(classes[i]);

    initCanvasSize();
    $(window).on("resize", initCanvasSize);

    $("#image-editor-canvas-foreground").on("mousemove", ctrl.onMouseMove);
    $("#image-editor-canvas-foreground").on("mousedown", ctrl.onMouseDown);
    $("#image-editor-canvas-foreground").on("mouseup", ctrl.onMouseUp);

    $(".scale-plus").on("click", ctrl.onScalePlusClick);
    $(".scale-minus").on("click", ctrl.onScaleMinusClick);

    $("#action-rotate").on("click", ctrl.onButtonRotateClick);
    $("#action-mirror").on("click", ctrl.onToggleSideClick);
    $("#action-center-h").on("click", ctrl.onResetTX);
    $("#action-center-v").on("click", ctrl.onResetTY);

    $(".popup-editor .controls-left div").on("click", ctrl.changeSideClick);
    $(".popup-editor .controls-color .color-menu").on("click", "a", ctrl.changeColorClick);
    $(".popup-editor .color-control").on("click", ctrl.showColorMenu);

    $(".popup-editor .product-advanced .tabs a").on("click", ctrl.tabsClickChange);

    $("#newimg").on("change", function($event){
        if (ctrl.onFileChanged)
            ctrl.onFileChanged(this);
    });
    //$("#size-chart").on("click", ctrl.showSizeChart);

    $("#popup-editor-close").on("click", function($event){
        $event.preventDefault();
        $(".popup-editor").hide();
        if (ctrl.onDocumentCancelled !== null)
            ctrl.onDocumentCancelled();
    });

    $("#product-save").on("click", function($event){
        $event.preventDefault();
        if (ctrl.onDocumentSaved !== null)
            ctrl.onDocumentSaved();
    });

    $(".popup-editor .controls a").hover(function($event){
        $("#control-tooltip").show();
        $("#control-tooltip").text($(this).attr("title"));
        $("#control-tooltip").css("left", Math.round($(this).position().left + $(this).width()/2 - $("#control-tooltip").width()/2) + "px");
    }, function($event){
        $("#control-tooltip").hide();
    });
});