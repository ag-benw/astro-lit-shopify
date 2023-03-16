import { html, TemplateResult } from "lit";
import { customElement, property } from 'lit/decorators.js';
import ThemeProvider from "../global/ThemeProvider";

import { addCartItem } from "../../utils/cart";
import { publish } from "pubsub-js";

@customElement('cart-button')
export class AddToCart extends ThemeProvider {

    @property({ reflect: true, attribute: true })
    product: string | null = this.getAttribute('product')

    async addToCart() {
        if (typeof this.product == "string") {
            const item = {
                id: this.product,
                quantity: 1,
            }
            await addCartItem(item);
        }
    }

    render(): TemplateResult {
        return html`
            <button @click="${this.addToCart}" type="button"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Add
                to Cart</button>
            `
    }
}