import fetch from "node-fetch";

class CianParser {
    constructor() {
    }

    async getData(roomsCount) {
        let queryStr = ""
        roomsCount.forEach(r => {
            queryStr += `room${r}=1&`
        })

        const res = await fetch(`https://www.cian.ru/cat.php?deal_type=sale&engine_version=2&offer_type=flat&${queryStr}`);
        const html = await res.text();

        const js = html.slice(html.indexOf("window._cianConfig['frontend-serp']"), html.indexOf("var d = w.document;") - 54);
        let window = {_cianConfig: []};
        eval(js);
        const state = window._cianConfig['frontend-serp'].find(d => d.key === "initialState");

        const data = []
        for (let offer of state.value.results.offers) {
            const offerParsed = {
                url: offer.fullUrl,
                id: offer.id,
                arrea: offer.totalArea,
                roomsCount: offer.roomsCount,
                photos: offer.photos.map(p => p.fullUrl),
                floor: offer.floorNumber,
                description: offer.description,
                address: offer.geo.address.map(a => a.fullName).join(", "),
                coordinates: offer.geo.coordinates,
                title: offer.title,
                price: offer.bargainTerms.price,
            }
            offerParsed.title = `${offerParsed.roomsCount}-комн. кв., ${offerParsed.arrea} м², ${offerParsed.floor} этаж`
            data.push(offerParsed);
        }

        return data;
    }
}

export default CianParser;