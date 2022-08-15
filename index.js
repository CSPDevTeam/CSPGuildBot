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
const childProcess = require("child_process");

function QrCodeLogin(){
  //使用二维码登录
  const client = variables.client
  client.login()
  client.on("system.login.qrcode",(e)=>{
    logger.info("扫描二维码后输入gbot login登录")
    logger.warn("请保证您在常用IP下进行扫码登陆,否则将无法登录")
    if (os.type() == "Windows_NT"){
      logger.warn("检测到您在使用Windows系统，如遇无法扫码请输入gbot qrcode打开窗口扫码")
    }
    variables.needVerify = true;
  })
}

function PassWordLogin(){
  //使用 密码/MD5 登录
  const client = variables.client
  client.login(variables.password)
  client.on("system.login.slider",(e)=>{
    logger.info("本次登录需要滑动验证,请按照提示滑动验证,获取到Ticket后输入gbot ticket <Ticket>即可提交ticket")
    logger.info("Url:",e.url)
    variables.needVerify = true;
  })
  client.on("system.login.device",(e)=>{
    logger.info("本次登录需要设备验证,请按照提示操作,操作完成后请输入gbot login再次登陆")
    logger.info("Url:",e.url)
    variables.needVerify = true;
  })
}

function loginQQBot(){
  if(variables.password != ""){ //密码登陆
    PassWordLogin();
  }else{
    QrCodeLogin();
  }
}

function startQrcodeProgress(){
  if(os.type() == "Windows_NT"){
    let qr_path = `${variables.photo_view} ${process.cwd()}\\data\\${variables.account}\\qrcode.png`
    childProcess.exec(qr_path, (err, stdout, stderr) => {
      if (err) {
        logger.error("弹窗扫码打开失败，请前往", qr_path, "手动扫码！");
      } 
      else {
        variables.client.login();
      }
    });
  }else{
    logger.error("暂不支持"+os.type()+"系统！")
  }
  
}
apis.startQrcodeProgress = startQrcodeProgress;

mc.listen("onServerStarted",loginQQBot)

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

