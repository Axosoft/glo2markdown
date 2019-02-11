# Glo2Markdown

## OAuth

GitKraken Glo uses OAuth to allow developers to create apps that access users' data on their behalf.
 More details on our OAuth system can be [found here](https://support.gitkraken.com/oauth/overview) TODO: Update this url

## API Calls

After obtaining an OAuth token for the user, the app makes API calls to get a list of their boards, and then gets details for the selected board. For more information on the Glo API, you can read up on our [API Docs](https://gloapi.gitkraken.com/v1/docs/)

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
    * This will run a dev server on port 8080
    * Debugging available on port 9229
    * Client should have hot reloading
    * Server should automatically restart when you change other files

### Using the app

1. The index page `/` will display your list of boards and allow you to select from a dropdown.
    * If you aren't logged in, it will redirect you to `/auth/login`
2. Once you've selected a board, you are directed to `/board?id={BOARD_ID}`
    * This page will load the columns and cards, and display your board in a markdown format

### Notes

* Sessions are stored in the in-memory implementation which is not meant for production! For a production app, please update and secure the session store as well as the user store. [Compatible session stores for express-session](https://www.npmjs.com/package/express-session#compatible-session-stores)

* While we chose to use Next.js for simplicity, you can use any appropriate tech stack to build out Glo OAuth/API apps.
