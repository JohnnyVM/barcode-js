function searchToObject() {
    var pairs = window.location.search.substring(1).split("&"),
      obj = {},
      pair,
      i;

    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;

      pair = pairs[i].split("=");
      obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
    }

    return obj;
}

class Settings {
	#debug = false

    get debug() {
        return this.#debug;
    }

    constructor() {
        let query = searchToObject();
        if (typeof query.debug === 'undefined') {
            this.#debug = false;
        } else {
            this.#debug = (query.debug.toLowerCase() === 'true' || query.debug === '1');
        }
    }
}


async function identifyDevice(stream) {
	const track = stream.getVideoTracks()[0];
	const cameraSettings = track.getSettings();
	const searchParams = new URLSearchParams(cameraSettings);
	const url = new URL('camera?' + searchParams.toString(), window.location.href);
	fetch(url, { method: 'HEAD' })
}

export { Settings, identifyDevice };
