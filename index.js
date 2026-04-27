import {
  Client,
  GatewayIntentBits,
  ChannelType,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// 🔐 VARIÁVEIS DO PAINEL
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
  console.log("❌ TOKEN não definido no painel!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.log("❌ CLIENT_ID não definido no painel!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔍 evita duplicar canais
async function criar(guild, nome, tipo, parent = null) {
  const canal = guild.channels.cache.find(c => c.name === nome);
  if (canal) return canal;

  return await guild.channels.create({
    name: nome,
    type: tipo,
    parent: parent?.id
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
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands
    });
    console.log("✅ Comando registrado!");
  } catch (err) {
    console.log("❌ Erro ao registrar comando:", err);
  }
})();

// ✅ bot online
client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// 🎮 comando
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({
      content: "⚙️ Organizando servidor...",
      ephemeral: true
    });

    const guild = interaction.guild;

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

    // 💎 VIP (mantém os seus)
    const vip = await criar(guild, "💎 ÁREA VIP", ChannelType.GuildCategory);
    await criar(guild, "💎・familia-souza", 0, vip);
    await criar(guild, "💎・familia", 0, vip);
    await criar(guild, "👕・set-roupas", 0, vip);
    await criar(guild, "👗・roupas-aurora", 0, vip);
    await criar(guild, "👔・roupas-henrique", 0, vip);

    // 🔒 VOZ
    const voz = await criar(guild, "🔒 RESENHAS", ChannelType.GuildCategory);
    await criar(guild, "🔒・resenha", 2, voz);
    await criar(guild, "🔒・familia", 2, voz);
    await criar(guild, "💤・dormindo", 2, voz);

    await interaction.followUp({
      content: "✅ Servidor organizado!"
    });
  }
});

// 🚀 login
client.login(TOKEN);
