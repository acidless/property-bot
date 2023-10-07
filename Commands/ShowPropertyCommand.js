import PropertyManager from "../PropertyManager.js";
import Bot from "../Bot.js";

export default class ShowPropertyCommand {
    constructor() {
        this.isActive = false;
    }

    async execute(msg) {
        const match = msg.text.match(/^(\d)\sкомнат/);
        let roomsCount = []
        if (match) {
            roomsCount = [+match[1]];
        } else {
            if (this.isActive) {
                this.isActive = false;
                roomsCount = msg.text.split(",").map(s => this.parseRoomsCount(s)).flat(2).filter(s => s >= 1 && s <= 6);
            } else {
                this.isActive = true;
                Bot.bot.sendMessage(msg.chat.id, "Введите кол-во комнат через запятую, так же можно использовать диапазон. Например, 1-4");
                return;
            }
        }

        Bot.bot.sendMessage(msg.chat.id, "Получаю данные о недвижимости...");
        await PropertyManager.instance().getProperty(roomsCount, (prop) => {
            PropertyManager.instance().sendProperty(msg.chat.id, prop);
        });
    }

    match(msg) {
        return msg.text.match(/^.+комнат/) || this.isActive;
    }

    parseRoomsCount(str) {
        const dashIdx = str.indexOf("-");
        if (dashIdx !== -1) {
            const start = parseInt(str.slice(0, dashIdx));
            const end = parseInt(str.slice(dashIdx + 1));

            const array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }

            return [array];
        }

        return [+parseInt(str)];
    }
}