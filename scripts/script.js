/* =========== Mobile friendly scripts =========== */
$(document).ready(function() {
    resizeWeb();
});

$(window).resize(function() {
    resizeWeb();
});

function resizeWeb() {
    // If on mobile
    if ($(window).width() < 680) {
        guiFullScreen();
        $('.gui-content').css("top", "100vh");
        return;
    }
    // Else if on desktop
    $(".nav-title").html('TaskEase');
    guiMinimize();
    $('.gui-content').css("top", "100vh");
}

/* =========== Navbar Scripts =========== */

var navLocked = 0;
var nightMode = 1;
var guishown = 0;
var toggleSearch = 0;
var notifMode = 1;

function navEnter() {
    if(navLocked == 1) return;

    $(".navbar").css("width", "30%");
    $(".navbar").css("margin-left", "0%");
    $(".nav-container").css("margin-left", "10%");
    $(".content-container").css("width", "64vw");
}

function navLeave() {
    if(navLocked == 1) return;

    $(".navbar").css("margin-left", "-20%");
    $(".nav-container").css("margin-left", "-70%");
    $(".content-container").css("width", "80vw");
}

function navLock() {
    if(navLocked == 0) {
        $(".util-lock").attr("src", "./assets/navbar/locked.png");
        navLocked = 1;
        localStorage.setItem("navLocked", navLocked);
        return; 
    }
    $(".util-lock").attr("src", "./assets/navbar/unlocked.png");
    navLocked = 0;
    localStorage.setItem("navLocked", navLocked);
}

function colorMode() {
    // If change to lightmode
    if(nightMode == 1) {
        nightMode = 0;
        localStorage.setItem("nightMode", nightMode);
        $(".util-color").attr("src", "./assets/navbar/brightmode.png");
        $(".bg-col-main").css("background-color", "#fdf6e3");
        $(".bg-col-dark").css("background-color", "#ddd6c1");
        $(".bg-col-light").css("background-color", "#93874a46");
        $(".bg-col-light-2").css("background-color","#ece4caeb");
        $(".bg-col-light-alt").css("background-color", "#93874a29");
        $(".bg-col-lighter").css("background-color", "#e7e1cf");
        $(".bg-contrast-lighter").css("background-color", "rgba(68, 51, 15, 0.452)");
        $(".text-col-h").css("color", "#7d6e75");
        $(".text-col-dark").css("color", "#6c5e64");
        $(".filter-dark").css("filter", "brightness(70%)");
        $(".nav-btn-mobile").css("opacity", "90%");
        $(".nav-btn").css("opacity", "90%");
        taskColorMode(0);
        return;
    }
    // If change to nightmode
    nightMode = 1;
    localStorage.setItem("nightMode", nightMode);
    $(".util-color").attr("src", "./assets/navbar/nightmode.png");
    $(".bg-col-main").css("background-color", "#2d2a2e");
    $(".bg-col-dark").css("background-color", "#221f22");
    $(".bg-col-light").css("background-color", "#e5d9f127");
    $(".bg-col-light-2").css("background-color","#363337eb");
    $(".bg-col-light-alt").css("background-color", "#c4bacf0f");
    $(".bg-col-lighter").css("background-color", "#dcd8e0");
    $(".bg-contrast-lighter").css("background-color", "rgba(42, 47, 118, 0.37)");
    $(".text-col-h").css("color", "#f4f4f4");
    $(".text-col-dark").css("color", "#5d585e");
    $(".filter-dark").css("filter", "brightness(20%)");
    $(".nav-btn-mobile").css("opacity", "50%");
    $(".nav-btn").css("opacity", "50%");
    taskColorMode(1);
}

function taskColorMode(args) {
    // Lightmode
    if(args == 0) {
        $(".text-col-light").css("color", "rgb(24, 22, 20)");
        $(".task-date").css("opacity", "90%");
        $(".bg-col-light").css("background-color", "#e8dda746");
    }
    // Darkmode
    else {
        $(".text-col-light").css("color", "rgba(255, 255, 255, 0.511)");
        $(".task-date").css("opacity", "60%");
        $(".bg-col-light").css("background-color", "#e5d9f127");
    }
    
    $(".task-today").css("color", "#66cf8e");
    $(".task-past").css("color", "#cf6666");
}

function disableTransitions() {
    $(".util-color").css("transition", "0ms");
    $(".bg-col-main").css("transition", "0ms");
    $(".bg-col-dark").css("transition", "0ms");
    $(".bg-col-light").css("transition", "0ms");
    $(".bg-col-lighter").css("transition", "0ms");
    $(".bg-contrast-lighter").css("transition", "0ms");
    $(".text-col-h").css("transition", "0ms");
    $(".text-col-dark").css("transition", "0ms");
    $(".filter-dark").css("transition", "0ms");
}

function enableTransitions() {
    $(".util-color").css("transition", "600ms");
    $(".bg-col-main").css("transition", "600ms");
    $(".bg-col-dark").css("transition", "600ms");
    $(".bg-col-light").css("transition", "600ms");
    $(".bg-col-lighter").css("transition", "600ms");
    $(".bg-contrast-lighter").css("transition", "600ms");
    $(".text-col-h").css("transition", "600ms");
    $(".text-col-dark").css("transition", "600ms");
    $(".filter-dark").css("transition", "600ms");
}

function restoreConfig() {
    
    // Get navlock property from previous page
    let nvlocked = localStorage.getItem("navLocked");

    // Restore nav property
    if(nvlocked !== null && nvlocked == 1) {
        navLock();
    }
    
    // Get night/light mode property from previous page
    if(localStorage.getItem("nightMode") !== null) {
        nightMode = parseInt(localStorage.getItem("nightMode"))
    
        // Restore nightmode property
        if (nightMode != 1) {
            nightMode = 1;
            disableTransitions();
    
            colorMode();
    
            sleep(510).then(() => {
                enableTransitions();
            });
        } 
    }

    // Get notification property from previous page
    if(localStorage.getItem("notification") !== null) {
        notifMode = parseInt(localStorage.getItem("notification"));
    }
    // Restore notification property
    if(notifMode == 1) {
        $('.notif-checkbox').attr('checked', true);
    }
    else {
        $('.notif-checkbox').attr('checked', false);
    }
}

function notifModeChange() {
    if(notifMode == 1) {
        notifMode = 0;
    } 
    else {
        notifMode = 1;
    }
    localStorage.setItem('notification', notifMode);
}

function inbox() {  
    window.location.replace("inbox.html");
}

function today() {
    window.location.replace("index.html");
}

function calendar() {
    window.location.replace("calendar.html");
}

/* =========== Overlay Gui Scripts =========== */

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayGui(type) {
    $('.gui-bg').css("display", "block");

    if(type == 'addTask') {
        $('.add-task-div').css("display", "block");
        let today = new Date();
        let month = today.getMonth() + 1;
        if(month < 10) month = "0" + month;

        $("#add_date").val(today.getFullYear() + '-' + month + '-' + today.getDate())
        $("#add_time").val("23:59")
        guishown = 1;
    }
    else if(type == 'notif') {
        $('.notif-gui-div').css("display", "block");
        getNotif();
        guishown = 2;
    }

    sleep(1).then(() => {
        $('.gui-bg').css("background-color", "rgba(0,0,0,0.5)");
        $('.gui-content').css("top", "7.5vh");
    });
}

async function hideGui() {
    $('.gui-bg').css("background-color", "rgba(0,0,0,0)");
    $('.gui-content').css("top", "100vh");

    guishown = 0;
    
    sleep(700).then(() => {
        $('.gui-bg').css("display", "none");
        $('.add-task-div').css("display", "none");
        $('.notif-gui-div').css("display", "none");
    });
}

// Keypress Handler
$(document).on("keydown", function(e) {
    // If escape to exit GUI
    if(guishown == 1 && e.key == "Escape") hideGui();   
    if(guishown == 2 && e.key == "Escape") hideGui();   
    
    if(guishown == 1 && e.key == "Enter") addTask();
    
    // If want to submit a search query
    if($("#nav-search").is(':focus') && e.key == "Enter") searchTask();
    if($("#nav-search-mobile").is(':focus') && e.key == "Enter") searchTask();
});

function guiFullScreen() {
    $('.gui-content').css("left", "0");
    $('.gui-content').css("top", "0");
    $('.gui-content').css("width", "100vw");
    $('.gui-content').css("height", "100vh");
}

function guiMinimize() {
    $('.gui-content').css("left", "35%");
    $('.gui-content').css("top", "7.5vh");
    $('.gui-content').css("width", "30vw");
    $('.gui-content').css("height", "75vh");
}

// Add task btn
function addBtn_Hover(args) {
    if ($(window).width() < 680) {
        return;
    }
    if(args == 1) {
        $(".add-btn-img").css("opacity", "0%");
        sleep(300).then(() => {
            $(".add-btn-img").css("display", "none");
            $(".add-btn-txt").css("display", "inline");
            sleep(1).then(() => {
                $(".add-btn-txt").css("opacity", "100%");
            });
        });
        return;
    }

    $(".add-btn-txt").css("opacity", "0%");
    sleep(300).then(() => {
        $(".add-btn-txt").css("display", "none");
        $(".add-btn-img").css("display", "inline");
        sleep(1).then(() => {
            $(".add-btn-img").css("opacity", "100%");
        });
    });
}

function getNotif() {
    if (localStorage.getItem("notifList") === null) {
        return;
    }

    let notifList = JSON.parse(localStorage.getItem("notifList"));

    $('.notif-gui-content').html(" ")
    
    notifList.map((notify) => {
        $('.notif-gui-content').html($('.notif-gui-content').html() + 
            '<div class=\'notif-gui-item\'>' +
                '<h3 class=\'text-col-dark\'>' + notify.title + '</h3>' +
                '<p class=\'text-col-p\'>' + notify.time + ' | ' + notify.date + '</p>' +
                '<p class=\'text-col-p\'>' + notify.content + '</p>' +
            '</div>'
        );
    });
}

function clearNotif() {
    localStorage.setItem('notifList', JSON.stringify([]));
    hideGui();
}

/* =========== Search Functions =========== */

function searchTask() {
    let query = "";

    if ($(window).width() < 680) {
        query = $("#nav-search-mobile").val();
    } else {
        query = $("#nav-search").val();
    }

    // If no query
    if(query.length < 1) return;

    // Save query in local storage
    localStorage.setItem("searchTask", query);

    // Redirect to page
    window.location.replace("search.html");
}

function searchClick() {
    if ($(window).width() > 680) return;

    if(toggleSearch == 0) {
        $(".top-nav-header .nav-title").css("margin-left", "40vw");
        sleep(500).then(() => {
            $("#nav-search-mobile").css("display", "block");
            sleep(5).then(() => {
                $("#nav-search-mobile").css("width", "55vw");
            });
        });
        toggleSearch = 1;
        return;
    }

    $("#nav-search-mobile").css("width", "0vw");
    sleep(600).then(() => {
        sleep(5).then(() => {
            $("#nav-search-mobile").css("display", "none");
        });
        $(".top-nav-header .nav-title").css("margin-left", "7.5vw");
    });
    toggleSearch = 0;
}