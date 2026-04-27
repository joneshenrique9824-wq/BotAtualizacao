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

// 🔥 CONFIG COMPLETA
const estrutura = {
  "🏠 BASE DA RESENHA": [
    "📜・boas-vindas",
    "📌・regras",
    "📢・avisos"
  ],
  "💬 COMUNIDADE": [
    "💭・chat-geral",
    "😂・zoeira",
    "📸・midia",
    "💡・sugestões",
    "📢・divulgacao"
  ],
  "💎 ÁREA VIP": [
    "💎・familia-souza",
    "💎・familia",
    "👕・set-roupas",
    "👗・roupas-aurora",
    "👔・roupas-henrique"
  ],
  "🔒 RESENHAS": [
    "🔒・resenha-secreta",
    "🔒・resenha-familia",
    "🔒・familia-naty",
    "🔒・resenha",
    "💤・dormindo"
  ],
  "🔊 VOZ": [
    "🔊・geral-1",
    "🔊・geral-2",
    "🔇・sem-microfone"
  ],
  "🤖 BOTS": [
    "🤖・comandos",
    "🤖・jogos"
  ],
  "⚙️ ADMIN": [
    "🚫・denuncias",
    "📝・logs",
    "⚙️・staff"
  ]
};

// 🔍 achar parecido
function acharParecido(guild, nome) {
  return guild.channels.cache.find(c =>
    c.name.toLowerCase().includes(nome.split("・")[1]?.toLowerCase())
  );
}

// 🔥 criar ou pegar categoria
async function getCategoria(guild, nome) {
  let cat = guild.channels.cache.find(
    c => c.name === nome && c.type === ChannelType.GuildCategory
  );

  if (!cat) {
    cat = await guild.channels.create({
      name: nome,
      type: ChannelType.GuildCategory
    });
  }

  return cat;
}

// 🔥 organizar canal
async function organizar(guild, nome, categoria, pos, tipo) {
  let canal = guild.channels.cache.find(c => c.name === nome);

  if (!canal) canal = acharParecido(guild, nome);

  if (!canal) {
    canal = await guild.channels.create({
      name: nome,
      type: tipo,
      parent: categoria.id
    });
  }

  if (canal.name !== nome) await canal.setName(nome);
  if (canal.parentId !== categoria.id) await canal.setParent(categoria.id);

  await canal.setPosition(pos);
}

// 📌 comando
const commands = [
  new SlashCommandBuilder()
    .setName("setup-servidor")
    .setDescription("Organização completa automática")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
})();

client.once("clientReady", () => {
  console.log("🔥 BOT COMPLETO ONLINE");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setup-servidor") {
    await interaction.reply({
      content: "⚙️ Organizando TUDO...",
      ephemeral: true
    });

    const guild = interaction.guild;
    let posGlobal = 0;

    for (const [catNome, canais] of Object.entries(estrutura)) {
      const categoria = await getCategoria(guild, catNome);
      await categoria.setPosition(posGlobal++);

      let pos = 0;

      for (const nome of canais) {
        const tipo = nome.includes("🔊") || nome.includes("🔒") || nome.includes("🔇")
          ? 2
          : 0;

        await organizar(guild, nome, categoria, pos++, tipo);
      }
    }

    await interaction.followUp({
      content: "✅ SERVIDOR 100% ORGANIZADO!"
    });
  }
});

client.login(TOKEN);
