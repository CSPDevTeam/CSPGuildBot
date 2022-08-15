const variables = require("./variables.js");
const apis = require("./API.js");

//自定义事件回调
class EventCallbacker {
  constructor(event) {
    this.event = event;
  }

  EventCallback(...args) {
    var Events = variables.config["CustomEvent"][this.event];
    var callbacker = Events["callback"];
    var type = Events["type"];

    //获取参数
    var param = callbacker.match(/(?<=\{)[^}]+(?=\})/g);
    //转换参数为字符串
    for (var k = 0; k < param.length; k++) {
      var replacer = param[k].split(".");
      var value = ""
      //判断是否需要转换
      if (replacer.length > 1) {
        value = args[Number(replacer[0])-1][replacer[1]];
      } 
      else {
        value = args[Number(replacer[0])-1];
      }
      callbacker = callbacker.replace(`{${param[k]}}`, value);
    }

    //执行发出
    for (var j = 0; j < variables.config["guild_id"].length; j++) {
      var data = variables.config["guild_id"][j];
      if (data.type == type) {
        let channel = apis.getChannel(data["guild_id"], data["channel_id"]);
        apis.sendGuildMessage(channel, callbacker);
      }
    }
  }
}

//创建事件回调
/**
 * @param {string} event
 */
function createEventCallbacker(event) {
  var cbe = new EventCallbacker(event);
  mc.listen(event, function (...args) {
    cbe.EventCallback(...args);
  });
}

//自定义事件
exports.addEvent =  function() {
  var obj = Object.keys(variables.config["CustomEvent"]);
  //监听事件
  for (var i = 0; i < obj.length; i++) {
    var event = obj[i];
    createEventCallbacker(event);
  }
}

//注册指令
mc.listen("onServerStarted", () => {
  let cmd = mc.newCommand("gbot", "Guild Bot Command", PermType.GameMasters);
  cmd.setAlias("gbot");

  //注册枚举
  cmd.setEnum("ListAction", ["guild", "reload","help","login","qrcode"]);
  cmd.setEnum("GuildAction", ["channel", "member","ticket"]);

  //注册参数
  cmd.mandatory("action", ParamType.Enum, "ListAction", 1);
  cmd.mandatory("action", ParamType.Enum, "GuildAction", 1);
  cmd.mandatory("name", ParamType.String);

  //注册指令
  cmd.overload(["ListAction"]);
  cmd.overload(["GuildAction", "name"]);

  //回调函数
  cmd.setCallback((_cmd, _ori, out, res) => {
    switch (res.action) {
      //输出频道列表
      case "guild":
        var guild = variables.app.guilds;
        guild.forEach((guild, key, map) => {
          out.success(`§a${guild.guild_name}:§e${key}`);
        });
        break;

      //输出频道列表
      case "channel":
        var guild = variables.app.guilds.get(res.name);
        if (guild != undefined) {
          var channel = guild.channels;
          out.success(`§a${guild.guild_name}:§e${res.name}`);
          channel.forEach((channel, key, map) => {
            out.success(`  §b${channel.channel_name}:§c${key}`);
          });
        } else {
          out.error("guild not found");
        }
        break;

      //获取成员列表
      case "member":
        var guild = variables.app.guilds.get(res.name);
        if (guild != undefined) {
          var member = guild.getMemberList();
          out.success(`§a${guild.guild_name}:§e${res.name}`);
          member
            .then((members) => {
              for (var i = 0; i < members.length; i++) {
                out.success(
                  `  §b${members[i].nickname}:§c${members[i].tiny_id}`
                );
              }
            })
            .catch((err) => {
              out.error(
                "An error occurred while getting the list of members:\n" + err
              );
            });
        } else {
          out.error("guild not found");
        }
        break;

      //重载
      case "reload":
        return variables.readConfig()
          ? out.success("reload success")
          : out.error("reload failed");
        
      //帮助
      case "help":
        out.success("§aGuild Bot Command");
        out.success("§a/gbot guild §e获取公会列表");
        out.success("§a/gbot channel <guild_id> §e获取公会频道列表");
        out.success("§a/gbot member <guild_id> §e获取公会成员列表");
        out.success("§a/gbot reload §e重载配置文件");
        break;

      //Login
      case "login":
        if(variables.needVerify){
          variables.client.login();
        }
        else{
          logger.error("您不需要二次登录")
        }
        break;

      //qrcode扫码
      case "qrcode":
        if(variables.needVerify){
          apis.startQrcodeProgress();
        }
        else{
          logger.error("您不需要二次登录")
        }

      //ticket
      case "ticket":
        if(variables.needVerify){
          var ticket = res.name
          variables.client.submitSlider(ticket)
        }
        else{
          logger.error("您不需要二次登录")
        }
        break;
    }
  });
  cmd.setup();
});

//监听玩家聊天
mc.listen("onChat", (pl, msg) => {
  //获取频道
  for (var i = 0; i < variables.config.guild_id.length; i++) {
    var data = variables.config.guild_id[i];
    //检测是否是chat频道
    if (data.type == "chat") {
      //获取指定的频道
      var guild = variables.app.guilds.get(data.guild_id);
      var channel = guild.channels.get(data.channel_id);
      //发送消息
      var msg = `<${pl.name}> ${msg}`;
      apis.sendGuildMessage(channel, msg);
    }
  }
});

