import Bot from "./Bot.js";
import CianParser from "./Parsers/Cian.js";
import EtagiParser from "./Parsers/Etagi.js";
import M2Parser from "./Parsers/M2.js";
import {shuffleArray} from "./utils.js";

export default class PropertyManager {
    static _instance;

    data = [];
    currendIdx = 0;
    parsers = [new EtagiParser(), new CianParser(), new M2Parser()];

    static instance() {
        if (!PropertyManager._instance) {
            PropertyManager._instance = new PropertyManager();
        }

        return PropertyManager._instance;
    }

    async getProperty(roomsCountArray) {
        this.data = [];
        this.currendIdx = 0;
        for (let p of this.parsers) {
            const parserData = await p.getData(roomsCountArray);
            this.data.push(...parserData)
        }

        shuffleArray(this.data);
    }

    async sendProperty(chatId) {
        const bot = Bot.bot;
        const prop = this.data[this.currendIdx++];

        if (!prop) {
            bot.sendMessage(chatId, "Объекты недвижимости закончились");
            return;
        }

        const images = prop.photos.slice(0, 4).map(p => ({type: "photo", media: p}));
        let caption = `
        <a href="${prop.url}">
            <b>${prop.title}</b>
        </a>
💵 ${prop.price.toLocaleString()} ₽\n
📍 ${prop.address}\n
${prop.description}`;

        caption = caption.slice(0, 1024);
        if (caption.length === 1024) {
            caption = caption.slice(0, 1020) + "...";
        }

        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: 'Показать еще', callback_data: "more"}, {
                        text: 'Показать на карте',
                        callback_data: `map${prop.id}`
                    }],
                ]
            })
        };


        images[0].caption = caption;
        images[0].parse_mode = "HTML";

        await bot.sendMediaGroup(chatId, images);
        bot.sendMessage(chatId, "Выберите действия", options);
    }

}