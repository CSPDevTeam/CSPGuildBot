const variables = require("./variables.js");

//发消息API
/**
 * @param {Channel} channel
 * @param {String} content
 * @description 发消息API
 * @returns {Promise}
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
 * @description 获取频道内的子频道
 */
exports.getChannel = function(guildId, channelId) {
  return variables.app.guilds.get(guildId).channels.get(channelId);
}

//获取频道类型
/**
 * @param {String} guildId
 * @param {String} channelId
 * @returns {Array}
 * @description 获取频道类型Array
 */
exports.getChannelType = function(guildId, channelId) {
  var typeList = [];
  for(var i=0;i<variables.config.guild_id.length;i++){
    var guildData = variables.config.guild_id[i];
    if(guildData.guild_id == guildId && guildData.channel_id == channelId){
      typeList.push(guildData.type);
    }
  }
  return typeList;
}

//是否符合对应类型
/**
 * @param {String} guildId
 * @param {String} channelId
 * @param {String} channelType
 * @returns {Boolean}
 * @description 判断频道是否符合对应类型
*/
exports.isChannelType = function(guildId, channelId, channelType) {
  var typeList = exports.getChannelType(guildId, channelId);
  return typeList.indexOf(channelType) != -1;
}

//是否是管理员
/**
 * @param {String} tiny_id
 * @returns {Boolean}
 * @description 是否是管理员
 * @example isAdmin("123456789")
*/
exports.isAdmin = function(tiny_id) {
  return variables.config.adminId.indexOf(tiny_id) != -1;
}