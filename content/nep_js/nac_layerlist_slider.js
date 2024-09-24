
// nac_layerlist_slider.js

$(function () {
    if (typeof Setter !== typeof undefined)
        return;

    NacLLSlider.initEvent();
    NacLLSlider.initSize();
    NacLLSlider.initMedia();
});

var NacLLSlider = {};

NacLLSlider.animating = false;
NacLLSlider.duration = 200;

NacLLSlider.initEvent = function () {
    var slider = $(".nac_layerlist_slider");
    slider.each(function () {
        var node = $(this);
        var prev = NacLLSlider.prevButton(node);
        var next = NacLLSlider.nextButton(node);
        var thumbs = NacLLSlider.thumbs(node);
        prev.on("click", NacLLSlider.onPrev).addClass("nac_disabled").removeClass("nac_enabled");
        next.on("click", NacLLSlider.onNext);
        thumbs.on("click", NacLLSlider.onNavigate);
        $(window).resize(function () {
            NacLLSlider.setItemSize(node);
        });
    });
    slider.on("show", NacLLSlider.onShow);
}

NacLLSlider.initSize = function () {
    var slider = $(".nac_layerlist_slider");
    slider.each(function () {
        var node = $(this);
        NacLLSlider.setItemSize(node);
    });
}

NacLLSlider.initMedia = function () {
    var slider = $(".nac_layerlist_slider");
    slider.find(".nac_item:not(.nac_active) audio, .nac_item:not(.nac_active) video").each(function () { this.pause(); });
    slider.each(function () { NacLLSlider.playMediaIfAutoPlay(NacLLSlider.activeItem($(this))); });
}

NacLLSlider.initItem = function (slider) {
    var items = NacLLSlider.items(slider);
    items.addClass("nac_display_none").removeClass("nac_active");
    items.eq(0).addClass("nac_active").removeClass("nac_display_none");
    NacLLSlider.prevButton(slider).addClass("nac_disabled").removeClass("nac_enabled");
    NacLLSlider.nextButton(slider).addClass("nac_enabled").removeClass("nac_disabled");
    NacLLSlider.setNavigateInfo(slider, items[0]);
}

NacLLSlider.isVisible = function (node) {
    return node[0].offsetWidth > 0 || node[0].offsetHeight > 0;
}

NacLLSlider.playMediaIfAutoPlay = function (item) {
    if (!NacLLSlider.isVisible(item))
        return;

    item.find("audio[autoplay], video[autoplay]").each(function () {
        var parent = this.parentNode;
        while (parent != item[0]) {
            if ($(parent).hasClass("nac_layerlist"))
                return;
            parent = parent.parentNode;
        }
        this.play();
    });
}

NacLLSlider.selectionChanged = function (slider, currentItem, newItem) {
    currentItem.find("audio, video").each(function () { this.pause(); });
    newItem.find(".nac_media, .nac_layerlist").trigger("show");
    NacLLSlider.playMediaIfAutoPlay(newItem);

    var items = NacLLSlider.items(slider);
    slider.trigger("pageChanged", [items.length, items.index(currentItem[0]), items.index(newItem[0])]);
}

NacLLSlider.parentLayerListSliderElement = function (child) {
    var cur = child.parent();
    while (cur.length > 0) {
        if (cur.hasClass("nac_layerlist_slider"))
            return cur;
        cur = cur.parent();
    }
    return null;
}

NacLLSlider.prevButton = function (slider) {
    if (slider.hasClass("nac_horz"))
        return slider.children(".nac_content_part").children(".nac_prev");
    else if (slider.hasClass("nac_vert"))
        return slider.children(".nac_navigate_part").children(".nac_prev");
    return null;
}

NacLLSlider.nextButton = function (slider) {
    if (slider.hasClass("nac_horz"))
        return slider.children(".nac_content_part").children(".nac_next");
    else if (slider.hasClass("nac_vert"))
        return slider.children(".nac_navigate_part").children(".nac_next");
    return null;
}

NacLLSlider.contentContainer = function (slider) {
    return slider.children(".nac_content_part").children(".nac_content_container");
}

NacLLSlider.items = function (slider) {
    return NacLLSlider.contentContainer(slider).children(".nac_item");
}

NacLLSlider.activeItem = function (slider) {
    return NacLLSlider.contentContainer(slider).children(".nac_item.nac_active");
}

NacLLSlider.thumbs = function (slider) {
    return slider.children(".nac_navigate_part").children(".nac_indicator").children(".nac_thumb_container").children(".nac_thumb");
}

NacLLSlider.page = function (slider) {
    return slider.children(".nac_navigate_part").children(".nac_indicator").children(".nac_page");
}

NacLLSlider.setItemSize = function (slider) {
    var items = NacLLSlider.items(slider).css("position", "absolute");
    var container = NacLLSlider.contentContainer(slider);
    var paddingLeft = parseInt(container.css("padding-left"), 10);
    var paddingTop = parseInt(container.css("padding-top"), 10);
    var paddingRight = parseInt(container.css("padding-right"), 10);
    var paddingBottom = parseInt(container.css("padding-bottom"), 10);
    var borderLeft = parseInt(container.css("border-left"), 10);
    var borderTop = parseInt(container.css("border-top"), 10);
    var borderRight = parseInt(container.css("border-right"), 10);
    var borderBottom = parseInt(container.css("border-bottom"), 10);
    var containerWidth = parseInt(container.css("width"), 10);
    var containerHeight = parseInt(container.css("height"), 10);

    var left = paddingLeft;
    var top = paddingTop;
    var width = containerWidth - borderLeft - borderRight - paddingLeft - paddingRight;
    var height = containerHeight - borderTop - borderBottom - paddingTop - paddingBottom;

    items.css({
        "left": left + "px",
        "top": top + "px",
        "width": width + "px",
        "height": height + "px"
    });
}

NacLLSlider.toNext = function (slider, duration) {
    var currentItem = NacLLSlider.activeItem(slider);
    var newItem = currentItem.next(".nac_item");
    if (newItem.length == 0)
        return;

    var container = NacLLSlider.contentContainer(slider);
    var containerWidth = parseInt(container.css("width"), 10);
    var left = parseInt(currentItem.css("left"), 10);
    newItem.css("left", (left + containerWidth) + "px");
    newItem.removeClass("nac_display_none");
    NacLLSlider.selectionChanged(slider, currentItem, newItem);

    NacLLSlider.animating = true;
    currentItem.animate({ "left": (left - containerWidth) + "px" }, duration, function () {
        currentItem.removeClass("nac_active");
        currentItem.addClass("nac_display_none");
    });
    newItem.animate({ "left": left + "px" }, duration, function () {
        newItem.addClass("nac_active");
        var nextItem = newItem.next(".nac_item");
        if (nextItem.length == 0) {
            var next = NacLLSlider.nextButton(slider);
            next.removeClass("nac_enabled");
            next.addClass("nac_disabled");
        }
        var prev = NacLLSlider.prevButton(slider);
        prev.removeClass("nac_disabled");
        prev.addClass("nac_enabled");
        NacLLSlider.animating = false;
    });
    NacLLSlider.setNavigateInfo(slider, newItem[0]);
}

NacLLSlider.toPrev = function (slider, duration) {
    var currentItem = NacLLSlider.activeItem(slider);
    var newItem = currentItem.prev(".nac_item");
    if (newItem.length == 0)
        return;

    var container = NacLLSlider.contentContainer(slider);
    var containerWidth = parseInt(container.css("width"), 10);
    var left = parseInt(currentItem.css("left"), 10);
    newItem.css("left", (left - containerWidth) + "px");
    newItem.removeClass("nac_display_none");
    NacLLSlider.selectionChanged(slider, currentItem, newItem);

    NacLLSlider.animating = true;
    currentItem.animate({ "left": (left + containerWidth) + "px" }, duration, function () {
        currentItem.removeClass("nac_active");
        currentItem.addClass("nac_display_none");
    });
    newItem.animate({ "left": left + "px" }, duration, function () {
        newItem.addClass("nac_active");
        var prevItem = newItem.prev(".nac_item");
        if (prevItem.length == 0) {
            var prev = NacLLSlider.prevButton(slider);
            prev.removeClass("nac_enabled");
            prev.addClass("nac_disabled");
        }
        var next = NacLLSlider.nextButton(slider);
        next.removeClass("nac_disabled");
        next.addClass("nac_enabled");
        NacLLSlider.animating = false;
    });
    NacLLSlider.setNavigateInfo(slider, newItem[0]);
}

NacLLSlider.toIndex = function (slider, duration, index) {
    var items = NacLLSlider.items(slider);
    var orgItem = NacLLSlider.activeItem(slider);
    var orgIndex = items.index(orgItem[0]);
    if (index == orgIndex)
        return;

    var count = Math.abs(index - orgIndex);
    duration = duration / count;
    var isNext = index > orgIndex;
    var container = NacLLSlider.contentContainer(slider);
    var containerWidth = parseInt(container.css("width"), 10);

    NacLLSlider.animating = true;
    function move(currentIndex, newIndex) {
        count--;
        var isLast = (count == 0 ? true : false);
        var currentItem = items.eq(currentIndex);
        var newItem = items.eq(newIndex);
        var left = parseInt(currentItem.css("left"), 10);
        newItem.css("left", (left + (isNext ? containerWidth : -containerWidth)) + "px");
        newItem.removeClass("nac_display_none");
        if (isLast)
            NacLLSlider.selectionChanged(slider, orgItem, newItem);

        currentItem.animate({ "left": (left + (isNext ? -containerWidth : containerWidth)) + "px" }, duration, function () {
            currentItem.removeClass("nac_active");
            currentItem.addClass("nac_display_none");
        });
        newItem.animate({ "left": left + "px" }, duration, function () {
            newItem.addClass("nac_active");
            if (isLast) {
                if (isNext) {
                    var nextItem = newItem.next(".nac_item");
                    if (nextItem.length == 0) {
                        var next = NacLLSlider.nextButton(slider);
                        next.removeClass("nac_enabled");
                        next.addClass("nac_disabled");
                    }
                    var prev = NacLLSlider.prevButton(slider);
                    prev.removeClass("nac_disabled");
                    prev.addClass("nac_enabled");
                }
                else {
                    var prevItem = newItem.prev(".nac_item");
                    if (prevItem.length == 0) {
                        var prev = NacLLSlider.prevButton(slider);
                        prev.removeClass("nac_enabled");
                        prev.addClass("nac_disabled");
                    }
                    var next = NacLLSlider.nextButton(slider);
                    next.removeClass("nac_disabled");
                    next.addClass("nac_enabled");
                }
                NacLLSlider.animating = false;
                return;
            }
            move(newIndex, isNext ? newIndex + 1 : newIndex - 1);
        });
        NacLLSlider.setNavigateInfo(slider, newItem[0]);
    }
    move(orgIndex, isNext ? orgIndex + 1 : orgIndex - 1);
}

NacLLSlider.setNavigateInfo = function (slider, item) {
    var items = NacLLSlider.items(slider);
    var index = items.index(item);
    NacLLSlider.page(slider).html((index + 1) + " / " + items.length);
    NacLLSlider.thumbs(slider).removeClass("nac_active").eq(index).addClass("nac_active");
}

NacLLSlider.onPrev = function () {
    if (NacLLSlider.animating)
        return;
    var slider = NacLLSlider.parentLayerListSliderElement($(this));
    NacLLSlider.toPrev(slider, NacLLSlider.duration);
}

NacLLSlider.onNext = function () {
    if (NacLLSlider.animating)
        return;
    var slider = NacLLSlider.parentLayerListSliderElement($(this));
    NacLLSlider.toNext(slider, NacLLSlider.duration);
}

NacLLSlider.onNavigate = function () {
    if (NacLLSlider.animating)
        return;
    var slider = NacLLSlider.parentLayerListSliderElement($(this));
    var thumbs = NacLLSlider.thumbs(slider);
    var newIndex = thumbs.index(this);
    NacLLSlider.toIndex(slider, NacLLSlider.duration, newIndex);
}

NacLLSlider.onShow = function (event) {
    if (event.target == this) {
        NacLLSlider.setItemSize($(this));
        NacLLSlider.playMediaIfAutoPlay(NacLLSlider.activeItem($(this)));
    }
    event.stopPropagation();
}





