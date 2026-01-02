const DB_NAME = 'weight';
const DB_VERSION = 1;
const STORE_NAME = 'weights';

let db = null;

/**
 * Initialize database connection
 * Creates database and object store if not exists
 * @returns {Promise<IDBDatabase>}
 */
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open database:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = database.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                // Create indexes for date field
                objectStore.createIndex('date', 'date', { unique: false });

                console.log('Object store "weights" created');
            }
        };
    });
}

/**
 * Insert weight record
 * @param {string} date - Date in 'YYYY-MM-DD' format
 * @param {number} weight - Weight value (real number)
 * @returns {Promise<number>} ID of inserted record
 */
function insertWeight(date, weight) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        const record = {
            date: date,
            weight: parseFloat(weight)
        };

        const request = objectStore.add(record);

        request.onsuccess = () => {
            console.log('Record inserted with ID:', request.result);
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Failed to insert record:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get all weight records
 * @returns {Promise<Array>} Array of weight records
 */
function getAllWeights() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Failed to get records:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get weight by date
 * @param {string} date - Date in 'YYYY-MM-DD' format
 * @returns {Promise<Object|null>} Weight record or null
 */
function getWeightByDate(date) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        const request = index.getAll(date);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Failed to get record by date:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Delete weight record by ID
 * @param {number} id - Record ID
 * @returns {Promise<void>}
 */
function deleteWeight(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            console.log('Record deleted:', id);
            resolve();
        };

        request.onerror = () => {
            console.error('Failed to delete record:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Clear all weight records
 * @returns {Promise<void>}
 */
function clearAllWeights() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();

        request.onsuccess = () => {
            console.log('All records cleared');
            resolve();
        };

        request.onerror = () => {
            console.error('Failed to clear records:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get weight records for a specific month
 * @param {number} year - Year (e.g., 2026)
 * @param {number} month - Month (0-11)
 * @returns {Promise<Array>} Array of weight records for the month
 */
function getWeightsByMonth(year, month) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        const request = index.getAll();

        request.onsuccess = () => {
            const allRecords = request.result;
            const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
            const monthRecords = allRecords.filter(record => 
                record.date.startsWith(monthPrefix)
            );
            resolve(monthRecords);
        };

        request.onerror = () => {
            console.error('Failed to get records:', request.error);
            reject(request.error);
        };
    });
}

// Export functions for ES6 module
export const weightDB = {
    initDB,
    insertWeight,
    getAllWeights,
    getWeightByDate,
    deleteWeight,
    clearAllWeights,
    getWeightsByMonth
};