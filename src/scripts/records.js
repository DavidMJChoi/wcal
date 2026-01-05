import { modal } from "./modal.js";
import { weightDB } from "./weightDB.js";

/**
 * Display monthly weight records in console
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 */
async function displayMonthlyWeights(year, month) {
    try {
        const weights = await weightDB.getWeightsByMonth(year, month);
        const consoleTextBox = document.getElementById('console-text-box');
        consoleTextBox.textContent = '';

        if (weights.length === 0) {
            consoleTextBox.textContent = 'No weight records for this month.';
            return;
        }
        

        const sortedWeights = weights.sort((a, b) => a.date.localeCompare(b.date));

        sortedWeights.forEach((record) => {
            consoleTextBox.appendChild(generateWeightRecord(record));
        });

    } catch (error) {
        console.error('Failed to display monthly weights:', error);
        const consoleTextBox = document.getElementById('console-text-box');
        consoleTextBox.textContent = 'Error loading weight records.';
    }
}

function generateWeightRecord(record) {
    const recordContainer = document.createElement('div');
    recordContainer.className = 'flex my-1';

    const removeButton = document.createElement('button');
    removeButton.className = 'border px-1';
    removeButton.textContent = 'remove';

    const weightRecord = document.createElement('div');
    weightRecord.className = 'pl-2';
    weightRecord.textContent = record.date + " | " + record.weight + " kg";

    removeButton.addEventListener('click', (e) => {
        removeRecord(e, record);
    })

    recordContainer.appendChild(removeButton);
    recordContainer.appendChild(weightRecord);

    return recordContainer;
}

async function removeRecord(e, record) {
    try {
        await weightDB.initDB();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        return;
    }

    const confirmation = await modal.showConfirmBox('Are you sure about that?');

    if (confirmation) {
        try {
            await weightDB.deleteWeight(record.id);
            const recordElement = e.target.closest('.grid');
            if (recordElement) {
                recordElement.remove();
            }
        } catch (error) {
            console.error('Failed to delete record:', error);
        }
    }
}

export const records = {
    displayMonthlyWeights
};