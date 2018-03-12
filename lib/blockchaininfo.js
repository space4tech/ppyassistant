const awesome = require("awesome_starter");
const axios = require("axios");
const request  = require("request");
const settings = require("../config");
const { bot } = require("./telegram");
var requestData;

function get_dynamic_global_properties(){
  requestData = { "jsonrpc" : "2.0", "method": "get_dynamic_global_properties", "params": [settings.witness_account, []], "id": 1 }
  request({
        url : settings.APINodeURL,
        method: "POST",
        json : requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var l_time = new Date(body.result.time);
          var l_itime = new Date(body.result.next_maintenance_time);
          var next_maintenance = ((l_itime.getTime() - l_time.getTime()) / 1000)/60;
          
          bot.sendMessage(
            settings.chatId,
            `<b>Current block</b>: ` + body.result.head_block_number + 
            `\n<b>Next maintenance in</b>: ` + next_maintenance + `minutes`,
            { parse_mode: "HTML" }
          );
          console.log(`<b>Current block</b>: ` + body.result.head_block_number);
          return body;
        }
        else {
          bot.sendMessage(
            settings.chatId,
            `Error trying to execute get_witness function. Error: `+ error +` ::: Response:  `+ response,
            { parse_mode: "HTML" }
          );          
            console.log("error: " + error)
            console.log("response.statusCode: " + response);
        }
    });  
}

function get_global_properties(){
  requestData = { "jsonrpc" : "2.0", "method": "get_global_properties", "params": [settings.witness_account, []], "id": 1 }
  request({
        url : settings.APINodeURL,
        method: "POST",
        json : requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var totActive = body.result.active_witnesses.length;
          bot.sendMessage(
            settings.chatId,
            `<b>Total active witness</b>: ` + totActive,
            { parse_mode: "HTML" }
          );
          console.log(`<b>Total active witness</b>: ` + totActive);
          return body;
        }
        else {
          bot.sendMessage(
            settings.chatId,
            `Error trying to execute get_witness function. Error: `+ error +` ::: Response:  `+ response,
            { parse_mode: "HTML" }
          );          
            console.log("error: " + error)
            console.log("response.statusCode: " + response);
        }
    });  
}

const respondBlockchainInfo = async () => {
  //get_dynamic_global_properties ::: return: result.head_block_number, result.time, result.next_maintenance_time
  //get_global_properties :::: return: result.active_witnesses
  try {
    var infoData1 = await get_dynamic_global_properties();
    var infoData2 = await get_global_properties();
  } catch (error) {
    bot.sendMessage(
      settings.chatId,
      `Error in respondBlockchainInfo: `+ error,
      { parse_mode: "HTML" }
    );              
  }
};

exports.respondBlockchainInfo = respondBlockchainInfo;