//==================================================================//

function showConfirmBox(title) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded shadow-lg">
                <h3 class="mb-4">${title}</h3>
                <div class="flex gap-2">
                    <button id="yesBtn" class="bg-blue-500 text-white px-4 py-2 rounded">YES</button>
                    <button id="noBtn" class="bg-gray-300 px-4 py-2 rounded">NO</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#yesBtn').onclick = () => {
            modal.remove();
            resolve(true);
        };
        modal.querySelector('#noBtn').onclick = () => {
            modal.remove();
            resolve(false);
        };

        modal.querySelector('#noBtn').focus();
    });
}

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

    modal.querySelector('#userInput').focus();
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

// Export functions for ES6 module
export const modal = {
    showInputBox,
    showConfirmBox,
    alertBox
};