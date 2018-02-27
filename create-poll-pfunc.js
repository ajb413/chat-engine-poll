// PubNub Function to create a new Poll in global chat
// name: chat-engine-poll-init
// event: after publish or fire
// channel: a long random string of characters that only the admin knows

/* TEST PAYLOAD
{
  "chat_channel": "chat-engine",
  "pollTitle": "Yo title",
  "pollOptions": [
    {
      "name": "Amanda",
      "vote": 0
    },
    {
      "name": "Katie",
      "vote": 0
    },
    {
      "name": "Janice",
      "vote": 0
    }
  ],
  "pollStartTT": 0,
  "pollEndTT": 1519699270276
}
*/

export default (request) => { 
    const kvstore = require('kvstore');
    const xhr = require('xhr');
    const vault = require('vault');
    const pubnub = require('pubnub');
    
    let pollTitle = request.message.pollTitle;
    let pollOptions = request.message.pollOptions;
    let pollStartTT = request.message.pollStartTT;
    let pollEndTT = request.message.pollEndTT;
    
    if (!pollTitle || !pollOptions || typeof pollStartTT !== 'number' || typeof pollEndTT !== 'number') {
        console.error('Missing parameter(s)\nNeed pollDomId, pollTitle, pollOptions, chatEngine');
        return request.abort();
    }
    
    function uuid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    
    // Make a random UUID for the poll channel
    var pollChannel = "ce-poll."+uuid();
    var data = pollOptions;
    
    var pollEmit = {
      "data": {
        "pollTitle": pollTitle,
        "pollOptions": pollOptions,
        "pollStartTT": request.message.pollStartTT,
        "pollEndTT": request.message.pollEndTT,
        "pollChannel": pollChannel,
      },
      "sender": "user-admin",
      "event": "$.poll",
      "chatengineSDK": "0.9.5"
    };
    
    // grant read and write on every poll that will ever happen
    pubnub.grant(
       {
           channels: ['ce-poll.*'],
           read: true, // false to disallow
           write: true, // false to disallow
           ttl: 0,
       },
       function (status) {
           console.log('pam grant status',status);
       }
    );
    
    return pubnub.publish({
        "channel": request.message.chat_channel,
        "message": pollEmit
    }).then((publishResponse) => {
        console.log('publishResponse', publishResponse);
        return request.ok();
    });
};
