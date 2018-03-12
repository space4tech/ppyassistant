exports.intents =
  {
    ASK_PASSWORD_FOR_RESYNC:
      "ASK_PASSWORD_FOR_RESYNC"
  };

exports.menu = {
  reply_markup: {
    keyboard: [
      ["🔎 Blockchain info", //return head_block_num, head_block_age, next_maintenance_time, participation, active_witnesses
       "📄 Get witness"] //return total_votes, total_missed, last_confirmed_block_num
//      ["📦 Server Status"], //return disk space, RAM usage, CPU usage
//      ["🔑 Resync blockchain"], //if your node is in a wrong block you can resync and replay blockchain, it will ask you your 2fa password
    ]
  }
};

