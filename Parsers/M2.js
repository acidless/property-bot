import fetch from "node-fetch";
import {parse} from "node-html-parser";

class M2Parser {
    constructor() {
    }

    async getData(roomsCount) {
        let queryStr = ""
        roomsCount.forEach(r => {
            if (r >= 5) {
                queryStr += "rooms=5-komnat_i_bolee"
            } else {
                queryStr += `rooms=${r}-komnat${r === 1 ? "a" : "y"}`
            }
        });

        const res = await fetch(`https://m2.ru/nedvizhimost/kupit-kvartiru/?${queryStr}`);
        const html = await res.text();
        const doc = parse(html);
        const totalData = JSON.parse(doc.getElementById('vtbeco-search-initial-state').textContent);
        let dataNeeded;
        Object.keys(totalData).forEach(k => {
            if (totalData[k].data && totalData[k].data.searchOffers) {
                dataNeeded = totalData[k].data;
            }
        })

        const dataArr = []
        for (let offer of dataNeeded.searchOffers.items) {
            const offerParsed = {
                url: `https://m2.ru/nedvizhimost/${offer.text.slug}-${offer.id}/`,
                id: offer.id,
                area: Math.round(offer.realtyObject.totalArea.value * 10) / 10,
                roomsCount: offer.realtyObject.roomsCount,
                photos: offer.gallery.images.map(i => i.medium.slice(2)),
                floor: offer.realtyObject.floor,
                description: offer.description || "",
                address: offer.location.formattedAddressLong,
                coordinates: {lat: offer.location.coordinates.latitude, lng: offer.location.coordinates.longitude},
                title: offer.title,
                price: offer.dealType.price.value / 100,
            }
            offerParsed.title = `${offerParsed.roomsCount}-комн. кв., ${offerParsed.area} м², ${offerParsed.floor} этаж`

            dataArr.push(offerParsed);
        }

        return dataArr;
    }
}

export default M2Parser;