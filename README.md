# Live Poll in Chat Engine Chat

This demo shows a poll in the chat window.

If you were building this from scratch you would:

- Make a div and give it an id, this is where the poll markup goes
- include d3, jquery, adn the client-poll.js file
- include the css marked in index.html
- add the javascript for `$.poll` in index to your chat engine init js code
- add the code in `create-poll-pfunc.js` to a PubNub Function with a randomized channel
- execute the code in the test payload to make a new poll for all users in the global chat