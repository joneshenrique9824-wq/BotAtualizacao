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
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔥 pegar categoria (NÃO cria)
function pegarCategoria(guild, nome) {
  return guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );
}

// 🔥 organizar canal (SEM criar)
async function moverSeExistir(guild, nome, categoria) {
  const canal = guild.channels.cache.find(c => c.name === nome);
  if (!canal) return; // não cria

  if (canal.parentId !== categoria.id) {
    await canal.setParent(categoria.id);
  }
}

// 📌 comando
const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organiza canais existentes sem criar nada")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// 🔥 registrar instantâneo
(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
})();

// ✅ pronto
client.once("clientReady", () => {
  console.log("✅ Bot online");
});

// 🎮 comando
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({
      content: "⚙️ Ajustando organização...",
      ephemeral: true
    });

    const guild = interaction.guild;

    // 💎 VIP
    const vip = pegarCategoria(guild, "💎 ÁREA VIP");
    if (vip) {
      await moverSeExistir(guild, "💎・familia-souza", vip);
      await moverSeExistir(guild, "💎・familia", vip);
      await moverSeExistir(guild, "👕・set-roupas", vip);
      await moverSeExistir(guild, "👗・roupas-aurora", vip);
      await moverSeExistir(guild, "👔・roupas-henrique", vip);
    }

    // 🔒 VOZ
    const voz = pegarCategoria(guild, "🔒 RESENHAS");
    if (voz) {
      await moverSeExistir(guild, "🔒・resenha-secreta", voz);
      await moverSeExistir(guild, "🔒・resenha-familia", voz);
      await moverSeExistir(guild, "🔒・familia-naty", voz);
      await moverSeExistir(guild, "🔒・resenha", voz);
      await moverSeExistir(guild, "💤・dormindo", voz);
    }

    await interaction.followUp({
      content: "✅ Organização corrigida sem criar nada!"
    });
  }
});

client.login(TOKEN);
