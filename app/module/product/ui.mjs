import { fetchProduct } from './lib.mjs';

class ProductCard extends HTMLElement {
	static get observedAttributes() {
		return ['name', 'barcode', 'default_code', 'lst_price'];
	}

    attributeChangedCallback(attrName, oldVal, newVal) {
		let sel = this.shadowRoot;
		let p = sel.querySelector('.card-' + attrName);
		if(p) {
			p.innerText = newVal;
		}
    }

	fromObject(obj) {
		for (let i = 0; i < ProductCard.observedAttributes.length; i++) {
			let key = ProductCard.observedAttributes[i];
			if(!key in obj) {
				continue;
			}
			if (obj[key] == null){ // si el campo es nulo lo ponemos vacio para que aparezca undefined
				obj[key] = "";
			}
			this.setAttribute(key, obj[key]);
		}
	}

    constructor(obj) {
        super();
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        this.container = document.createElement('div');
		this.container.classList.add('card');
        	let body = document.createElement('div');
			this.container.appendChild(body);
			body.classList.add('card-body');
				let dname = document.createElement('div');
					let name = document.createElement('p');
					dname.appendChild(name);
					name.classList.add('card-name');
				let dbar = document.createElement('div');
					let bar = document.createElement('p');
					dbar.appendChild(bar);
					bar.classList.add('card-barcode');
				let ddef = document.createElement('div');
					let def = document.createElement('p');
					ddef.appendChild(def);
					def.classList.add('card-default_code');
				let dlst = document.createElement('div');
					let lst = document.createElement('p');
					dlst.appendChild(lst);
					lst.classList.add('card-lst_price');
			body.append(dname, dbar, ddef, dlst);

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/product/style.css");

        this.shadowRoot.append(linkElem, this.container);

		if(obj) {
			this.fromObject(obj);
		}

        ProductCard.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });
    }
}

class ProductList extends HTMLElement {
	static get observedAttributes() {
		return [];
	}

    attributeChangedCallback(attrName, oldVal, newVal) {
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        this.container = document.createElement('div');

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/product/style.css");

        this.shadowRoot.append(linkElem, this.container);

        this.constructor.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });
    }

	findBarcode(bar) {
		for(const node of this.container.childNodes) {
			if(node instanceof ProductCard) {
				let barcode = node.getAttribute('barcode');
				if(bar === barcode) {
					return node;
				}
			}
		}
		return false
	}

	async addProduct(bar) {
		let product = this.findBarcode(bar);
		if(product) {
			return;
		}
		const plist = await fetchProduct(bar);
		if(plist === null) {
			console.log("Unknown barcode: " + bar);
			return;
		}
		plist.forEach((prod) => {
			let pc = new ProductCard(prod);
			this.container.appendChild(pc);
		});
	}
}

export { ProductCard, ProductList };
