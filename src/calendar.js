import { modal } from './scripts/modal.js';
import { weightDB } from './scripts/weightDB.js';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

let currentDate = new Date();

weightDB.initDB().catch(error => {
    console.error('Failed to initialize database:', error);
});

function goToPrevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    refreshCalendar();
}

function goToNextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    refreshCalendar();
}

function refreshCalendar() {
    const calendarTitle = document.getElementById('calendar-title');
    const calendarMain = document.getElementById('calendar-main');
    calendarTitle.innerHTML = '';
    calendarMain.innerHTML = '';
    generateCalendarTitle();
    generateCalendarMain();
}

function generateCalendarTitle() {

    const monthTitle = document.createElement('div');
    monthTitle.className = 'grid grid-cols-3 font-bold text-gray-1000 dark:text-gray-200';

    const prevMonth = document.createElement('div');
    prevMonth.className = 'text-left cursor-pointer hover:text-blue-500';
    prevMonth.textContent = '❰';
    prevMonth.addEventListener('click', goToPrevMonth);

    const monthName = document.createElement('div');
    monthName.className = 'text-center';
    monthName.textContent = monthNames[currentDate.getMonth()];

    const nextMonth = document.createElement('div');
    nextMonth.className = 'text-right cursor-pointer hover:text-blue-500';
    nextMonth.textContent = '❱';
    nextMonth.addEventListener('click', goToNextMonth);

    monthTitle.appendChild(prevMonth);
    monthTitle.appendChild(monthName);
    monthTitle.appendChild(nextMonth);

    const year = document.createElement('div');
    year.className = 'text-right font-bold text-gray-1000 dark:text-gray-200';
    year.textContent = currentDate.getFullYear();

    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.appendChild(monthTitle);
    calendarTitle.appendChild(year);
}

async function generateCalendarMain() {

    await weightDB.initDB().catch(error => {
        console.error('Failed to initialize database:', error);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    await displayMonthlyWeights(year, month);

    const calendar = document.getElementById('calendar-main');

    // const year = currentDate.getFullYear();
    // const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Get Monday as first day (0 = Sunday, 1 = Monday, etc.)
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // days of week
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.className = 'font-bold text-gray-700 dark:text-gray-300 select-none';
        div.textContent = day;
        calendar.appendChild(div);
    });

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        const div = document.createElement('div');
        div.className = 'p-2';
        calendar.appendChild(div);
    }

    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const div = document.createElement('div');
        div.className = '';

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        weightDB.getWeightByDate(dateString).then(
            weights => {
                const weightValue = weights[0]?.weight;
                weightOfDay.textContent = weightValue ? weightValue : '-';
            }
        )

        const actualBox = document.createElement('div');
        actualBox.className = 'border rounded hover:border-blue-500 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800 m-1 mt-3';
        actualBox.addEventListener('click', (e) => {
            setWeight(e, dateString);
        });

        const dateNumber = document.createElement('div');
        dateNumber.className = 'bg-white dark:bg-gray-500 dark:text-white font-[serif] text-center font-bold absolute select-none pr-1';
        dateNumber.textContent = day;

        const weightOfDay = document.createElement('div');
        weightOfDay.className = 'font-[Fira] p-3 text-center text-gray-500 dark:text-gray-400 text-sm';
        weightOfDay.textContent = '...';

        // Check if this day is today
        const isToday = (
            year === new Date().getFullYear() &&
            month === new Date().getMonth() &&
            day === new Date().getDate()
        );
        if (isToday) {
            actualBox.classList.add('border-red-500');
        }

        div.appendChild(dateNumber);
        div.appendChild(actualBox);
        actualBox.appendChild(weightOfDay);
        calendar.appendChild(div);
    }
}



async function setWeight(e, date) {
    await weightDB.initDB().catch(error => {
        console.error('Failed to initialize database:', error);
    });

    modal.showInputBox('Input weight (kg):'+date, async (weight) => {
        if (weight !== null && weight !== '') {
            const numericWeight = parseFloat(weight);
            if (!isNaN(numericWeight)) {
                await weightDB.getWeightByDate(date)
                await weightDB.insertWeight(date, numericWeight);
                e.target.textContent = numericWeight;
                
            } else {
                modal.alertBox("Invalid input!");
            }
        }
    });
}

//==================================================================//

generateCalendarTitle();
generateCalendarMain();

/**
 * Display monthly weight records in console
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 */
async function displayMonthlyWeights(year, month) {
    try {
        const weights = await weightDB.getWeightsByMonth(year, month);
        const consoleTextBox = document.getElementById('console-text-box');

        if (weights.length === 0) {
            consoleTextBox.textContent = 'No weight records for this month.';
            return;
        }

        const sortedWeights = weights.sort((a, b) => a.date.localeCompare(b.date));
        let outputLines = "";

        sortedWeights.forEach((record) => {
            outputLines = outputLines + record.date + " | " + record.weight + " kg<br>";
        });

        consoleTextBox.innerHTML = outputLines;
    } catch (error) {
        console.error('Failed to display monthly weights:', error);
        const consoleTextBox = document.getElementById('console-text-box');
        consoleTextBox.textContent = 'Error loading weight records.';
    }
}