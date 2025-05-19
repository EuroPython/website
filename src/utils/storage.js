const STORAGE_PREFIX = "codeheart_v1";

/**
 * Get the full storage key with namespace
 * @param {string} id - Unique identifier for the code
 * @returns {string} - The full storage key
 */
export function getStorageKey(id) {
  if (!id) {
    throw new Error("A code ID is required for storage operations");
  }
  return `${STORAGE_PREFIX}:${id}`;
}

/**
 * Save code to localStorage
 * @param {string} codeId - Unique identifier for the code
 * @param {string} code - The code to save
 * @param {string} title - Optional title for the code
 * @returns {boolean} - Success status
 */
export function saveCode(codeId, code, title = "") {
  try {
    const item = {
      code,
      title,
      timestamp: new Date().toISOString(),
      version: 1, // For future compatibility
    };

    localStorage.setItem(getStorageKey(codeId), JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Failed to save code:", error);
    return false;
  }
}

/**
 * Remove code from localStorage
 * @param {string} codeId - Unique identifier for the code
 * @returns {boolean} - Success status
 */
export function removeCode(codeId) {
  try {
    localStorage.removeItem(getStorageKey(codeId));
    return true;
  } catch (error) {
    console.error("Failed to remove code:", error);
    return false;
  }
}

/**
 * Check if code is saved in localStorage
 * @param {string} codeId - Unique identifier for the code
 * @returns {boolean} - Whether the code is saved
 */
export function isCodeSaved(codeId) {
  try {
    return localStorage.getItem(getStorageKey(codeId)) !== null;
  } catch (error) {
    console.error("Failed to check if code is saved:", error);
    return false;
  }
}

/**
 * Get code from localStorage
 * @param {string} codeId - Unique identifier for the code
 * @returns {Object|null} - The code object or null if not found
 */
export function getCode(codeId) {
  try {
    const data = localStorage.getItem(getStorageKey(codeId));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get code:", error);
    return null;
  }
}

/**
 * Get all saved code snippets
 * @returns {Array} - Array of saved code objects
 */
export function getAllSavedCodes() {
  try {
    const savedCodes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(`${STORAGE_PREFIX}:`)) {
        try {
          const codeId = key.substring(STORAGE_PREFIX.length + 1);
          const data = JSON.parse(localStorage.getItem(key));

          savedCodes.push({
            id: codeId,
            ...data,
          });
        } catch (err) {
          console.error(`Failed to parse saved code: ${key}`, err);
        }
      }
    }

    return savedCodes.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error("Failed to get all saved codes:", error);
    return [];
  }
}
