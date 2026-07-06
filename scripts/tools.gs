/**
 * Transforms a 2D matrix from a spreadsheet into an array of objects,
 * using the first row as property keys (headers).
 * 
 * @param {string} sheetName - The name of the sheet tab.
 * @returns {Object[]} An array of structured objects representing the rows.
 */
function matrixToObjects(sheetName) {
  // 1. Fetch your 2D matrix from the spreadsheet
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
  const matrix = sheet.getDataRange().getValues(); // Returns [[Header1, Header2], [Val1, Val2]]
  
  // 2. Separate the first row (headers) from the rest of the matrix (data)
  const [headers, ...rows] = matrix;
  
  // 3. Transform rows into an array of objects
  const arrayOfObjects = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Use header text as key, row value as value
      obj[header] = row[index]; 
    });
    return obj;
  });
  
  // View your structured data in the Apps Script logger
  return arrayOfObjects;
}

/**
 * Calculates the mathematical median of an array of numbers.
 * 
 * @param {number[]} valores - Array of numbers to evaluate.
 * @returns {number} The calculated median value.
 */
function median(valores) {
  const sorted = [...valores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Analyzes expense history over the last 3 months to suggest a budget
 * per category based on its median, rounding to the nearest thousand.
 * 
 * @param {string[]} meses - List of months corresponding to each expense record.
 * @param {string[]} categorias - List of categories corresponding to each record.
 * @param {number[]} gastos - List of expense amounts corresponding to each record.
 * @returns {(Array<Array<string|number>>|string)} A nested array with the suggested data, or a warning message if data is insufficient.
 */
function calibrar(months, categories, expenses) {
  // Last 3 unique months
  const uniqueMonths = [...new Set(months)].sort().slice(-3);

  if (uniqueMonths.length < 2) {
    return getLocalString("noCalibration");
  }

  const byCategory = {};
  months.forEach((month, i) => {
    if (!uniqueMonths.includes(month)) return;

    const category = categories[i];
    const expense = expenses[i];

    if (!byCategory[category]) byCategory[category] = {};
    if (!byCategory[category][month]) byCategory[category][month] = 0;

    byCategory[category][month] += expense;
  });

  // Calculate category median and format answer
  const lines = Object.entries(byCategory).map(([category, expensesByMonth]) => {
    const values = Object.values(expensesByMonth);
    const med = median(values);
    const suggested = Math.round(median(values) / 1000) * 1000;
    return [category, suggested, med];
  });
  return lines;
}


function tst() {
  const date = new Date();
  date.setDate(date.getDate() - 15);
  const endDate = getNearestMonthEnd(date);
  const expenses = matrixToObjects(expensesSheet);
  // Suggested Budget
  const expensesBeforeDate = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Date.getFullYear() + "-" + ("0" + (obj.Date.getMonth() + 1)).slice(-2));
  const expensesBeforeCat = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Category);
  const expensesBeforeVal = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Cost);
  const cali = calibrar(expensesBeforeDate, expensesBeforeCat, expensesBeforeVal).map(ele => [ele[0], ele[1]]);

  console.log(`${getLocalString("calibrationCompleted")} \n <code>${cali.map(ele => ele.join("\t")).join("\n")}</code>`);
}

/**
 * Counts the actual visual length of a string, treating complex emojis
 * and compound characters as a single grapheme cluster.
 * 
 * @param {string} str - The string to evaluate.
 * @returns {number} The total count of visual characters.
 */
function getVisualLength(str) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(str)].length;
}

/**
 * Retrieves the closest month-end date based on business logic:
 * If it is the 1st day of the month, it returns the end of the previous month.
 * From the 2nd day onwards, it returns the end of the current month.
 * 
 * @param {Date} [date=new Date()] - Reference date. Defaults to today.
 * @returns {Date} Date object representing the nearest month-end.
 */
function getNearestMonthEnd(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const prevMonthEnd = new Date(d.getFullYear(), d.getMonth(),     0);
  const currMonthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  if (d.getDate() === 1) return prevMonthEnd;

  return currMonthEnd;
}

/**
 * Returns all valid weeks within a specified month.
 * Each week ends on a Sunday and starts on a Monday (or the 1st day of the month).
 *
 * @param {number} year - 4-digit calendar year.
 * @param {number} month - 0-based index of the month (0 = January, 11 = December).
 * @returns {Array<{ weekNumber: number, start: Date, end: Date }>} List of detected weeks.
 */
function getWeeksInMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const weeks    = [];

  // First week: day 1 → first sunday
  let weekEnd = new Date(firstDay);
  while (weekEnd.getDay() !== 0) {
    weekEnd.setDate(weekEnd.getDate() + 1);
  }
  if (weekEnd <= lastDay) {
    weeks.push({ start: new Date(firstDay), end: new Date(weekEnd) });
  }

  // Next weeks: monday → sunday between month
  let weekStart = new Date(weekEnd);
  weekStart.setDate(weekStart.getDate() + 1);

  while (weekStart <= lastDay) {
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekEnd <= lastDay) {
      weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
    }

    weekStart.setDate(weekStart.getDate() + 7);
  }
  return weeks.map((w, i) => ({ weekNumber: i + 1, ...w }));
}

/**
 * Returns the nearest Sunday looking backwards in time.
 * If the provided date is already a Sunday, it returns it unmodified.
 *
 * @param {Date} [date=new Date()] - Reference date.
 * @returns {Date} Date instance set to the calculated Sunday.
 */
function getNearestSunday(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0=dom
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Identifies the week a specific Sunday belongs to within its month,
 * calculates the startDate (Monday or day 1), and generates a UI label.
 *
 * @param {Date} [referenceDate=new Date()] - Reference date used to look up the closest Sunday.
 * @returns {{
 *   weekNumber: number,
 *   totalWeeks: number,
 *   startDate: Date,
 *   endDate: Date
 * }} Detailed metadata about the current week.
 */
function getCurrentWeekInfo(referenceDate = new Date()) {
  const endDate = getNearestSunday(referenceDate);
  const year    = endDate.getFullYear();
  const month   = endDate.getMonth();
  const weeks   = getWeeksInMonth(year, month);

  const week = weeks.find(
    w => w.end.getTime() === endDate.getTime()
  );

  //const label = `Semana ${week.weekNumber} de ${monthName(endDate)} • ${week.start.getDate()} al ${week.end.getDate()} ${monthName(endDate)}`;
  return {
    weekNumber:  week.weekNumber,
    totalWeeks:  weeks.length,
    startDate:   week.start,
    endDate:     week.end
  };
}

/**
 * Converts a Date object into a localized string showing the numeric day and full month name.
 * Relies on the global variable `locale`.
 * 
 * @param {Date} date - Date to be formatted.
 * @returns {string} Formatted date string (e.g., "May 15").
 */
function formatDate(date) {
  return date.toLocaleDateString(locale, { day: "numeric", month: "long" });
}

/**
 * Extracts the full long month name from a Date object.
 * Relies on the global variable `locale`.
 * 
 * @param {Date} date - Reference date.
 * @returns {string} Full name of the month (e.g., "December").
 */
function monthName(date) {
  return date.toLocaleDateString(locale, { month: "long" });
}

/**
 * Applies locale formatting to a number, transforming it into either Percent or Currency.
 * Relies on the global variables `locale` and `currency`.
 * 
 * @param {number} num - Number to format.
 * @param {string} type - Desired format type (must contain keywords like "percent" or "currency").
 * @returns {(string|number)} The formatted string representation or plain number if no type found.
 */
function formatNum(num, type) {
  if (new String(type).toLocaleLowerCase().includes("percent")) {
    return num.toLocaleString(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (new String(type).toLocaleLowerCase().includes("currency")) {
    return num.toLocaleString(locale, {
      style: 'currency',
      currency: currency
    });
  }
  else {
    return num;
  }
}

/**
 * Looks up a translated text within a global localized dictionary collection.
 * Relies on the global variables `loc` and `locale`.
 * 
 * @param {string} text - Original source string acting as the lookup key.
 * @returns {string} The matched translated value, or an empty string if not found.
 */
function getLocalString(id) {
  return loc.filter(obj => obj.lang == locale.substring(0, 2))[0]?.text.filter(obj => obj.id == id)[0]?.value || "";
}

/**
 * Replaces positional placeholders (e.g., `{0}`, `{1}`) inside a template string
 * with dynamically passed arguments.
 * 
 * @param {string} template - The text template containing placeholders.
 * @param {...*} values - Variadic list of values to interpolate sequentially.
 * @returns {string} The fully processed string with replacements applied.
 */
function formatString(template, ...values) {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof values[index] !== 'undefined' ? values[index] : match;
  });
}