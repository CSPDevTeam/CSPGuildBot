const variables = require("./variables.js");

//发消息API
/**
 * @param {Channel} channel
 * @param {String} content
 */
exports.sendGuildMessage = function(channel, content) {
  channel
    .sendMessage(content)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      logger.error("发送消息出现错误:", err.message);
      return err;
    });
}

//获取频道内的子频道
/**
 * @param {String} guildId
 * @param {String} channelId
 * @returns {Channel|undefined}
 */
exports.getChannel = function(guildId, channelId) {
  return variables.app.guilds.get(guildId).channels.get(channelId);
}
