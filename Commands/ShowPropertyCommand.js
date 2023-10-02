import PropertyManager from "../PropertyManager.js";

export default class ShowPropertyCommand {
    constructor() {
    }

    async execute(msg) {
        const match = msg.text.match(/^(\d)\sкомнат/);
        if (match) {
            const roomsCount = +match[1];
            await PropertyManager.instance().getProperty(roomsCount);
            PropertyManager.instance().sendProperty(msg.chat.id);
        }
    }

    match(msg) {
        return msg.text.match(/^(\d)\sкомнат/);
    }
}