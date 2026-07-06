/**
 * Retrieves all categories from the categories sheet and formats them 
 * as a single, comma-separated string.
 * 
 * Relies on global variables `ssId` and `categoriesSheet`.
 * 
 * @returns {string} A comma-separated list of categories.
 */
function listCategories() {
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(categoriesSheet);
  let categoriesList = [];
  const lr = sheet.getDataRange().getLastRow();
  for (let i = 2; i <= lr; i++) {
    let category = sheet.getRange(i, 1).getValue();
    categoriesList.push(category);
  }
  return categoriesList.join();
}

/**
 * appends a log entry message to the bottom of the log management sheet.
 * 
 * Relies on global variables `ssId` and `logsSheet`.
 * 
 * @param {string} data - The text or message payload to log.
 */
function logMessage(data) {
  const googleSheet = SpreadsheetApp.openById(ssId);
  const telegramLog = googleSheet.getSheetByName(logsSheet);
  const lr = telegramLog.getDataRange().getLastRow();
  telegramLog.getRange(lr + 1, 1).setValue(data);
}

/**
 * Verifies if a given Telegram ID is authorized inside the users database sheet.
 * Searches backwards from bottom to top for efficiency.
 * 
 * Relies on global variables `ssId` and `usersSheet`.
 * 
 * @param {(string|number)} id - The Telegram ID to look up.
 * @returns {boolean} True if the ID is authenticated, false otherwise.
 */
function checkUserAuthentication(id) {
  // Google Sheet
  const googleSheet = SpreadsheetApp.openById(ssId);
  const authenticatedUsersSheet = googleSheet.getSheetByName(usersSheet);
  const lr = authenticatedUsersSheet.getDataRange().getLastRow();
  for (let i = lr; i > 1; i--) {
    let userId = authenticatedUsersSheet.getRange(i, 1).getValue();
    if (userId == id)
      return true;
  }
  return false;
}

/**
 * Retrieves the display name (alias) associated with a given Telegram ID.
 * Looks up values in column 2 of the users spreadsheet.
 * 
 * Relies on global variables `ssId` and `usersSheet`.
 * 
 * @param {(string|number)} id - The Telegram ID to look up.
 * @returns {string} The matching user alias, or an empty string if not found.
 */
function getUserName(id) {
  // Google Sheet
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(usersSheet);
  const lr = sheet.getDataRange().getLastRow();
  for (let i = lr; i > 1; i--) {
    let userId = sheet.getRange(i, 1).getValue();
    if (userId == id)
      return sheet.getRange(i, 2).getValue();
  }
  return "";
}

/**
 * Compiles a list of all registered non-empty Telegram User IDs.
 * 
 * Relies on global variables `ssId` and `usersSheet`.
 * 
 * @returns {Array<string|number>} An array containing the raw registered user IDs.
 */
function userList() {
  // Google Sheet
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(usersSheet);

  let userLi = [];
  for (let i = 2; i <= sheet.getDataRange().getLastRow(); i++) {
    let user = sheet.getRange(i, 1).getValue();
    user != "" && userLi.push(user);
  }
  return userLi
}

/**
 * Appends structured row entry objects into a specified spreadsheet destination,
 * appending the author/modifier name as the final column.
 * 
 * Relies on global variable `ssId`.
 * 
 * @param {Object[]} data - Array of objects whose key values represent cell content rows.
 * @param {string} name - Name or alias of the user responsible for adding rows.
 * @param {string} sheetName - Target sheet tab destination.
 * @returns {boolean} True if records were added successfully, false if input data is invalid.
 */
function addRows(data, name, sheetName) {
  if (!data || data.length === 0) return false;

  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);

  let rowsToAdd = data.map(line => {
    let values = Object.values(line);
    values.push(name);
    return values;
  });

  const rows = rowsToAdd.length;
  const columns = rowsToAdd[0].length;
  const nextRow = sheet.getLastRow() + 1;

  sheet.getRange(nextRow, 1, rows, columns).setValues(rowsToAdd);
  return true;
}


/**
 * Updates the values in column B of a Google Sheet based on matching keys 
 * provided in a two-dimensional array.
 * 
 * @param {Array<Array<string|number>>} data - Array of objects whose key values represent cell content rows.
 */
function updateSheetValuesFromLookup(data) {
  // Convert the array into a Key-Value map for O(1) fast lookup efficiency
  const valueLookupMap = Object.fromEntries(data);

  // Connect to the spreadsheet environment
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(budgetSheet);
  
  // Safety check: verify if the sheet contains any data rows
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  // Retrieve current data from columns A and B in a single batch read
  const targetRange = sheet.getRange(1, 1, lastRow, 2); 
  const sheetMatrix = targetRange.getValues();

  // Iterate through the spreadsheet rows in-memory
  for (let i = 1; i < sheetMatrix.length; i++) {
    const columnAValue = sheetMatrix[i][0]; // Column A (Key)
    
    // If the key exists in our lookup map, update column B (Value)
    if (valueLookupMap.hasOwnProperty(columnAValue)) {
      sheetMatrix[i][1] = valueLookupMap[columnAValue];
    } else {
      sheetMatrix[i][1] = 0;
    }
  }

  // Push the updated matrix back to the spreadsheet in a single batch write
  targetRange.setValues(sheetMatrix);
}