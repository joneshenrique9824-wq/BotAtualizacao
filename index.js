import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// 🔐 CONFIG SEGURA (evita erro de token)
const TOKEN = process.env.TOKEN?.trim();
const CLIENT_ID = process.env.CLIENT_ID?.trim();

if (!TOKEN) {
  console.log("❌ TOKEN não encontrado! Verifique o .env ou as variáveis do painel.");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.log("❌ CLIENT_ID não encontrado!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔍 Evita duplicar canal
async function criarSeNaoExiste(guild, nome, tipo, parent = null) {
  const existente = guild.channels.cache.find(c => c.name === nome);
  if (existente) return existente;

  return await guild.channels.create({
    name: nome,
    type: tipo,
    parent: parent ? parent.id : null
  });
}

// 📌 Slash command
const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organizar servidor automaticamente sem mexer no que já existe")
].map(cmd => cmd.toJSON());

// 🚀 Registrar comando
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🔄 Registrando comando...");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("✅ Comando registrado!");
  } catch (err) {
    console.log("❌ Erro ao registrar comando:", err);
  }
})();

// ✅ Bot online
client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// 🎮 Comando
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({ content: "⚙️ Organizando servidor...", ephemeral: true });

    const guild = interaction.guild;

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
    await criarSeNaoExiste(guild, "📢・divulgacao", 0, comunidade); // mantém

    // 💎 VIP (NÃO altera os seus)
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

    interaction.followUp({ content: "✅ Servidor organizado com sucesso!" });
  }
});

// 🚀 LOGIN
client.login(TOKEN);
