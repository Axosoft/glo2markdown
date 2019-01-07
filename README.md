# Glo2Markdown

This is an Next.js app demonstrating how to use GitKraken Glo's OAuth and API. Users login with OAuth, pick a board, and it is converted to Markdown. While we chose to use Next.js for simplicity, you can use any appropriate tech stack to build out Glo OAuth/API apps.

## OAuth

GitKraken Glo uses OAuth to allow developers to create apps that access users' data on their behalf.
 More details on our OAuth system can be [found here](https://support.gitkraken.com/oauth/overview) TODO: Update this url

## API Calls

After obtaining an OAuth token for the user, the app makes API calls to get a list of their boards, and then gets details for the selected board. For more information on the Glo API, you can read up on our [API Docs](https://gloapi.gitkraken.com/v2/glo/docs)

## Running the app

### Prerequisites

* Node.js (Tested on v8 LTS)
* npm/yarn
* Client ID/Secret for a [GitKraken OAuth app](https://app.gitkraken.com/oauth_apps)

### Steps

1. Clone/download this repo
2. `npm i` or `yarn` depending on which tool you use
3. Create a .env file based on the template
    * Replace Client ID/Secret with your OAuth app info
    * Replace the session secret with a string of your choosing
4. `npm run dev` or `yarn dev`

### Notes

Sessions are stored in the in-memory implementation which is not meant for production! For a production app, please update and secure the session store as well as the user store. [Compatible session stores for express-session](https://www.npmjs.com/package/express-session#compatible-session-stores)
