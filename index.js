import { Client, GatewayIntentBits, ChannelType } from "discord.js";

// 🔐 COLE SEU TOKEN AQUI (SEM ESPAÇO)
const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔍 cria canal só se não existir
async function criar(guild, nome, tipo, parent = null) {
  const canal = guild.channels.cache.find(c => c.name === nome);
  if (canal) return canal;

  return await guild.channels.create({
    name: nome,
    type: tipo,
    parent: parent?.id
  });
}

// 🚀 QUANDO LIGAR
client.once("ready", async () => {
  console.log("✅ BOT ONLINE");

  const guild = client.guilds.cache.first();
  if (!guild) return console.log("❌ Bot não está no servidor");

  console.log("⚙️ Organizando...");

  // 🏠 BASE
  const base = await criar(guild, "🏠 BASE DA RESENHA", ChannelType.GuildCategory);
  await criar(guild, "📜・boas-vindas", 0, base);
  await criar(guild, "📌・regras", 0, base);
  await criar(guild, "📢・avisos", 0, base);

  // 💬 COMUNIDADE
  const com = await criar(guild, "💬 COMUNIDADE", ChannelType.GuildCategory);
  await criar(guild, "💭・chat-geral", 0, com);
  await criar(guild, "😂・zoeira", 0, com);
  await criar(guild, "📸・midia", 0, com);
  await criar(guild, "💡・sugestões", 0, com);
  await criar(guild, "📢・divulgacao", 0, com);

  // 💎 VIP (mantém seus canais)
  const vip = await criar(guild, "💎 ÁREA VIP", ChannelType.GuildCategory);
  await criar(guild, "💎・familia-souza", 0, vip);
  await criar(guild, "💎・familia", 0, vip);
  await criar(guild, "👕・set-roupas", 0, vip);
  await criar(guild, "👗・roupas-aurora", 0, vip);
  await criar(guild, "👔・roupas-henrique", 0, vip);

  // 🔒 VOZ PRIVADA
  const vozP = await criar(guild, "🔒 RESENHAS", ChannelType.GuildCategory);
  await criar(guild, "🔒・resenha", 2, vozP);
  await criar(guild, "🔒・familia", 2, vozP);
  await criar(guild, "💤・dormindo", 2, vozP);

  console.log("✅ ORGANIZADO!");
});

// 🚨 LOGIN DIRETO (SEM VARIÁVEL)
client.login(TOKEN);
