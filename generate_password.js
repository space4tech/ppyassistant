let speakeasy = require("speakeasy");
let qrcode = require("qrcode-terminal");
let secret = speakeasy.generateSecret({ name: "graphene assistant" });

console.log("\n");
console.log("Save your secret: \n ");
console.log(secret);
console.log("\n");
console.log(
  "Scan the following QR code with your 2FA app (e.g. Google Authenticator)"
);
console.log("\n\n");
qrcode.generate(secret.otpauth_url);

console.log("\n\n");
console.log(
  "If you have problems in scanning the QR code, copy this URL in your 2FA app:\n",
  secret.otpauth_url
);

console.log("\n\n");
console.log(
  "Insert in the config.js file the following secret: ",
  secret.base32
);
console.log("\n\n");

console.log(
  "By now you should have set up the One time password in your 2FA app and the secret configured in the config.js"
);
console.log(
  'You can test the athentication code by sending a message to your bot like this: /test 6_DIGITS_FROM_AUTH_APP'
);
console.log("\n");