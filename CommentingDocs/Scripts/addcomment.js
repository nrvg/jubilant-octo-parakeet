var highlighter;
var cssapplierHiglight;
var cssapplierCurrent;
var iframeDoc;

// when updated, asp:updatePanel does not trigger document.ready, so there is this:
var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_endRequest(function () {
    // re-bind your jQuery events here
    bindTextBoxFocus();
});

function bindTextBoxFocus() {
    $(".textbox").focus(function () {
        var index = $(this).attr("data-id");
        var hl = getHighlightById(index);
        hl.unapply();
        hl.classApplier = cssapplierCurrent;
        hl.apply(); // apply uses classApplier
        console.log("focusing " + index);
    });
    $(".textbox").blur(function () {
        var index = $(this).attr("data-id");
        var hl = getHighlightById(index);
        hl.unapply();
        hl.classApplier = cssapplierHiglight;
        hl.apply();
        console.log("bluring " + index);
    });
    $(".addcommentbutton").hide();
}

$(function () {
    console.log("onready");
    bindTextBoxFocus();


    console.log("about to subscribe");
    // listen to postmessage from iframe
    if (window.addEventListener){
        addEventListener("message", listener, false)
    } else {
        attachEvent("onmessage", listener)
    }
    setTimeout(initializeRangy, 100);
});

// when??
function initializeRangy() {
    rangy.init();

    var iframe = document.getElementById("IFrameDocument");
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    highlighter = rangy.createHighlighter(iframeDoc);

    cssapplierHiglight = rangy.createCssClassApplier("highlight", { ignoreWhiteSpace: true }, "*")
    highlighter.addClassApplier(cssapplierHiglight);

    cssapplierCurrent = rangy.createCssClassApplier("currenthighlight", { ignoreWhiteSpace: true }, "*")
    highlighter.addClassApplier(cssapplierCurrent);

    var ser = $("[id$='hdnForHighlighter']").val();
    console.log(ser);
    console.log("deserializing start");
    highlighter.deserialize(ser);
    console.log("deserializing finish");
}

function listener(event) {
    console.log("-----" + event.origin);
    //if (event.origin !== "http://localhost:57770")
    //    return;
    console.log(event.data);

    handleMouseUp(event.data);
}

function handleMouseUp(e) {
    console.log("onmouseup");
 
    var sel = rangy.getSelection(iframeDoc);
    console.log(sel);
    var ranges = sel.getAllRanges();
    console.log("onmouseup");
    unhighlightComments();
    $(".addcommentbutton").hide();

    if (!sel.isCollapsed && ranges.length > 0) {
        var highlights = highlighter.getIntersectingHighlights([ranges[0]]);
        if (highlights.length > 0)
            // do not show "add comment" button if some comment areas are under selection
            highlightComments(highlights)
        else {
            $(".addcommentbutton").show();
        }
    }
    else {
        if (sel.isCollapsed) {
            var coord = e.split("|");
            var x = coord[0], y = coord[1];
            elementMouseIsOver = iframeDoc.elementFromPoint(x, y);
            console.log("iscollapsed");
            var highlight = highlighter.getHighlightForElement(elementMouseIsOver);
            if (highlight)
                highlightComments([highlight]);

            console.log("iscollapsed2");
        }

        $(".addcommentbutton").hide();
        console.log("hide");
    }
}


function unhighlightComments() {
    console.log("unhighlighting");
    $(".acomment").removeClass("dotted");
}

function highlightComments(highlights) {
    console.log("highlighting");
    for (var i = 0; i < highlights.length; i++) {
        var index = highlights[i].id;
        console.log($('.acomment[data-id="' + index + '"]').length);
        $(".acomment[data-id='" + index + "']").addClass("dotted");
        console.log("highlighting " + index);
    }
}

function addbuttonclick() {
    console.log("addclick");

    // highlight current selection with .highlight
    var sel = rangy.getSelection(iframeDoc);
    console.log(sel);

    var something = highlighter.highlightSelection("highlight", sel);
    var ser = highlighter.serialize();
    $("[id$='hdnForHighlighter']").val(ser);

    console.log(ser);
    console.dir(something);
    var index = something[0].id;
    console.log(index);
    $("[id$='hdnForAdd']").val(index);

    return true;
}

function deletebuttonclick(arg) {
    console.log("delete");
    console.log(arg);
    var highliglt = getHighlightById(arg);
    if (highliglt)
        highlighter.removeHighlights([highliglt]);

    var ser = highlighter.serialize();
    $("[id$='hdnForHighlighter']").val(ser);

    // this may be done by ajaxing, no need for postback
    return true;
}

function getHighlightById(arg) {
    for (var i = 0; i < highlighter.highlights.length; i++)
        if (highlighter.highlights[i].id == arg)
            return highlighter.highlights[i];
    return null;
}

    
