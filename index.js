import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;

const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organizar servidor automaticamente")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );
})();

client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({ content: "⚙️ Organizando servidor...", ephemeral: true });

    const guild = interaction.guild;

    // 🏠 BASE
    const base = await guild.channels.create({
      name: "🏠 BASE DA RESENHA",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({
      name: "📜・boas-vindas",
      type: ChannelType.GuildText,
      parent: base.id
    });

    await guild.channels.create({
      name: "📌・regras",
      type: ChannelType.GuildText,
      parent: base.id
    });

    await guild.channels.create({
      name: "📢・avisos",
      type: ChannelType.GuildText,
      parent: base.id
    });

    // 💬 COMUNIDADE
    const comunidade = await guild.channels.create({
      name: "💬 COMUNIDADE",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "💭・chat-geral", type: 0, parent: comunidade.id });
    await guild.channels.create({ name: "😂・zoeira", type: 0, parent: comunidade.id });
    await guild.channels.create({ name: "📸・midia", type: 0, parent: comunidade.id });
    await guild.channels.create({ name: "💡・sugestões", type: 0, parent: comunidade.id });

    // 📢 DIVULGAÇÃO (MANTIDO)
    await guild.channels.create({
      name: "📢・divulgacao",
      type: ChannelType.GuildText,
      parent: comunidade.id
    });

    // 💎 VIP / FAMÍLIA
    const vip = await guild.channels.create({
      name: "💎 ÁREA VIP",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "💎・familia-souza", type: 0, parent: vip.id });
    await guild.channels.create({ name: "💎・familia", type: 0, parent: vip.id });
    await guild.channels.create({ name: "👕・set-roupas", type: 0, parent: vip.id });
    await guild.channels.create({ name: "👗・roupas-aurora", type: 0, parent: vip.id });
    await guild.channels.create({ name: "👔・roupas-henrique", type: 0, parent: vip.id });

    // 🔒 VOZ
    const vozPrivada = await guild.channels.create({
      name: "🔒 RESENHAS",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "🔒・resenha-secreta", type: 2, parent: vozPrivada.id });
    await guild.channels.create({ name: "🔒・resenha-familia", type: 2, parent: vozPrivada.id });
    await guild.channels.create({ name: "🔒・familia-naty", type: 2, parent: vozPrivada.id });
    await guild.channels.create({ name: "🔒・resenha", type: 2, parent: vozPrivada.id });
    await guild.channels.create({ name: "💤・dormindo", type: 2, parent: vozPrivada.id });

    // 🤖 BOTS
    const bots = await guild.channels.create({
      name: "🤖 BOTS",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "🤖・comandos-loritta", type: 0, parent: bots.id });
    await guild.channels.create({ name: "🤖・gartic-bot", type: 0, parent: bots.id });

    // 🔊 VOZ GERAL
    const voz = await guild.channels.create({
      name: "🔊 CONVERSA DE VOZ",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "🔇・sem-microfone", type: 2, parent: voz.id });
    await guild.channels.create({ name: "🔊・geral-1", type: 2, parent: voz.id });
    await guild.channels.create({ name: "🔊・geral-2", type: 2, parent: voz.id });

    // ⚙️ ADMIN
    const admin = await guild.channels.create({
      name: "⚙️ ADMINISTRAÇÃO",
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({ name: "🚫・denuncias", type: 0, parent: admin.id });
    await guild.channels.create({ name: "📝・logs", type: 0, parent: admin.id });
    await guild.channels.create({ name: "⚙️・staff", type: 0, parent: admin.id });

    interaction.followUp({ content: "✅ Servidor organizado com sucesso!" });
  }
});

client.login(TOKEN);
