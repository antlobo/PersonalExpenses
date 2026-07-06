const properties = PropertiesService.getScriptProperties();
/**
 * @var Telegram
 * @brief 1. Fill with your own Telegram Bot Token Id
 *        (e.g. 521xxxx7165:AAHxxxxxxxxjbHr5l-m8rGxxxxxxwbk)
 */
const telegramToken = properties.getProperty("3. Telegram Token") || "";
const telegramUrl = properties.getProperty("Telegram Bot API URL") + telegramToken;
const telegramUrlFiles = properties.getProperty("Telegram Bot API Files URL") + telegramToken;
/**
 * @var webAppUrl
 * @brief 2. Fill with your google web app address
 *        (e.g. https://script.google.com/macros/s/AKfycbXXXXLHeAY-07_A2dmXftSX0JNR8gTxxxEQmzo2j2aWmItIuSsFSYzlB1bJNw0Dovd3qw/exec)
 */
const webAppUrl = properties.getProperty("4. Web App URL"); 
/**
 * @var ssId
 * @brief 3. Fill with Google Spreadsheet Id
 *        (e.g. 1f_IT_kAFIG0TUOZyXXXXW67fxvdxxxxaw6gbAbtxzEo)
 */
 const ssId = properties.getProperty("2. Google Sheet ID");
 /**
 * @var claudeToken
 * @brief 4. Fill with your own Claude API token
 *        (e.g. XXXXXXXXXXXXX)
 */
const claudeToken = properties.getProperty("1. Claude API Token");
const claudeUrl = properties.getProperty("Claude API URL");
/**
 * @var locale
 * @brief 5. Set your locale for date time parsing
 *           e.g. it-IT
 *           e.g. en-US
 *           e.g. es-CO
 */
const locale = properties.getProperty("6. Localization");
/**
* @var currency
* @brief 6. Set your currency
*           e.g. "GBP"
*           e.g. "USD"
*           e.g. "COP"
*/
const currency = properties.getProperty("5. Currency");
/**
* @var Google speechToText
* @brief 7. Set your Google Speech2Text API Key
*           (e.g. XXXXXXXXXXXXX)
*/
const speechToTextToken = properties.getProperty("Google Speech2Text Token");
const speechToTextURL = properties.getProperty("Google Speech2Text URL");
/**
 * @var adminID
 * @brief 8. Admin Telegram Chat Id. 
 *           Used to debug in case of problems, error will be sent as a telegram message
 *           to the chat here mentioned.
 *           (e.g. 875276202)
 */
const adminID = "";   // 4. Fill in your own Telegram ID for debugging
