# Live Poll in Chat Engine Chat

This demo shows a poll in the chat window.

live demo at: https://ajb413.github.io/chat-engine-poll/

If you were building this from scratch you would:

- Make a div and give it an id, this is where the poll markup goes
- include d3, jquery, and the client-poll.js file like at the top of `index.html`
- include the css marked with `REALTIME POLL` in `index.html`
- add the javascript for `$.poll` in `index.html` to your chat engine init js code
- add the code in `create-poll-pfunc.js` to a PubNub Function with a randomized channel
- execute the code in the test payload in the PubNub Function file `create-poll-pfunc.js` to make a new poll for all users in the global chat

see server function keys in `index.html`
```
ChatEngine = ChatEngineCore.create({...})
```