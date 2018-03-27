const GoogleMaps = require("@google/maps");
class GoogleMapClient {
	constructor() {
		this.client = GoogleMaps.createClient({
			key: "AIzaSyCUgdhFms3Fl85Lww6JIHYXzjkKk3FwyUY",
			Promise: global.Promise
		});
	}

	async geoCodeAddress(address) {
		let res = await this.client.geocode({ address: address }).asPromise();
		return res.json.results[0].geometry.location;
	}
}

module.exports = new GoogleMapClient();
