import TelegramBot from "node-telegram-bot-api";

export default class Bot {
    static bot;

    constructor() {
        Bot.bot = new TelegramBot("6601343641:AAFYjTpJENeIMb02dUGXo2nz4x4l_W30K0M", {polling: true});
    }
}