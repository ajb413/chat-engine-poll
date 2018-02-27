window.ChatEnginePoll = function (chatEngine, pollDomId, pollTitle, pollOptions, pollChannel, pollStartTT, pollEndTT) {

  if (!chatEngine || !pollDomId || !pollTitle || !pollOptions || !pollChannel || typeof pollStartTT !== 'number' || typeof pollEndTT !== 'number') {
    console.error('Missing parameter(s)\nNeed pollDomId, pollTitle, pollOptions, chatEngine');
    return;
  }

  var date = new Date().getTime();
  document.getElementById(pollDomId).style.display = 'none';
  document.getElementById(pollDomId).innerHTML = '';

  if (date > pollEndTT || date < pollStartTT) {
    return;
  }

  var data = pollOptions;

  chatEngine.pubnub.addListener({
      message: increment
  });

  chatEngine.pubnub.subscribe({
      channels: [pollChannel] 
  });

  // Put the poll title into the dom if it's not already there
  var title = document.getElementById("chat-engine-poll-title");
  if (!title) {
    title = document.createElement("H3");
    title.innerText = pollTitle;
    title.id = "chat-engine-poll-title";
    closeButton = document.createElement("BUTTON");
    closeButton.textContent = "X";
    closeButton.addEventListener("click", function(e) {
      document.getElementById(pollDomId).style.display = 'none';
    }, false);
    title.appendChild(closeButton);
    document.getElementById(pollDomId).appendChild(title);
  }

  function sendData(msg) {
    chatEngine.pubnub.publish({
        channel: pollChannel,
        message: msg
    });
  }

  function draw(data) {
    var bars = d3.select("#"+pollDomId)
      .selectAll(".bar-wrapper")
      .data(data);

    var barEnter = bars
      .enter()
      .append("div")
      .attr("class", "bar-wrapper")

    barEnter
      .append("button")
      .text(function(d) { return "Vote "+ d.name; })
      .attr("class", "vote-btn btn-default btn-primary")
      .on("click", function(d) {
        sendData(d.name);
      });

    barEnter
      .append("div")
      .attr("class", "bar")
      .style("width", function (d) {
        return (d.vote*10)+15 + "px";
      })
      .text(function(d) { return d.vote });

    bars.selectAll("div")
      .text(function(d) { return d.vote })
      .style("width", function (d) {
        return (d.vote*10)+15 + "px";
      });

    bars
      .exit()
      .remove()
  };

  function increment(message) {
    try{
        if (message.message.data.pollTitle.length > 0)
            document.getElementById(pollDomId).style.display = 'block';
    } catch(e) {}
    message = message.message
    for (var i=0; i<data.length; i++) {
      var el = data[i];
      if (el.name == message) {
        el.vote += 1;
      }
    }
    draw(data);
  }

  function init_votes() {
    chatEngine.pubnub.history({
      channel: pollChannel,
      start: 0,
    },
    function(status, response) {
      var vote_history = response.messages;
      for (var i=0; i<vote_history.length; i++) {
        increment({ message: vote_history[i].entry });
      }
    });
  }

  init_votes();
  draw(data);

  return {
    pollChannel: pollChannel,
    pollTitle: pollTitle,
    data: data
  };
};
