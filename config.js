// replace all the fields with your configuration

exports.telegramAPIToken = ""; // Your telegram bot API key. 
exports.chatId = ""; // your telegram id. 
exports.OTPsecret = ""; // run "npm run generate-password" in order to get this setting. This setting will help you to manage your server
exports.APINodeURL = "http://testnet-ppyapi.spacemx.tech:88/rpc"; //api node to execute querys

exports.PWDFolder = "/home/user/peerplays/programs/"; // go where your cli_wallet and witness_node program are and execute: pwd  ... put the result in exports.PWDFolder

exports.witness_account = "1.2.199"; //your witness account

exports.remoteNodes = [
  //list of your API nodes, if you have none leave []
  //You need 2 or more in order to this function to work
  {
    url: "http://127.0.0.1:8090/rpc",
    name: "Local API"
  },
  {
    url: "http://testnet-ppyapi.spacemx.tech:88/rpc",
    name: "Remote API 1"
  }
];