import {config} from '../config.js';

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
    get debug() {
        return this.debug_cache;
    }

    constructor() {
        let query = searchToObject();
        if (typeof query.debug === 'undefined') {
            this.debug_cache = false;
        } else {
            this.debug_cache = (query.debug.toLowerCase() === 'true' || query.debug === '1');
        }
    }
}


async function identifyDevice(stream) {
	const track = stream.getVideoTracks()[0];
	const cameraSettings = track.getSettings();
	let data = {
		cameraWidth: cameraSettings.width,
		cameraHeight: cameraSettings.height,
	};
	const searchParams = new URLSearchParams(data);
	const url = new URL(config['url'] + '?' + searchParams.toString());
	fetch(url, { method: 'HEAD' })
}

export { Settings, identifyDevice };
