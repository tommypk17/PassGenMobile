$(document).ready(function () {
    buildDb();
    checkLoggedIn();
    $("#btnCreateNewAccount").click(function () {
        $("#new-account-modal").css("display", "block");
    });

    $("#btnCreate").click(function () {
        var username = $("#txtNewUsernameAccount").val();
        var password = $("#txtNewPasswordAccount").val();
        createNewUser(username, password);
        $("#new-account-modal").css("display", "none");
    });

    $("#btnLogin").click(function () {
        var username = $("#txtUsername").val();
        var password = $("#txtPassword").val();
        login(username, password);
    });

    $("#brand-name").click(function () {
        $("#content").load("content.html");
    });

    $("#btnAdd").click(function () {
        $("#add-item-modal").css("display", "block");
    });

    $("#btnList").click(function () {
        $("#heading").html("My Passwords");
        renderDbList();
    });

    $("#btnAccount").click(function () {
        var username = window.sessionStorage.getItem("username");
        var password = window.sessionStorage.getItem("password");
        var accountDetails = decryptArray([username, password]);
        $("#account-info").html("<b>Username:</b> "+accountDetails[0] + "<br/><b>Password:</b> " + accountDetails[1]);
        $("#account-modal").css("display", "block");
    });

    $("#btnSearch").click(function () {
        $("#search-modal").css("display", "block");
    });

    $("#btnSearchFor").click(function () {
        $("#heading").html("Searched Passwords");
        var searchBy = $("#cboSearchBy").val();
        var searchTerm = $("#txtSearchTerm").val();
        searchFor(searchTerm, searchBy);
        $("#search-modal").css("display", "none");
    });

    $("#btnSubmitNewAccount").click(function () {
        if (createNewEntry($("#txtNewSiteName").val(), $("#txtNewUsername").val(), $("#txtNewPassword").val())) {
            success();
            $("#add-item-modal").css("display", "none");
            $("#btnList").click();
        } else {
            fail();
            $("#add-item-modal").css("display", "none");
        }

    });

    $("#btnGenerate").click(function () {
        var pass = generatePassword();
        $("#txtNewPassword").val(pass);
    });

    $(".btnCancel").click(function () {
        $("#txtNewSiteName").val("");
        $("#txtNewUsername").val("");
        $("#txtNewPassword").val("");
        $("#add-item-modal").css("display", "none");
        $("#search-modal").css("display", "none");
        $("#new-account-modal").css("display", "none");
        $("#account-item-modal").css("display", "none");
        $("#account-modal").css("display", "none");
    });


    $("#btnCopy").click(function () {
        var arr = stripHTML($("#account-item-modal-html").html());
        var tempInput = document.createElement("input");
        tempInput.style = "position: absolute; left: 0px; top: 0px";
        tempInput.value = arr[2];
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Password Copied");
        $("#account-item-modal").css("display", "none");

    });


    $("#btnDelete").click(function () {
        var arr = stripHTML($("#account-item-modal-html").html());
        deleteEntry(arr[0], arr[1], arr[2]);
        $("#account-item-modal").css("display", "none");
    });


});

function stripHTML(html) {
    html = html.replace(/(<([^>]+)>)/ig, "");
    html = html.substring(27, html.length).replace("Username", "").replace("Password", "");
    var firstSpace = html.search(":");
    var secondSpace = html.lastIndexOf(":");
    var sitename = html.substring(0, firstSpace);
    var username = html.substring(firstSpace + 2, secondSpace);
    var password = html.substring(secondSpace + 2, html.length);
    password = password.replace("&amp;", "&");
    var arr = [sitename, username, password];
    return arr;
}

function maginfyItem(html) {
    $("#account-item-modal").css("display", "block");
    $("#account-item-modal-html").html("<h4>Account Details:</h4><b>" + html + "</b>");
}


function success() {
    $("#panelSuccess").fadeIn(400, function () {
        sleep(1500);
    });
    $("#panelSuccess").fadeOut(400);
}

function fail() {
    $("#panelFail").fadeIn(400, function () {
        sleep(1500)
    });
    $("#panelFail").fadeOut(400);
}