/**
 * Returns basic information about the bot in the Apps Script execution logs.
 * Used for testing bot authentication and connectivity.
 * 
 * Relies on global variable `telegramUrl`.
 */
function getMe() {
  const url = telegramUrl + "/getMe";
  const response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

/**
 * Registers your deployed Google Apps Script Web App URL with Telegram.
 * This ensures Telegram forwards all incoming bot interactions to your script.
 * 
 * Relies on global variables `telegramUrl` and `webAppUrl`.
 */
function setWebhook() {
  const url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  const response = UrlFetchApp.fetch(url);
}

/**
 * Sends a text message to a specific Telegram chat using HTML parsing mode.
 * Supports custom reply keyboard markup arrays.
 * 
 * Relies on global variable `telegramUrl`.
 * 
 * @param {(string|number)} chatId - Unique identifier for the target chat or user.
 * @param {string} text - Message text to display, supporting standard HTML tags.
 * @param {Object} [keyBoard] - Optional keyboard layout structure (e.g., ReplyKeyboardMarkup).
 */
function sendText(chatId, text, keyBoard) {
  const data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

/**
 * Deletes an existing message from a Telegram chat history.
 * 
 * Relies on global variable `telegramUrl`.
 * 
 * @param {(string|number)} chatId - Unique identifier for the target chat.
 * @param {(string|number)} messageId - Unique identifier of the message to remove.
 */
function deleteMessage(chatId, messageId) {
  const data = {
    method: "post",
    payload: {
      method: "deleteMessage",
      chat_id: String(chatId),
      message_id: String(messageId)
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

/**
 * Pulls the localized main menu string and sends it directly to the Telegram user.
 * 
 * Relies on internal helper `getLocalString`.
 * 
 * @param {(string|number)} id - Telegram user/chat ID requesting the main menu.
 */
function sendMainMenu(id) {
  sendText(id, getLocalString("menu"));
}

/**
 * Downloads a file from the Telegram Bot API using its file ID.
 * 
 * This function first requests the file path from Telegram and, if successful,
 * fetches the actual binary file content returning it as a Google Apps Script Blob.
 *
 * @param {string} fileId - The unique identifier of the file on Telegram's servers.
 * @returns {Blob|string} The downloaded file as a Google Apps Script Blob object if successful,
 *                        or an error message string if the Telegram API request fails.
 */
function downloadTelegramFile(fileId) {
  const response = UrlFetchApp.fetch(`${telegramUrl}/getFile?file_id=${fileId}`);
  const fileData = JSON.parse(response.getContentText());

  if (fileData.ok) {
    const filePath = fileData.result.file_path;
    const downloadUrl = `${telegramUrlFiles}/${filePath}`;
    
    // Download file as a Blob
    const fileResponse = UrlFetchApp.fetch(downloadUrl);
    return fileResponse.getBlob(); 
  }
  return "Failed to get file path from Telegram.";
}