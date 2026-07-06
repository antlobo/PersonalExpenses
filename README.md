# Personal Expenses

**Personal Expenses** is an intelligent personal finance management solution that allows you to record income and expenses using natural language (text or voice notes) directly from a Telegram chat. The application automatically classifies movements, tracks them against a defined budget, and delivers periodic automated analytical reports.

## 🚀 Architecture and Components

The project implements a lightweight, serverless architecture based on the following tools:

-   **Telegram Bot API:** The primary interface for user interaction.
    
-   **Google Apps Script & Google Sheets:** Serves as the backend logic engine (web server/webhook) and the relational database to store logs and parameters.
    
-   **Anthropic Claude API:** The Artificial Intelligence core responsible for understanding natural language, extracting amounts and descriptions, and matching transactions with the right category.
    
-   **Google Cloud Speech-to-Text API (Optional):** Transcribes audio notes sent via Telegram so they can be processed as standard text inputs.
    

## ✨ Core Features

1.  **Natural Language Input:** Write or say phrases like _"Spent 12 dollars on coffee this morning"_ or _"+2500 bank transfer credit"_.
    
2.  **Multi-language Support:** The bot interface natively adapts to the user's language (currently supporting English and Spanish).
    
3.  **Dynamic Category Management:** Add or remove expense/income categories directly through the configuration sheet.
    
4.  **Budget Control:** Assign monthly allowance limits per category.
    
5.  **Automatic Calibration (`/calibrate`):** After accumulating more than 2 months of historical entries, it dynamically calculates a recommended budget per category based on real historical averages.
    
6.  **Automated Reporting:**
    
    -   **Weekly (Sundays):** Automated status check showing real spending vs. target budget.
        
    -   **Monthly (Closing):** Consolidated financial summary detailing the finalized month's metrics.
        

## ⚙️ Prerequisites & Deployment Instructions

#### 1. Create the Telegram Bot

1.  Open Telegram and search for `@BotFather`.
    
2.  Send the `/newbot` command.
    
3.  Follow the steps to set up a name and a unique username for your bot.
    
4.  Copy the generated **HTTP API Token** (you will use it later).
    

#### 2. Set Up the Database (Google Sheets)

1.  [Copy](https://docs.google.com/spreadsheets/d/172OqFCDZOtS1MIzfjJN67LCj4JaOTuMgoH35MhJljhM/edit?usp=sharing) example spreadsheet in Google Sheets.

2.  Initialize the following mandatory tabs:
        
    -   `Budget`: Columns for `Category` and `Total`.
  
    -   `Users`: Columns `Telegram ID` and `Name`. You can get `Telegram ID` when you complete the setup and send a message to the bot.
        
3.  Click on **Extensions > Apps Script** in the top menu to access the code editor.
    

#### 3. Configure Script Properties

Inside the Google Apps Script editor, open the Project Settings (the gear icon ⚙️) on the left sidebar:

1.  Scroll down to the **Script properties** section.
    
2.  Add the following required key-value pairs:

    - `1. Claude API Token`: Your Anthropic Claude API Key.
    - `2. Google Sheet ID`: Your sheet ID its in the URL and looks like `1f_IT_kAFIG0TUOZyXXXXW67fxvdxxxxaw6gbAbtxzEo`
    - `3. Telegram Token`: The token you received from BotFather.
    - `4. Web App URL`: URL you get when app its published.
    - `5. Currency`: Your lead currency (e.g. `USD`, `EUR`, `MXN`, etc).
    - `6. Localization`: Default language setup (e.g. `en-EN` or `es-ES`).
    - `Claude API URL`: Current URL is https://api.anthropic.com/v1/messages
    - `Telegram Bot API URL`: Current URL is https://api.telegram.org/bot
    - `Telegram Bot API Files URL`: Current URL is https://api.telegram.org/file/bot
    - `Google Speech2Text Token`: Your Google Cloud API Key (only if using voice notes).
    - `Google Speech2Text URL`: Current URL is https://speech.googleapis.com/v1/speech:recognize
    - `Sheet Name Expenses`: Default sheet name is `Expenses`.
    - `Sheet Name Budget`: Default sheet name is `Budget`.
    - `Sheet Name Incomes`: Default sheet name is `Incomes`.
    - `Sheet Name Users`: Default sheet name is `Users`.
    - `Sheet Name Logs`: Default sheet name is `Logs`.
    - `Sheet Name Categories`: Default sheet name is `Categories`.

#### 4. Obtain External API Credentials & Credits

-   **Claude (Anthropic):** Sign up on the Anthropic Developer Console, deposit credits (roughly $5 every 3 months), and generate an API key.
    
-   **Google Speech-to-Text (Optional):**
    
    1.  Log into the [Google Cloud Console](https://console.cloud.google.com/).
        
    2.  Create a new project or choose an active one.
        
    3.  Enable the **Cloud Speech-to-Text API**.
        
    4.  Navigate to **Credentials**, create an **API Key**, and apply safety restrictions if desired.
        

#### 5. Deploy the Apps Script Web Application

1.  In the Apps Script code editor, click **Deploy > New deployment** (top right corner).
2.  Select **Web app** as the deployment type.
3.  Configure the execution rules:
    -   _Execute as:_ Me (your account).        
    -   _Who has access:_ **Anyone** (mandatory for Telegram to successfully trigger the webhook).

4.  Click **Deploy** and complete the authorization process.    
5.  Copy the generated **Web app URL** and paste it on `4. Web App URL` property.
    

#### 6. Link the Google Webhook with Telegram
To bind Telegram to your script, open `Telegram.gs`, select `setWebhook` function and run it.


## 🤝 Contributing

Contributions are welcome! If you want to improve parsing logic, add new categories, optimize the workflow, or enhance the web app.

