# Glo2Markdown

This is an Next.js app demonstrating how to use GitKraken Glo's OAuth and API. Users login with OAuth, pick a board, and it is converted to Markdown. While we chose to use Next.js for simplicity, you can use any appropriate tech stack to build out Glo OAuth/API apps.

## OAuth

GitKraken Glo uses OAuth to allow developers to create apps that access users' data on their behalf.
 More details on our OAuth system can be [found here](https://support.gitkraken.com/oauth/overview)

## API Calls

After obtaining an OAuth token for the user, the app makes API calls to get a list of their boards, and then gets details for the selected board. For more information on the Glo API, you can read up on our [API Docs](https://gloapi.gitkraken.com/v2/glo/docs)

