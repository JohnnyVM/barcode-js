import { config }  from '../../config.js';

async function fetchProduct(bar) {
	const response = await fetch(new URL('/product/' + bar, config['url']));
	const jsonData = await response.json();
	if(!jsonData.length) {
		return null;
	}
	return jsonData;
}

export { fetchProduct };
