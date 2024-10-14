var date = new Date();
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();

function start() {
    restoreConfig();
    getCalendar();
    getTasks(date.getDate(), month, year);
}

function getCalendar() {
    let firstdate = new Date(year, month, 1);
    let lastdate = new Date(year, month + 1, 0);

    let gaps = firstdate.getDay();
    let i = 0;
    // Declare string to store HTML elements
    let calendarStr = '';

    // Set calendar's month
    $(".calendar-month").html(getMonthWord(month + 1) + ' ' + year);
    // Clear calendar DOM
    $("table> tbody").html('');

    // Start Table Row
    calendarStr = calendarStr + "<tr>";

    // Make gaps before first date
    while(i < gaps) {
        calendarStr = calendarStr + "<td>&nbsp;</td>";
        i ++;
    }

    // Start adding dates
    let j;
    for(j = 1; j <= lastdate.getDate(); j ++, i ++) {
        // Container for task marker
        let DateCont = '';
        let DateSelect = '';

        // If row full
        if(i % 7 == 0) {
            calendarStr = calendarStr + "</tr><tr>";
        }
        
        // Check if task is today
        let checkDate = CheckTaskDate(j, month, year);
        // If past
        if(checkDate == -1) {
            DateCont = '<div style=\"background-color: #ff6159;\" class=\"date-marker\"></div>';
        }
        // If today
        else if(checkDate == 1) {
            DateCont = '<div style=\"background-color: #ffbe30;\" class=\"date-marker\"></div>';
        } 
        // If future
        else if(checkDate == 2){
            DateCont = '<div style=\"background-color: #2ace42;\" class=\"date-marker\"></div>';
        }

        // Check if date is selected
        if(j == day) {
            DateSelect = '<div class=\"bg-col-light-alt date-selector\"></div>';
        }

        // Append date to calendar
        calendarStr = calendarStr + 
            "<td onclick=\"selectDate(" + j + ")\">" + 
                DateSelect +
                j + 
                DateCont + 
            "</td>";
    }

    // Fill in remaining gaps
    let remain = i % 7;
    while(remain < 7 && remain != 0) {
        if(i % 7 == 0) {
            calendarStr = calendarStr + "</tr><tr>";
        }

        // Append gap
        calendarStr = calendarStr + "<td>&nbsp;</td>";

        remain ++;
    }

    // Attach calendar to DOM
    $("table> tbody:last").append(calendarStr);
}

function selectDate(dy) {
    day = dy;

    getTasks(dy, month, year);
}

function monthNext(arg) {
    month = month + arg;
    if(month > 11) {
        year ++;
        month = 0;
    } else if(month < 0) {
        year --;
        month = 11;
    }
    getCalendar();
}

function CheckTaskDate(dy, mo, yr) {
    let now = new Date();

    if(dy == now.getDate() && mo == now.getMonth() && yr == now.getFullYear()) {
        return 2;
    }

    let taskList = [];
    taskList = JSON.parse(localStorage.getItem("taskList"));
    
    if(taskList === null) return;
    
    let length = taskList.length;

    for(let i = 0; i < length; i ++) {
        // If task is found
        if(taskList[i].Year == yr && taskList[i].Month == mo && taskList[i].Date == dy) {
            
            // If past due
            if(taskList[i].Time < now.getTime()) return -1;
            
            // If on future
            return 1;
        }
    }
    return 0;
}

function getTasks(dy, mo, yr) {
    // Reload calendar
    getCalendar();

    // If date not provided, return
    if(dy === undefined || mo === undefined || yr === undefined) {
        dy = day;
        mo = month;
        yr = year;
    }

    // Fetch taskList
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // Task heading
    $(".date-task-div").html("<h2 class=\"text-col-p date-task-h\">Tasks on " 
        + dy + " " + getMonthWord(mo + 1) + ", " + yr + 
        "</h2>"
    );

    if(taskList === null) return;

    for(let i = 0; i < taskList.length; i ++)
    {   
        let taskdate;
        let dateImg;
        let favImg;
        let taskClass;

        let hour = taskList[i].Hour;
        let minute = taskList[i].Minute;
        
        // Check if date matches
        if(dy != taskList[i].Date || mo != taskList[i].Month || yr != taskList[i].Year) continue;

        if(taskList[i].Favorite == 0) {
            favImg = "./assets/favorite.png";
        }
        else {
            favImg = "./assets/favorite_active.png";
        }

        // Format time
        if(hour == 0) {
            hour = 12;
        }
        else if(hour < 10) {
            hour = "0" + hour;
        }

        if(minute < 10) {
            minute = "0" + minute;
        }

        // Set date
        taskdate = getMonthWord(mo + 1) + ' ' + dy + ', ' + hour + ':' + minute;
        dateImg = "./assets/today_active.png";
        taskClass = "task-today";

        $(".date-task-div").html($(".date-task-div").html() +
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
                    "<button onclick=\"addToFav(" + i + ")\" class=\"task-fav-btn\">" +
                        "<img src=\"" + favImg + "\">" +
                    "</button>" +
                "</div>" +

                "<div class=\"task-item-mobile\">" +
                    "<button onclick=\"addToFav(" + i + ")\" class=\"task-fav-btn\">" +
                        "<img src=\"" + favImg + "\">" +
                    "</button>" +
                    "<p class=\"text-col-light\">" + taskList[i].Type + "</p>" +
                "</div>" +
            "</div>" +
        "</div>"
        );
    }
    taskColorMode(nightMode);
}