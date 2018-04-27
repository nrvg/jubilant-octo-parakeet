console.log("onready from ifrmae");
if (parent) {
    console.log("is within main frame");

    document.body.addEventListener("mouseup", function (e) { parent.postMessage("" + e.clientX + "|" + e.clientY, "*"); }, false);
}