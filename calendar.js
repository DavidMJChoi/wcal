function generateCalendarTitle() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();

    const monthTitle = document.createElement('div');
    monthTitle.className = 'font-bold text-gray-1000 dark:text-gray-200';
    monthTitle.textContent = monthNames[today.getMonth()];

    const year = document.createElement('div');
    year.className = 'text-right font-bold text-gray-1000 dark:text-gray-200';
    year.textContent = today.getFullYear();

    const calendarTitle = document.getElementById('calendar-title');   
    calendarTitle.appendChild(monthTitle);
    calendarTitle.appendChild(year);
}

function generateCalendarMain() {
    const calendar = document.getElementById('calendar-main');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Get Monday as first day (0 = Sunday, 1 = Monday, etc.)
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    days.forEach(day => {
        const div = document.createElement('div');
        div.className = 'font-bold text-gray-700 dark:text-gray-300';
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
        div.className = 'font-[serif] py-5 border rounded hover:bg-gray-100 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800';
        div.textContent = day;
        calendar.appendChild(div);
    }
}

generateCalendarTitle();
generateCalendarMain();