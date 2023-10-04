import Bot from "../Bot.js";

export default class StartCommand {
    constructor() {
    }

    async execute(msg) {
        const options = {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{text: '1 комната'}, {text: '2 комнаты'}, {text: '3 комнаты'}, {text: 'Другое кол-во комнат'}],
                ]
            })
        };

        Bot.bot.sendMessage(msg.chat.id, "Выберите количество комнат", options);
    }

    match(msg) {
        return msg.text === "/start";
    }
}