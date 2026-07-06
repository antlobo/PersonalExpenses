/**
 * Compiles a comprehensive financial report for a given month.
 * Computes category-specific cost overruns, tracks individual contributor weights, 
 * extracts active payment installment counts, and generates predictive target metrics 
 * using historic median calibrators.
 * 
 * Relies on: `getNearestMonthEnd`, `matrixToObjects`, `formatNum`, `calibrar`, `formatString`, 
 * `getLocalString`, and `monthName`.
 * 
 * @param {Date} [date=new Date()] - Reference date anchor to isolate target operational month boundaries.
 * @returns {string} Fully localized, text-padded monthly summary report ready for distribution.
 */
function createMonthSummary(date = new Date()) {
  // Set report's dates
  const endDate = getNearestMonthEnd(date);
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  const endLastMonth = new Date();
  endLastMonth.setDate(startDate.getDate() - 1);
  const startLastMonth = new Date(endLastMonth.getFullYear(), endLastMonth.getMonth(), 1);
  const startNextMonth = new Date();
  startNextMonth.setDate(endDate.getDate() + 1);
  const endNextMonth = new Date(startNextMonth.getFullYear(), startNextMonth.getMonth() + 1, 0);

  const expenses = matrixToObjects(expensesSheet);
  const budget = matrixToObjects(budgetSheet);
  const categories = matrixToObjects(categoriesSheet).map(obj => ({...obj, Text:`${obj.Icon} ${obj.Category}`}));

  const arrCurrentMonthExp = expenses.filter(ele => ele.Date >= startDate && ele.Date <= endDate);
  
  const currentMonthExpenseTotal = arrCurrentMonthExp.reduce((a, b) => a + b.Cost, 0);
  const budgetTotal = budget.reduce((a, b) => a + b.Total, 0);
  const transactionAmount = arrCurrentMonthExp.length;
  const budgetPercentage = arrCurrentMonthExp.reduce((sum, item) => sum + item.Cost, 0)  / budget.reduce((sum, item) => sum + item.Total, 0);
  const lastMonthExp = expenses.length > 0 ? expenses.filter(ele => ele.Date >= startLastMonth && ele.Date <= endLastMonth).reduce((sum, item) => sum + item.Cost, 0) : 1;

  const totalByCategory = arrCurrentMonthExp.reduce((accumulator, currentItem) => {
      const category = currentItem.Category;
      const cost  = currentItem.Cost;
      accumulator[category] = (accumulator[category] || 0) + cost;
      return accumulator;
  }, {});
  const arrayGastos = Object.entries(totalByCategory).map(([clave, valor]) => ({
      Text: categories.find(obj => obj.Category === clave)?.Text,
      Category: clave,
      Cost: valor,
      Budget: budget.find(obj => obj.Category === clave)?.Total,
      Percentage: budget.find(obj => obj.Category === clave)?.Total != 0 ? valor / budget.find(obj => obj.Category === clave)?.Total : -1
  }));

  const cheapestCat = arrayGastos.length > 0 ? arrayGastos.reduce((lowest, current) => {return (current.Cost < lowest.Cost && current.Budget != 0) ? current : lowest;})?.Category : "";
  const expensivestCat = arrayGastos.length > 0 ? arrayGastos.reduce((highest, current) => {return (current.Cost > highest.Cost && current.Budget != 0) ? current : highest;}) : {Category:"", Cost:0, Budget:0};
  const largestCatName = arrayGastos.length > 0 ? arrayGastos.reduce((largest, current) => {return (current.Category.length > largest.Category.length) ? current : largest})?.Category.length + 3 : 0;
  const largestCatExpense = arrayGastos.length > 0 ? formatNum(arrayGastos.reduce((largest, current) => {return (formatNum(current.Cost, "currency").length > formatNum(largest.Cost, "currency").length) ? current : largest})?.Cost, "currency").length : 0;
  const largestCatBudget = arrayGastos.length > 0 ? formatNum(arrayGastos.reduce((largest, current) => {return (formatNum(current.Budget, "currency").length > formatNum(largest.Budget, "currency").length) ? current : largest})?.Budget, "currency").length : 0;
  const largestCatPercentage = arrayGastos.length > 0 ? formatNum(arrayGastos.reduce((largest, current) => {return current.Percentage > largest.Percentage ? current : largest})?.Percentage, "percentage").length : 0;

  const catsWithBudget = arrayGastos.filter(obj => obj.Budget != 0).sort((a, b) => b.Cost - a.Cost).map(obj => `${obj.Text.padEnd(largestCatName)} ${formatNum(obj.Cost, "currency").padStart(largestCatExpense)} / ${formatNum(obj.Budget, "currency").padStart(largestCatBudget)} ${formatNum(obj.Percentage, "percentage").padStart(largestCatPercentage)} ${obj.Cost <= obj.Budget ? "🟢" : ((obj.Percentage-1)*100) <= 10 ? "🟡" : "🔴"}`);

  const catsWithoutBudget = arrayGastos.filter(obj => obj.Budget == 0).sort((a, b) => b.Cost - a.Cost).map(obj => `${obj.Text.padEnd(largestCatName)} ${formatNum(obj.Cost, "currency").padStart(largestCatExpense)}`);

  const userExpenses = Object.entries(arrCurrentMonthExp.reduce((accumulator, currentItem) => {
      const name = currentItem.Name;
      const cost  = currentItem.Cost;
      accumulator[name] = (accumulator[name] || 0) + cost;
      return accumulator;
  }, {})).map(([key, value]) => `${key} — ${formatNum(value, "currency").padStart(11)} (${formatNum(arrCurrentMonthExp.reduce((a, b) => a + b.Cost, 0) > 0 ? value / arrCurrentMonthExp.reduce((a, b) => a + b.Cost, 0) : 0, "percentage")})`);

  // Installments
  const installments = expenses.filter(ele => ele.Date >= startNextMonth && ele.Date <= endNextMonth).filter(ele => ele.Description.toLowerCase().includes("cuota"));
  const largestInstallmentName = installments.length > 0 ? installments.reduce((largest, current) => {return (current.Description.length > largest.Description.length) ? current : largest})?.Description.length : 0;
  let installmentsText = installments.length > 0 ? installments.map(obj => `${obj.Description.padEnd(largestInstallmentName)} · ${formatNum(obj.Cost, "currency")}`) : [];
  installments.length > 0 && installmentsText.push(formatString(getLocalString("installmentsText"), getLocalString("installment").padEnd(largestInstallmentName), formatNum(installments.reduce((a, b) => a + b.Cost, 0), "currency")));

  // Suggested Budget
  const expensesBeforeDate = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Date.getFullYear() + "-" + ("0" + (obj.Date.getMonth() + 1)).slice(-2));
  const expensesBeforeCat = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Category);
  const expensesBeforeVal = expenses.filter(obj => obj.Date <= endDate && obj.Date != "").map(obj => obj.Cost);
  const cali = calibrar(expensesBeforeDate, expensesBeforeCat, expensesBeforeVal);
  const median = typeof cali != "string" ? cali.map(r => r[2]).reduce((a, b) => a + b) : 0;
  const suggestedBudget = typeof cali != "string" ? cali.map(r => r[1]).reduce((a, b) => a + b) : 0;

  return formatString(getLocalString("monthReport"),
  /* Date */          monthName(endDate), endDate.getFullYear(),
  /* SUMMARY */       formatNum(currentMonthExpenseTotal, "currency"),
                      formatNum(budgetTotal, "currency"),
                      currentMonthExpenseTotal > budgetTotal ? "🔴 " + formatNum(currentMonthExpenseTotal - budgetTotal, "currency") + " " + getLocalString("weekReportBudgetOver") : "🟢 " + formatNum(budgetTotal - currentMonthExpenseTotal, "currency") + " " + getLocalString("weekReportBudgetLower"),
                      formatNum(budgetPercentage, "percentage"),
                      transactionAmount,
  /* CATEGORY */      catsWithBudget.join("\n"),
                      cheapestCat,
                      cheapestCat != expensivestCat.Category ? expensivestCat.Category : "",  
                      cheapestCat != expensivestCat.Category ? formatNum(expensivestCat.Cost-expensivestCat.Budget, "currency") : formatNum(0, "currency"), 
                      catsWithoutBudget.length > 0 ? `\n\n${formatString(getLocalString("noBudgetAssigned"))} \n` + catsWithoutBudget.join("\n") + "\n": "\n",
  /* COMPARISON */    monthName(endLastMonth),
                      formatNum(currentMonthExpenseTotal-lastMonthExp, "currency"), formatNum((currentMonthExpenseTotal/lastMonthExp)-1, "percentage"),
                      formatNum(currentMonthExpenseTotal-median, "currency"), formatNum((currentMonthExpenseTotal/median)-1, "percentage"),
  /* USER */          userExpenses.join("\n"),
  /* INSTALLMENTS */  installments.length > 0 ? installmentsText.join("\n") + "\n" : "",
  /* NEXT MONTH */    monthName(startNextMonth).toUpperCase(),
                      formatNum(suggestedBudget, "currency")
  );
}

/**
 * Generates the weekly financial operational digest sent on Sundays.
 * Tracks performance variants compared to the previous week, updates spending bar indicators,
 * runs a velocity projection tracking estimated month-end targets, and creates thresholds for risk alerts.
 * 
 * Relies on: `getNearestSunday`, `getCurrentWeekInfo`, `matrixToObjects`, `formatNum`, 
 * `formatString`, and `getLocalString`.
 * 
 * @param {Date} [date=new Date()] - Reference date used to calculate the operational week window boundaries.
 * @returns {string} Fully formatted and localized weekly textual performance report.
 */
function createSundaySummary(date = new Date()) {
  // Set report's dates
  const endDate = getNearestSunday(date);
  const info = getCurrentWeekInfo(endDate)
  const startDate = info.startDate;
  const lastWeekStartDate = new Date();
  lastWeekStartDate.setDate(startDate.getDate() - 7);
  const lastWeekEndtDate = new Date();
  lastWeekEndtDate.setDate(endDate.getDate() - 7);
  const monthStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const monthEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const budget = matrixToObjects(budgetSheet);
  const categories = matrixToObjects(categoriesSheet).map(obj => ({...obj, Text:`${obj.Icon} ${obj.Category}`}));
  const expense = matrixToObjects(expensesSheet).filter(obj => obj.Date <= monthEndDate);
  const expensesWeek = expense.filter(obj => obj.Date >= startDate && obj.Date <= endDate);
  const expensesMonth = expense.filter(obj => obj.Date >= monthStartDate && obj.Date <= endDate);
  const expensesLastWeek = matrixToObjects(expensesSheet).filter(obj => obj.Date >= lastWeekStartDate && obj.Date <= lastWeekEndtDate);
  const expensesDiffWeekPercentage = expensesWeek.reduce((a, b) => a + b.Cost, 0) / expensesLastWeek.reduce((a, b) => a + b.Cost, 0) - 1 || 0;
  const budgetPercentage = expensesMonth.reduce((a, b) => a + b.Cost, 0) / budget.reduce((a, b) => a + b.Total, 0) || 0;
  const monthEndProjection = (expensesMonth.reduce((a, b) => a + b.Cost, 0) / date.getDate()) * monthEndDate.getDate();
  const budgetVsMonthEnd = budget.reduce((a, b) => a + b.Total, 0) - monthEndProjection;

  let totalByCategory = expensesWeek.reduce((accumulator, currentItem) => {
      const category = currentItem.Category;
      const cost  = currentItem.Cost;
      accumulator[category] = (accumulator[category] || 0) + cost;
      return accumulator;
  }, {});
  const arrayGastosWeek = Object.entries(totalByCategory).map(([clave, valor]) => ({
      Text: categories.find(obj => obj.Category === clave)?.Text,
      Category: clave,
      Cost: valor,
      Budget: budget.find(obj => obj.Category === clave)?.Total,
      Percentage: budget.find(obj => obj.Category === clave)?.Total != 0 ? valor / budget.find(obj => obj.Category === clave)?.Total : -1
  }));

  totalByCategory = expensesMonth.reduce((accumulator, currentItem) => {
      const category = currentItem.Category;
      const cost  = currentItem.Cost;
      accumulator[category] = (accumulator[category] || 0) + cost;
      return accumulator;
  }, {});
  const arrayGastosMonth = Object.entries(totalByCategory).map(([clave, valor]) => ({
      Text: categories.find(obj => obj.Category === clave)?.Text,
      Category: clave,
      Cost: valor,
      Budget: budget.find(obj => obj.Category === clave)?.Total,
      Percentage: budget.find(obj => obj.Category === clave)?.Total != 0 ? valor / budget.find(obj => obj.Category === clave)?.Total : -1
  }));

  const topThreeExpCats = arrayGastosWeek.sort((a, b) => b.Cost - a.Cost).slice(0, 3);
  const largestCatName = topThreeExpCats.length > 0 ? topThreeExpCats.reduce((largest, current) => {return (current.Category.length > largest.Category.length) ? current : largest})?.Category.length + 3 : 0;

  const totalByUser = expensesWeek.reduce((accumulator, currentItem) => {
      const user = currentItem.Name;
      const cost  = currentItem.Cost;
      accumulator[user] = (accumulator[user] || 0) + cost;
      return accumulator;
  }, {});
  const userExpenses = Object.entries(totalByUser).map(([clave, valor]) => ({
      Name: clave,
      Cost: valor,
      Percentage: valor / expensesWeek.reduce((a, b) => a + b.Cost, 0)
  })).map(obj => `${obj.Name} ${formatNum(obj.Cost, "currency").padStart(13)} (${formatNum(obj.Percentage, "percentage").padStart(6)})`);

  const alerts = [];
  if (budgetPercentage > 0.9 && monthEndDate.getDate() - endDate.getDate()  < 7) {
    alerts.push(formatString(getLocalString("weekReportBudgetAlert1"), formatNum(budgetPercentage, "percentage"), monthEndDate.getDate() - endDate.getDate()));
  }

  const alertArray = arrayGastosMonth.sort((a, b) => b.Percentage - a.Percentage);
  for (let i = 0; i < alertArray.length; i++) {
    if (alertArray[i].Budget == 0) { 
      alerts.push(formatString(getLocalString("weekReportBudgetAlert2"), alertArray[i].Category, formatNum(alertArray[i].Cost, "currency")));
    } else if (alertArray[i].Percentage > 1) {
      alerts.push(formatString(getLocalString("weekReportBudgetAlert3"), alertArray[i].Category, formatNum(alertArray[i].Cost, "currency"), formatNum(alertArray[i].Budget, "currency"), formatNum(alertArray[i].Cost - alertArray[i].Budget, "currency")));
    } else if (alertArray[i].Percentage > 0.75) {
      alerts.push(formatString(getLocalString("weekReportBudgetAlert4"), alertArray[i].Category, formatNum(alertArray[i].Percentage, "percentage"), formatNum(alertArray[i].Budget - alertArray[i].Cost, "currency")));
    }
  }

  return formatString(getLocalString("weekReport"),
  /* Date */          formatString(getLocalString("weekReportDateLabel"), info.weekNumber, monthName(info.endDate), info.startDate.getDate(), info.endDate.getDate(), monthName(info.endDate)),
  /* THIS WEEK */     formatNum(expensesWeek.reduce((a, b) => a + b.Cost, 0), "currency"),
                      formatNum(expensesDiffWeekPercentage, "percentage"), expensesDiffWeekPercentage > 0 ? "\u{2B06}" : expensesDiffWeekPercentage < 0 ? "\u{2B07}" : "\u{2194}", formatNum(expensesWeek.reduce((a, b) => a + b.Cost, 0) - expensesLastWeek.reduce((a, b) => a + b.Cost, 0), "currency"),
                      userExpenses.length > 0 ? "\n" + userExpenses.join("\n") + "\n" : "",
  /* MONTH ACCUM */   formatNum(expensesMonth.reduce((a, b) => a + b.Cost, 0), "currency").padStart(16),
                      formatNum(budget.reduce((a, b) => a + b.Total, 0), "currency").padStart(16),
                      formatNum(budgetPercentage, "percentage"), "█".repeat(budgetPercentage*10) + "░".repeat(10-budgetPercentage*10), 
  /* PROJECTION */    formatNum(monthEndProjection, "currency"), budgetVsMonthEnd == 0 ? "" : formatNum(Math.abs(budgetVsMonthEnd), "currency"),
                      budgetVsMonthEnd > 0 ? getLocalString("weekReportBudgetLower") : budgetVsMonthEnd < 0 ? getLocalString("weekReportBudgetOver") : "",
                      budgetVsMonthEnd > 0 ? "\u{1F7E2} " + getLocalString("weekReportBudgetLower2")  : budgetVsMonthEnd == 0 ? "\u{1F7E1} " + getLocalString("weekReportBudgetOver2") : "\u{1F534} " + getLocalString("weekReportBudgetAlert"),
  /* TOP 3 */         topThreeExpCats.length > 0 ? topThreeExpCats.map((obj, idx) => `${idx + 1}. ${obj.Text.padEnd(largestCatName)} ${formatNum(obj.Cost, "currency").padStart(12)}`).join("\n") : "",
  /* ALERTS */        alerts.join("\n")
  );
}

/**
 * Generates an on-demand, high-level summary of the current calendar month.
 * Compiles localized text mapping total monthly expenses, captured incomes, total targeted thresholds, 
 * run-rate spend projections, and aggregated budget execution percentages.
 * 
 * Relies on: `matrixToObjects`, `formatNum`, and `formatString`.
 * 
 * @param {Date} [today=new Date()] - Active date representing the snapshot runtime ceiling.
 * @returns {string} Interp-parsed configuration metadata detailing month-to-date metrics.
 */
function createLimitedMonthSummary(today = new Date()) {
  const monthStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEndDate =  new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const expensesMonth = matrixToObjects(expensesSheet).filter(obj => obj.Date >= monthStartDate && obj.Date <= today);
  const incomesMonth = matrixToObjects(incomesSheet).filter(obj => obj.Date >= monthStartDate && obj.Date <= monthEndDate);
  const budget = matrixToObjects(budgetSheet);
  const monthEndProjection = (expensesMonth.reduce((a, b) => a + b.Cost, 0) / today.getDate()) * monthEndDate.getDate();
  const budgetPercentage = expensesMonth.reduce((a, b) => a + b.Cost, 0) / budget.reduce((a, b) => a + b.Total, 0) || 0;

  return formatString(getLocalString("limitedMonthSummary"), 
                      getLocalString("currentMonthExpenses"), formatNum(expensesMonth.reduce((a, b) => a + b.Cost, 0), "currency"),
                      getLocalString("currentMonthIncomes"), formatNum(incomesMonth.reduce((a, b) => a + b.Amount, 0), "currency"),
                      getLocalString("currentMonthBudget"), formatNum(budget.reduce((a, b) => a + b.Total, 0), "currency"),
                      getLocalString("monthEndProjection"), formatNum(monthEndProjection, "currency"),
                      getLocalString("expensesVsBudget"), formatNum(budgetPercentage, "percentage")
  );
}

/**
 * Compiles an annualized historical macro snapshot up to the execution date.
 * Evaluates macro expenditure against cumulative registered inflows to derive 
 * a macro debt-to-income utilization quotient.
 * 
 * Relies on: `matrixToObjects`, `formatNum`, and `formatString`.
 * 
 * @param {Date} [today=new Date()] - Date configuration parsing baseline.
 * @returns {string} Formatted localized string rendering year-to-date performance.
 */
function createLimitedYearSummary(today = new Date()) {
  const yearStartDate = new Date(today.getFullYear(), 0, 1);
  const expensesYear = matrixToObjects(expensesSheet).filter(obj => obj.Date >= yearStartDate && obj.Date <= today);
  const incomesYear = matrixToObjects(incomesSheet).filter(obj => obj.Date >= yearStartDate && obj.Date <= today);
  const anualExpVsInc = incomesYear.length > 0 ? expensesYear.reduce((a, b) => a + b.Cost, 0) / incomesYear.reduce((a, b) => a + b.Amount, 0) : 0;

  return formatString(getLocalString("limitedYearSummary"), 
                      getLocalString("anualExpenses"), formatNum(expensesYear.reduce((a, b) => a + b.Cost, 0), "currency"),
                      getLocalString("anualIncomes"), formatNum(incomesYear.reduce((a, b) => a + b.Amount, 0), "currency"),
                      getLocalString("expensesVsIncomes"), formatNum(anualExpVsInc, "percentage")
  );
}

/**
 * Compiles a micro contextual flash metric designed to execute instantly after registering an expense.
 * Provides micro pacing feedback, reflecting updated path velocities and target exhaustion milestones.
 * 
 * Relies on: `matrixToObjects`, `formatNum`, and `formatString`.
 * 
 * @param {Date} [today=new Date()] - Timestamp representing the newly saved entry context.
 * @returns {string} Inline formatted notification template payload.
 */
function createSummaryAfterRegisteredExpense(today = new Date()) {
  const monthStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEndDate =  new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const expensesMonth = matrixToObjects(expensesSheet).filter(obj => obj.Date >= monthStartDate && obj.Date <= today);
  const budget = matrixToObjects(budgetSheet);
  const monthEndProjection = (expensesMonth.reduce((a, b) => a + b.Cost, 0) / today.getDate()) * monthEndDate.getDate();
  const budgetPercentage = expensesMonth.reduce((a, b) => a + b.Cost, 0) / budget.reduce((a, b) => a + b.Total, 0) || 0;

  return formatString(getLocalString("summaryAfterExpense"), formatNum(monthEndProjection, "currency"), formatNum(budgetPercentage, "percentage"))
}

/**
 * Main distribution routing engine triggered by scheduled crons.
 * Processes active channel distributions, looks up validated user accounts, 
 * builds the target summary payload based on the incoming trigger source type, and loops 
 * outbound dispatches to registered profiles.
 * 
 * Relies on: `userList`, `createMonthSummary`, `createSundaySummary`, and `sendText`.
 * 
 * @param {string} type - Identifier string routing target execution branches (`lastDay` vs `sunday`).
 */
function createSummary(type) {
  const users = userList();
  const today = new Date();
  let text = "";
  if(type == lastDayV) {
    text = createMonthSummary(today, users);
  } else if (type == sundayV) {
    text = createSundaySummary(today, users);
  }

  for(let i = 0; i < users.length; i++) {
    users[i] && sendText(users[i], text);
  }
}
