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

// ==================== DOM ELEMENTS ====================
const calendarDaysContainer = document.querySelector(".calendar-dates");
const currentDateDisplay = document.querySelector(".calendar-current-date");
const navigationButtons = document.querySelectorAll(".calendar-navigation span");



// ====================  BUTTON LISTENERs ====================

//for task button
document.querySelector('.task-button').addEventListener('click', function() {
    console.log("➕ Adding task for day", selectedDayNumber);

    
    // Show menu
    document.querySelector('.menu-container').style.display = 'flex';
     
    
    // Update menu title with selected day
    const heading = document.querySelector('.menu-heading');
    if (heading && selectedDayNumber) {
        heading.textContent = `Tasks for Day ${selectedDayNumber}`;
    }
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