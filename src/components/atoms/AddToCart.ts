import { html, TemplateResult } from "lit";
import { customElement } from 'lit/decorators.js';
import ThemeProvider from "../global/ThemeProvider";

import { addCartItem } from "../../utils/cart";

@customElement('cart-button')
export class AddToCart extends ThemeProvider {

    addToCart(): void {
        if (this.id) {
            const item = {
                id: this.id,
                quantity: 1,
            }
            addCartItem(item);
        }
    }

    render(): TemplateResult {
        return html`
            <button @click=${this.addToCart}
            type="submit"
            class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Add to Cart</button>
            `
    }
}