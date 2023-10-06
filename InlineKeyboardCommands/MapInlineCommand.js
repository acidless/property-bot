import PropertyManager from "../PropertyManager.js";
import Bot from "../Bot.js";

export default class MapInlineCommand {
    constructor() {
    }

    async execute(query) {
        const id = query.data.slice(3);
        const prop = PropertyManager.instance().data.find(p => p.id == id);
        Bot.bot.sendLocation(query.message.chat.id, prop.coordinates.lat, prop.coordinates.lng);
    }

    match(query) {
        return query.startsWith("map");
    }
}