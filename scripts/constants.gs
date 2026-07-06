 /**
 * @const expenses
 * @const incomes
 * @const users
 * @const logs
 * @const categories
 * @const helper
 * @brief. Sheet names
 */
const expensesSheet = properties.getProperty("Sheet Name Expenses");
const budgetSheet = properties.getProperty("Sheet Name Budget");
const incomesSheet = properties.getProperty("Sheet Name Incomes");
const usersSheet = properties.getProperty("Sheet Name Users");
const logsSheet = properties.getProperty("Sheet Name Logs");
const categoriesSheet = properties.getProperty("Sheet Name Categories");
const helperSheet = properties.getProperty("Sheet Name Helper");

 /**
 * @const outExpense
 * @brief. object for Claude's prompt exit
 */
const outExpense = {
      format: {
        type: "json_schema",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              category: { type: "string" }
            },
            required: ["date", "description", "amount", "category"],
            additionalProperties: false
          },
        }
      }
    };

 /**
 * @const outIncome
 * @brief. object for Claude's prompt exit
 */
const outIncome = {
      format: {
        type: "json_schema",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              amount: { type: "number" }
            },
            required: ["date", "amount"],
            additionalProperties: false
          },
        }
      }
    };

