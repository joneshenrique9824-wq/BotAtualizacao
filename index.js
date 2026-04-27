import {
  Client,
  GatewayIntentBits,
  ChannelType
} from "discord.js";

// 🔐 COLE SEU TOKEN AQUI (SEM ESPAÇO)
const TOKEN = "MTQ5ODMxMTA0OTUxNzA3NjY0MQ.Gzb20r.yBYb8xqjmGDlMa8M8MA4NHm0zLrzcinTIgGfBs";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔍 evita duplicar canais
async function criarSeNaoExiste(guild, nome, tipo, parent = null) {
  const existente = guild.channels.cache.find(c => c.name === nome);
  if (existente) return existente;

  return await guild.channels.create({
    name: nome,
    type: tipo,
    parent: parent ? parent.id : null
  });
}

// ✅ BOT ONLINE
client.once("ready", async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  const guild = client.guilds.cache.first(); // pega seu servidor

  if (!guild) {
    console.log("❌ Bot não está em nenhum servidor");
    return;
  }

  console.log("⚙️ Organizando servidor automaticamente...");

  // 🏠 BASE
  const base = await criarSeNaoExiste(guild, "🏠 BASE DA RESENHA", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "📜・boas-vindas", 0, base);
  await criarSeNaoExiste(guild, "📌・regras", 0, base);
  await criarSeNaoExiste(guild, "📢・avisos", 0, base);

  // 💬 COMUNIDADE
  const comunidade = await criarSeNaoExiste(guild, "💬 COMUNIDADE", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "💭・chat-geral", 0, comunidade);
  await criarSeNaoExiste(guild, "😂・zoeira", 0, comunidade);
  await criarSeNaoExiste(guild, "📸・midia", 0, comunidade);
  await criarSeNaoExiste(guild, "💡・sugestões", 0, comunidade);
  await criarSeNaoExiste(guild, "📢・divulgacao", 0, comunidade);

  // 💎 VIP (mantém os seus)
  const vip = await criarSeNaoExiste(guild, "💎 ÁREA VIP", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "💎・familia-souza", 0, vip);
  await criarSeNaoExiste(guild, "💎・familia", 0, vip);
  await criarSeNaoExiste(guild, "👕・set-roupas", 0, vip);
  await criarSeNaoExiste(guild, "👗・roupas-aurora", 0, vip);
  await criarSeNaoExiste(guild, "👔・roupas-henrique", 0, vip);

  // 🔒 VOZ PRIVADA
  const vozPrivada = await criarSeNaoExiste(guild, "🔒 RESENHAS", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "🔒・resenha-secreta", 2, vozPrivada);
  await criarSeNaoExiste(guild, "🔒・resenha-familia", 2, vozPrivada);
  await criarSeNaoExiste(guild, "🔒・familia-naty", 2, vozPrivada);
  await criarSeNaoExiste(guild, "🔒・resenha", 2, vozPrivada);
  await criarSeNaoExiste(guild, "💤・dormindo", 2, vozPrivada);

  // 🤖 BOTS
  const bots = await criarSeNaoExiste(guild, "🤖 BOTS", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "🤖・comandos-loritta", 0, bots);
  await criarSeNaoExiste(guild, "🤖・gartic-bot", 0, bots);

  // 🔊 VOZ
  const voz = await criarSeNaoExiste(guild, "🔊 CONVERSA DE VOZ", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "🔇・sem-microfone", 2, voz);
  await criarSeNaoExiste(guild, "🔊・geral-1", 2, voz);
  await criarSeNaoExiste(guild, "🔊・geral-2", 2, voz);

  // ⚙️ ADMIN
  const admin = await criarSeNaoExiste(guild, "⚙️ ADMINISTRAÇÃO", ChannelType.GuildCategory);
  await criarSeNaoExiste(guild, "🚫・denuncias", 0, admin);
  await criarSeNaoExiste(guild, "📝・logs", 0, admin);
  await criarSeNaoExiste(guild, "⚙️・staff", 0, admin);

  console.log("✅ Servidor organizado com sucesso!");
});

// 🚀 LOGIN
client.login(TOKEN);
