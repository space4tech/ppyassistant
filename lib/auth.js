const settings = require("../config");
const { bot } = require("./telegram");
let speakeasy = require("speakeasy");

const testAuthenticationOTP = async (otpCode, silent) => {
  const verifyObj = {
    secret: settings.OTPsecret,
    encoding: "base32",
    token: otpCode.replace(/ /g, "")
  };

  if (await speakeasy.totp.verify(verifyObj)) {
    if (!silent) bot.sendMessage(settings.chatId, `✅ Your password works!!`);
    return true;
  } else if (!silent) {
    bot.sendMessage(settings.chatId, `The code is wrong please check your configuration`);
  }
  return false;
};

exports.testAuthenticationOTP = testAuthenticationOTP;