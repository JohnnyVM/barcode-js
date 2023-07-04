import { config }  from '../../config.js';

async function fetchProduct(bar) {
	try {
		const response = await fetch(new URL('/product/' + bar, config['url']));
		if (response.status === 404) {
			return null;
		}
		if (!response.ok) {
			throw new Error("Network response was not OK");
		}
		const jsonData = await response.json();
		if(!jsonData.length) {
			return null;
		}
		return jsonData;
	} catch (error) {
		console.error("There has been a problem with your fetch operation: ", error);
	}
}

export { fetchProduct };
