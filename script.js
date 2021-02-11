let data = {};
let userList = {};

eventsource = new EventSource(
  "https://stream.wikimedia.org/v2/stream/revision-create"
);
eventsource.onopen = function () {};
eventsource.onerror = function (msg) {};
eventsource.onmessage = function (msg) {
  let serName = JSON.parse(msg.data).meta.domain;
  let botValue = JSON.parse(msg.data).performer.user_is_bot;
  let userName = JSON.parse(msg.data).performer.user_text;
  let userEditCount = JSON.parse(msg.data).performer.user_edit_count;
  if (!(serName in data)) {
    data[serName] = 1;
  } else {
    for (const [key, value] of Object.entries(data)) {
      if (key === serName) {
        data[key] = value + 1;
        //   console.log(`${key}:${value}`);
      }
    }
  }
  if (!botValue && serName === "en.wikipedia.org") {
    if (userEditCount)
      if (!(userName in userList)) {
        userList[userName] = userEditCount;
      } else {
        if (userList[userName] < userEditCount) {
          userList[userName] = userEditCount;
          // console.log(`${userName}:${userList[userName]}`);
        }
      }
    // if (!userEditCount) console.log(userName);
  }
};

// setInterval(function () {
//   var body = document.getElementById("root");
//   body.innerHTML = "";
// }, 10);
setInterval(function () {
  var body = document.getElementById("root");
  body.innerHTML = "";
}, 60 * 1000);

setInterval(function () {
  var title = document.createElement("h1");
  var title2 = document.createElement("h1");
  var body = document.getElementById("root");
  var size = Object.keys(data).length;
  var body = document.getElementById("root");
  var x,
    txt = "";
  var dlist = document.createElement("div");

  title.className = "title";
  title2.className = "title";

  title.textContent = "Domains Report(last 1 minute)";
  title2.textContent = "Total number of Wikipedia Domains Updated: " + size;

  body.append(title);
  body.append(title2);

  const sortable1 = Object.fromEntries(
    Object.entries(data).sort(([, a], [, b]) => b - a)
  );
  console.log(sortable1);

  for (x in sortable1) {
    txt += x + " : " + sortable1[x] + "  pages updated";
    var listItem = document.createElement("h3");
    listItem.className = "listItem";
    listItem.textContent = txt;
    txt = "";
    // var nl = document.createElement("br");

    var body = document.getElementById("root");
    dlist.className = "dlist";
    dlist.append(listItem);
    body.append(dlist);
  }
  console.log(sortable1);

  var usReport = document.createElement("h1");
  usReport.className = "usReport";
  usReport.textContent = "Users who made changes to en.wikipedia.org";
  var body = document.getElementById("root");
  body.append(usReport);

  var y,
    utext = "";
  const sortable = Object.fromEntries(
    Object.entries(userList).sort(([, a], [, b]) => b - a)
  );
  console.log(sortable);
  var ulist = document.createElement("div");

  for (y in sortable) {
    utext += y + " : " + sortable[y];
    var listItem = document.createElement("h3");
    listItem.className = "listItem";
    listItem.textContent = utext;
    utext = "";
    // var nl = document.createElement("br");

    var body = document.getElementById("root");

    ulist.className = "ulist";
    ulist.append(listItem);
    body.append(ulist);
    // body.append(nl);
  }
  data = {};
  userList = {};
}, 60 * 1000);
