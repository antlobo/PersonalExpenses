/**
 * Handles incoming HTTP GET requests
 * 
 * @param {Object} e - The event parameter containing request details
 */
function doGet(e){
  const params = JSON.stringify(e);
  return ContentService.createTextOutput(params).setMimeType(ContentService.MimeType.JSON);
}


/**
 * Handles incoming HTTP POST requests
 * 
 * @param {Object} e - The event parameter containing request details
 */
function doPost(e) {
  // Log Message
  logMessage(e.postData.contents);
  // Telegram Message
  const contents = JSON.parse(e.postData.contents);
  const from_id = contents.message.from.id;
  const chat_id = contents.message.from.id == contents.message.chat.id ? contents.message.from.id : contents.message.chat.id;
  const personalChat = from_id == chat_id ? true : false;
  const fechaActual = new Date().toISOString().split("T")[0];
  let text = "";

  if (!checkUserAuthentication(from_id)) {
    sendText(chat_id, "⛔ " + from_id + " " + getLocalString("userNotAuthorized"));
    return;
  }

  if (contents.message && contents.message.voice) {
    if (speechToTextToken.trim() == "") {
      sendText(chat_id, getLocalString("noSp2TToken"));
      return;
    }

    const fileId = contents.message.voice.file_id;
    
    // Fetch details and download the file
    const rateHertz = [8000, 12000, 16000, 24000, 48000];
    const voiceBlob = downloadTelegramFile(fileId);
    if (typeof voiceBlob == "string") {
      sendText(chat_id, getLocalString("noGetAudio"));
      return;
    }
    const metadata = getMetadataOggOpus(voiceBlob);

    if (metadata == {}) {
      sendText(chat_id, getLocalString("noValidAudio"));
      return;
    } else if (metadata.seconds >= 60) {
      sendText(chat_id, getLocalString("audioAbove60Sec"));
      return;
    } else if (!rateHertz.includes(metadata.sampleRateHertz)) {
        sendText(chat_id, getLocalString("badSampleRate"));
        return;
    } else {
      text = transcribeAudio(voiceBlob, metadata);
      if(text.includes("Error")) {
        sendText(chat_id, text);
        return;
      }
    }
    
  } else if (contents.message && contents.message.text) {
    text = contents.message.text.trim();

  } else {
    sendText(chat_id, getLocalString("errorMessageType"));
  }

  try {
    if (getLocalString("month").some(item => item.toLowerCase() === text.toLowerCase()) || text == "1") {
      sendText(chat_id, createLimitedMonthSummary());

    } else if (getLocalString("year").some(item => item.toLowerCase() === text.toLowerCase()) || text == "2") {
      sendText(chat_id, createLimitedYearSummary());

    } else if (text == "3") {      
      sendText(chat_id, getLocalString("expenseExample"));
    
    } else if (text == "4") {      
      sendText(chat_id, getLocalString("incomeExample"));
    
    } else if (text == "/" + getLocalString("calibrate")) { 
      const endDate = new Date();
      const expenses = matrixToObjects(expensesSheet).filter(obj => obj.Date <= endDate && obj.Date != "");
      const expensesBeforeDate = expenses.map(obj => obj.Date.getFullYear() + "-" + ("0" + (obj.Date.getMonth() + 1)).slice(-2));
      const expensesBeforeCat = expenses.map(obj => obj.Category);
      const expensesBeforeVal = expenses.map(obj => obj.Cost);
      const cali = calibrar(expensesBeforeDate, expensesBeforeCat, expensesBeforeVal).map(ele => [ele[0], ele[1]]);
      updateSheetValuesFromLookup(cali);
      sendText(chat_id, `${getLocalString("calibrationCompleted")} \n<code>${cali.map(ele => ele.join("\t")).join("\n")}</code>`);
    

    } else if (getLocalString("income").some(item => text.toLowerCase().includes(item.toLowerCase()))) {      
      const res = callClaude(formatString(getLocalString("incomeQuery"), fechaActual, text), outIncome);
      if(typeof res != "string" && res.length != 0) {
        if(addRows(res, getUserName(from_id), incomesSheet)) {
          const headers = Object.keys(res[0]).join('\t');
          const rows = res.map(obj => Object.values(obj).join('\t')).join('\n');
          const tsvData = `<code>${headers}\n${rows}</code>`;
          sendText(chat_id, getLocalString("newIncome") + ": \n" + tsvData);
        } else {
          sendText(chat_id, getLocalString("errorAddingIncome"));
        }
      } else {
        sendText(chat_id, res);
      }
    
    
    } else if (/\d/.test(text)) {
      const res = callClaude(formatString(getLocalString("expenseQuery"), fechaActual, listCategories(), text), outExpense);
      if(typeof res != "string" && res.length != 0) {
        if(addRows(res, getUserName(from_id), expensesSheet)) {
          const headers = Object.keys(res[0]).join('\t');
          const rows = res.map(obj => Object.values(obj).join('\t')).join('\n');
          const tsvData = `<code>${headers}\n${rows}</code>`;
          sendText(chat_id, getLocalString("newExpense") + ": \n" + tsvData);
          sendText(chat_id, createSummaryAfterRegisteredExpense());
        } else {
          sendText(chat_id, getLocalString("errorAddingExpense"));
        }
      } else {
        sendText(chat_id, res);
      }
    
    
    } else {
      sendMainMenu(chat_id);
    }
  } catch (e) {
    logMessage("Error: " + JSON.stringify(e, null, 4));
    //sendText(adminID, "Error: " + JSON.stringify(e, null, 4));
  }
}
