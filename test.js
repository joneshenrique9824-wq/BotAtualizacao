import { Client } from "discord.js";

const client = new Client({ intents: [] });

client.once("ready", () => {
  console.log("✅ BOT FUNCIONANDO");
});

client.login("MTQ5ODMxMTA0OTUxNzA3NjY0MQ.GCAGYc.w-73QVn0JuVofUMxAvWN-qp1QiR0sFetfslQ8k");
