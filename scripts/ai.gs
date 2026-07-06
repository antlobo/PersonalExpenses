/**
* Sends a query to Claude's API 
* 
* @param {string} prompt Prompt to be queried
* @param {object} outConfig Object for Claude's prompt exit
*/
function callClaude(prompt, outConfig) {
  try {
    const response =  UrlFetchApp.fetch(claudeUrl, {
      method: 'POST',
      headers: {
                'content-type': 'application/json',
                'x-api-key': claudeToken,
                'anthropic-version': '2023-06-01' // Required API version header
               },
      payload: JSON.stringify({
                model: 'claude-sonnet-4-6', // Specify your desired model
                max_tokens: 1024,
                messages: [
                  { role: 'user', content: prompt }
                ],
                output_config: outConfig
              })
    });
    const data = JSON.parse(response.getContentText());
    return JSON.parse(data.content[0].text);
  } catch (error) {
    return getLocalString("errorQueryClaude") + error;
  }
}
