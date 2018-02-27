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

## Make a [PubNub Function Event Handler](https://www.pubnub.com/docs/tutorials/pubnub-functions)

following the comments in `create-poll-pfunc.js`
set options for a poll in the test payload and hit publish


## Add the following to your web page to get this working

```html
<!-- IMPORTS -->
<script
  src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js"></script>
<script src="client-poll.js" type="text/javascript"></script>

<!-- CSS -->
<style>

.bar {
  font: 10px sans-serif;
  background-color: #e74c3c;
  text-align: right;
  padding: 3px;
  margin: 1px;
  height: 40px;
  line-height: 35px;
  color: white;
  margin-left: 120px;
}
.vote-btn {
  border: solid 1px #20538D;
  height: 40px;
  width: 100px;
  float: left;
  line-height: 35px;
  color: blue;
  font-size: 10px;
}

</style>

<!-- HTML -->
<div id="poll-container"></div>

<!-- JS -->
<script>
  // Make a poll dom container
  var pollDomId = "asdf";
  var myPoll;
  // get past polls and verify that the poll is currently active
  // based on the start and end time bounds of the poll
  ChatEngine.global.search({
      event: '$.poll',
      limit: 1
  }).on('$.poll', function(message) {
    var data = message.data;
    if (myPoll && myPoll.pollChannel === data.pollChannel) {
      return;
    }
    myPoll = ChatEnginePoll(ChatEngine, pollDomId, data.pollTitle, data.pollOptions, data.pollChannel, data.pollStartTT, data.pollEndTT);
  });
  ChatEngine.on('$.poll', function(message) {
    var data = message.data;
    if (myPoll && myPoll.pollChannel === data.pollChannel) {
      return;
    }
    myPoll = ChatEnginePoll(ChatEngine, pollDomId, data.pollTitle, data.pollOptions, data.pollChannel, data.pollStartTT, data.pollEndTT);
  });
</script>

```