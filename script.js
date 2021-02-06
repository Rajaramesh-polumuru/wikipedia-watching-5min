let data = {};

eventsource = new EventSource(
  "https://stream.wikimedia.org/v2/stream/recentchange"
);
eventsource.onopen = function () {};
eventsource.onerror = function (msg) {};
eventsource.onmessage = function (msg) {
  let serName = JSON.parse(msg.data).server_name;
  if (!JSON.parse(msg.data).bot && !(serName in data)) {
    data[serName] = 1;
  } else if (!JSON.parse(msg.data).bot) {
    for (const [key, value] of Object.entries(data)) {
      if (key === serName) {
        data[key] = value + 1;
        //   console.log(`${key}:${value}`);
      }
    }
  }
};

setInterval(function () {
  console.log(data);
  var x,
    txt = "";

  for (x in data) {
    txt += x + ":" + data[x];
    var title = document.createElement("h3");
    title.className = "title";
    title.textContent = txt;
    txt = "";
    var nl = document.createElement("br");

    var body = document.getElementById("root");
    body.append(title);
    body.append(nl);
  }
  prevData = data;
  data = {};
}, 3000);
