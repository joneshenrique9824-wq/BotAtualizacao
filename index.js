import {
  Client,
  GatewayIntentBits,
  ChannelType,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// 🔐 COLOCA AQUI (SEM ASPAS ERRADAS)
const TOKEN = "MTQ5ODMxMTA0OTUxNzA3NjY0MQ.GCAGYc.w-73QVn0JuVofUMxAvWN-qp1QiR0sFetfslQ8k";
const CLIENT_ID = "1498311049517076641";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔍 evita duplicar
async function criarSeNaoExiste(guild, nome, tipo, parent = null) {
  const existente = guild.channels.cache.find(c => c.name === nome);
  if (existente) return existente;

  return await guild.channels.create({
    name: nome,
    type: tipo,
    parent: parent ? parent.id : null
  });
}

// 📌 comando
const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organizar servidor automaticamente")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// 🚀 registrar comando
(async () => {
  try {
    console.log("🔄 Registrando comando...");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("✅ Comando registrado!");
  } catch (err) {
    console.log("❌ Erro ao registrar:", err);
  }
})();

// ✅ online
client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// 🎮 comando
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({ content: "⚙️ Organizando servidor...", ephemeral: true });

    const guild = interaction.guild;

    const base = await criarSeNaoExiste(guild, "🏠 BASE DA RESENHA", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "📜・boas-vindas", 0, base);
    await criarSeNaoExiste(guild, "📌・regras", 0, base);
    await criarSeNaoExiste(guild, "📢・avisos", 0, base);

    const comunidade = await criarSeNaoExiste(guild, "💬 COMUNIDADE", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "💭・chat-geral", 0, comunidade);
    await criarSeNaoExiste(guild, "😂・zoeira", 0, comunidade);
    await criarSeNaoExiste(guild, "📸・midia", 0, comunidade);
    await criarSeNaoExiste(guild, "💡・sugestões", 0, comunidade);
    await criarSeNaoExiste(guild, "📢・divulgacao", 0, comunidade);

    const vip = await criarSeNaoExiste(guild, "💎 ÁREA VIP", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "💎・familia-souza", 0, vip);
    await criarSeNaoExiste(guild, "💎・familia", 0, vip);
    await criarSeNaoExiste(guild, "👕・set-roupas", 0, vip);
    await criarSeNaoExiste(guild, "👗・roupas-aurora", 0, vip);
    await criarSeNaoExiste(guild, "👔・roupas-henrique", 0, vip);

    const vozPrivada = await criarSeNaoExiste(guild, "🔒 RESENHAS", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "🔒・resenha-secreta", 2, vozPrivada);
    await criarSeNaoExiste(guild, "🔒・resenha-familia", 2, vozPrivada);
    await criarSeNaoExiste(guild, "🔒・familia-naty", 2, vozPrivada);
    await criarSeNaoExiste(guild, "🔒・resenha", 2, vozPrivada);
    await criarSeNaoExiste(guild, "💤・dormindo", 2, vozPrivada);

    const bots = await criarSeNaoExiste(guild, "🤖 BOTS", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "🤖・comandos-loritta", 0, bots);
    await criarSeNaoExiste(guild, "🤖・gartic-bot", 0, bots);

    const voz = await criarSeNaoExiste(guild, "🔊 CONVERSA DE VOZ", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "🔇・sem-microfone", 2, voz);
    await criarSeNaoExiste(guild, "🔊・geral-1", 2, voz);
    await criarSeNaoExiste(guild, "🔊・geral-2", 2, voz);

    const admin = await criarSeNaoExiste(guild, "⚙️ ADMINISTRAÇÃO", ChannelType.GuildCategory);
    await criarSeNaoExiste(guild, "🚫・denuncias", 0, admin);
    await criarSeNaoExiste(guild, "📝・logs", 0, admin);
    await criarSeNaoExiste(guild, "⚙️・staff", 0, admin);

    interaction.followUp({ content: "✅ Servidor organizado!" });
  }
});

// 🚀 LOGIN
client.login(TOKEN);
