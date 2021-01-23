const Discord = require("discord.js");
const db = require("quick.db");
const moment = require('moment')
require("moment-duration-format")
exports.run = async (client, message, args) => {
  const us = message.mentions.users.first() || client.users.get(args[0]) || message.author

  const puan = await db.get("puan_" + message.guild.id + "_" + us.id);

  let sayi22 = 1;
  let top3c = message.guild.channels
    .array()
    .sort((a, b) => {
      return (
        (db.get(`puanuc_${us.id}_${b.id}`) || 0) -
        (db.get(`puanuc_${us.id}_${a.id}`) || 0)
      );
    })
    .map(x => {
      return `\n${sayi22++}.  <#${x.id}>:  \`${db.get(
        `puanuc_${us.id}_${x.id}`
      ) || 0}\``;
    })
    .slice(0, 3);
    
   let sayi4 = 1
  let top4c = message.guild.channels
    .array()
    .sort((a, b) => {
      return (
        (db.get(`voiceuc_${us.id}_${b.id}`) || 0) -
        (db.get(`voiceuc_${us.id}_${a.id}`) || 0)
      );
    })
    .map(x => {
      return `\n\`${sayi4++}.\` <#${x.id}>:  \`${moment.duration(db.get('voiceuc_'+us.id+'_'+x.id)).format("D [Gün] H [Saat] m [Dakika] s [Saniye]")}\``;
    })
    .slice(0, 3);
    
    const sess = await db.get('voicei_'+message.guild.id+'_'+us.id)
    const ses = moment.duration(sess).format("D [gün] H [saat] m [dakika]");
  const embed = new Discord.RichEmbed()
    .setTitle(`${us.username} İSTATİSTİKLERİ`)
    .setTimestamp()
    .setThumbnail(us.avatarURL || message.author.avatarURL)
    .setFooter(client.user.username)
    .setDescription(
      `**Mesaj İstatistikleri:** \`${puan}\`\n**En Çok Mesaj Attığı 3 Kanal**${top3c}\n\n**Seste Kalma Süresi:** \`${ses}\`\n**En Çok Seste Durduğu 3 Kanal**${top4c}`)
    .setColor("GREEN");
  message.channel.send(embed)
 //Discord Code Shâre
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "mesaj",
  description: "İstediğiniz kişinin istatistiklerini verir",
  usage: "mesaj & mesaj <@kişi-etiket>"
};
