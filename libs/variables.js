//导入库
const YAML = require("yamljs");
const { createClient } = require("oicq");
const { GuildApp, Channel } = require("oicq-guild");

//定义Logger
logger.setTitle("GuildBot");

//变量
exports.config = {};
exports.root_path = "plugins/guildBot/";
exports.photo_view = process.cwd() + exports.root_path +"view\\ImagePreview.exe"

//常量
exports.VERSION = "v0.0.2";

exports.readConfig = function() {
  try {
    exports.config = YAML.load("plugins/guildBot/config.yml");
    return true;
  } 
	catch (err) {
    logger.error("读取Config时出现了错误:", err);
    return false;
  }
}

exports.readConfig();

//账号密码
exports.account = exports.config.account.id;
exports.password = exports.config.account.password;

//创建OICQ的客户端
exports.client = createClient(exports.account);
exports.app = GuildApp.bind(exports.client);