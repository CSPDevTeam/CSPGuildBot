//LiteLoaderScript Dev Helper
/// <reference path="e:\MCServer\LXLDevHelper-VsCode\Library/Library/JS/Api.js" />

//引入库文件
const { createClient } = require("oicq");
const { GuildApp, Channel } = require("oicq-guild");
const fs = require("fs");
const YAML = require('yamljs');
const os = require("os")
const SMC = require("./libs/minecraft")
const variables = require("./libs/variables.js");

//定义Logger的Title
logger.setTitle("GuildBot");

//监听事件
function onBotRecive(e){
  var msg = e.raw_message;

  //分割Message
  var commandAction = msg.split(" ")[0];

  //执行操作
  switch (commandAction) {
    //运行命令
    case "run":
      var result = mc.runcmdEx(msg.replace(commandAction + " ", ""));
      e.reply(result.output);
      break;

    //tellraw说话
    case "say":
      var content = msg.replace(commandAction + " ", "");
      mc.broadcast(`<${e.sender.nickname}> ${content}`);
      break;

    //查询相关信息
    case "query":
      if (e.message.length < 1) {
        return;
      }
      var userId = e.message[1].type == "at" ? e.message[1].id : "Unkown";
      var userName = e.message[1].type == "at" ? e.message[1].text : "Unkown";
      var channel_id = e.channel_id;
      var guild_id = e.guild_id;

      var msg = [
        {
          type: "at",
          qq: 0,
          text: "@" + e.sender.nickname,
          id: e.sender.tiny_id,
        },
        `\n您查询的信息结果如下:\n用户Id:${userId}\n用户名:${userName}\n子频道Id:${channel_id}\n频道Id:${guild_id}`,
      ];
      e.reply(msg);
      break;

    //查询自己
    case "queryme":
      var userId = e.sender.tiny_id != undefined ? e.sender.tiny_id : "Unkown";
      var userName =
        e.sender.nickname != undefined ? e.sender.nickname : "Unkown";
      var channel_id = e.channel_id;
      var guild_id = e.guild_id;

      var msg = [
        {
          type: "at",
          qq: 0,
          text: "@" + e.sender.nickname,
          id: e.sender.tiny_id,
        },
        `\n您的信息如下:\n用户Id:${userId}\n用户名:${userName}\n子频道Id:${channel_id}\n频道Id:${guild_id}`,
      ];
      e.reply(msg);
      break;
  }
}

function onBotReady(){
  logger.info("Guild Bot 已启动,如需帮助请输入gbot help");
}

//注册监听事件
variables.app.on("ready", onBotReady);
variables.app.on("message", onBotRecive);

//创建自定义事件
SMC.addEvent();

