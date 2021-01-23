const Discord = require("discord.js");
const db = require("quick.db");
const moment = require('moment')
require("moment-duration-format")
let ms = require("parse-ms");
exports.run = async (client, message, args) => {
//Discord Code Shâre
//////////////////////////////////////////////////

  let sayi = 1
  let mesaj_kişi = message.guild.members
    .filter(mem => !mem.user.bot)
    .array()
    .sort((a, b) => {
      return (
        (db.get(`puan_${message.guild.id}_${b.user.id}`) || 0) -
        (db.get(`puan_${message.guild.id}_${a.user.id}`) || 0)
      );
    })
    .slice(0, 5)
    .map(member => {
      return `\n\`${sayi++}.\`  <@${member.user.id}>:  \`${db.get(
        `puan_${message.guild.id}_${member.user.id}`
      )}\``;
    });
    
    //////////////////////////////////////////////////
   let sayi2 = 1
  let ses_kişi = message.guild.members
    .filter(mem => !mem.user.bot)
    .array()
    .sort((a, b) => {
      return (
        (db.get(`voicei_${message.guild.id}_${b.user.id}`) || 0) -
        (db.get(`voicei_${message.guild.id}_${a.user.id}`) || 0)
      );
    })
    .slice(0, 3)
    .map(member => {
      return `\n\`${sayi2++}.\`  <@${member.user.id}>:  \`${moment.duration(db.get('voicei_'+message.guild.id+'_'+member.user.id)).format("D [Gün] H [Saat] m [Dakika] s [Saniye]")}\``;
    });
    
//////////////////////////////////////////////////
  let sayi3 = 1
  let mesaj_kanal = message.guild.channels
    .array()
    .sort((a, b) => {
      return (
        (db.get(`puanc_${message.guild.id}_${b.id}`) || 0) -
        (db.get(`puanc_${message.guild.id}_${a.id}`) || 0)
      );
    })
    .map(x => {
      return `\n\`${sayi3++}.\`  <#${x.id}>:  \`${db.get(
        `puanc_${message.guild.id}_${x.id}`
      )}\``;
    })
    .slice(0, 5);
    
//////////////////////////////////////////////////
let sayi4 = 1
  let ses_kanal = message.guild.channels
    .array()
    .sort((a, b) => {
      return (
        (db.get(`voicec_${message.guild.id}_${b.id}`) || 0) -
        (db.get(`voicec_${message.guild.id}_${a.id}`) || 0)
      );
    })
    .map(x => {
      return `\n\`${sayi4++}.\` <#${x.id}>:  \`${moment.duration(db.get('voicec_'+message.guild.id+'_'+x.id)).format("D [Gün] H [Saat] m [Dakika] s [Saniye]")}\``;
    })
    .slice(0, 3);
    
//////////////////////////////////////////////////
const içerik = `**__Message | Top 5 - Channels__\n\n${mesaj_kanal}\n\n__Message | Top 5 - Members__\n\n${mesaj_kişi}\n\n\n__Voice | Top 3 - Channels__\n\n${ses_kanal}\n\n__Voice | Top 3 - Members__\n\n${ses_kişi}\n\n__Sunucudaki Toplam Üye:__ \`${message.guild.memberCount}\`**`

  message.channel.send(
    new Discord.RichEmbed()
      .setDescription(içerik)
      .setTitle(message.guild.name+' İstatistik')
      .setThumbnail(message.guild.iconURL)
      .setColor("BLUE")
    .setFooter('Discord Code Shâre Aittir!')
      .setTimestamp()
  );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["top"],
  permLevel: 0
};
exports.help = {
  name: "tops"
  //Discord Code Shâre
};
