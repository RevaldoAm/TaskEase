var hour;
var min;
var sec;

function start() {
    startClock();
    setDate();
    getTasks();
    restoreConfig();
}

function startClock() {
    // Get current time
    const today = new Date();
    hour = today.getHours();
    min = today.getMinutes();
    sec = today.getSeconds();

    // Format time
    if(hour < 10) {
        hour = "0" + hour;
    }
    if(min < 10) {
        min = "0" + min;
    }
    if(sec < 10) {
        sec = "0" + sec;
    }
    // Append to DOM
    document.querySelector('.clock-txt').innerHTML =  hour + ":" + min + ":" + sec;
    // Recursion
    setTimeout(startClock, 1000);
}

function getTasks() {

    // If there is no task,
    if(localStorage.getItem("taskList") === null) {
        greetUser();
        return;
    }

    // Fetch tasklist
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    $(".task-content").html("");

    // Lists for notifications
    let dueTommorow = [];
    let dueHour = [];
    let duePast = [];

    // Iterate every tasks in list
    let count = 0;
    for(let i = 0; i < taskList.length; i ++)
    {   
        let taskdate;
        let dateImg;
        let favImg;
        let taskClass;

        // Set Notification
        let notify = checkNotify(taskList[i]);
        if(notify == 1) {
            dueTommorow.push(taskList[i].Name + " " + taskList[i].Type);
            taskList[i].NotifWarn = 1;
        } else if(notify == 2) {
            dueHour.push(taskList[i].Name + " " + taskList[i].Type);
            taskList[i].NotifWarn = 2;
        } else if(notify == 3) {
            duePast.push(taskList[i].Name + " " + taskList[i].Type);
            taskList[i].NotifWarn = 3;
        }

        // Format time
        let hour = taskList[i].Hour;
        let minute = taskList[i].Minute;
        
        if(hour == 0) {
            hour = 12;
        }
        else if(hour < 10) {
            hour = "0" + hour;
        }
        
        if(minute < 10) {
            minute = "0" + minute;
        }
        
        // Check if task is for today
        if(checkToday(taskList[i].Year, taskList[i].Month, taskList[i].Date, taskList[i].Hour, taskList[i].Minute) == 0) {
            taskdate = "Today " + hour + ":" + minute
            dateImg = "./assets/today_active.png";
            taskClass = "task-today";
        }
        // If not today, skip
        else {
            continue;
        }

        // Check if task is favourited
        if(taskList[i].Favorite == 0) {
            favImg = "./assets/favorite.png";
        }
        else {
            favImg = "./assets/favorite_active.png";
        }

        // Append task div to DOM
        $(".task-content").html($(".task-content").html() +
            "<div class=\"task-item bg-col-light\">" +
                "<input type=\"radio\" onclick=\"removeTask(" + i + ");\">" +
                "<div class=\"task-item-content\">" +
                    "<div class=\"task-item-h\">" +
                        "<p class=\"task-name text-col-light\">" + taskList[i].Name + "</p>" +
                        "<div class=\"task-date " + taskClass + "\">" +
                            "<img src=\"" + dateImg + "\">" +
                            "<p class=\"text-col-light task-date " + taskClass + "\">" + taskdate + "</p>" +
                        "</div>" +
                    "</div>" +

                    "<div class=\"task-item-right\">" +
                        "<p class=\"text-col-light\">" + taskList[i].Type + "</p>" +
                        "<button onclick=\"favoriteTask(" + i + ")\" class=\"task-fav-btn\">" +
                            "<img src=\"" + favImg + "\">" +
                        "</button>" +
                    "</div>" +

                    "<div class=\"task-item-mobile\">" +
                        "<button onclick=\"favoriteTask(" + i + ")\" class=\"task-fav-btn\">" +
                            "<img src=\"" + favImg + "\">" +
                        "</button>" +
                        "<p class=\"text-col-light\">" + taskList[i].Type + "</p>" +
                    "</div>" +
                "</div>" +
            "</div>"
        );
        count ++;
    }
    // Change task color according to dark/light mode
    taskColorMode(nightMode);

    // Update tasks
    localStorage.setItem("taskList", JSON.stringify(taskList));
    sendNotif(dueTommorow, dueHour, duePast);

    // If no task, greet user
    if(count == 0) {
        greetUser();
    }
    else {
        $(".task-head").css("display", "block");
        $(".greet-div").css("display", "none");
    }
}

function greetUser() {
    // Show greet-div
    $(".task-head").css("display", "none");
    $(".greet-div").css("display", "block");

    let greeting = "";
    let user = "";
    
    // Greet according to time
    if(hour >= 5 && hour < 12) {
        greeting = "morning"
    }
    else if(hour >= 12 && hour < 18) {
        greeting = "afternoon"
    } else {
        greeting = "evening"
    }

    // Get user's name
    if(localStorage.getItem("user") !== null) {
        user = ", " + localStorage.getItem("user");
    }

    // Append greeting to DOM
    $(".greet-txt").html("Good " + greeting + user);
}