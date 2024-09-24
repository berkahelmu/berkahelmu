// namo_default.js

var closeBtnImgs = "./nep_image/pubtree_popup_close.png";

function PubtreeHyperlink(href, target) {
    setTimeout(function () {
        console.log('PubtreeHyperlink : url - ', href)
        window.location.href = href;
    }, 500);
}

function PubtreePopupPosition(caller, targetid, position) {
    // caller location and size information.
    var callerRect = caller.getBoundingClientRect();
    if (!callerRect.width) callerRect.width = callerRect.right - callerRect.left + 1;
    if (!callerRect.height) callerRect.height = callerRect.bottom - callerRect.top + 1;

    // Target size information.
    var targetRect = {};
    targetRect.width = $('#' + targetid).css('width').replace(/[^-\.0-9]/g, '');
    targetRect.height = $('#' + targetid).css('height').replace(/[^-\.0-9]/g, '');

    var leftPadding = $('#' + targetid).css('padding-left').replace(/[^-\.0-9]/g, '');
    var rightPadding = $('#' + targetid).css('padding-right').replace(/[^-\.0-9]/g, '');
    var topPadding = $('#' + targetid).css('padding-top').replace(/[^-\.0-9]/g, '');
    var bottomPadding = $('#' + targetid).css('padding-bottom').replace(/[^-\.0-9]/g, '');
    var leftMargin = $('#' + targetid).css('margin-left').replace(/[^-\.0-9]/g, '');
    var rightMargin = $('#' + targetid).css('margin-right').replace(/[^-\.0-9]/g, '');
    var topMargin = $('#' + targetid).css('margin-top').replace(/[^-\.0-9]/g, '');
    var bottomMargin = $('#' + targetid).css('margin-bottom').replace(/[^-\.0-9]/g, '');
    var leftBorder = $('#' + targetid).css('border-left-width').replace(/[^-\.0-9]/g, '');
    var rightBorder = $('#' + targetid).css('border-right-width').replace(/[^-\.0-9]/g, '');
    var topBorder = $('#' + targetid).css('border-top-width').replace(/[^-\.0-9]/g, '');
    var bottomBorder = $('#' + targetid).css('border-bottom-width').replace(/[^-\.0-9]/g, '');

    targetRect.width = parseInt(targetRect.width) + parseInt(leftPadding) + parseInt(rightPadding) + parseInt(leftBorder) + parseInt(rightBorder);
    targetRect.height = parseInt(targetRect.height) + parseInt(topPadding) + parseInt(bottomPadding) + parseInt(topBorder) + parseInt(bottomBorder);

    // Set a target position.
    switch (position) {
        case 'tl': targetRect.top = callerRect.top - targetRect.height - parseInt(topMargin); targetRect.left = callerRect.left - parseInt(leftMargin); break;
        case 'tc': targetRect.top = callerRect.top - targetRect.height - parseInt(topMargin); targetRect.left = callerRect.left + ((callerRect.width - targetRect.width) / 2) - parseInt(leftMargin); break;
        case 'tr': targetRect.top = callerRect.top - targetRect.height - parseInt(topMargin); targetRect.left = callerRect.left + callerRect.width - targetRect.width - parseInt(leftMargin); break;

        case 'bl': targetRect.top = callerRect.top + callerRect.height - parseInt(topMargin); targetRect.left = callerRect.left - leftMargin; break;
        case 'bc': targetRect.top = callerRect.top + callerRect.height - parseInt(topMargin); targetRect.left = callerRect.left + ((callerRect.width - targetRect.width) / 2) - parseInt(leftMargin); break;
        case 'br': targetRect.top = callerRect.top + callerRect.height - parseInt(topMargin); targetRect.left = callerRect.left + callerRect.width - targetRect.width - parseInt(leftMargin); break;

        case 'lt': targetRect.left = callerRect.left - targetRect.width - parseInt(leftMargin); targetRect.top = callerRect.top - parseInt(topMargin); break;
        case 'lm': targetRect.left = callerRect.left - targetRect.width - parseInt(leftMargin); targetRect.top = callerRect.top + ((callerRect.height - targetRect.height) / 2) - parseInt(topMargin); break;
        case 'lb': targetRect.left = callerRect.left - targetRect.width - parseInt(leftMargin); targetRect.top = callerRect.top + callerRect.height - targetRect.height - parseInt(topMargin); break;

        case 'rt': targetRect.left = callerRect.left + callerRect.width - parseInt(leftMargin); targetRect.top = callerRect.top - parseInt(topMargin); break;
        case 'rm': targetRect.left = callerRect.left + callerRect.width - parseInt(leftMargin); targetRect.top = callerRect.top + ((callerRect.height - targetRect.height) / 2) - parseInt(topMargin); break;
        case 'rb': targetRect.left = callerRect.left + callerRect.width - parseInt(leftMargin); targetRect.top = callerRect.top + callerRect.height - targetRect.height - parseInt(topMargin); break;

        case '1q': targetRect.top = callerRect.top - targetRect.height - parseInt(topMargin); targetRect.left = callerRect.left + callerRect.width - parseInt(leftMargin); break;
        case '2q': targetRect.top = callerRect.top - targetRect.height - parseInt(topMargin); targetRect.left = callerRect.left - targetRect.width - parseInt(leftMargin); break;
        case '3q': targetRect.top = callerRect.top + callerRect.height - parseInt(topMargin); targetRect.left = callerRect.left - targetRect.width - parseInt(leftMargin); break;
        case '4q': targetRect.top = callerRect.top + callerRect.height - parseInt(topMargin); targetRect.left = callerRect.left + callerRect.width - parseInt(leftMargin); break;

        default: return null;  // use current position.
    }

    var scrollFix = {
        top: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
        left: (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft
    };

    var htmlFix = {
        top: Math.abs(parseFloat($(document).find("html").css("top"))),
        left: Math.abs(parseFloat($(document).find("html").css("left")))
    };

    targetRect.top += scrollFix.top;
    targetRect.left += scrollFix.left;
    if (!isNaN(htmlFix.top)) targetRect.top += htmlFix.top;
    if (!isNaN(htmlFix.left)) targetRect.left += htmlFix.left;

    /* top, left 이 마이너스 일때 0 으로 고정 */
    if (targetRect.top < 1) targetRect.top = 0;
    if (targetRect.left < 1) targetRect.left = 0;

    return targetRect;
}

function getViewportSize(key){
	var returnData = {
		"width":null,
		"height":null
	};
	var viewport = $("meta[name='viewport']").length > 0 ? $("meta[name='viewport']").attr("content") : false;
	if(viewport){
		viewport = viewport.split(",");
		for(var i = 0; i < viewport.length; i++){
			var token = $.trim(viewport[i]).split("=");
			if(token[0] == "width")
				returnData.width = token[1];
			else if(token[0] == "height")
				returnData.height = token[1];
		}
	}

	if(returnData.width == null && returnData.height == null){
		returnData.width = $(window).width();
		returnData.height = $(window).height();
	}

	return key && key != "" ? eval("returnData."+key) : returnData;
}

function PubtreePopupLayer(caller, targetid, action, position, closeBtn, fullLayer) {
    var target = document.getElementById(targetid);
    NAPopupLayer.closeAllPopupLayer(target);

    // Whitespace removed and converted to lowercase.
    action = action.replace(/ /g, '').toLowerCase();
    position = position.replace(/ /g, '').toLowerCase();

    // Target current state.
    var isVisible = !$(target).hasClass("nac_display_none");

    // Adjust toggle action.
    action = (action == "toggle") ? (isVisible ? "hide" : "show") : action;
    if (action == "show" || action == "display") {
        var rect = PubtreePopupPosition(caller, targetid, position);
        if (rect != null) {
            $(target).css({
                "position": "absolute",
                "left": rect.left,
                "top": rect.top
            });
        }

        var hasCloseButton = closeBtn != undefined ? closeBtn : false;
        var isFullscreen = fullLayer != undefined ? fullLayer : false;
        if (isFullscreen)
            hasCloseButton = true;

        var fixs = $("meta[name='viewport']").length < 1 ? "fixed" : "absolute";
        var fixs_w = $("meta[name='viewport']").length < 1 ? $(window).width() : getViewportSize("width");
        var fixs_h = $("meta[name='viewport']").length < 1 ? $(window).height() : getViewportSize("height");

        if (isFullscreen) {
            $('#' + targetid).css({
                "position": fixs,
                "top": "0px",
                "left": "0px",
                "width": fixs_w,
                "height": fixs_h,
                "box-sizing": "border-box",
                "overflow": "auto"
            });
        }

        if (hasCloseButton && $(target).find(".pp_closeBtn").length < 1) {
            var closeBtnObj = $("<img\>").addClass("pp_closeBtn").css({
                "position": isFullscreen ? fixs : "absolute",
                "top": "10px",
                "left": parseFloat($(target).width()) - 60,
                "z-index": isFullscreen ? parseInt($(target).css("z-index")) + 1 : 1,
                "cursor": "pointer"
            }).attr({
                "src": closeBtnImgs,
                "onclick": "PubtreePopupLayer(this, '" + targetid + "', 'hide', '" + position + "')"
            });
            closeBtnObj.appendTo($(target));
        }
        NAPopupLayer.openPopupLayer(target);
    }
    else if (action == "hide" || action == "hidden") {
        NAPopupLayer.closePopupLayer(target);
    }

    var event = window.event || PubtreePopupLayer.caller.arguments[0];
    event.stopPropagation();
}

function getHandler(targetid){
	var returnObj = null;
	$(".pubtree_popup_layer").each(function(){
		if($(this).attr("onclick") && $(this).attr("onclick").indexOf(targetid) != -1||$(this).attr("ondblclick") && $(this).attr("ondblclick").indexOf(targetid) != -1
			||$(this).attr("onmouseover") && $(this).attr("onmouseover").indexOf(targetid) != -1||$(this).attr("onmouseout") && $(this).attr("onmouseout").indexOf(targetid) != -1){
			returnObj = $(this).get(0);
			return false;
		}
	});

	return returnObj;
}

function PubtreePopupSetup(targetid, position, closeBtn, fullLayer){
	var $closeBtn = closeBtn != undefined ? closeBtn : false;
	var $fullLayer = fullLayer != undefined ? fullLayer : false;
	var fixs = $("meta[name='viewport']").length < 1 ? "fixed" : "absolute";
	var fixs_w = $("meta[name='viewport']").length < 1 ? $(window).width() : getViewportSize("width");
	var fixs_h = $("meta[name='viewport']").length < 1 ? $(window).height() : getViewportSize("height");

	if($fullLayer) $closeBtn = true;
	if($fullLayer){
		$('#' + targetid).attr("data-pubtree-fullscreen", "Y").css({
			"position":fixs,
			"top":"0px",
			"left":"0px",
			"width":fixs_w,
			"height":fixs_h,
			"box-sizing":"border-box",
			"overflow":"auto"
		});
	}else{
		var targetRectNew = getHandler(targetid) != null ? PubtreePopupPosition(getHandler(targetid), targetid, position) : null;
		if(targetRectNew != null){
			$('#' + targetid).attr("data-pubtree-fullscreen", "N").css({
				"top":targetRectNew.top,
				"left":targetRectNew.left
			});
		}

		$('#' + targetid).css({
			"position":"absolute"
		});

		if($('#' + targetid).attr("data-pubtree-fullscreen") == "Y"){
			$('#' + targetid).removeAttr("data-pubtree-fullscreen").css({
				"width":"auto",
				"height":"auto",
				"overflow":"visible"
			});
		}
	}
	
	if(!$closeBtn) $('#' + targetid).find(".pp_closeBtn").remove();
	if($closeBtn && $('#' + targetid).find(".pp_closeBtn").length < 1){
		var closeBtnObj = $("<img\>").addClass("pp_closeBtn").css({
			"position": $fullLayer ? fixs : "absolute",
			"top":"10px",
			"left": parseFloat($('#' + targetid).width()) - 60,
			"z-index": $fullLayer ? parseInt($('#'+targetid).css("z-index"))+1 : 1,
			"cursor":"pointer"
		}).attr({
			"src":closeBtnImgs,
			"onclick":"PubtreePopupLayer('', '"+targetid+"', 'hide', '"+position+"')"
		});
		
		closeBtnObj.appendTo($('#' + targetid));

		var targetRectNew = getHandler(targetid) != null ? PubtreePopupPosition(getHandler(targetid), targetid, position) : null;
		if(targetRectNew != null){
			$('#' + targetid).attr("data-pubtree-fullscreen", "N").css({
				"top":targetRectNew.top,
				"left":targetRectNew.left
			});
		}
	}
}


$(function () {
    if (document.callEditor && document.callEditor("designMode", "") == "yes")
        return;

    $(window).on("click", NAPopupLayer.onWindowClick);
    $("div[data-pubtree-popuplayer-type]").on("click", NAPopupLayer.onPopupLayerClick);
    NAPopupLayer.initPopupLayer();

	//for YouTube fullscreen mode
    $('[data-allowfullscreen]').each(function (i, el) {
        var stat = $(el).attr('data-allowfullscreen');
        $(el).attr('allowfullscreen', stat);
        $(el).removeAttr('data-allowfullscreen');
    });
});

var NAPopupLayer = {};
NAPopupLayer.onWindowClick = function (event) {
    NAPopupLayer.closeAllPopupLayer(null);
}
NAPopupLayer.onPopupLayerClick = function (event) {
    event.stopPropagation();
}
NAPopupLayer.initPopupLayer = function () {
    $("div[data-pubtree-popuplayer-type]").each(function () {
        $(this).css({ "display": "", "opacity": "0", "z-index": "10000" }).addClass("nac_display_none");
    });
}
NAPopupLayer.closeAllPopupLayer = function (exclude) {
    $("div[data-pubtree-popuplayer-type]").each(function () {
        if (exclude == null || exclude != this)
            NAPopupLayer.closePopupLayer(this);
    });
}
NAPopupLayer.closePopupLayer = function (popup) {
    $(popup).stop().animate({ "opacity": "0" }, 200, function () {
        $(popup).addClass("nac_display_none");
    });
    $(popup).find("audio").each(function () { this.pause(); });
    $(popup).find("video").each(function () { this.pause(); });
}
NAPopupLayer.openPopupLayer = function (popup) {
    $(popup).removeClass("nac_display_none");
    $(popup).stop().animate({ "opacity": "1" }, 200);
    $(popup).find(".nac_media, .nac_layerlist").trigger("show");
}

function maxTabIndex(node, index){
    var tabIndex = node.attr("tabindex");
    var idx = index < Number(tabIndex) ? Number(tabIndex) : index;  //넘어온 인덱스가 현재 노드의 tabindex보다 작은 경우, tabIndex로 아닌 경우, 넘어온 인자로
    
    var child = node.children();
    for(var i = 0; i < child.length; i++){
        tabIndex = maxTabIndex(child.eq(i), idx);
        
        if(idx < Number(tabIndex))
            idx = Number(tabIndex);
    }   
        
    return idx.toString();
}