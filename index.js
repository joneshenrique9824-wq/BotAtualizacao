import {
  Client,
  GatewayIntentBits,
  ChannelType,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔥 pega ou cria categoria
async function getOuCriaCategoria(guild, nome) {
  let categoria = guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );

  if (!categoria) {
    categoria = await guild.channels.create({
      name: nome,
      type: ChannelType.GuildCategory
    });
  }

  return categoria;
}

// 🔥 organiza canal (CRIA OU MOVE)
async function organizarCanal(guild, nome, tipo, categoria) {
  let canal = guild.channels.cache.find(c => c.name === nome);

  if (!canal) {
    return await guild.channels.create({
      name: nome,
      type: tipo,
      parent: categoria.id
    });
  }

  // 🔄 move se estiver fora da categoria
  if (canal.parentId !== categoria.id) {
    await canal.setParent(categoria.id);
  }

  return canal;
}

// 📌 comando
const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organiza tudo sem duplicar")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: commands
  });
})();

client.once("ready", () => {
  console.log("✅ Bot online");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({
      content: "⚙️ Organizando tudo...",
      ephemeral: true
    });

    const guild = interaction.guild;

    // 🏠 BASE
    const base = await getOuCriaCategoria(guild, "🏠 BASE DA RESENHA");
    await organizarCanal(guild, "📜・boas-vindas", 0, base);
    await organizarCanal(guild, "📌・regras", 0, base);
    await organizarCanal(guild, "📢・avisos", 0, base);

    // 💬 COMUNIDADE
    const com = await getOuCriaCategoria(guild, "💬 COMUNIDADE");
    await organizarCanal(guild, "💭・chat-geral", 0, com);
    await organizarCanal(guild, "😂・zoeira", 0, com);
    await organizarCanal(guild, "📸・midia", 0, com);
    await organizarCanal(guild, "💡・sugestões", 0, com);
    await organizarCanal(guild, "📢・divulgacao", 0, com);

    // 💎 VIP (NÃO REMOVE OS SEUS)
    const vip = await getOuCriaCategoria(guild, "💎 ÁREA VIP");
    await organizarCanal(guild, "💎・familia-souza", 0, vip);
    await organizarCanal(guild, "💎・familia", 0, vip);
    await organizarCanal(guild, "👕・set-roupas", 0, vip);
    await organizarCanal(guild, "👗・roupas-aurora", 0, vip);
    await organizarCanal(guild, "👔・roupas-henrique", 0, vip);

    // 🔒 VOZ
    const voz = await getOuCriaCategoria(guild, "🔒 RESENHAS");
    await organizarCanal(guild, "🔒・resenha", 2, voz);
    await organizarCanal(guild, "🔒・familia", 2, voz);
    await organizarCanal(guild, "💤・dormindo", 2, voz);

    await interaction.followUp({
      content: "✅ Tudo organizado sem duplicar!"
    });
  }
});

client.login(TOKEN);
