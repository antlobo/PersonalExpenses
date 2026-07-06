const loc = [
  {
    lang: "es",
    text: [
      // Telegram.gs
      { id: "menu", value: "Con este bot puede: \n1. Solicitar un reporte del mes \n2. Solicitar un reporte del año \n3. Agregar un gasto \n4. Agregar un ingreso" },

      // AI.gs
      { id: "errorQueryClaude", value: "Falla en la comunicación con Claude: " },

      // Appscript.gs
      { id: "month", value: ["mes", "mensual"] },
      { id: "year", value: ["año", "anual"] },
      { id: "calibrate", value: "calibrar" },
      { id: "expenseQuery", value: "Extrae fecha (default:{0}),descripción,monto y categoría del texto.Divide en cuotas mensuales incrementando 1 mes por cuota desde la fecha base.Categorías:{1}.Texto:{2}" },
      { id: "incomeQuery", value: "Extrae fecha (default:{0}) y monto.Texto:{1}" },
      { id: "income", value: ["entrada", "ingreso", "salario", "sueldo", "estipendio", "emolumentos", "retribución", "ganancia"] },
      { id: "userNotAuthorized", value: "No está autorizado para usar este bot!" },
      { id: "expenseExample", value: "Digite el nuevo gasto, ejemplo: 2800 taxi" },
      { id: "newExpense", value: "Nuevo gasto agregado así" },
      { id: "errorAddingExpense", value: "Error al agregar gasto" },  
      { id: "incomeExample", value: "Digite el nuevo ingreso, ejemplo: ingreso 2800" },
      { id: "newIncome", value: "Nuevo ingreso agregado así" },
      { id: "errorAddingIncome", value: "Error al agregar ingreso" },
      { id: "calibrationCompleted", value: "Calibración completada." },
      { id: "noSp2TToken", value: "No se cuenta con un token para utilizar la API de Google Speech-to-Text." },
      { id: "noGetAudio", value: "No se pudo obtener el audio desde Telegram." },
      { id: "noValidAudio", value: "No se reconoció un audio válido." },
      { id: "audioAbove60Sec", value: "El audio debe ser inferior a 60 segundos." },
      { id: "badSampleRate", value: "Sample Rate Hertz no es adecuado para el uso con Google Speech." },

      // Reports.gs
      { id: "anualExpenses", value: "Gastos anuales" },
      { id: "anualIncomes", value: "Ingresos anuales" },
      { id: "expensesVsIncomes", value: "Porcentaje de lo gastado frente a lo ingresado" },
      { id: "currentMonthExpenses", value: "Gastos actuales del mes" },
      { id: "currentMonthIncomes", value: "Ingresos actuales del mes" },
      { id: "currentMonthBudget", value: "Presupuesto del mes" },
      { id: "monthEndProjection", value: "Proyección del mes con los gastos actuales" },
      { id: "expensesVsBudget", value: "Porcentaje de lo gastado frente a lo presupuestado" },
      { id: "limitedMonthSummary", value: "<b>{0}:</b> {1} \n<b>{2}:</b> {3} \n<b>{4}:</b> {5} \n<b>{6}:</b> {7} \n<b>{8}:</b> {9}" },
      { id: "limitedYearSummary", value: "<b>{0}:</b> {1} \n<b>{2}:</b> {3} \n<b>{4}:</b> {5}" },
      { id: "summaryAfterExpense", value: "Si los gastos continúan igual, se espera cerrar el mes con gastos de: {0} \nEl porcentaje de lo gastado frente a lo presupuestado es del: {1}" },
      { id: "weekReport", value: "📅 {0} \n\n━━━━━━━━━━━━━━━━━━ \n💸 <b> ESTA SEMANA </b> \n━━━━━━━━━━━━━━━━━━ \nTotal gastado: {1} \nvs semana anterior: {2} {3} ({4}) \n{5} \n━━━━━━━━━━━━━━━━━━ \n📊 <b> ACUMULADO DEL MES </b> \n━━━━━━━━━━━━━━━━━━ \nGastado:     {6} \nPresupuesto: {7} \nEjecutado:   {8} {9} \n\n━━━━━━━━━━━━━━━━━━ \n📈 <b> PROYECCIÓN DE CIERRE </b> \n━━━━━━━━━━━━━━━━━━ \nSiguiendo este ritmo el mes terminará en {10} — {11} {12} \n{13} \n\n━━━━━━━━━━━━━━━━━━ \n🏆 <b> TOP 3 ESTA SEMANA </b> \n━━━━━━━━━━━━━━━━━━ \n{14} \n\n━━━━━━━━━━━━━━━━━━ \n🔍 <b> ALERTAS </b> \n━━━━━━━━━━━━━━━━━━ \n{15}" },
      { id: "weekReportDateLabel", value: "Semana {0} de {1} • {2} al {3} {4}" },
      { id: "weekReportBudgetLower", value: "bajo presupuesto" },
      { id: "weekReportBudgetOver", value: "sobre presupuesto" },
      { id: "weekReportBudgetLower2", value: "Gastos por debajo del presupuesto" },
      { id: "weekReportBudgetOver2", value: "Se ha llegado al límite de lo presupuestado" },
      { id: "weekReportBudgetAlert", value: "Ojo — se está gastando más rápido de lo planeado" },
      { id: "weekReportBudgetAlert1", value: "🚨 Se ha gastado el {0} del presupuesto mensual y aún quedan {1} días de mes" },
      { id: "weekReportBudgetAlert2", value: "⚠️ <i>{0}</i> no tiene presupuesto definido — se ha gastado {1}" },
      { id: "weekReportBudgetAlert3", value: "🚨 <i>{0}</i> superó el presupuesto mensual \nGastado: {1} · límite {2} \nExceso de: {3}" },
      { id: "weekReportBudgetAlert4", value: "⚠️ <i>{0}</i> al {1} del presupuesto mensual — queda {2}" },
      { id: "monthReport", value: "📅 Cierre de {0} {1} \n\n━━━━━━━━━━━━━━━━━━ \n✅ RESUMEN EJECUTIVO\n━━━━━━━━━━━━━━━━━━ \nGasto total     {2} \nPresupuesto     {3} \nDiferencia      {4} \nEjecucion       {5} \nTransacciones   {6} registros \n\n━━━━━━━━━━━━━━━━━━ \n📂 POR CATEGORÍA \n━━━━━━━━━━━━━━━━━━ \n{7} \n\n💚 Más económica    {8} \n🔴 Más excedida     {9} ({10}) {11} \n━━━━━━━━━━━━━━━━━━ \n📊 COMPARACIÓN HISTÓRICA \n━━━━━━━━━━━━━━━━━━ \nvs. {12}             {13} ({14}) \nvs. mediana 3 meses  {15} ({16}) \n\n━━━━━━━━━━━━━━━━━━ \n👤 POR PERSONA \n━━━━━━━━━━━━━━━━━━ \n{17} \n\n━━━━━━━━━━━━━━━━━━ \n💳 CUOTAS ACTIVAS \n━━━━━━━━━━━━━━━━━━ \n{18} \n━━━━━━━━━━━━━━━━━━ \n🎯 {19} \n━━━━━━━━━━━━━━━━━━ \nPresupuesto sugerido  {20}\n(basado en mediana histórica) \n\nEscribe /calibrar para actualizar tus presupuestos por categoría." },
      { id: "installment", value: "Compromiso fijo" },
      { id: "installmentsText", value: "\n{0} · {1}" },
      { id: "noBudgetAssigned", value: "📌 SIN PRESUPUESTO ASIGNADO" },

      // Tools.gs
      {id: "noCalibration", value: "No se puede realizar la calibración con información de sólo 1 mes."},

      // Speech2Text.gs
      {id: "noResultsFound", value: "No se encontraron resultados."},
    ]
  },
  {
    lang: "en",
    text: [
      // Telegram.gs
      { id: "menu", value: "With this bot you can: \n1. Request a monthly report \n2. Request a yearly report \n3. Add an expense \n4. Add an income" },

      // AI.gs
      { id: "errorQueryClaude", value: "Failed to communicate with Claude: " },

      // Appscript.gs
      { id: "month", value: ["month", "monthly"] },
      { id: "year", value: ["year", "yearly"] },
      { id: "calibrate", value: "calibrate" },
      { id: "expenseQuery", value: "Extract date (default:{0}), description, amount, and category from the text. Divide into monthly installments incrementing by 1 month per installment starting from the base date. Categories: {1}. Text: {2}" },
      { id: "incomeQuery", value: "Extract date (default:{0}) and amount. Text: {1}" },
      { id: "income", value: ["inflow", "income", "salary", "wages", "stipend", "earnings", "remuneration", "profit"] },
      { id: "userNotAuthorized", value: "You are not authorized to use this bot!" },
      { id: "expenseExample", value: "Enter the new expense, example: 2800 taxi" },
      { id: "newExpense", value: "New expense added as follows" },
      { id: "errorAddingExpense", value: "Error adding expense" },  
      { id: "incomeExample", value: "Enter the new income, example: income 2800" },
      { id: "newIncome", value: "New income added as follows" },
      { id: "errorAddingIncome", value: "Error adding income" },
      { id: "calibrationCompleted", value: "Calibration completed." },
      { id: "noSp2TToken", value: "A token has not been configured to use the Google Speech-to-Text API." },
      { id: "noGetAudio", value: "The audio could not be retrieved from Telegram." },
      { id: "noValidAudio", value: "No valid audio was recognized." },
      { id: "audioAbove60Sec", value: "The audio must be shorter than 60 seconds." },
      { id: "badSampleRate", value: "Sample Rate Hertz is not suitable for use with Google Speech." },

      // Reports.gs
      { id: "anualExpenses", value: "Annual expenses" },
      { id: "anualIncomes", value: "Annual income" },
      { id: "expensesVsIncomes", value: "Percentage of expenses vs income" },
      { id: "currentMonthExpenses", value: "Current month expenses" },
      { id: "currentMonthIncomes", value: "Current month income" },
      { id: "currentMonthBudget", value: "Month budget" },
      { id: "monthEndProjection", value: "Month projection based on current expenses" },
      { id: "expensesVsBudget", value: "Percentage of expenses vs budget" },
      { id: "limitedMonthSummary", value: "<b>{0}:</b> {1} \n<b>{2}:</b> {3} \n<b>{4}:</b> {5} \n<b>{6}:</b> {7} \n<b>{8}:</b> {9}" },
      { id: "limitedYearSummary", value: "<b>{0}:</b> {1} \n<b>{2}:</b> {3} \n<b>{4}:</b> {5}" },
      { id: "summaryAfterExpense", value: "If spending continues at this rate, the month is expected to close with expenses of: {0} \nThe percentage of expenses vs budget is: {1}" },
      { id: "weekReport", value: "📅 {0} \n\n━━━━━━━━━━━━━━━━━━ \n💸 <b> THIS WEEK </b> \n━━━━━━━━━━━━━━━━━━ \nTotal spent: {1} \nvs previous week: {2} {3} ({4}) \n{5} \n━━━━━━━━━━━━━━━━━━ \n📊 <b> MONTH-TO-DATE </b> \n━━━━━━━━━━━━━━━━━━ \nSpent:      {6} \nBudget:     {7} \nExecuted:   {8} {9} \n\n━━━━━━━━━━━━━━━━━━ \n📈 <b> CLOSING PROJECTION </b> \n━━━━━━━━━━━━━━━━━━ \nAt this rate the month will end at {10} — {11} {12} \n{13} \n\n━━━━━━━━━━━━━━━━━━ \n🏆 <b> TOP 3 THIS WEEK </b> \n━━━━━━━━━━━━━━━━━━ \n{14} \n\n━━━━━━━━━━━━━━━━━━ \n🔍 <b> ALERTS </b> \n━━━━━━━━━━━━━━━━━━ \n{15}" },
      { id: "weekReportDateLabel", value: "Week {0} of {1} • {2} to {3} {4}" },
      { id: "weekReportBudgetLower", value: "under budget" },
      { id: "weekReportBudgetOver", value: "over budget" },
      { id: "weekReportBudgetLower2", value: "Expenses are under budget" },
      { id: "weekReportBudgetOver2", value: "Budget limit has been reached" },
      { id: "weekReportBudgetAlert", value: "Watch out — spending is faster than planned" },
      { id: "weekReportBudgetAlert1", value: "🚨 {0} of the monthly budget has been spent, and there are still {1} days left in the month" },
      { id: "weekReportBudgetAlert2", value: "⚠️ <i>{0}</i> has no budget defined — {1} has been spent" },
      { id: "weekReportBudgetAlert3", value: "🚨 <i>{0}</i> exceeded the monthly budget \nSpent: {1} · limit {2} \nExcess of: {3}" },
      { id: "weekReportBudgetAlert4", value: "⚠️ <i>{0}</i> at {1} of the monthly budget — {2} remaining" },
      { id: "monthReport", value: "📅 {0} {1} Closing \n\n━━━━━━━━━━━━━━━━━━ \n✅ EXECUTIVE SUMMARY\n━━━━━━━━━━━━━━━━━━ \nTotal Spent     {2} \nBudget          {3} \nDifference      {4} \nExecution       {5} \nTransactions    {6} records \n\n━━━━━━━━━━━━━━━━━━ \n📂 BY CATEGORY \n━━━━━━━━━━━━━━━━━━ \n{7} \n\n💚 Most economical  {8} \n🔴 Most exceeded    {9} ({10}) {11} \n━━━━━━━━━━━━━━━━━━ \n📊 HISTORICAL COMPARISON \n━━━━━━━━━━━━━━━━━━ \nvs. {12}             {13} ({14}) \nvs. 3-month median    {15} ({16}) \n\n━━━━━━━━━━━━━━━━━━ \n👤 BY PERSON \n━━━━━━━━━━━━━━━━━━ \n{17} \n\n━━━━━━━━━━━━━━━━━━ \n💳 ACTIVE INSTALLMENTS \n━━━━━━━━━━━━━━━━━━ \n{18} \n━━━━━━━━━━━━━━━━━━ \n🎯 {19} \n━━━━━━━━━━━━━━━━━━ \nSuggested budget  {20}\n(based on historical median) \n\nType /calibrate to update your budgets by category." },
      { id: "installment", value: "Fixed commitment" },
      { id: "installmentsText", value: "\n{0} · {1}" },
      { id: "noBudgetAssigned", value: "📌 NO BUDGET ASSIGNED" },

      // Tools.gs
      {id: "noCalibration", value: "Calibration cannot be performed with only 1 month's worth of data."},

      // Speech2Text.gs
      {id: "noResultsFound", value: "No results were found."},
    ]
  }
];