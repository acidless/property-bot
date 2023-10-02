import MapInlineCommand from "./InlineKeyboardCommands/MapInlineCommand.js";
import MoreInlineCommand from "./InlineKeyboardCommands/MoreInlineCommand.js";
import Bot from "./Bot.js";
import StartCommand from "./Commands/StartCommand.js";
import ShowPropertyCommand from "./Commands/ShowPropertyCommand.js";

const botWrapper = new Bot();

const inlineKeyboardCommands = [new MapInlineCommand(), new MoreInlineCommand()];
Bot.bot.on("callback_query", async (query) => {
    for (let command of inlineKeyboardCommands) {
        if (command.match(query.data)) {
            command.execute(query);
        }
    }
})

const commands = [new StartCommand(), new ShowPropertyCommand()]
Bot.bot.on('message', async (msg) => {
    for (let command of commands) {
        if (command.match(msg)) {
            command.execute(msg);
        }
    }
});