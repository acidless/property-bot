import PropertyManager from "../PropertyManager.js";

export default class MoreInlineCommand {
    constructor() {
    }

    async execute(query) {
        PropertyManager.instance().sendProperty(query.message.chat.id);
    }

    match(query) {
        return query === "more";
    }
}