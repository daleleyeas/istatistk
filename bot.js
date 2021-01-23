const Discord = require("discord.js"); //Discord Code Share

const client = new Discord.Client(); //Discord Code Share

const ayarlar = require("./ayarlar.json"); //Discord Code Share

const chalk = require("chalk"); //Discord Code Share

const moment = require("moment"); //D//Discord Code Share

var Jimp = require("jimp"); //Discord Code Share

const { Client, Util } = require("discord.js"); //Discord Code Share

const weather = require("weather-js"); //Discord Code Share

const fs = require("fs"); //Discord Code Share

const db = require("quick.db"); //Discord Code Share

const http = require("http"); //Discord Code Share

const express = require("express"); //Discord Code Share

require("./util/eventLoader")(client); //Discord Code Share

const path = require("path"); //Discord Code Share

const request = require("request"); //Discord Code Share

const snekfetch = require("snekfetch"); //Discord Code Share

const queue = new Map(); //Discord Code Share

const YouTube = require("simple-youtube-api"); //Discord Code Share

const ytdl = require("ytdl-core"); //Discord Code Share

//Discord Code Share

const app = express(); //Discord Code Share

app.get("/", (request, response) => {
  //Discord Code Share

  console.log(Date.now() + " Ping tamamdır."); //Discord Code Share

  response.sendStatus(200); //Discord Code Share
});
app.listen(process.env.PORT); //Discord Code Share

setInterval(() => {
  //Discord Code Share

  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); //Discord Code Share
}, 280000); //Discord Code Share

//Discord Code Share

var prefix = ayarlar.prefix; //Discord Code Share

const log = message => {
  //Discord Code Share

  console.log(`${message}`); //Discord Code Share
};
//Discord Code Share

client.commands = new Discord.Collection(); //Discord Code Share

client.aliases = new Discord.Collection(); //Discord Code Share

fs.readdir("./komutlar/", (err, files) => {
  //Discord Code Share

  if (err) console.error(err); //Discord Code Share

  log(`${files.length} komut yüklenecek.`); //Discord Code Share

  files.forEach(f => {
    //Discord Code Share

    let props = require(`./komutlar/${f}`); //Discord Code Share

    log(`Yüklenen komut: ${props.help.name}.`); //Discord Code Share

    client.commands.set(props.help.name, props); //Discord Code Share

    props.conf.aliases.forEach(alias => {
      //Discord Code Share

      client.aliases.set(alias, props.help.name); //Discord Code Share
    }); //Discord Code Share
  });
}); //Discord Code Share

client.reload = command => {
  //Discord Code Share

  return new Promise((resolve, reject) => {
    //Discord Code Share

    try {
      //Discord Code Share

      delete require.cache[require.resolve(`./komutlar/${command}`)]; //Discord Code Share

      let cmd = require(`./komutlar/${command}`); //Discord Code Share

      client.commands.delete(command); //Discord Code Share

      client.aliases.forEach((cmd, alias) => {
        //Discord Code Share

        if (cmd === command) client.aliases.delete(alias); //Discord Code Share
      });
      client.commands.set(command, cmd); //Discord Code Share

      cmd.conf.aliases.forEach(alias => {
        //Discord Code Share

        client.aliases.set(alias, cmd.help.name); //Discord Code Share
      }); //Discord Code Share

      resolve(); //Discord Code Share
    } catch (e) {
      //Discord Code Share

      reject(e); //Discord Code Share
    } //Discord Code Share
  }); //Discord Code Share
}; //Discord Code Share

client.load = command => {
  //Discord Code Share

  return new Promise((resolve, reject) => {
    //Discord Code Share

    try {
      //Discord Code Share

      let cmd = require(`./komutlar/${command}`); //Discord Code Share

      client.commands.set(command, cmd); //Discord Code Share

      cmd.conf.aliases.forEach(alias => {
        //Discord Code Share

        client.aliases.set(alias, cmd.help.name); //Discord Code Share
      }); //Discord Code Share

      resolve(); //Discord Code Share
    } catch (e) {
      //Discord Code Share

      reject(e); //Discord Code Share
    }
  }); //Discord Code Share
};

client.unload = command => {
  //Discord Code Share

  return new Promise((resolve, reject) => {
    //Discord Code Share

    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)]; //Discord Code Share

      let cmd = require(`./komutlar/${command}`); //Discord Code Share

      client.commands.delete(command); //Discord Code Share

      client.aliases.forEach((cmd, alias) => {
        //Discord Code Share

        if (cmd === command) client.aliases.delete(alias); //Discord Code Share
      }); //Discord Code Share

      resolve(); //Discord Code Share
    } catch (e) {
      //Discord Code Share

      reject(e); //Discord Code Share
    } //Discord Code Share
  }); //Discord Code Share
};
//Discord Code Share

client.elevation = message => {
  //Discord Code Share

  if (!message.guild) {
    //Discord Code Share

    return; //Discord Code Share
  } //Discord Code Share

  let permlvl = 0; //Discord Code Share

  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2; //Discord Code Share

  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3; //Discord Code Share

  if (message.author.id === ayarlar.sahip) permlvl = 4; //Discord Code Share

  return permlvl; //Discord Code Share
};
//Discord Code Share

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g; //Discord Code Share

client.on("warn", e => {
  //Discord Code Share

  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted"))); //Discord Code Share
}); //Discord Code Share

//Discord Code Share

client.on("error", e => {
  //Discord Code Share

  console.log(chalk.bgRed(e.replace(regToken, "that was redacted"))); //Discord Code Share
}); //Discord Code Share

//Discord Code Share

client.login(ayarlar.token); //Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//........MESAJ ISTATISTIK........//

client.on("message", async message => {
  if (message.author.bot === false) {
    await db.add(`puan_${message.guild.id}_${message.author.id}`, 1); //MESAJ BAŞINA VERİLECEK PUAN ÜYE  //Discord Code Share

    await db.add(`puanc_${message.guild.id}_${message.channel.id}`, 1); //MESAJ BAŞINA VERİLECEK PUAN KANAL   //Discord Code Share

    await db.add(`puanuc_${message.author.id}_${message.channel.id}`, 1); //EN COK MESAJ ATILAN KANAL UYE  //Discord Code Share
  }
});

//........SES ISTATISTIK........//

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  if (!oldMember.user.bot) {
    let oldChannel = oldMember.voiceChannel; //Discord Code Share

    let newChannel = newMember.voiceChannel; //Discord Code Share

    if (oldChannel === undefined && newChannel !== undefined) {
      db.set(`girisses.${oldMember.user.id}.${oldMember.guild.id}`, Date.now());
    } else if (newChannel === undefined) {
      let ilksessüre = await db.fetch(
        `girisses.${oldMember.user.id}.${oldMember.guild.id}`
      ); //Discord Code Share

      let time = Date.now() - ilksessüre;
      await db.add(
        "voicei_" + oldMember.guild.id + "_" + oldMember.user.id,
        time
      ); //Discord Code Share

      await db.add(
        "voicec_" + oldMember.guild.id + "_" + oldMember.voiceChannelID,
        time
      ); //Discord Code Share

      await db.add(
        "voiceuc_" + oldMember.user.id + "_" + oldMember.voiceChannelID,

        time //Discord Code Share
      ); //Discord Code Share
    }
  } //Discord Code Share
}); //Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share

//Discord Code Share
