const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];



function generateCalendarTitle() {

    const today = new Date();

    const monthTitle = document.createElement('div');
    monthTitle.className = 'grid grid-cols-3 font-bold text-gray-1000 dark:text-gray-200';

    const prevMonth = document.createElement('div');
    prevMonth.className = 'text-left cursor-pointer';
    prevMonth.textContent = '❰';

    const monthName = document.createElement('div');
    monthName.className = 'text-center';
    monthName.textContent = monthNames[today.getMonth()];

    const nextMonth = document.createElement('div');
    nextMonth.className = 'text-right cursor-pointer';
    nextMonth.textContent = '❱';
    monthTitle.appendChild(prevMonth);
    monthTitle.appendChild(monthName);
    monthTitle.appendChild(nextMonth);

    const year = document.createElement('div');
    year.className = 'text-right font-bold text-gray-1000 dark:text-gray-200';
    year.textContent = today.getFullYear();

    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.appendChild(monthTitle);
    calendarTitle.appendChild(year);
}

async function generateCalendarMain() {

    await initDB().catch(error => {
        console.error('Failed to initialize database:', error);
    });

    const calendar = document.getElementById('calendar-main');

    let today = new Date();
    // today = new Date('2026-12-31'); 
    const year = today.getFullYear();
    const month = today.getMonth();

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
        dateNumber.className = 'bg-white font-[serif] text-left font-bold absolute select-none pr-1';
        dateNumber.textContent = day;

        const weightOfDay = document.createElement('div');
        weightOfDay.className = 'font-[Fira] p-3 text-center text-gray-500 dark:text-gray-400 text-sm';
        weightOfDay.textContent = '...';

        

        div.appendChild(dateNumber);
        div.appendChild(actualBox);
        actualBox.appendChild(weightOfDay);
        calendar.appendChild(div);
    }
}



async function setWeight(e, date) {
    await initDB().catch(error => {
        console.error('Failed to initialize database:', error);
    });


    showInputBox('Input weight (kg):', async (weight) => {
        if (weight !== null && weight !== '') {
            const numericWeight = parseFloat(weight);
            if (!isNaN(numericWeight)) {
                await weightDB.getWeightByDate(date)
                await weightDB.insertWeight(date, numericWeight);
                e.target.textContent = numericWeight;
            } else {
                alertBox("Invalid input!");
            }
        }
    });
}








//==================================================================//

function showInputBox(title, callback) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="mb-4">${title}</h3>
            <input id="userInput" type="text" class="border p-2 rounded w-full mb-4">
            <div class="flex gap-2">
                <button id="confirmBtn" class="bg-blue-500 text-white px-4 py-2 rounded">DONE</button>
                <button id="cancelBtn" class="bg-gray-300 px-4 py-2 rounded">CANCEL</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#confirmBtn').onclick = () => {
        modal.remove();
        callback(modal.querySelector('#userInput').value);
    }
    modal.querySelector('#cancelBtn').onclick = () => modal.remove();
}

function alertBox(title) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="mb-4">${title}</h3>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => modal.remove(), 1000);
}

//==================================================================//

generateCalendarTitle();
generateCalendarMain();