//导入库
const YAML = require("yamljs");
const { createClient } = require("oicq");
const { GuildApp, Channel } = require("oicq-guild");
const fs = require("fs");
const os = require("os");

//定义Logger
logger.setTitle("GuildBot");

//变量
exports.config = {};
exports.clientConfig = {};
exports.root_path = "plugins/guildBot/";
exports.photo_view = process.cwd() +"/"+exports.root_path +"/view/ImagePreview.exe"
exports.canStart = false;

//常量
exports.CONFIGVERSION = 1

exports.readConfig = function() {
  try {
    exports.config = YAML.load("plugins/guildBot/config.yml");
    //校验配置版本
    if(exports.config.version < exports.CONFIGVERSION || exports.config.version == undefined){
      logger.error("配置版本不匹配，请更新配置文件");
      return false;
    }
    return true;
  } 
	catch (err) {
    logger.error("读取Config时出现了错误:", err);
    return false;
  }
}

exports.readClientConfig = function(){
  try {
    exports.clientConfig = YAML.load("plugins/guildBot/Advanced_Config.yml");
    return true;
  } 
  catch (err) {
    logger.error("读取Client Config时出现了错误:", err);
    logger.warn("无法读取Client Config,将使用默认配置");
    return false;
  }
}

if(exports.readConfig()){
  exports.canStart = true
}
else{
  logger.error("配置文件读取不正确,guildBot将停止启动...")
}

exports.readClientConfig();

//账号密码
exports.account = exports.config.account.id;
exports.password = exports.config.account.password;

//创建OICQ的客户端
if(exports.canStart){
  exports.client = createClient(exports.account, exports.clientConfig);
  exports.app = GuildApp.bind(exports.client);
}
else{
  process.exit(1)
}


//需要验证码
exports.needVerify = false;