//LiteLoaderScript Dev Helper
/// <reference path="e:\MCServer\LXLDevHelper-VsCode\Library/Library/JS/Api.js" />

//引入库文件
const { createClient } = require("oicq");
const { GuildApp, Channel } = require("oicq-guild");
const fs = require("fs");
const YAML = require("yamljs");
const os = require("os");
const SMC = require("./libs/minecraft");
const variables = require("./libs/variables.js");
const apis = require("./libs/API.js");

//定义Logger的Title
logger.setTitle("GuildBot");

//监听事件
/*
{
  guild_id:72124111650617189,
  channel_id:8599850,
  guild_name:eoe机器人测试频道,
  channel_name:玩家聊天区,
  sender:{
    tiny_id:144115218677257743,
    nickname:最美夕阳红
  },
  seq:84,
  rand:248483640,
  time:1660269120,
  message:[
    {
      type:text,
      text:1
    }
  ],
  raw_message:1,
  reply:<Function>
}
*/

variables.client.on("system.login.slider", function (e) {
  logger.info("收到验证码,请获取到验证码后使用gbot ticket <ticket>提交验证码")
  process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login("password")

//之后还可能会输出设备锁url，需要去网页自行验证，也可监听 `system.login.device` 处理

function onBotRecive(e) {
  logger.debug(e);
  var msg = e.raw_message;
  var guild_id = e.guild_id;
  var channel_id = e.channel_id;

  //分割Message
  var commandAction = msg.split(" ")[0];

  //执行操作
  switch (commandAction) {
    //运行命令
    case "run":
      if (apis.isChannelType(guild_id, channel_id, "console")) {
        if(apis.isAdmin(e.sender.tiny_id)){
          var result = mc.runcmdEx(msg.replace(commandAction + " ", ""));
          if(result.success){
            if(result.output != ""){
              e.reply("执行成功,输出:\n"+result.output);
            }else{
              e.reply("执行成功");
            }
          }else{
            if(result.output != ""){
              e.reply("执行失败,输出:\n"+result.output);
            }else{
              e.reply("执行失败");
            }
          }
          
        }
        else{
          e.reply("您没有权限运行命令");
        }
        
      } else {
        e.reply("请在控制台频道运行命令");
      }
      break;

    //tellraw说话
    case "say":
      if (apis.isChannelType(guild_id, channel_id, "chat")) {
        var content = msg.replace(commandAction + " ", "");
        mc.broadcast(`<${e.sender.nickname}> ${content}`);
      }
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

function onBotReady() {
  logger.info("Guild Bot 已启动,如需帮助请输入gbot help");
}

//注册监听事件
variables.app.on("ready", onBotReady);
variables.app.on("message", onBotRecive);

//创建自定义事件
SMC.addEvent();

//检测是否是数字
function myIsNaN(value) {
  return (!isNaN(value));
}

//检查更新
function queryUpdate(){
  network.httpGet("https://api.github.com/repos/CSPDevTeam/CSPGuildBot/releases/latest",(status,result)=>{
    if(status == 200){
      var jr = JSON.parse(result);
      var latestVersion = jr.tag_name;
      var currentVersion = require("./package.json").version;

      //分割版本号
      var latestVersionArray = latestVersion.split("");
      var currentVersionArray = currentVersion.split("");
      var latestVersionNumber = "";
      var currentVersionNumber = "";
      for(var i=0;i<latestVersionArray.length;i++){
        if(myIsNaN(latestVersionArray[i])){
          latestVersionNumber += latestVersionArray[i];
        }
      }
      for(var i=0;i<currentVersionArray.length;i++){
        if(myIsNaN(currentVersionArray[i])){
          currentVersionNumber += currentVersionArray[i];
        }
      }
      if(Number(latestVersionNumber) > Number(currentVersionNumber)){
        logger.warn("GuildBot 发现新版本,当前版本:"+currentVersion+",最新版本:"+latestVersion);
      }
      else if(Number(latestVersionNumber) == Number(currentVersionNumber)){
        logger.info("GuildBot 当前版本为最新版本");
      }
      else{
        logger.warn("GuildBot 您使用的版本为Beta版本，如有问题请报告Issues");
      }
    }else{
      logger.warn("GuildBot 检查更新失败");
    }
  })
}

queryUpdate();
