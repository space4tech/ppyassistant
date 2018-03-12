require("awesome_starter");
require("./cron");
const settings = require("./config");
const consts = require("./consts");
const { 
  respondGetWitness
} = require("./lib/getwitness");
const { respondBlockchainInfo } = require("./lib/blockchaininfo");
const { testAuthenticationOTP } = require("./lib/auth");
const { cleanIntent, setIntent, sendChunkedMessage } = require("./lib/utils");
const { bot } = require("./lib/telegram");
let promptIntent = {
  waitingPrompt: false,
  lastIntent: ""
};
let followLogs = false;
actualMissedBlocks = 0;

console.log(`
  
  Telegram Bot running only for ${settings.chatId}
  OTP secret is ${settings.OTPsecret}

  Check this parameters, if all is good you can continue using this assistant
 `);

if (settings.chatId) {
  (async () => {
    await bot.sendMessage(
      settings.chatId,
      `Peerplays assistant is here, check the options available in the menu... `
    );
  })();
}

//Menu
bot.onText(/(\/s|\/start|help|hello|hey|hi)/i, msg => {
  promptIntent = cleanIntent();
  if(settings.chatId)
    bot.sendMessage(
      settings.chatId,
      `👋 Hi ${msg.from.first_name}! How can I help you?`,
      consts.menu
    );
  else
    bot.sendMessage(
        msg.from.id,
        `Hi ${msg.from.first_name}! Your id is: ${msg.from.id}`,
        consts.menu
    );
  console.log(
    "Client connected:",
    msg.from.id,
    msg.from.first_name,
    "@" + msg.from.username
  );
});

// blockHeight
bot.onText(/(\/b|blockchain info|block info)/i, async () => {
  promptIntent = cleanIntent();
  respondBlockchainInfo();
});

// get_witness
bot.onText(/(\/b|get witness|Get witness)/i, async () => {
  promptIntent = cleanIntent();
  respondGetWitness();
});


// test OTP
bot.onText(/\/test (.+)/, (msg, match) => {
  promptIntent = cleanIntent();
  testAuthenticationOTP(match[1].toString());
});


// Rebuild flow start
bot.onText(/🔑 Resync blockchain/, async () => {
  promptIntent = setIntent(consts.intents.ASK_PASSWORD_FOR_RESYNC);
  return bot.sendMessage(
    settings.chatId,
    `🔐 Please provide the password to proceed with the operation..`,
    {
      reply_markup: {
        keyboard: [["❌ Cancel"]]
      }
    }
  );
});

bot.on("message", async function(msg) {
  // inspects every message and looks if we are awaiting a reply from the user (prompting)

  if (!promptIntent.waitingPrompt) {
    // If we are not waiting for followup messages, return
    return;
  }
  prompting = true; //avoiding to go in default message

  if (msg.text === "❌ Cancel") {
    bot.sendMessage(settings.chatId, `Ok, mission aborted!`, consts.menu);
    setTimeout(cleanIntent, 200);
    return;
  }

  if (
    promptIntent.lastIntent ===
    consts.intents.ASK_PASSWORD_FOR_RESYNC
  ) {
    const otpToken = msg.text.toString();
    const validOTP = await testAuthenticationOTP(otpToken, true);

    if (validOTP) {
      bot.sendMessage(
        settings.chatId,
        `✅ You are authenticated! Now I'll start the replay resync your node...`
      );
      //startRebuild(consts.snapshot_servers.GREENDRAGON_MAIN);
    } else {
      bot.sendMessage(
        settings.chatId,
        `Error, invalid password... Try again...`,
        {
          reply_markup: {
            keyboard: [["❌ Cancel"]]
          }
        }
      );
    }
  }
});

bot.onText(/.+/, function(msg) {
  // Default message in case we didn't get the request
  if (!promptIntent.waitingPrompt)
    bot.sendMessage(
      msg.chat.id,
      "🤔I've not been coded to to understand that info, yet..."
    );
});

exports.actualMissedBlocks = actualMissedBlocks;