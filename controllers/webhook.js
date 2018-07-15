const { Webhook } = require("../models");
const { findIfUserIsGranted } = require("./utils");

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
  return { webhooks };
}

module.exports = {
  create,
  update,
  destroy,
  communityWebHooks
};
