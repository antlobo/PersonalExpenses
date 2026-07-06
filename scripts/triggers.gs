/**
 * Mock global variables for trigger configuration tracking.
 * @type {string}
 */
const lastDayV = "lastDay";
const sundayV = "sunday";

/**
 * Trigger Initialization Script Block
 * 
 * Automatically audits active time-driven project triggers upon script execution.
 * If total project triggers drop below 2, it purges existing active routines and resets 
 * two standardized daily/weekly cron routines scheduled at 10:00 PM (22:00).
 */
const triggers = ScriptApp.getProjectTriggers();

if(triggers.length < 2) {
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger(lastDayV).timeBased().everyDays(1).atHour(22).create();
  ScriptApp.newTrigger(sundayV).timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(22).create();
}

/**
 * Evaluates whether the current day matches the final calendar day of the active month.
 * If criteria are met, executes the monthly summary compilation workflow.
 * 
 * Designed to execute daily via a time-driven project trigger.
 * Relies on external global callback functionality `createSummary` and string constant `lastDayV`.
 */
function lastDay() {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Check if today's date matches the last day's date
  if (today.getDate() === lastDayOfMonth.getDate()) {
    createSummary(lastDayV);
  }
}

/**
 * Executes the weekly summary compilation workflow.
 * 
 * Designed to execute weekly on Sundays via a time-driven project trigger.
 * Relies on external global callback functionality `createSummary` and string constant `sundayV`.
 */
function sunday() {
  createSummary(sundayV);
}