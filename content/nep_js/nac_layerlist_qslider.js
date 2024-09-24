
// nac_layerlist_qslider.js

$(function () {
    if (typeof Setter !== typeof undefined)
        return;

    NacLLQSlider.initEvent();
    NacLLQSlider.initSize();
    NacLLQSlider.initMedia();
});

var NacLLQSlider = {
    animating: false,
    duration:200,

    questionInfo: [],
    questionInfoValue: function (question, pageIndex) {
        this.question = question;
        this.pageIndex = pageIndex;
        this.answerIsRight = false;
    },
};

NacLLQSlider.initEvent = function () {
    var qslider = $(".nac_layerlist_qslider");
    qslider.each(function () {
        var node = $(this);
        node.children(".nac_to_next").on("click", NacLLQSlider.onToNextPage);
        node.children(".nac_to_back").on("click", NacLLQSlider.onToPrevPage);
        node.children(".nac_to_result").on("click", NacLLQSlider.onToResultPage);
        node.children(".nac_reset").on("click", NacLLQSlider.onReset);
        node.children(".nac_retry_all").on("click", NacLLQSlider.onRetryAll);
        $(window).resize(function () {
            NacLLQSlider.setItemSize(node);
        });
    });
    qslider.on("show", NacLLQSlider.onShow);
}

NacLLQSlider.initSize = function () {
    var qslider = $(".nac_layerlist_qslider");
    qslider.each(function () {
        var node = $(this);
        NacLLQSlider.setItemSize(node);
    });
}

NacLLQSlider.initMedia = function () {
    var qslider = $(".nac_layerlist_qslider");
    qslider.find(".nac_item:not(.nac_active) audio, .nac_item:not(.nac_active) video").each(function () { this.pause(); });
    qslider.each(function () { NacLLQSlider.playMediaIfAutoPlay(NacLLQSlider.activeItem($(this))); });
}

NacLLQSlider.initItem = function (qslider) {
    var items = NacLLQSlider.items(qslider);
    items.removeClass("nac_active").addClass("nac_display_none");
    items.eq(0).addClass("nac_active").removeClass("nac_display_none");
    qslider.find(".nac_question").each(function () { NacQuestion.refreshQuestion($(this), true); });
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, 0);
}

NacLLQSlider.isVisible = function (node) {
    return node[0].offsetWidth > 0 || node[0].offsetHeight > 0;
}

NacLLQSlider.playMediaIfAutoPlay = function (item) {
    if (!NacLLQSlider.isVisible(item))
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

NacLLQSlider.selectionChanged = function (qslider, currentItem, newItem) {
    currentItem.find("audio, video").each(function () { this.pause(); });
    newItem.find(".nac_media, .nac_layerlist").trigger("show");
    NacLLQSlider.playMediaIfAutoPlay(newItem);

    var items = NacLLQSlider.items(qslider);
    qslider.trigger("pageChanged", [items.length, items.index(currentItem[0]), items.index(newItem[0])]);
}

NacLLQSlider.parentLayerListQSliderElement = function (child) {
    var cur = child.parent();
    while (cur.length > 0) {
        if (cur.hasClass("nac_layerlist_qslider"))
            return cur;
        cur = cur.parent();
    }
    return null;
}

NacLLQSlider.contentContainer = function (qslider) {
    return qslider.children(".nac_content_container");
}

NacLLQSlider.items = function (qslider) {
    return NacLLQSlider.contentContainer(qslider).children(".nac_item");
}

NacLLQSlider.activeItem = function (qslider) {
    return NacLLQSlider.contentContainer(qslider).children(".nac_item.nac_active");
}

NacLLQSlider.setItemSize = function (qslider) {
    var items = NacLLQSlider.items(qslider).css("position", "absolute");
    var container = NacLLQSlider.contentContainer(qslider);
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

NacLLQSlider.firstPageIndex = function (items) {
    return NacLLQSlider.nextPageIndex(items, 0);
}

NacLLQSlider.lastPageIndex = function (items) {
    return items.length - 1;
}

NacLLQSlider.nextPageIndex = function (items, startIndex) {
    for (var i = startIndex; i < items.length; i++) {
        if (!items.eq(i).hasClass("nac_hide_page"))
            return i;
    }
    return -1;
}

NacLLQSlider.prevPageIndex = function (items, startIndex) {
    for (var i = startIndex; i >= 0; i--) {
        if (!items.eq(i).hasClass("nac_hide_page"))
            return i;
    }
    return -1;
}

NacLLQSlider.isLastPage = function (items, index) {
    return index == NacLLQSlider.lastPageIndex(items);
}

NacLLQSlider.isFirstPage = function (items, index) {
    return index == NacLLQSlider.firstPageIndex(items);
}

NacLLQSlider.isLastQuestionPage = function (items, index) {
    var nextIndex = NacLLQSlider.nextPageIndex(items, index + 1);
    if (nextIndex == -1)
        return false;
    return NacLLQSlider.isLastPage(items, nextIndex);
}

NacLLQSlider.isPerfectScore = function () {
    var perfect = true;
    NacLLQSlider.questionInfo.forEach(function (info, index) {
        if (!info.answerIsRight)
            perfect = false;
    });
    return perfect;
}

NacLLQSlider.hideUnnecessaryPage = function (items) {
    for (var i = 0; i < items.length; i++) {
        if (items.eq(i).find(".nac_question").length == 0)
            items.eq(i).addClass("nac_hide_page");
        else
            return;
    }
}

NacLLQSlider.resetAllQuestion = function (items) {
    items.removeClass("nac_hide_page");
    NacLLQSlider.hideUnnecessaryPage(items);
    NacLLQSlider.questionInfo.forEach(function (info, index) {
        NacQuestion.refreshQuestion($(info.question), true);
    });
}

NacLLQSlider.resetOnlyWrongQuestion = function (items) {
    var pages = [];
    var pagesToDisplay = [];
    NacLLQSlider.hideUnnecessaryPage(items);
    NacLLQSlider.questionInfo.forEach(function (info, index) {
        if (pages.indexOf(info.pageIndex) < 0)
            pages.push(info.pageIndex);
        if (!info.answerIsRight) {
            if (pagesToDisplay.indexOf(info.pageIndex) < 0)
                NacQuestion.refreshQuestion($(info.question), true);
            pagesToDisplay.push(info.pageIndex);
        }
    });

    pages.forEach(function (value, index) {
        if (pagesToDisplay.indexOf(value) >= 0)
            items.eq(value).removeClass("nac_hide_page");
        else
            items.eq(value).addClass("nac_hide_page");
    });
}

NacLLQSlider.movePage = function (qslider, items, fromIndex, toIndex) {
    if (fromIndex == toIndex)
        return;

    var count = Math.abs(toIndex - fromIndex);
    var duration = NacLLQSlider.duration / count;
    var isNext = toIndex > fromIndex;
    var container = NacLLQSlider.contentContainer(qslider);
    var containerWidth = parseInt(container.css("width"), 10);

    NacLLQSlider.animating = true;
    function move(currentIndex, newIndex) {
        count--;
        var isLast = (count == 0 ? true : false);
        var currentItem = items.eq(currentIndex);
        var newItem = items.eq(newIndex);
        var left = parseInt(currentItem.css("left"), 10);
        newItem.css("left", (left + (isNext ? containerWidth : -containerWidth)) + "px");
        newItem.removeClass("nac_display_none");
        if (isLast)
            NacLLQSlider.selectionChanged(qslider, items.eq(fromIndex), newItem);

        currentItem.animate({ "left": (left + (isNext ? -containerWidth : containerWidth)) + "px" }, duration, function () {
            currentItem.removeClass("nac_active");
            currentItem.addClass("nac_display_none");
        });
        newItem.animate({ "left": left + "px" }, duration, function () {
            newItem.addClass("nac_active");
            if (isLast)
                NacLLQSlider.animating = false;
            else
                move(newIndex, isNext ? newIndex + 1 : newIndex - 1);
        });
    }
    move(fromIndex, isNext ? fromIndex + 1 : fromIndex - 1);
}

NacLLQSlider.onToNextPage = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    var items = NacLLQSlider.items(qslider);
    var item = NacLLQSlider.activeItem(qslider);
    var fromIndex = items.index(item[0]);
    var toIndex = NacLLQSlider.nextPageIndex(items, fromIndex + 1);
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, toIndex);
}

NacLLQSlider.onToPrevPage = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    var items = NacLLQSlider.items(qslider);
    var item = NacLLQSlider.activeItem(qslider);
    var fromIndex = items.index(item[0]);
    var toIndex = NacLLQSlider.prevPageIndex(items, fromIndex - 1);
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, toIndex);
}

NacLLQSlider.onToResultPage = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    var items = NacLLQSlider.items(qslider);
    NacLLQSlider.fillResultPage(qslider, items);
    var item = NacLLQSlider.activeItem(qslider);
    var fromIndex = items.index(item[0]);
    var toIndex = NacLLQSlider.lastPageIndex(items);
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, toIndex);
}

NacLLQSlider.onReset = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    var items = NacLLQSlider.items(qslider);
    NacLLQSlider.resetAllQuestion(items);
    var fromIndex = NacLLQSlider.lastPageIndex(items);
    var toIndex = NacLLQSlider.firstPageIndex(items);
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, toIndex);
}

NacLLQSlider.onRetryAll = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    if (!qslider.children(".nac_retry_all").hasClass("nac_enabled"))
        return;
    var items = NacLLQSlider.items(qslider);
    NacLLQSlider.resetOnlyWrongQuestion(items);
    var fromIndex = NacLLQSlider.lastPageIndex(items);
    var toIndex = NacLLQSlider.firstPageIndex(items);
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showNavigateButtonByIndex(qslider, items, toIndex);
}

NacLLQSlider.onToWrongPage = function () {
    if (NacLLQSlider.animating)
        return;
    var qslider = NacLLQSlider.parentLayerListQSliderElement($(this));
    var items = NacLLQSlider.items(qslider);
    var questionIndex = parseInt($(this).parent().attr("data-question-index"), 10);
    NacQuestion.refreshQuestion($(NacLLQSlider.questionInfo[questionIndex].question), true);
    var fromIndex = NacLLQSlider.lastPageIndex(items);
    var toIndex = NacLLQSlider.questionInfo[questionIndex].pageIndex;
    NacLLQSlider.movePage(qslider, items, fromIndex, toIndex);
    NacLLQSlider.showWrongResultButton(qslider);
}

NacLLQSlider.showNavigateButtonByIndex = function (qslider, items, index) {
    if (NacLLQSlider.isLastPage(items, index))
        NacLLQSlider.showResetButton(qslider);
    else if (NacLLQSlider.isLastQuestionPage(items, index))
        NacLLQSlider.showResultButton(qslider);
    else if(NacLLQSlider.isFirstPage(items, index))
        NacLLQSlider.showNextButton(qslider);
    else
        NacLLQSlider.showBackButton(qslider);
}

// 130 left 190 middle 270 right
NacLLQSlider.showNextButton = function (qslider) {
    qslider.find(".nac_to_next").removeClass("nac_display_none");
    qslider.find(".nac_to_next").css("left","190px");
    qslider.find(".nac_to_back").addClass("nac_display_none");
    qslider.find(".nac_to_result").addClass("nac_display_none");
    qslider.find(".nac_reset").addClass("nac_display_none");
    qslider.find(".nac_retry_all").addClass("nac_display_none");
}

NacLLQSlider.showBackButton = function (qslider) {
    qslider.find(".nac_to_next").removeClass("nac_display_none");
    // qslider.find(".nac_to_next").css("left","270px");
    qslider.find(".nac_to_back").addClass("nac_display_none");
    qslider.find(".nac_to_result").addClass("nac_display_none");
    qslider.find(".nac_reset").addClass("nac_display_none");
    qslider.find(".nac_retry_all").addClass("nac_display_none");
}

NacLLQSlider.showResultButton = function (qslider) {
    qslider.find(".nac_to_next").addClass("nac_display_none");
    qslider.find(".nac_to_back").addClass("nac_display_none");
    qslider.find(".nac_to_result").removeClass("nac_display_none");
    qslider.find(".nac_to_result").css("left","190px");
    qslider.find(".nac_reset").addClass("nac_display_none");
    qslider.find(".nac_retry_all").addClass("nac_display_none");
}

NacLLQSlider.showWrongResultButton = function (qslider) {
    qslider.find(".nac_to_next").addClass("nac_display_none");
    qslider.find(".nac_to_back").addClass("nac_display_none");
    qslider.find(".nac_to_result").removeClass("nac_display_none");
    // qslider.find(".nac_to_result").css("left","190px");
    qslider.find(".nac_reset").addClass("nac_display_none");
    qslider.find(".nac_retry_all").addClass("nac_display_none");
}

NacLLQSlider.showResetButton = function (qslider) {
    qslider.find(".nac_to_next").addClass("nac_display_none");
    qslider.find(".nac_to_back").addClass("nac_display_none");
    qslider.find(".nac_to_result").addClass("nac_display_none");
    qslider.find(".nac_reset").removeClass("nac_display_none");
    qslider.find(".nac_retry_all").removeClass("nac_display_none");
    if (NacLLQSlider.isPerfectScore())
        qslider.find(".nac_retry_all").removeClass("nac_enabled");
    else
        qslider.find(".nac_retry_all").addClass("nac_enabled");
}

NacLLQSlider.onShow = function (event) {
    if (event.target == this) {
        NacLLQSlider.setItemSize($(this));
        NacLLQSlider.playMediaIfAutoPlay(NacLLQSlider.activeItem($(this)));
    }
    event.stopPropagation();
}

// result page
NacLLQSlider.initQuestionObject = function (items, resultPage) {
    NacLLQSlider.questionInfo.length = 0;
    resultPage.find(".nac_right_item.nac_copied_item").remove();
    resultPage.find(".nac_wrong_item.nac_copied_item").remove();

    var right = resultPage.find(".nac_right_item").addClass("nac_display_none");
    var wrong = resultPage.find(".nac_wrong_item").addClass("nac_display_none");
    var parent = right.parent();
    for (var i = 0; i < items.length; i++) {
        items.eq(i).find(".nac_question").each(function () {
            var questionIndex = NacLLQSlider.questionInfo.length;
            NacLLQSlider.questionInfo.push(new NacLLQSlider.questionInfoValue(this, i));

            var rightClone = right.clone();
            rightClone.find(".nac_index").html((questionIndex + 1) + ".");
            rightClone.attr("data-question-index", questionIndex).addClass("nac_copied_item");
            parent.append(rightClone);

            var wrongClone = wrong.clone();
            wrongClone.find(".nac_index").html((questionIndex + 1) + ".");
            wrongClone.attr("data-question-index", questionIndex).addClass("nac_copied_item");
            wrongClone.find(".nac_retry").on("click", NacLLQSlider.onToWrongPage);
            parent.append(wrongClone);
        });
    }
}

NacLLQSlider.fillResultPage = function (qslider, items) {
    if (typeof NacQuestion === typeof undefined)
        return;

    var resultPage = items.last();
    NacLLQSlider.initQuestionObject(items, resultPage);

    var right = 0;
    var wrong = 0;
    var totalScore = 0;
    var rightItems = resultPage.find(".nac_right_item.nac_copied_item");
    var wrongItems = resultPage.find(".nac_wrong_item.nac_copied_item");
    NacLLQSlider.questionInfo.forEach(function (info, index) {
        var score = NacQuestion.showResult($(info.question), false);
        if (score > 0) {
            right++;
            rightItems.eq(index).removeClass("nac_display_none");
            wrongItems.eq(index).addClass("nac_display_none");
            info.answerIsRight = true;
        }
        else {
            wrong++;
            rightItems.eq(index).addClass("nac_display_none");
            wrongItems.eq(index).removeClass("nac_display_none");
            info.answerIsRight = false;
        }
        totalScore += score;
    });

    resultPage.find(".nac_score").html(totalScore);
    resultPage.find(".nac_total_count").html(right + wrong);
    resultPage.find(".nac_right_count").html(right);
    resultPage.find(".nac_wrong_count").html(wrong);
}





