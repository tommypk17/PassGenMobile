function generatePassword() {
    var password = "";
    for (var i = 0; i < 8; i++) {
        var specChar = Math.floor(Math.random() * 48);
        while (specChar < 33 || specChar == 34 || specChar == 39 || specChar == 44) {
            specChar = Math.floor(Math.random() * 48);
        }
        var c = Math.floor(Math.random() * 91);
        while (c < 65) {
            c = Math.floor(Math.random() * 91);
        }
        var num = Math.floor(Math.random() * 10);
        if (i == 0) {
            password += String.fromCharCode(specChar);
        } else if (i <= 4 && i > 0) {
            password += String.fromCharCode(c);
        } else {
            password += num;
        }
    }
    return password;
}

function encrypt(string) {
    var newString = "";
    for (var i = 0; i < string.length; i++) {
        var char = string[i];
        char = Number(string.charCodeAt(i));
        if (char >= 65 || char <= 90 || char >= 97 || char <= 122) {

            if (char >= 65 && char < 78) {
                char += 13;
            } else if (char >= 78 && char <= 90) {
                char -= 13;
            } else if (char >= 97 && char < 110) {
                char += 13;
            } else if (char >= 110 && char <= 122) {
                char -= 13;
            }
            newString += String.fromCharCode(char);
        }
    }
    return newString;
}

function encryptArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = encrypt(arr[i]);
    }
    return arr;
}

function decryptArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = decrypt(arr[i]);
    }
    return arr;
}

function decrypt(string) {
    var newString = "";
    for (var i = 0; i < string.length; i++) {
        var char = string[i];
        char = Number(string.charCodeAt(i));
        if (char >= 65 || char <= 90 || char >= 97 || char <= 122) {
            if (char >= 65 && char < 78) {
                char += 13;
            } else if (char >= 78 && char <= 90) {
                char -= 13;
            } else if (char >= 97 && char < 110) {
                char += 13;
            } else if (char >= 110 && char <= 122) {
                char -= 13;
            }
            newString += String.fromCharCode(char);
        }
    }
    return newString;
}

function createNewEntry(sitename, username, password) {
    var arr = [sitename, username, password];
    arr = encryptArray(arr);
    db.transaction(insertDb(arr), errorCb);
    return true;
}

function searchFor(searchTerm, searchBy) {
    var arr = [searchTerm, searchBy];
    arr[0] = encrypt(arr[0]);
    db.transaction(searchDb(arr), errorCb);
    return true;
}

function login(username, password) {
    var arr = [username, password];
    arr = encryptArray(arr);
    db.transaction(queryUser(arr), errorCb);
}

function createNewUser(username, password) {
    var arr = [username, password];
    arr = encryptArray(arr);
    db.transaction(createUser(arr), errorCb);
    return true;
}

function deleteEntry(sitename, username, password) {
    var arr = [sitename, username, password];
    arr = encryptArray(arr);
    db.transaction(deleteFromDb(arr), errorCb);
}

function checkLoggedIn() {
    var username = window.sessionStorage.getItem("username");
    var password = window.sessionStorage.getItem("password");
    if (username == undefined || password == undefined) {
        $("#content").css("display", "none");
        $("#login-modal").css("display", "block");
    } else {
        username = encrypt(username);
        password = encrypt(password);
        login(username, password);
    }
}

function loggedIn(isLoggedIn) {
    if (isLoggedIn == true) {
        $("#content").css("display", "block");
        $("#login-modal").css("display", "none");
        $("#content").load("content.html");
    } else {
        alert("Incorrect Username or Password!");
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}