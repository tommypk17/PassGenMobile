document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
}
