require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");
const client = new Client({partials: ['MESSAGE', 'REACTION']});
const webhookClient = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has Logged In!`);
});

client.on("message", async (message) => {
  if (!message.author.bot) {
    /*console.log(`[${message.author.tag}]:${message.content}`);
    if (message.content === "hello") {
      //message.reply("Hello There!");
      message.channel.send("hello");
    }*/
    if (message.content.startsWith(PREFIX)) {
      const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

      if (CMD_NAME === "kick") {
        if (!message.member.hasPermission("KICK_MEMBERS"))
          return message.reply(
            "You do not have permissions to use that command!"
          );
        if (args.length === 0) return message.reply("Please provide an ID!");
        const member = message.guild.members.cache.get(args[0]);
        if (member) {
          member
            .kick()
            .then(() => message.channel.send(`${member} was kicked!`))
            .catch((err) =>
              message.channel.send(
                "I do not have permissions to kick that user :("
              )
            );
        } else {
          message.channel.send("That user was not found!");
        }
      }

      else if (CMD_NAME === "ban") {
        if (!message.member.hasPermission("BAN_MEMBERS"))
          return message.reply(
            "You do not have permission to use this command!"
          );
        if (args.length === 0) return message.reply("Please provide an ID.");

        try {
          const user = await message.guild.members.ban(args[0]);
          message.channel.send("User was banned!");
        } catch (e) {
          console.log(e);
          message.channel.send("An error occurred. Either I do not have permissions or the user was not found!");
        }
      }

      else if (CMD_NAME === "announce") {
        const msg = args.join(' ');
        webhookClient.send(msg);
      }

      else if (CMD_NAME === "ping") {
        const msg = await message.channel.send(`Pinging....`);
        msg.edit(`Pong!
        Latency is ${Math.floor(
          msg.createdTimestamp - message.createdTimestamp
        )}ms
        API Latency is ${Math.round(client.ws.ping)}ms`);
      }

      else if (CMD_NAME === "purge") {
        if (message.deletable) {
          message.delete();
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          return message
            .reply("You can't delete messages....")
            .then((m) => m.delete(5000));
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
          return message
            .reply(
              "Yeah.... That's not a number? I also can't delete 0 messages by the way."
            )
            .then((m) => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
          return message
            .reply("Sorryy... I can't delete messages.")
            .then((m) => m.delete(5000));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
          deleteAmount = 100;
        } else {
          deleteAmount = parseInt(args[0]);
        }

        message.channel
          .bulkDelete(deleteAmount, true)
          .then((deleted) =>
            message.channel.send(`I deleted \`${deleted.size}\` messages.`)
          )
          .catch((err) => message.reply(`Something went wrong... ${err}`));
      }
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const {name} = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === "808402005285404753") {
    switch (name) {
      case '🍌':
        member.roles.add('808392964144496650');
        break;
      case '🍎':
        member.roles.add('808393318617841675');
        break;
      case '🍇':
        member.roles.add('808393350381436938')
        break;
      case '☕':
        member.roles.add('808393567516491777')
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const {name} = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === "808402005285404753") {
    switch (name) {
      case '🍌':
        member.roles.remove('808392964144496650');
        break;
      case '🍎':
        member.roles.remove('808393318617841675');
        break;
      case '🍇':
        member.roles.remove('808393350381436938')
        break;
      case '☕':
        member.roles.remove('808393567516491777')
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
