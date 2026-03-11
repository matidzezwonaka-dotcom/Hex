// ==================== CONSTANTS ====================
const MONTHS = [
    "January 📅", "February 💝", "March 🌱", "April 🌧️", "May 🌸", 
    "June ☀️", "July 🎆", "August 🏖️", "September 🍎", 
    "October 🎃", "November 🦃", "December 🎄"
];

// ==================== GLOBAL VARIABLES ====================
let currentDateObject = new Date();
let currentYear = currentDateObject.getFullYear();
let currentMonthIndex = currentDateObject.getMonth();
let selectedDayNumber = null;
let selectedDayElement = null;

//for the time of the day varible 

let hour = currentDateObject.getHours(); 
let minutes = currentDateObject.getMinutes();


console.log(`Time: ${hour}: ${minutes}`);

// ==================== DOM ELEMENTS ====================
//FOR DAY 
const calendarDaysContainer = document.querySelector(".calendar-dates");
const currentDateDisplay = document.querySelector(".calendar-current-date");
const navigationButtons = document.querySelectorAll(".calendar-navigation span");

//task container in planner 
const taskContainer = document.querySelector('.Add-task-container')

//menu container in planner 
const menuContainer = document.querySelector('.menu-container');

//task management in planner 
const taskManagement = document.querySelector('.task-management');

//day-of-task in planner 
const dayOfTask = document.querySelector('.day-of-task');

//default keeps the task-mangement off until needed 
taskManagement.style.display = 'none';



//=====================FOR EACH BUTTON THAT WAS CREATED=======
const timeButton = document.createElement('button');


//======SETING PROPETY FOR THE BUTTON======


// ====================  BUTTON LISTENERs ====================

//TASK BUTTON LISTENER
document.querySelector('.task-button').addEventListener('click', function() {
    console.log("➕ Adding task for day", selectedDayNumber);
    
    // Show menu
    menuContainer.style.display = 'flex';

    //removes the content of the task button
    taskContainer.style.display = 'none';
     
    
    // Update menu title with selected day
    const heading = document.querySelector('.menu-heading');
    if (heading && selectedDayNumber) {
        heading.textContent = `Tasks for Day ${selectedDayNumber}`;
    }


});

//listens for the menu that are clicked in planner 
    document.querySelector('.menu-button').addEventListener ('click', function () {
           console.log("menu-button was clicked");
        //closes the menu container after the button is pressed 
        menuContainer.style.display = 'none';



         //show task management 
        taskManagement.style.display = ' grid';
            dayOfTask.textContent = `Tasks for Day ${selectedDayNumber}`;
});



// //removes the content of the task management button
document.querySelector('.task-management-exist').addEventListener('click', function () {
        console.log("task-management-exist clicked");
    
         taskManagement.style.display = 'none';

});



//say the menu button was pressed 
document.querySelector('.menu-exist').addEventListener('click', function () {

    console.log("menu exist was clicked");

    //removes the content of the memu 
    document.querySelector('.menu-container').style.display = 'none';

});

// ==================== CALENDAR GENERATION FUNCTIONS ====================
function generateCalendarGrid() {
    // Calculate important dates
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex, lastDateOfMonth).getDay();
    const lastDateOfPreviousMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    let htmlContent = "";

    // Add previous month's days
    for (let counter = firstDayOfMonth; counter > 0; counter--) {
        const dayNumber = lastDateOfPreviousMonth - counter + 1;
        htmlContent += `<li class="inactive">${dayNumber}</li>`;
    }

    // Add current month's days
    for (let dayNumber = 1; dayNumber <= lastDateOfMonth; dayNumber++) {
        const isToday = checkIfIsToday(dayNumber);
        const isSelected = checkIfIsSelected(dayNumber);
        const todayClass = isToday ? "active" : "";
        const selectedClass = isSelected ? "highlight" : "";
        
        htmlContent += `<li class="${todayClass} ${selectedClass}" data-day="${dayNumber}">${dayNumber}</li>`;
    }

    // Add next month's days
    for (let counter = lastDayOfMonth; counter < 6; counter++) {
        const dayNumber = counter - lastDayOfMonth + 1;
        htmlContent += `<li class="inactive">${dayNumber}</li>`;
    }

    // Update display
    currentDateDisplay.textContent = `${MONTHS[currentMonthIndex]} ${currentYear}`;
    calendarDaysContainer.innerHTML = htmlContent;

    setupDayClickHandlers();
}

function checkIfIsToday(dayNumber) {
    const today = new Date();
    const isSameDay = (dayNumber === today.getDate());
    const isSameMonth = (currentMonthIndex === today.getMonth());
    const isSameYear = (currentYear === today.getFullYear());
    
    return isSameDay && isSameMonth && isSameYear;
}

function checkIfIsSelected(dayNumber) {
    return (selectedDayNumber === dayNumber);
}

// ==================== DAY CLICK HANDLING ====================
function setupDayClickHandlers() {
    const activeDayElements = calendarDaysContainer.querySelectorAll('li:not(.inactive)');
    
    activeDayElements.forEach(function(dayElement) {
        dayElement.addEventListener('click', handleDayClick);
    });
}

function handleDayClick(event) {
    const clickedElement = event.currentTarget;
    
    // Remove highlight from previously selected day
    if (selectedDayElement) {
        selectedDayElement.classList.remove('highlight');
    }

    // Add highlight to clicked day
    clickedElement.classList.add('highlight');
    selectedDayElement = clickedElement;

    // Store the selected day number
    const dayAttributeValue = clickedElement.getAttribute('data-day');
    selectedDayNumber = parseInt(dayAttributeValue);

    // Show task button container
    const taskButton = document.querySelector('.Add-task-container');
    taskButton.style.display = 'flex';
}

// ==================== NAVIGATION HANDLING ====================
function handleNavigationButtonClick(event) {
    const buttonElement = event.currentTarget;
    const buttonId = buttonElement.id;
    
    // Change month
    if (buttonId === "calendar-prev") {
        currentMonthIndex = currentMonthIndex - 1;
    } else if (buttonId === "calendar-next") {
        currentMonthIndex = currentMonthIndex + 1;
    }

    // Handle year change when month goes out of bounds
    if (currentMonthIndex < 0) {
        currentDateObject = new Date(currentYear, currentMonthIndex, currentDateObject.getDate());
        currentYear = currentDateObject.getFullYear();
        currentMonthIndex = currentDateObject.getMonth();
    } else if (currentMonthIndex > 11) {
        currentDateObject = new Date(currentYear, currentMonthIndex, currentDateObject.getDate());
        currentYear = currentDateObject.getFullYear();
        currentMonthIndex = currentDateObject.getMonth();
    }

    // Clear selection when month changes
    selectedDayNumber = null;
    selectedDayElement = null;

    // Regenerate calendar
    generateCalendarGrid();
}

function setupNavigationButtons() {
    navigationButtons.forEach(function(buttonElement) {
        buttonElement.addEventListener("click", handleNavigationButtonClick);
    });
}

// ==================== INITIALIZATION ====================
function initializeCalendar() {
    setupNavigationButtons();
    generateCalendarGrid();
}

// ==================== START APPLICATION ====================
initializeCalendar();

//=============SET TIME FOR DAY MENU==========================
function SetTime () {
   // first display the currunet time and work from there 
    

    console.log(timeButton);
}

//===========FOR THE TASK BAR (TIME) ==============

//===========light bulb logic 

const body = document.getElementById('body');
        const bulb = document.getElementById('bulb');
        const switchEl = document.getElementById('switch');
        const switchLabel = document.getElementById('switchLabel');
        const titles = document.getElementById('titles');
        const loginButtons = document.getElementById('loginButtons');
        const hint = document.getElementById('hint');

        let isOn = false;

        switchEl.addEventListener('click', () => {
            isOn = !isOn;

            if (isOn) {
                // Switch ON
                switchEl.classList.add('on');
                switchLabel.textContent = 'ON';
                
                // Light up bulb
                bulb.classList.add('glow');
                
                // Lighten background
                body.classList.add('lit');
                
                // Fade out hint
                hint.classList.add('fade-out');
                
                // Show titles and buttons with dramatic delay
                setTimeout(() => {
                    titles.classList.add('visible');
                }, 200);
                
                setTimeout(() => {
                    loginButtons.classList.add('visible');
                }, 400);
                
            } else {
                // Switch OFF
                switchEl.classList.remove('on');
                switchLabel.textContent = 'OFF';
                
                // Dim bulb
                bulb.classList.remove('glow');
                
                // Darken background
                body.classList.remove('lit');
                
                // Show hint again
                hint.classList.remove('fade-out');
                
                // Hide titles and buttons
                titles.classList.remove('visible');
                loginButtons.classList.remove('visible');
            }
        });

        // Prevent clicking links when switch is off
        document.querySelectorAll('.b').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!isOn) {
                    e.preventDefault();
                    // Optional: give feedback
                    hint.style.opacity = '1';
                    hint.textContent = 'flip the switch first!';
                    setTimeout(() => {
                        hint.textContent = 'flip the switch to begin';
                        hint.style.opacity = '0.5';
                    }, 1500);
                }
            });
        });