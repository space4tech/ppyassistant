const awesome = require("awesome_starter");
const cron = require("node-cron");
const { getMissedBlocksCron } = require("./lib/getwitness");

cron.schedule("* * * * *", () => {
  getMissedBlocksCron().catch(e =>
    awesome.errors.generalCatchCallback(e, "[cron]getMissedBlocksCron")
  );  
});