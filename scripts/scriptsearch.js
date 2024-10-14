var favList = [];
var favIndex = 0;

function start() {
    let query = localStorage.getItem("searchTask");
    $("#nav-search").val(query);
    $("#nav-search-mobile").val(query);

    getTasks(query);
    restoreConfig();
    getFav();
    favNext();
}

function getTasks(query) {

    // Fetch Tasklist
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // Clear task DOM
    $(".task-content").html("");

    // Iterate over every tasks
    for(let i = 0; i < taskList.length; i ++)
    {   
        if(!taskList[i].Name.toLowerCase().includes(query.toLowerCase())) continue;

        let taskdate;
        let dateImg;
        let favImg;
        let taskClass;

        let hour = taskList[i].Hour;
        let minute = taskList[i].Minute;

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
        
        // Compare date to today
        let checkvar = checkToday(taskList[i].Year, taskList[i].Month, taskList[i].Date, taskList[i].Hour, taskList[i].Minute)
        
        // If today
        if(checkvar == 0) {
            taskdate = "Today " + hour + ":" + minute
            dateImg = "./assets/today_active.png";
            taskClass = "task-today";
        }
        // If not today
        else {            
            taskdate = getDayWord(taskList[i].Day) + " " + hour + ":" + minute + ", " + getMonthWord(taskList[i].Month + 1) + " " + taskList[i].Date;
            
            // If past due
            if(checkvar < 0) {
                dateImg = "./assets/today_past.png";
                taskClass = "task-past";
            }
            // If future task
            else {
                dateImg = "./assets/today.png";
                taskClass = "";
            }
        }

        // Get favorite data
        if(taskList[i].Favorite == 0) {
            favImg = "./assets/favorite.png";
        }
        else {
            favImg = "./assets/favorite_active.png";
        }

        // Append to DOM
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

    // Change color according to dark/light mode
    taskColorMode(nightMode);
}

function getFav() {
    // Fetch taskList from localstorage
    favList = [];
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // Iterate over every task
    for(let i = 0; i < taskList.length; i ++)
    {
        // If not favorite, continue
        if(taskList[i].Favorite == 0) continue;
        // Append task to favList
        favList.push(taskList[i]);
    }
}

function addToFav(id) {
    favoriteTask(id);
    getFav();
    if(favList.length < 1) {
        favNext();
    }
}

// Function for favorite tasks carousel
function favNext() {
    // Add to favIndex
    favIndex ++;

    // Prevent overflow
    if(favIndex >= favList.length) {
        favIndex = 0;
    }

    let taskdate;
    let dateImg;
    let taskClass;

    let hour = favList[favIndex].Hour;
    let minute = favList[favIndex].Minute;

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
    
    // Check if task is today
    let checkvar = checkToday(favList[favIndex].Year, favList[favIndex].Month, favList[favIndex].Date, favList[favIndex].Hour, favList[favIndex].Minute)
    // If today
    if(checkvar == 0) {
        
        taskdate = "Today " + hour + ":" + minute
        dateImg = "./assets/today_active.png";
        taskClass = "task-today";
    }
    // If not today
    else {
        taskdate = getDayWord(favList[favIndex].Day) + " " + hour + ":" + minute + ", " + getMonthWord(favList[favIndex].Month + 1) + " " + favList[favIndex].Date;
        
        // If past due
        if(checkvar < 0) {
            dateImg = "./assets/today_past.png";
            taskClass = "task-past";
        }
        // If future task
        else {
            dateImg = "./assets/today.png";
            taskClass = "";
        }
    }

    // Append to DOM
    $(".fav-content").html(
    "<div class=\"fav-inner\">" +
        "<h2 class=\"text-col-light\">" + favList[favIndex].Name + "</h2>" +
        "<p class=\"text-col-light\">" + favList[favIndex].Type + "</p>" +
        "<div class=\"task-date " + taskClass + "\">" +
            "<img src=\"" + dateImg + "\">" +
            "<p class=\"text-col-light task-date " + taskClass + "\">" + taskdate + "</p>" +
        "</div>" +
    "</div>" 
    );
    
    // Animate entrance
    sleep(1).then(() => {
        $('.fav-inner').css("margin-left", "5%");
        $('.fav-inner').css("opacity", "100%");
    });
    
    // Wait 4 seconds, then animate exit
    sleep(4000).then(() => {
        $('.fav-inner').css("margin-left", "200px");
        $('.fav-inner').css("opacity", "0");

        // Wait for animation to finish, then next task
        sleep(800).then(() => {
            favNext();
        });
    });
}