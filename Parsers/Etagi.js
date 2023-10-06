import fetch from "node-fetch";

class EtagiParser {
    constructor() {
    }

    async getData(roomsCount) {
        let queryStr = ""
        roomsCount.forEach(r => {
            queryStr += `rooms[]=${r}&`
        })

        const res = await fetch(`https://etagi.com/realty/?type[]=flat&${queryStr}`);
        const html = await res.text();

        let js = html.slice(html.indexOf("var data="), html.indexOf('etagi.com"}}}') + 13);
        js = js.replace("var data=", "window._data=");
        let window = {};
        eval(js);

        const dataArr = []
        for (let offer of window._data.lists.flats) {
            const offerParsed = {
                url: `https://etagi.com/realty/${offer.id}`,
                id: offer.id,
                area: offer.square,
                roomsCount: offer.rooms,
                photos: [`https://cdn.esoft.digital/320240/${offer.main_photo}`],
                floor: offer.floor,
                description: offer.description || "",
                address: `${offer.meta.city}, ${offer.meta.street}, д. ${offer.house_address_number}`,
                coordinates: {lat: offer.la, lng: offer.lo},
                title: offer.title,
                price: +offer.price,
            }
            offerParsed.title = `${offerParsed.roomsCount}-комн. кв., ${offerParsed.area} м², ${offerParsed.floor} этаж`
            dataArr.push(offerParsed);
        }

        return dataArr;
    }
}

export default EtagiParser;