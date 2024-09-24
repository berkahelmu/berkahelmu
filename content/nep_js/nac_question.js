
// nac_question.js

$(function () {
    ;
        if (typeof Setter !== typeof undefined){
    
            return;
        }
    
        $(".nac_question .show_answer").on("click", NacQuestion.onQuestionShowAnswer);
        $(".nac_question .show_hint").on("click", NacQuestion.onQuestionHint);
        $(".nac_question .show_explain").on("click", NacQuestion.onQuestionExplain);
        $(".nac_question .check_result").on("click", NacQuestion.onQuestionResult);
    
        $(".nac_question .answer_o").on("click", NacQuestion.onQuestionAnswerO);
        $(".nac_question .answer_x").on("click", NacQuestion.onQuestionAnswerX);
        $(".nac_question .choice .example").on("click", NacQuestion.onQuestionChoice);
        $(".nac_question .item .example").on("click", NacQuestion.onQuestionConnect);
    
        $(".nac_question_result .result_button").on("click", NacQuestion.onQuestionOpenResultDialog);
        $(".nac_question_result .close").on("click", NacQuestion.onQuestionCloseResultDialog);
        $(".nac_question_result .reset").on("click", NacQuestion.onQuestionRestart);
    
        $(".nac_question").css("cursor", "default");
        $(".nac_question .refresh_result").css("display", "none");
        $(".nac_question_result").css({ "cursor": "default", "-webkit-user-select": "none", "user-select": "none" });
        $(".nac_question_result .result_container").css("position", "fixed");
        $(".nac_question img").attr("draggable", "false");
    
        $( ".dragdrop_object" ).draggable();
        $( ".dragdrop_answer" ).droppable({
            over: function( event, ui ) {
                var answer = $(this).attr("data-select");
                if(answer && answer.indexOf(ui.draggable.attr("id")) == -1)
                    var example_data = $(this).attr("data-select") + "," + ui.draggable.attr("id");
                else if(answer == "undefined" || answer == "" || answer == null)
                    var example_data = ui.draggable.attr("id");
                ui.draggable.css("box-shadow","rgba(0, 0, 0, 0.6) 0px 0px 4px 3px");
                $(this).attr("data-select",example_data);
            },
            out: function(event, ui){
                var example_data = "";
                var answer = $(this).attr("data-select");
                if(answer){
                    var answers = answer.split(",");
                    for(var i = 0; i < answers.length; i++){
                        if(answers[i] != ui.draggable.attr("id")){
                            if(example_data.length > 0)
                                example_data += ",";
                            example_data += answers[i];
                        }
                        
                        
                    }
                }
                ui.draggable.css("box-shadow","");
                $(this).attr("data-select",example_data);
            }
        });
    });
    
    var NacQuestion = {};
    
    NacQuestion.parentQuestionElement = function (child) {
        var cur = child.parent();
        while (cur.length > 0) {
            if (cur.hasClass("nac_question"))
                return cur;
            cur = cur.parent();
        }
        return null;
    }
    
    NacQuestion.onQuestionShowAnswer = function (event) {
        if ($(this).hasClass("disabled"))
            return;
        var question = NacQuestion.parentQuestionElement($(this));
        NacQuestion.refreshQuestion(question, true);
        NacQuestion.displayAnswer(question);
    }
    
    NacQuestion.onQuestionHint = function (event) {
        if ($(this).hasClass("disabled"))
            return;
        var question = NacQuestion.parentQuestionElement($(this));
        NacQuestion.toggleHint(question);
    }
    
    NacQuestion.onQuestionExplain = function (event) {
        if ($(this).hasClass("disabled"))
            return;
        var question = NacQuestion.parentQuestionElement($(this));
        NacQuestion.toggleExplain(question);
    }
    
    NacQuestion.onQuestionResult = function (event) {
        var question = NacQuestion.parentQuestionElement($(this));
        NacQuestion.toggleResult(question);
    }
    
    NacQuestion.hintIsVisible = function (question) {
        var hint = question.find(".show_hint");
        return hint.attr("data-state") == "checked" ? true : false;
    }
    
    NacQuestion.explainIsVisible = function (question) {
        var explain = question.find(".show_explain");
        return explain.attr("data-state") == "checked" ? true : false;
    }
    
    NacQuestion.resultIsVisible = function (question) {
        var checkResult = question.find(".check_result");
        return checkResult.attr("data-state") == "checked" ? true : false;
    }
    
    NacQuestion.showHint = function (question) {
        if (NacQuestion.resultIsVisible(question))
            return;
        NacQuestion.hideExplain(question);
        var hint = question.find(".hint");
        var showHint = question.find(".show_hint");
        hint.css({ "z-index": "3", "opacity": "1" });
        showHint.attr("data-state", "checked");
    }
    
    NacQuestion.showExplain = function (question) {
        if (NacQuestion.resultIsVisible(question))
            return;
        NacQuestion.hideHint(question);
        var explain = question.find(".explain");
        var showExplain = question.find(".show_explain");
        explain.css({ "z-index": "3", "opacity": "1" });
        showExplain.attr("data-state", "checked");
    }
    
    NacQuestion.showResult = function (question, playAudio) {
        var result = 0;
        var right = false;
        var resultObject = null;
        var resultO = question.find(".result_o").css({ "opacity": "0", "display": "" });
        var resultX = question.find(".result_x").css({ "opacity": "0", "display": "" });
        var blocker = question.find(".blocker").css({ "opacity": "0", "display": "" });
    
        NacQuestion.hideHint(question);
        NacQuestion.hideExplain(question);
        if (NacQuestion.answerIsRight(question)) {
            resultObject = resultO;
            result = parseInt(question.attr("data-point"), 10);
            right = true;
        }
        else {
            resultObject = resultX;
            question.find(".show_answer").removeClass("disabled");
        }
    
        resultObject.css("display", "inline");
        blocker.css("display", "inline");
        setTimeout(function () {
            var parent = resultObject.parent();
            var left = (parent.width() - resultObject.width()) / 2;
            var top = (parent.height() - resultObject.height()) / 2;
            resultObject.css({
                "left": left + "px",
                "top": top + "px",
                "opacity": "1"
            });
            blocker.css("opacity", "0.5");
        }, 0);
    
        var checkResult = question.find(".check_result");
        if (checkResult.attr("data-state") != "checked") {
            var refreshResult = question.find(".refresh_result");
            var checkResultSrc = checkResult.attr("src");
            var refreshResultSrc = refreshResult.attr("src");
            checkResult.attr("data-state", "checked");
            checkResult.attr("src", refreshResultSrc);
            refreshResult.attr("src", checkResultSrc);
        }
    
        question.find(".show_hint").addClass("disabled");
        question.find(".show_explain").addClass("disabled");
    
        if (playAudio) {
            if (right)
                NacQuestion.play(question.find(".nac_question_audio_right"));
            else
                NacQuestion.play(question.find(".nac_question_audio_wrong"));
        }
    
        if (question.hasClass("show_answer_immediately"))
            NacQuestion.displayAnswer(question);
        if (question.hasClass("toggle_helper_left"))
            question.find(".helper_left").css("opacity", "1");
        if (question.hasClass("toggle_helper_right"))
            question.find(".helper_right").css("opacity", "1");
        if (question.hasClass("toggle_helper_top"))
            question.find(".helper_top").css("opacity", "1");
        if (question.hasClass("toggle_helper_bottom"))
            question.find(".helper_bottom").css("opacity", "1");
    
        return result;
    }
    
    NacQuestion.hideHint = function (question) {
        var hint = question.find(".hint");
        var showHint = question.find(".show_hint");
        hint.css("opacity", "0");
        showHint.attr("data-state", "init");
        setTimeout(function () {
            hint.css("z-index", "-1");
        }, 300);
    }
    
    NacQuestion.hideExplain = function (question) {
        var explain = question.find(".explain");
        var showExplain = question.find(".show_explain");
        explain.css("opacity", "0");
        showExplain.attr("data-state", "init");
        setTimeout(function () {
            explain.css("z-index", "-1");
        }, 300);
    }
    
    NacQuestion.hideResult = function (question) {
        var checkResult = question.find(".check_result");
        if (checkResult.attr("data-state") != "init") {
            var refreshResult = question.find(".refresh_result");
            var checkResultSrc = checkResult.attr("src");
            var refreshResultSrc = refreshResult.attr("src");
            checkResult.attr("src", refreshResultSrc);
            refreshResult.attr("src", checkResultSrc);
            checkResult.attr("data-state", "init");
        }
    
        var resultO = question.find(".result_o").css("opacity", "0");
        var resultX = question.find(".result_x").css("opacity", "0");
        var blocker = question.find(".blocker").css("opacity", "0");
        setTimeout(function () {
            resultO.css("display", "");
            resultX.css("display", "");
            blocker.css("display", "");
        }, 300);
    
        question.find(".show_answer").addClass("disabled");
        question.find(".show_hint").removeClass("disabled");
        question.find(".show_explain").removeClass("disabled");
    }
    
    NacQuestion.toggleHint = function (question) {
        NacQuestion.hintIsVisible(question) ? NacQuestion.hideHint(question) : NacQuestion.showHint(question);
    }
    
    NacQuestion.toggleExplain = function (question) {
        NacQuestion.explainIsVisible(question) ? NacQuestion.hideExplain(question) : NacQuestion.showExplain(question);
    }
    
    NacQuestion.toggleResult = function (question) {
        NacQuestion.resultIsVisible(question) ? NacQuestion.refreshQuestion(question, true) : NacQuestion.showResult(question, true);
    }
    
    NacQuestion.onQuestionAnswerO = function (event) {
        var question = NacQuestion.parentQuestionElement($(this));
        var answerO = $(this);
        var answerX = question.find(".answer_x");
        answerO.attr("data-state", "checked");
        answerO.css("transform", "scale(1.7)");
        answerX.attr("data-state", "init");
        answerX.css("transform", "");
    }
    
    NacQuestion.onQuestionAnswerX = function (event) {
        var question = NacQuestion.parentQuestionElement($(this));
        var answerO = question.find(".answer_o");
        var answerX = $(this);
        answerO.attr("data-state", "init");
        answerO.css("transform", "");
        answerX.attr("data-state", "checked");
        answerX.css("transform", "scale(1.7)");
    }
    
    NacQuestion.onQuestionChoice = function (event) {
        var example = $(this);
        var choice = example.parent();
        if (choice.hasClass("single")) {
            if (example.hasClass("selected"))
                return;
            choice.children(".selected").removeClass("selected");
            example.addClass("selected");
        }
        else {
            if (example.hasClass("selected"))
                example.removeClass("selected");
            else
                example.addClass("selected");
        }
    }
    
    NacQuestion.onQuestionConnect = function (event) {
        var question = NacQuestion.parentQuestionElement($(this));
        var selected = question.find(".selected");
        
        selected.removeClass("selected");
        $(this).addClass("selected");
    
        if (selected.length == 0
            || selected.length > 1
            || NacQuestion.parentIsSame($(this), selected))
            return;
    
        var parent = $(this).parent();
        var prevParent = parent.prev("div");
        var nextParent = parent.next("div");
        var selectedParent = selected.parent();
        var duplicate_selection = question.find(".item").hasClass("duplicate-selection");
    
        if (NacQuestion.isSame(prevParent, selectedParent)) {   // 선택된 노드와 현재 선택한 노드의 전 노드가 같은지 검사
            var index = NacQuestion.nodeIndex($(this)) + 1;
    
            if(!duplicate_selection){
                NacQuestion.clearIndex(prevParent.children("div"), index);  //앞 노드에서 연결할려던 노드와 이미 연결되어 있으면 삭제
            }
    
            NacQuestion.setConnectionIndex(selected, index, duplicate_selection);    //처음 선택한 노드에 인덱스 속성 추가
            NacQuestion.drawConnectionLine(question);   //그리기
        }
        else if (NacQuestion.isSame(nextParent, selectedParent)) {
            var index = NacQuestion.nodeIndex(selected) + 1;
            
            if(!duplicate_selection){
                NacQuestion.clearIndex(parent.children("div"), index);
            }
            NacQuestion.setConnectionIndex($(this), index, duplicate_selection);
            NacQuestion.drawConnectionLine(question);
        }
        question.find(".selected").removeClass("selected");
    }
    
    
    NacQuestion.showPassMessage = function (dialog, score) {
        var passContainer = dialog.find(".pass_container");
        if (passContainer.hasClass("nac_display_none"))
            return;
    
        var cutline = parseInt(passContainer.attr("data-cutline-point"), 10);
        if (score >= cutline) {
            passContainer.find(".fail").addClass("nac_display_none");
            passContainer.find(".success").removeClass("nac_display_none");
        }
        else {
            passContainer.find(".fail").removeClass("nac_display_none");
            passContainer.find(".success").addClass("nac_display_none");
        }
    }
    
    NacQuestion.onQuestionOpenResultDialog = function (event) {
        var right = 0;
        var totalScore = 0;
        var questions = $(document).find(".nac_question");
        questions.each(function () {
            var score = NacQuestion.showResult($(this), false);
            if (score != 0) {
                totalScore += score;
                right++;
            }
        });
        var count = questions.length;
        var wrong = count - right;
    
        var dialog = $(document).find(".nac_question_result .result_container");
        dialog.css("display", "flex");
        dialog.find(".score_container .score").html(totalScore);
        dialog.find(".total_container .count").html(count);
        dialog.find(".right_container .count").html(right);
        dialog.find(".wrong_container .count").html(wrong);
        NacQuestion.showPassMessage(dialog, totalScore);
        dialog.animate({ "opacity": 1 }, 200);
    
        NacQuestion.play(dialog.find(".nac_question_audio_result"));
    }
    
    NacQuestion.onQuestionCloseResultDialog = function (event) {
        var dialog = $(document).find(".nac_question_result .result_container");
        dialog.animate({ "opacity": 0 }, 200, function () {
            dialog.css("display", "none");
        });
    
        NacQuestion.pauseAll();
    }
    
    NacQuestion.onQuestionRestart = function (event) {
        var questions = $(document).find(".nac_question");
        questions.each(function () {
            NacQuestion.refreshQuestion($(this), false);
        });
        NacQuestion.onQuestionCloseResultDialog();
    }
    
    NacQuestion.stringArrToNumberArr = function (arr) {
        for (var i = 0; i < arr.length; i++)
            arr[i] = parseInt(arr[i], 10);
    }
    
    NacQuestion.hasAnswerString = function (value, answerList, ignoreSpace) {
        if (!value.length || !answerList.length)
            return false;
    
        value = value.trim();
        if (ignoreSpace)
            value = value.replace(/(\s*)/g, "");
    
        var arr = answerList.split(",");
        for (var i = 0; i < arr.length; i++) {
            var answer = arr[i].trim();
            if (ignoreSpace)
                answer = answer.replace(/(\s*)/g, "");
            if (value == answer)
                return true;
        }
        return false;
    }
    
    NacQuestion.answerIsRight = function (question) {
        question.find(".item .example").removeClass("selected");
        if (!NacQuestion.hasAttr(question, "data-type"))
            return false;
        var type = question.attr("data-type");
        if (type == "letter") {
            var letters = question.find(".answer_letter");
            var ignoreSpace = question.hasClass("allow_space");
            for (var i = 0; i < letters.length; i++) {
                var letter = $(letters[i]);
                if (!NacQuestion.hasAttr(letter, "data-answer"))
                    return false;
                if (!NacQuestion.hasAnswerString(letter.val(), letter.attr("data-answer"), ignoreSpace))
                    return false;
            }
            return true;
        }else if (type == "dragdrop") {                
            var answerObjects = question.find(".dragdrop_answer");
            for(var i = 0; i < answerObjects.length; i++)
            {
                var answers = answerObjects[i].getAttribute("data-select");
                if(answers == "" || answers == null){       // 속성 검사
                    return false;
                }
                var answersList = answers.split(",");
                var answer = answerObjects[i].getAttribute("data-answer");
                if(answersList.length != answer.split(",").length)  // 중복 답일 경우의 검사
                    return false;

                for(var j = 0; j < answersList.length; j++){
                    if(!answer.includes(answersList[j]))    //답안 검사
                        return false;
                }
            }
            return true;
        }
    
        if (!NacQuestion.hasAttr(question, "data-answer"))
            return false;
        var answer = question.attr("data-answer");
        
        if (answer.length <= 0)
            return false;
    
        if (type == "truefalse") {
            if (answer == "true" && question.find(".answer_o").attr("data-state") == "checked")
                return true;
            else if (answer == "false" && question.find(".answer_x").attr("data-state") == "checked")
                return true;
            return false;
        }
        else if (type == "choice") {
            var arr = answer.split(',');
            NacQuestion.stringArrToNumberArr(arr);
            var examples = question.find(".example");
            for (var i = 0; i < examples.length; i++) {
                var isSelected = $(examples[i]).hasClass("selected");
                var isAnswer = arr.indexOf(i + 1);
                if (isSelected && isAnswer < 0 || !isSelected && isAnswer >= 0)
                    return false;
            }
            return true;
        }
        else if (type == "connect") {
            var answerItems = answer;
            var items = question.find(".item");
            if (items.length != 2 && items.length != 3)
                return false;
            var examples = $(items[0]).children("div");
            for (var i = 0; i < examples.length; i++) {
                var example = $(examples[i]);
                if (!NacQuestion.hasAttr(example, "data-next")){
                    if(answerItems.indexOf((i+1) +"-") < 0)
                        continue;
                    return false;
                }
                var index = example.attr("data-next").split(",");
                
                for(var j = 0; j < index.length; j++){
                    var answerItem = (i + 1) + "-" + index[j];
                    if (items.length == 3) {
                        var childs = $(items[1]).children("div");
                        var nextExampleIndex = parseInt(index[j], 10) - 1;

                        if (isNaN(nextExampleIndex) || nextExampleIndex < 0 || nextExampleIndex >= childs.length)
                            return false;
                        example = $(childs[nextExampleIndex]);
                        if (!NacQuestion.hasAttr(example, "data-next")){
                            if(answerItems.indexOf(answerItem) < 0)
                                continue;
                            return false;
                        }
                        var dep2_index = example.attr("data-next").split(",");
                        
                        for(var k = 0; k < dep2_index.length; k++){
                            var temp = answerItem;
                            temp += "-" + dep2_index[k];

                            if (answerItems.indexOf(temp) < 0)
                                return false;
                        }
                        
                    }else{
                        if (answerItems.indexOf(answerItem) < 0){
                            return false;
                        }
                    }

                } 
            }
            return true;
        }
        return false;
    }
    
    NacQuestion.refreshQuestion = function (question, pauseAudio) {
        NacQuestion.hideHint(question);
        NacQuestion.hideExplain(question);
        NacQuestion.hideResult(question);
    
        var type = question.attr("data-type");
        if (type == "truefalse") {
            question.find(".answer_o").attr("data-state", "init").css("transform", "");
            question.find(".answer_x").attr("data-state", "init").css("transform", "");
        }
        else if (type == "letter") {
            question.find(".answer_letter").val("");
        }
        else if (type == "choice") {
            question.find(".selected").removeClass("selected");
        }
        else if (type == "connect") {
            var selected = question.find(".example");
            selected.removeClass("selected");
            selected.removeAttr("data-next");
            NacQuestion.clearCanvas(question.find(".nac_canvas_connect")[0]);
        }
    
        if (pauseAudio)
            NacQuestion.pauseAll();
    
        if (question.hasClass("toggle_helper_left"))
            question.find(".helper_left").css("opacity", "0");
        if (question.hasClass("toggle_helper_right"))
            question.find(".helper_right").css("opacity", "0");
        if (question.hasClass("toggle_helper_top"))
            question.find(".helper_top").css("opacity", "0");
        if (question.hasClass("toggle_helper_bottom"))
            question.find(".helper_bottom").css("opacity", "0");
    }
    
    NacQuestion.displayAnswer = function (question) {
        if (!NacQuestion.hasAttr(question, "data-type"))
            return;
    
        var type = question.attr("data-type");
        if (type == "letter") {
            question.find(".answer_letter").each(function () {
                $(this).val($(this).attr("data-answer"));
            });
        }
    
        if (!NacQuestion.hasAttr(question, "data-answer"))
            return;
    
        var answer = question.attr("data-answer");
        if (type == "truefalse") {
            var answerO = question.find(".answer_o");
            var answerX = question.find(".answer_x");
            if (answer == "true") {
                answerO.attr("data-state", "checked").css("transform", "scale(1.7)");
                answerX.attr("data-state", "init").css("transform", "");
            }
            else if (answer == "false") {
                answerX.attr("data-state", "checked").css("transform", "scale(1.7)");
                answerO.attr("data-state", "init").css("transform", "");
            }
        }
        else if (type == "choice") {
            var arr = answer.split(',');
            NacQuestion.stringArrToNumberArr(arr);
            question.find(".example").each(function (i) {
                if (arr.indexOf(i + 1) >= 0)
                    $(this).addClass("selected");
                else
                    $(this).removeClass("selected");
            });
        }
        //data-answer 의 값을 data-next에 등록시키는 로직
        else if (type == "connect") {
            var answerItems = answer.split(",");    
            var items = question.find(".item");
            for (var i = 0; i < answerItems.length; i++) {
                var arr = answerItems[i].split("-"); 
                NacQuestion.stringArrToNumberArr(arr);
                for (var j = 0; j < arr.length - 1; j++) {
                    // 0-0-0 포맷에서 첫 번째 수는 1단 두 번째 수는 2단 세 번째 수는 3단에 설정을 하기 때문에 
                    // -을 기준으로 나눈 배열의 길이를 보고 가져옴
                    var item = $(items[j]); 
                    var example = $(item.children("div")[arr[j] - 1]); //보기의 인덱스 넘버링은 1부터 시작하기 때문에 -1을 해줘야 함.
                    if(NacQuestion.hasAttr(example, "data-next")){  
                        var data = example.attr("data-next") + "," + arr[j + 1];
                        if(example.attr("data-next").indexOf(arr[j+1]) >= 0)
                            continue;
                        example.attr("data-next", data);
                    }
                    else{
                        example.attr("data-next", arr[j + 1]);
                    }
                }
            }
            NacQuestion.drawConnectionLine(question);
        }
    }
    
    NacQuestion.play = function (audio) {
        NacQuestion.pauseAll();
        if (audio.length == 1)
            audio[0].play();
    }
    
    NacQuestion.pause = function (audio) {
        if (audio.length == 1) {
            audio[0].pause();
            audio[0].currentTime = 0;
        }
    }
    
    NacQuestion.pauseAll = function () {
        $(document).find(".nac_question_audio_right").each(function () {
            this.pause();
            this.currentTime = 0;
        });
        $(document).find(".nac_question_audio_wrong").each(function () {
            this.pause();
            this.currentTime = 0;
        });
        $(document).find(".nac_question_audio_result").each(function () {
            this.pause();
            this.currentTime = 0;
        })
    }
    
    NacQuestion.isSame = function (node1, node2) {
        if (node1.length != 1 || node2.length != 1)
            return false;
        return node1[0] == node2[0];
    }
    
    NacQuestion.parentIsSame = function (child1, child2) {
        return NacQuestion.isSame(child1.parent(), child2.parent());
    }
    
    NacQuestion.nodeIndex = function (node) {
        var nodes = node.parent().children(node[0].nodeName);
        return nodes.index(node[0]);
    }
    
    NacQuestion.clearIndex = function (nodes, index) {
        nodes.each(function (i) {
            if ($(this).attr("data-next") == index.toString())
                $(this).removeAttr("data-next");
        });
    }
    
    NacQuestion.hasIndex = function (nodes, index) {
        for (var i = 0; i < nodes.length; i++) {
            if ($(nodes[i]).attr("data-next") == index.toString())
                return true;
        }
        return false;
    }
    
    NacQuestion.hasAttr = function (node, name) {
        var attr = node.attr(name);
        return typeof attr !== typeof undefined && attr !== false;
    }
    
    NacQuestion.setConnectionIndex = function (node, index, dup) {
        if(dup && NacQuestion.hasAttr(node,"data-next")){
            var answers = node.attr("data-next");
            var contains = answers.indexOf(index.toString());
            if(contains >= 0){  
                var indexs = contains != 0 ? answers.replace("," + index.toString(), "") 
                                          : answers.replace(index.toString() + ",", "")
                if(answers.length > 1)
                    node.attr("data-next", indexs);
                else    //이미 선택한 선을 선택한 경우 선 제거
                    node.removeAttr("data-next");
            }else{  //선이 하나만 있을 경우
                var indexs = answers + "," + index; 
                node.attr("data-next", indexs);
            }
        }else{
            node.attr("data-next", index);
        }
        
    }
    
    NacQuestion.drawConnectionLine = function (question) {
        var canvas = question.find(".nac_canvas_connect");
        if (canvas.length <= 0)
            return;
    
        var width = canvas.innerWidth();
        var height = canvas.innerHeight();
        canvas.attr("width", width);
        canvas.attr("height", height);
    
        var context = canvas[0].getContext("2d");
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.lineWidth = NacQuestion.hasAttr(question, "data-line-width") ? parseInt(question.attr("data-line-width"), 10) : 2;
        context.lineCap = "round";
        context.strokeStyle = "#ff0000";
    
        var items = question.find(".item");
        var answer = question.find(".answer")[0];
        for (var i = 0; i < items.length - 1; i++)      // length: 2 or 3 
            NacQuestion.drawLine(context, answer, $(items[i]).children("div"), $(items[i + 1]).children("div"));
    
        context.stroke();
    }
    
    NacQuestion.clearCanvas = function (canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    NacQuestion.drawLine = function (context, boudingParent, begins, ends) {
        begins.each(function (i) {
            var begin = $(this);
            if (begin.hasClass("nac_display_none"))
                return;
    
            var attr =begin.attr("data-next");
            if(!attr)
                return;
            var indexs = attr.replace("/ /g","g").split(",");
            for(var i =0; i < indexs.length; i++){
                var index = parseInt(indexs[i]) - 1;
                if (isNaN(index) || index < 0 || index >= ends.length)
                    return;
    
                var end = $(ends[index]);
                if (end.hasClass("nac_display_none"))
                    return;
                var startConnector = begin.find(".connector_start");
                var endConnector = end.find(".connector_end");
                if (startConnector.length != 1 || endConnector.length != 1)
                    return;
    
                var offsetX = 0;
                var offsetY = 0;
                var gapX = Math.floor(startConnector.innerWidth() / 2);
                var gapY = Math.floor(startConnector.innerHeight() / 2);
                var parent = startConnector[0];
                while (parent != boudingParent) {
                    offsetX += parent.offsetLeft;
                    offsetY += parent.offsetTop;
                    parent = parent.parentNode;
                }
                context.moveTo(offsetX + gapX, offsetY + gapY);
    
                offsetX = 0;
                offsetY = 0;
                gapX = Math.floor(endConnector.innerWidth() / 2);
                gapY = Math.floor(endConnector.innerHeight() / 2);
                parent = endConnector[0];
                while (parent != boudingParent) {
                    offsetX += parent.offsetLeft;
                    offsetY += parent.offsetTop;
                    parent = parent.parentNode;
                }
                context.lineTo(offsetX + gapX, offsetY + gapY);
            }
        });
    }
    
    // 채점
    NacQuestion.GradingAnswer = function (question){
        var type = question.attr("data-grade-answer");
        
        switch(type){
            case 1: //한번에 채점하기
                var answers = question.children(".dragdrop_answer:first");
                NacQuestion.toggleResult(question);
                break;
            case 2: //한번에 채점하기(분할점수)
                break;
            //3과 4는 drop 이벤트 발생 시 실행
            case 3: //실시간 채점
                break;
            case 4: //실시간 채점(분할점수)
                break;
        }
    }

    //분할점수 채점
    NacQuestion.PartiallyAnswer = function (question){
        var type =question.attr("data-type");
        var score = 0;
        if(type == "dragdrop"){
            var answerObjects = question.find(".dragdrop_answer");
            for(var i = 0; i < answerObjects.length; i++)
            {
                var answers = answerObjects[i].getAttribute("data-select");
                if(answers == "" || answers == null){       // 속성 검사
                    continue;
                }
                var answersList = answers.split(",");
                var answer = answerObjects[i].getAttribute("data-answer");
                if(answersList.length != answer.split(",").length)  // 중복 답일 경우의 검사
                    continue;

                for(var j = 0; j < answersList.length; j++){
                    if(answer.includes(answersList[j])){    //답안 검사
                        score += $("#"+answersList[j]).attr("data-point");
                    }
                }
            }
        }
        return score;
    }