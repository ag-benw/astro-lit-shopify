import { z } from "zod";
import { html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ProductResult } from "../../utils/schemas";
import ThemeProvider from "../global/ThemeProvider";

@customElement('products-section')
export class Products extends ThemeProvider {

    @property({ type: Array, attribute: true })
    product = []

    render() {
        return html`
        <section>
            <div class="bg-white">
                <div
                class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"
                >
                <div class="md:flex md:items-center md:justify-between">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">
                    Trending products
                    </h2>
                    <a
                    href="#"
                    class="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
                    >
                    Shop the collection
                    <span aria-hidden="true"> &rarr;</span>
                    </a>
                </div>

                <div
                    class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8"
                >
                ${this.product.map((product: z.infer<typeof ProductResult>) => html`
                <div class="group relative">
                    <div class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img src="${product.featuredImage?.url}" alt="${product.featuredImage?.altText}" class="h-full w-full object-cover object-center">
                    </div>
                    <h3 class="mt-4 text-sm text-gray-700">
                    <a href="/products/${product.handle}">
                        <span class="absolute inset-0"></span>
                        ${product.title}
                    </a>
                    </h3>
                    ${product.variants.nodes.forEach((variant) => html`<p class="mt-1 text-sm text-gray-500">${variant}</p>`)}
                    <p class="mt-1 text-sm font-medium text-gray-900">$75</p>
                </div>
                `)}

                </div>

                <div class="mt-8 text-sm md:hidden">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                    Shop the collection
                    <span aria-hidden="true"> &rarr;</span>
                    </a>
                </div>
                </div>
            </div>
        </section>
        `
    }
}
