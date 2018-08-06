const { Webhook } = require("../models");
const { findIfUserIsGranted } = require("./utils");
const axios = require("axios");

async function create(community, eventType, endpoint, userId) {
  await findIfUserIsGranted(community, userId);
  const webhook = new Webhook({ community, eventType, endpoint });
  await webhook.save();
  return webhook;
}

async function update(community, id, webhookInfo, userId) {
  await findIfUserIsGranted(community, userId);
  let webhook = await Webhook.findOne({ _id: id });
  webhook.set(webhookInfo);
  await webhook.save();
  return webhook;
}

async function destroy(community, id, userId) {
  await findIfUserIsGranted(community, userId);
  let webhook = await Webhook.findOne({ _id: id });
  await webhook.remove();
  return true;
}

async function communityWebHooks(community, userId) {
  await findIfUserIsGranted(community, userId);
  const webhooks = await Webhook.find({ community });
  return webhooks;
}

async function run(community, eventType, data) {
  try {
    const webhooks = await Webhook.find({ community, eventType });
    const requests = webhooks.map(webhook => toRequest(webhook, data));
    if (requests.length > 0) await axios.all(requests);
  } catch (error) {
    //console.log("WEBHOOK ERROR", error);
  }
}

function toRequest(webhook, data) {
  return axios.post(webhook.endpoint, data);
}

module.exports = {
  create,
  update,
  destroy,
  communityWebHooks,
  run
};
