const TelegramBot = require('node-telegram-bot-api');
const token = '5275495536:AAGFWTPTJaGYf2FOnxDbqHvIWrKQm2DrSsA';
const bot = new TelegramBot(token, {polling:true});

bot.on('polling_error', function(error){
    console.log(error);
});

bot.onText(/^\/start/, function(msg){
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;
    
    bot.sendMessage(chatId, "Que haces por aqui?" + nameUser);
});

bot.onText(/^\/ping/, function(msg){
    var chatId = msg.chat.id;
   bot.sendMessage(chatId, "Pong!")
});

bot.onText(/^\/soyadmin/, function(message, match) {
	bot.getChatMember(message.chat.id, message.from.id).then(function(data) {
		if ((data.status == "creator") || (data.status == "administrator")){
			bot.sendMessage(message.chat.id, "Eres Admin que god");
		}else{
			bot.sendMessage(message.chat.id, "No eres admin pendejo");
		}
	});
});

bot.onText(/^\/mute (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    
    // Recogerá en el comando el tiempo de baneo
    var tiempo = match[1];
    
    // Nos permitirá manejar el tiempo
    var ms = require('ms')
    
    // Se encargará de manejar los privilegios que el usuario tendrá restringidos.
    const perms = {};
    perms.can_send_message = false;
    perms.can_send_media_messages = false;
    perms.can_send_other_messages = false;
    perms.can_can_add_web_page_previews = false;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, fromId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.restrictChatMember(chatId, replyId, {until_date: Math.round((Date.now() + ms(tiempo + "days")/1000))}, perms).then(function(result){
            bot.sendMessage(chatId, "El usuario " + replyName + " ha sido muteado durante " + tiempo + " días");
            }) // restrictChatMember
        } else {
            bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador");
        }
    }) // getChatMember
}) // Comando

bot.onText(/^\/unmute/, function(msg){
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var fromName = msg.from.first_name;
    var replyName = msg.reply_to_message.from.first_name;
    var replyId = msg.reply_to_message.from.id;
    const perms = {};
    
    perms.can_send_message = true;
    perms.can_send_media_messages = true;
    perms.can_send_other_messages = true;
    perms.can_can_add_web_page_previews = true;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, fromId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.restrictChatMember(chatId, replyId, perms).then(function(result){
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido desmuteado");
            }) // restrictChatMember
        }
        else {
        bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador");
        }
    }) // getChatMember
}) // Comando

bot.onText(/^\/mod/, function(msg){

    // Fijamos las variables
        var chatId = msg.chat.id;
        var userId = msg.from.id;
        var replyId = msg.reply_to_message.from.id;
        var replyName = msg.reply_to_message.from.first_name;
        var userName = msg.from.first_name;
        var messageId = msg.message_id;
    //
    
    // Fijamos las propiedades con su respectivo valor
        const prop = {};
        
        prop.can_delete_message = true;
        prop.can_change_info = false;
        prop.can_invite_users = true;
        prop.can_pin_messages = true;
        prop.can_restrict_members = true;
        prop.can_promote_members = false;
    // 
    
        if (msg.reply_to_message == undefined){
            return;
            }
    
        bot.getChatMember(chatId, userId).then(function(data){
            if ((data.status == 'creator') || (data.status == 'administrator')){
                bot.promoteChatMember(chatId, replyId, prop).then(function(result){
                    bot.deleteMessage(chatId, messageId);
                    bot.sendMessage(chatId, "Ahora " + replyName + ", es administrador.")
            })
        }
    else {
        bot.sendMessage(chatId, "Lo siento " + userName + ", no eres administrador" )
            }
        })
    });

    bot.onText(/^\/unmod/, function(msg) {

        var chatId = msg.chat.id;
        var replyName = msg.reply_to_message.from.first_name;
        var replyId = msg.reply_to_message.from.id;
        var userId = msg.from.id;
        var fromName = msg.from.first_name;
        var messageId = msg.message_id;
    
    // Cambiamos a false todos los valores de las propiedades
        const prop = {};
        
        prop.can_change_info = false;
        prop.can_delete_message = false;
        prop.can_invite_users = false;
        prop.can_pin_messages = false;
        prop.can_restrict_members = false;
        prop.can_promote_members = false;
    // 
    
        if (msg.reply_to_message == undefined) {
            return;
        }
    
        bot.getChatMember(chatId, userId).then(function(data) {
            if ((data.status == 'creator') || (data.status == 'administrator')) {
                bot.promoteChatMember(chatId, replyId, prop).then(function(result) {
                    bot.deleteMessage(chatId, messageId)
                    bot.sendMessage(chatId, "Ahora " + replyName + ", ya no es administrador.")
                })
            } 
            else {
                bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador.")
            }
        })
    });

    bot.on('message', function(msg){
    
        var chatId = msg.chat.id;
        var chatitle = msg.chat.title;
        
        if (msg.new_chat_members != undefined){
        
            var nameNewMember = msg.new_chat_member.first_name;
        
            bot.sendMessage(chatId, "Hola " + nameNewMember + ", bienvenido al grupo " + chatitle);
        }
        else if (msg.left_chat_member != undefined){
        
            var nameLeftMember = msg.left_chat_member.first_name;
            
            bot.sendMessage(chatId, nameLeftMember + " abandonó el grupo")
        }
    });
