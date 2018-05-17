document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    $("#header").load("header.html");
    $("#content").load("content.html");
    $("#footer").load("footer.html");

}
