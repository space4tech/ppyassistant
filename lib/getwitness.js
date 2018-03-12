const awesome = require("awesome_starter");
const axios = require("axios");
const request  = require("request");
const settings = require("../config");
const { bot } = require("./telegram");
var requestData;
var actualMissedBlocks = require("../index").actualMissedBlocks;
    
function get_vesting_balances(){
  requestData = { "jsonrpc" : "2.0", "method": "get_vesting_balances", "params": [settings.witness_account, []], "id": 1 }
  let options = {
        url: settings.APINodeURL,
        method: "POST",
        json : requestData
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })  
}

function get_witness(){
  requestData = { "jsonrpc" : "2.0", "method": "get_witness_by_account", "params": [settings.witness_account, []], "id": 1 }
  let options = {
        url: settings.APINodeURL,
        method: "POST",
        json : requestData
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })  
}

const respondGetWitness = async () => {
  //return total_votes, total_missed, last_confirmed_block_num
  //get_vesting_balances ::: return: result.balance.amount
        let getData = get_witness();
        getData.then(function(result) {
            data = result;
            bot.sendMessage(
              settings.chatId,
              `<b>Total in votes</b>: ` + data.result.total_votes + `\n<b>Total missed</b>: ` + 
              data.result.total_missed + `\n<b>Last signed block</b>: ` + 
              data.result.last_confirmed_block_num,
              { parse_mode: "HTML" }
            );
        }, function(err) {
            bot.sendMessage(
              settings.chatId,
              `Error trying respondGetWitness get_witness: `+ err,
              { parse_mode: "HTML" }
            );
            console.log(err);
        });
    
       let getData2 = get_vesting_balances();
        getData2.then(function(result) {
            data = result;
            vesBalance = data.result[0].balance.amount / 100000;
            bot.sendMessage(
              settings.chatId,
              `<b>Vesting balance</b>: ` + vesBalance,
              { parse_mode: "HTML" }
            );
        }, function(err) {
            bot.sendMessage(
              settings.chatId,
              `Error trying respondGetWitness get_vesting_balances: `+ err,
              { parse_mode: "HTML" }
            );
            console.log(err);
        });
};

const getMissedBlocks = async () => {
    let getData = get_witness();
    getData.then(function(result) {
        let data = result;
        result (data.result.total_missed);
    }, function(err) {
        bot.sendMessage(
          settings.chatId,
          `Error trying Missedblocks: `+ err,
          { parse_mode: "HTML" }
        );
        console.log(err);
    });
};

const getMissedBlocksCron = async () => {
    let getData = get_witness();
    getData.then(function(result) {
        let data = result;
        if(actualMissedBlocks == undefined){
          actualMissedBlocks = data.result.total_missed;
        }
//          bot.sendMessage(
//            settings.chatId,
//            `Check global `+actualMissedBlocks+` against actual blocks: `+ data.result.total_missed,
//            { parse_mode: "HTML" }
//          );
        
        if(actualMissedBlocks != data.result.total_missed){
          bot.sendMessage(
            settings.chatId,
            `You are missing blocks\nActual missed blocks: `+ data.result.total_missed,
            { parse_mode: "HTML" }
          );
          actualMissedBlocks = data.result.total_missed;
        }
    }, function(err) {
        bot.sendMessage(
          settings.chatId,
          `Error trying Missedblocks cron: `+ err,
          { parse_mode: "HTML" }
        );
        console.log(err);
    })
};

exports.respondGetWitness = respondGetWitness;
exports.getMissedBlocks = getMissedBlocks;
exports.getMissedBlocksCron = getMissedBlocksCron;