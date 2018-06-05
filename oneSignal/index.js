const OneSignal = require("onesignal-node");
const client = new OneSignal.Client({
  userAuthKey: "MWQwNzZjMmYtMjliOC00NzAxLTkwNmUtNGZhMGFiNzlmMTZl",
  app: {
    appAuthKey: "MWNlOGU4MTgtNzE4Mi00MzA4LWJkNGEtYzMzODc4MzE2OTI5",
    appId: "3448c128-41d1-4813-a70f-14cb2ea55e9f"
  }
});

async function send(receivers, type, data) {
  var notification = new OneSignal.Notification({
    contents: {
      en: "notification"
    }
  });
  notification.setParameter("data", { type, data });
  notification.setTargetDevices(receivers);
  return await sendNotification(notification);
}

async function sendNotification(notification) {
  return new Promise((resolve, reject) => {
    client.sendNotification(notification, function(err, httpResponse, data) {
      if (err) {
        console.log("OS Error", err);
        reject(err);
      } else {
        resolve({ data, httpResponse });
      }
    });
  });
}

module.exports = { send };
