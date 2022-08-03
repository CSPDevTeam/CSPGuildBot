//LiteLoaderScript Dev Helper
/// <reference path="e:\MCServer\LXLDevHelper-VsCode\Library/Library/JS/Api.js" />

const { createClient } = require("oicq");
const { GuildApp, Channel } = require("oicq-guild");
const fs = require("fs");

var config = {};
logger.setTitle("GuildBot")

//读取Config文件
function readConfig(){
  try {
    config = JSON.parse(fs.readFileSync("plugins/guildBot/config.json", "utf8"));
    return true;
  } 
  catch (err) {
    logger.error("读取Config时出现了错误:",err);
    return false;
  }
}
readConfig();

// input with your account and password
var account = config.account.id;
var password = config.account.password;

// create oicq client
const client = createClient(account);
client.login(password);

// create guild app and bind it to an oicq client
const app = GuildApp.bind(client);

app.on("ready", function () {
  console.log("My guild list:");
  console.log(this.guilds);
});

//发消息API
function sendGuildMessage(channel,content){
  channel.sendMessage(content)
    .then(data=>{
      return data;
    })
    .catch(err=>{
      logger.error("发送消息出现错误:",err.message);
      return err;
    })
}

/*
GuildMessage {
  guild_id: '72124111650617189',
  channel_id: '8599870',
  guild_name: 'eoe机器人测试频道',
  channel_name: '服务器交互区',
  sender: { tiny_id: '144115218773667666', nickname: 'TPCP Robot' },
  seq: 3,
  rand: 570974309,
  time: 1659488291,
  message: [ { type: 'text', text: 'Hello, 最美夕阳红!' } ],
  raw_message: 'Hello, 最美夕阳红!',
  reply: [Function: bound sendMessage] AsyncFunction
}
*/
app.on("message", (e) => {
  console.log(e);
  var msg = e.raw_message;

  //分割Message
  var commandAction = msg.split(" ")[0];

  //执行操作
  switch (commandAction) {
    //运行命令
    case "run":
      mc.runcmd(msg.replace(commandAction+" ",""));
      break;

    //tellraw说话
    case "say":
      var content = msg.replace(commandAction+" ","");
      mc.broadcast(`<${e.sender.nickname}> ${content}`);
      break;

    //查询相关信息
    case "query":
      if(e.message.length < 1){
        return;
      }
      var userId = e.message[1].type == "at" ? e.message[1].id : "Unkown";
      var userName = e.message[1].type == "at" ? e.message[1].text : "Unkown";
      var channel_id = e.channel_id;
      var guild_id = e.guild_id;
      
      var msg = [
        {
          type: 'at',
          qq: 0,
          text: "@"+e.sender.nickname,
          id: e.sender.tiny_id
        },
        `\n您查询的信息结果如下:\n用户Id:${userId}\n用户名:${userName}\n子频道Id:${channel_id}\n频道Id:${guild_id}`];
      e.reply(msg);
      break;

    //查询自己
    case "queryme":
      var userId = e.sender.tiny_id!=undefined ? e.sender.tiny_id : "Unkown";
      var userName = e.sender.nickname!=undefined ? e.sender.nickname : "Unkown";
      var channel_id = e.channel_id;
      var guild_id = e.guild_id;
      
      var msg = [
        {
          type: 'at',
          qq: 0,
          text: "@"+e.sender.nickname,
          id: e.sender.tiny_id
        },
        `\n您的信息如下:\n用户Id:${userId}\n用户名:${userName}\n子频道Id:${channel_id}\n频道Id:${guild_id}`];
      e.reply(msg);
      break;
  }

});

mc.listen("onChat", (pl, msg) => {
  //获取频道
  for (var i = 0; i < config.guild_id.length; i++) {
    var data = config.guild_id[i];
    //检测是否是chat频道
    if (data.type == "chat") {
      //获取指定的频道
      var guild = app.guilds.get(data.guild_id);
      var channel = guild.channels.get(data.channel_id);
      //发送消息
      var msg = `<${pl.name}> ${msg}`;
      // channel.sendMessage(msg)
      //   .catch(err=>{
      //     logger.error(err)
      //   });
      sendGuildMessage(channel,msg);
    }
  }
});

mc.listen("onServerStarted", () => {
  let cmd = mc.newCommand("gbot", "Guild Bot Command", PermType.GameMasters);
  cmd.setAlias("gbot");

  //注册枚举
  cmd.setEnum("ChangeAction", ["add", "remove"]);
  cmd.setEnum("ListAction", ["guild","reload"]);
  cmd.setEnum("GuildAction", ["channel","member"]);

  //注册参数
  cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
  cmd.mandatory("action", ParamType.Enum, "ListAction", 1);
  cmd.mandatory("action", ParamType.Enum, "GuildAction", 1);
  cmd.mandatory("name", ParamType.String);

  //注册指令
  cmd.overload(["ChangeAction", "name"]);
  cmd.overload(["ListAction"]);
  cmd.overload(["GuildAction","name"]);

  //回调函数
  cmd.setCallback((_cmd, _ori, out, res) => {
    switch (res.action) {
      case "add":
        return out.success(`add "${res.name}"`);
      case "remove":
        return out.success(`remove "${res.name}"`);

      //输出频道列表
      case "guild":
        
        var guild = app.guilds;
        guild.forEach((guild,key,map)=>{
          out.success(`§a${guild.guild_name}:§e${key}`)
        })
        break;

      //输出频道列表
      case "channel":
        
        var guild = app.guilds.get(res.name);
        if(guild != undefined){
          var channel = guild.channels;
          out.success(`§a${guild.guild_name}:§e${res.name}`)
          channel.forEach((channel,key,map)=>{
            out.success(`  §b${channel.channel_name}:§c${key}`)
          })
        }
        else{
          out.error("guild not found")
        }
        break;
      
      //获取成员列表
      case "member":
        var guild = app.guilds.get(res.name);
        if(guild != undefined){
          var member = guild.getMemberList();
          out.success(`§a${guild.guild_name}:§e${res.name}`)
          member
            .then(members=>{
              for(var i=0;i<members.length;i++){
                out.success(`  §b${members[i].nickname}:§c${members[i].tiny_id}`)
              }
            })
            .catch(err=>{
              out.error("An error occurred while getting the list of members:\n"+err)
            })
          
          
        }
        else{
          out.error("guild not found")
        }
        break;
        
        //重载
      case "reload":
        return readConfig() ? out.success("reload success"):out.error("reload failed");
      }
  });
  cmd.setup();
});
