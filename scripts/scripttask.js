var added = 0;

// Add Task
function addTask() {
    if(added != 0) return;
    added = 1;

    let type = $('#add_type').val();
    let name = $('#add_name').val();
    let duedate = $('#add_date').val();
    let duetime = $('#add_time').val();

    let due = new Date(duedate + " " + duetime);
    const today = new Date();
    
    $(".gui-error-msg").css("color", "rgba(230, 0, 0, 0.7)");

    // Check for blank fields
    if(type == null || name == "" || duedate == "" || duetime == "")
    {
        $(".gui-error-msg").html("Please fill in every fields");
        added = 0;
        return;
    }
    
    if(due < today) 
    {
        $(".gui-error-msg").html("Task's due date must not be set in the past");
        added = 0;
        return;
    }
    
    // Append to user's tasklist
    let tasklist = [];
    
    if(localStorage.getItem("taskList") !== null)
    {
        tasklist = JSON.parse(localStorage.getItem("taskList"));
    }
    
    tasklist.push({
        "Type" : type,
        "Name" : name,
        "Day" : due.getDay(),
        "Date" : due.getDate(),
        "Month" : due.getMonth(),
        "Year" : due.getFullYear(),
        "Hour" : due.getHours(),
        "Minute" : due.getMinutes(),
        "Time" : due.getTime(),
        "Favorite" : 0,
        "NotifWarn" : 0
    });
    
    tasklist.sort(function(a,b) {
        return a.Time - b.Time;
    });

    localStorage.setItem("taskList", JSON.stringify(tasklist));

    $(".gui-error-msg").css("color", "green");
    $(".gui-error-msg").html("Success!");

    sleep(500).then(() => {
        hideGui();
        added = 0;
    });
    
    getTasks();
}

function getDayWord(d)
{
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days[d];
}

function getMonthWord(m)
{
    let months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return months[m - 1];
}

function checkToday(year, month, date, hour, minute) {
    let today = new Date();
    let due = new Date(year, month, date, hour, minute);

    // If today
    if(year == today.getFullYear() && month == today.getMonth() && date == today.getDate()) {
        return 0;
    }
    // Else if future
    else if(due > today) {
        return 1;
    }
    // Else past
    else {
        return -1;
    }
}

function setDate() {
    const today = new Date();
    let date = today.getDate();
    let year = today.getFullYear();
    let day = getDayWord(today.getDay());
    let month = getMonthWord(today.getMonth() + 1);

    document.querySelector('.date-txt').innerHTML = day + ", " + date + " " + month + " " + year;
}

function removeTask(id) {
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // Remove Task
    taskList.splice(id, 1)

    // Update localStorage
    localStorage.setItem("taskList", JSON.stringify(taskList));

    getTasks();
}

function favoriteTask(id) {
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // Favorite Task
    if(taskList[id].Favorite == 1) {
        taskList[id].Favorite = 0;
    }
    else
    {
        taskList[id].Favorite = 1;
    }

    // Update localStorage
    localStorage.setItem("taskList", JSON.stringify(taskList));

    getTasks();
}

/* =========== Notification =========== */
function checkNotify(task)
{
    if(task.NotifWarn > 2) return;

    let now = new Date();
    let minDiff = (task.Time / 60000) - (now.getTime() / 60000);

    // If past due
    if(minDiff < 0 && task.NotifWarn < 3) return 3;
    // If due in this hour
    if(minDiff <= 60 && minDiff > 0 && task.NotifWarn < 2) return 2;
    // If due tommorow
    if(minDiff <= 2500 && minDiff > 1000 && task.NotifWarn == 0) return 1;

    return 0;
}

function sendNotif(tommorowList, hourList, pastList)
{
    if(notifMode == 0) {
        return;
    }
    
    let notifContent = "";
    let dateNow = new Date();
    let hourNow = dateNow.getHours();
    let minuteNow = dateNow.getMinutes();

    if(hourNow < 10) {
        hourNow = "0" + hourNow;
    }
    if(minuteNow < 10) {
        minuteNow = "0" + minuteNow
    }

    let notifList = JSON.parse(localStorage.getItem("notifList"));
    if(notifList === null) notifList = [];

    if(hourList.length > 0) {
        notifContent = notifContent +
            "<div class=\"notif-item\">" +
                "<h3 class=\"text-col-p\">Tasks due this hour</h3>" +
                "<p class=\"text-col-dark\">" + hourList.join(", ") + "</p>" +
            "</div>"

        notifList.push({
            title : 'Tasks due this hour',
            content : hourList.join(", "),
            date : dateNow.getDate() + "-" + dateNow.getMonth() + "-" + dateNow.getFullYear(),
            time : hourNow + ":" + minuteNow
        });
    }

    if(pastList.length > 0) {
        notifContent = notifContent +
            "<div class=\"notif-item\">" +
                "<h3 class=\"text-col-p\">Tasks past due</h3>" +
                "<p class=\"text-col-dark\">" + pastList.join(", ") + "</p>" +
            "</div>"
        
        notifList.push({
            title : 'Tasks past due',
            content : pastList.join(", "),
            date : dateNow.getDate() + "-" + dateNow.getMonth() + "-" + dateNow.getFullYear(),
            time : hourNow + ":" + minuteNow
        });
    }

    if(tommorowList.length > 0) {
        notifContent = notifContent +
            "<div class=\"notif-item\">" +
                "<h3 class=\"text-col-p\">Tasks due tommorow</h3>" +
                "<p class=\"text-col-dark\">" + tommorowList.join(", ") + "</p>" +
            "</div>"

        notifList.push({
            title : 'Tasks due tommorow',
            content : tommorowList.join(", "),
            date : dateNow.getDate() + "-" + dateNow.getMonth() + "-" + dateNow.getFullYear(),
            time : hourNow + ":" + minuteNow
        });
    }

    if(notifContent.length > 0) {
        localStorage.setItem("notifList", JSON.stringify(notifList));
        $('.notif-content').html(notifContent);
        $('.notif-div').css('margin-top', '0px');
    }
}

function closeNotif() {
    $('.notif-div').css('margin-top', '-200px');
}