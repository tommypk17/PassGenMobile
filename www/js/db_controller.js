var db;

function buildDb() {
    db = window.openDatabase("passgen_db", "1.0", "PassGen Database", 6 * 1024 * 1024);
    db.transaction(createDb);
    db.transaction(createUserDb);
    renderDbList();
}

function createUserDb(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS user (username, password)');
}

function queryUser(arr) {
    return function (tx) {
        var sql = "SELECT * FROM user WHERE username=? AND password=?";
        tx.executeSql(sql, [arr[0], arr[1]], checkCredentials, errorCb);
    }
}

function deleteUser(arr) {
    return function (tx){
        var sql = "DELETE FROM user WHERE username=? AND password=?";
        tx.executeSql(sql, [arr[0], arr[1]], successCb, errorCb);
        tx.executeSql("DROP TABLE password", [], successCb, errorCb);
    }
}

function checkCredentials(tx, result) {
    try {
        if (result.rows.item(0).username != undefined) {
            if (result.rows.item(0).password != undefined) {
                window.sessionStorage.setItem("username", result.rows.item(0).username);
                window.sessionStorage.setItem("password", result.rows.item(0).password);
                loggedIn(true);
            }
        }
    } catch (err) {
        loggedIn(false);
    }

}

function createUser(arr) {
    return function (tx) {
        var sql = "INSERT INTO user (username, password) VALUES (?,?)";
        console.log(sql);
        tx.executeSql(sql, [arr[0], arr[1]], successCb, errorCb);
        success();
    }
}

function renderDbList() {
    db.transaction(successQueryDb, errorCb, successCb);
}

function createDb(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS password (site_name, username, password)');
}


function errorCb(err) {
    console.log("error processing SQL: " + err.code);
}

function successCb() {
}

function insertDb(arr) {
    return function (tx) {
        var sql = "INSERT INTO password (site_name, username, password) VALUES (?, ?, ?)";
        tx.executeSql(sql, [arr[0], arr[1], arr[2]], renderList, errorCb);
    }
}

function searchDb(arr) {
    return function (tx) {
        if (arr[0] == "") {
            var sql = "SELECT * FROM password";
        } else {
            var sql = "SELECT * FROM password WHERE " + arr[1] + "=?";
        }
        tx.executeSql(sql, [arr[0]], renderList, errorCb);
    }
}

function deleteFromDb(arr) {
    return function (tx) {
        var sql = "DELETE FROM password WHERE site_name=? AND username=? AND password=?";
        tx.executeSql(sql, [arr[0], arr[1], arr[2]], successQueryDb, errorCb);
    }
}

function successInsertDb(tx) {
    successQueryDb(tx);
}

function successQueryDb(tx) {
    var sql = "SELECT * FROM password";
    tx.executeSql(sql, [], renderList, errorCb);

}


function renderList(tx, result) {
    var len = result.rows.length;
    var list = $("<ul></ul>");
    var listItem;
    for (var i = 0; i < len; i++) {
        var listSelection = $("<a class=\"lineItem\" id=\"entry" + i + "\"></a>");
        var listLine = $("<li></li>");
        listItem = "<br />Site Name: " + decrypt(result.rows.item(i).site_name);
        listItem += "<br />Username: " + decrypt(result.rows.item(i).username);
        listItem += "<br />Password: " + decrypt(result.rows.item(i).password);

        listSelection.html(listItem);
        listLine.html(listSelection);
        list.append(listLine);
    }
    $("#page-content").html(list);
    $("#page-content").find("a").click(function (event) {
        maginfyItem(event.target.innerHTML);
    });
}