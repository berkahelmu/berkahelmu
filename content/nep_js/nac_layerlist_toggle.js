
// nac_layerlist_toggle.js

$(function () {
    if (typeof Setter !== typeof undefined)
        return;

    NacLLToggle.initEvent();
    NacLLToggle.initSize();
    NacLLToggle.initMedia();
});

var NacLLToggle = {};

NacLLToggle.animating = false;

NacLLToggle.initEvent = function () {
    var toggle = $(".nac_layerlist_toggle");
    toggle.each(function () {
        var node = $(this);
        var thumbs = NacLLToggle.thumbs(node);
        thumbs.on("click", NacLLToggle.onThumb);
        $(window).resize(function () {
            NacLLToggle.setItemSize(node);
        });
    });
    toggle.on("show", NacLLToggle.onShow);
}

NacLLToggle.initSize = function () {
    var toggle = $(".nac_layerlist_toggle");
    toggle.each(function () {
        var node = $(this);
        NacLLToggle.setItemSize(node);
    });
}

NacLLToggle.initMedia = function () {
    var toggle = $(".nac_layerlist_toggle");
    toggle.find(".nac_item:not(.nac_active) audio, .nac_item:not(.nac_active) video").each(function () { this.pause(); });
    toggle.each(function () { NacLLToggle.playMediaIfAutoPlay(NacLLToggle.activeItem($(this))); });
}

NacLLToggle.isVisible = function (node) {
    return node[0].offsetWidth > 0 || node[0].offsetHeight > 0;
}

NacLLToggle.playMediaIfAutoPlay = function (item) {
    if (!NacLLToggle.isVisible(item))
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

NacLLToggle.selectionChanged = function (toggle, currentItem, newItem) {
    currentItem.find("audio, video").each(function () { this.pause(); });
    newItem.find(".nac_media, .nac_layerlist").trigger("show");
    NacLLToggle.playMediaIfAutoPlay(newItem);

    var items = NacLLToggle.items(toggle);
    toggle.trigger("pageChanged", [items.length, items.index(currentItem[0]), items.index(newItem[0])]);
}

NacLLToggle.parentLayerListToggleElement = function (child) {
    var cur = child.parent();
    while (cur.length > 0) {
        if (cur.hasClass("nac_layerlist_toggle"))
            return cur;
        cur = cur.parent();
    }
    return null;
}

NacLLToggle.itemsContainerElement = function (toggle) {
    return toggle.children(".nac_content_container");
}

NacLLToggle.items = function (toggle) {
    return NacLLToggle.itemsContainerElement(toggle).children(".nac_item");
}

NacLLToggle.activeItem = function (toggle) {
    return NacLLToggle.itemsContainerElement(toggle).children(".nac_item.nac_active");
}

NacLLToggle.thumbsContainerElement = function (toggle) {
    return toggle.children(".nac_thumb_container");
}

NacLLToggle.thumbs = function (toggle) {
    return NacLLToggle.thumbsContainerElement(toggle).children(".nac_thumb");
}

NacLLToggle.activeThumb = function (toggle) {
    return NacLLToggle.thumbsContainerElement(toggle).children(".nac_thumb.nac_active");
}

NacLLToggle.setItemSize = function (toggle) {
    var items = NacLLToggle.items(toggle).css("position", "absolute");
    var container = NacLLToggle.itemsContainerElement(toggle);
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

NacLLToggle.isToggleMode = function (toggle) {
    return toggle.hasClass("nac_toggle_mode");
}

NacLLToggle.selectByThumb = function (thumb) {
    var toggle = NacLLToggle.parentLayerListToggleElement(thumb);
    var toggleMode = NacLLToggle.isToggleMode(toggle);
    if (!toggleMode && thumb.hasClass("nac_active"))
        return;

    var thumbs = NacLLToggle.thumbs(toggle);
    var index = thumbs.index(thumb[0]);
    if (toggleMode) {
        if (++index == thumbs.length)
            index = 0;
        thumb = $(thumbs[index]);
    }
    thumbs.removeClass("nac_active").addClass("nac_inactive");
    thumb.removeClass("nac_inactive").addClass("nac_active");

    var items = NacLLToggle.items(toggle);
    var currentItem = NacLLToggle.activeItem(toggle);
    var newItem = items.eq(index);
    newItem.removeClass("nac_display_none");
    NacLLToggle.selectionChanged(toggle, currentItem, newItem);

    NacLLToggle.animating = true;
    currentItem.animate({ "opacity": "0" }, 200, function () {
        currentItem.removeClass("nac_active").addClass("nac_display_none");
    });
    newItem.animate({ "opacity": "1" }, 200, function () {
        newItem.addClass("nac_active");
        NacLLToggle.animating = false;
    });
}

NacLLToggle.onThumb = function () {
    NacLLToggle.selectByThumb($(this));
}

NacLLToggle.onShow = function (event) {
    if (event.target == this) {
        NacLLToggle.setItemSize($(this));
        NacLLToggle.playMediaIfAutoPlay(NacLLToggle.activeItem($(this)));
    }
    event.stopPropagation();
}

