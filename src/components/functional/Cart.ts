import { html } from "lit";
import type { z } from "zod";
import { customElement, property, state } from 'lit/decorators.js';
import ThemeProvider from "../global/ThemeProvider";
import { subscribe, publish } from "pubsub-js";
import type { CartItemResult, CartResult } from "../../utils/schemas";

@customElement('cart-drawer')
export class CartDrawer extends ThemeProvider {

  @property({ attribute: true, type: Boolean, reflect: true })
  open: boolean = this.hasAttribute('open')

  @state()
  items: any = null

  @state()
  price: string | null = null

  @state()
  checkout: string = "";

  connectedCallback() {
    super.connectedCallback();
    subscribe('cart-drawer:toggle', this._handleDrawer.bind(this))
  }

  private _handleDrawer() {
    this.open = !this.open;

    const persistantCart: z.infer<typeof CartResult> = JSON.parse(localStorage.getItem('cart') as string)

    if (persistantCart !== null) {
      this.items = persistantCart.lines.nodes
      this.price = persistantCart.cost.totalAmount.amount
      this.checkout = persistantCart.checkoutUrl
    }
  }

  private handleClick() {
    publish('cart-drawer:toggle', true)
  }

  render() {
    return html`
          <div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${this.open ? "" : " hidden"}"></div>
          
            <div class="fixed inset-0 overflow-hidden ${this.open ? "" : " hidden"}">
              <div class="absolute inset-0 overflow-hidden">
                <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <div class="pointer-events-auto w-screen max-w-md ${this.open ? "" : " hidden"}">
                    <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                        <div class="flex items-start justify-between">
                          <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                          <div class="ml-3 flex h-7 items-center">
                            <button type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500" @click="${this.handleClick}">
                              <span class="sr-only">Close panel</span>
                              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
          
                        <div class="mt-8">
                          <div class="flow-root">
                            <ul role="list" class="-my-6 divide-y divide-gray-200">
                              ${this.items !== null && this.items.map((item: z.infer<typeof CartItemResult>) => html`
                                <li class="flex py-6">
                                  <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src="${item.merchandise.image?.url})" alt="${item.merchandise.image?.altText || ""}"
                                      class="h-full w-full object-cover object-center">
                                  </div>
          
                                  <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div class="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href="#">${item.merchandise.product.title}</a>
                                        </h3>
                                        <p class="ml-4">$${item.cost.totalAmount.amount}</p>
                                      </div>
                                      <p class="mt-1 text-sm text-gray-500">Salmon</p>
                                    </div>
                                    <div class="flex flex-1 items-end justify-between text-sm">
                                      <p class="text-gray-500">Qty ${item.quantity}</p>
          
                                      <div class="flex">
                                        <button type="button"
                                          class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                `)}
                            </ul>
                            ${this.items !== null && this.items.length == 0 ? html`
                            <div class="text-center">
                              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                aria-hidden="true">
                                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                              </svg>
                              <h3 class="mt-2 text-sm font-semibold text-gray-900">No items in cart</h3>
                              <p class="mt-1 text-sm text-gray-500">Get started by shopping our latest range</p>
                              <div class="mt-6">
                                <button type="button"
                                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                  <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path
                                      d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                  </svg>
                                  Continue Shopping
                                </button>
                              </div>
                            </div>
                            `: null}
                          </div>
                        </div>
                      </div>
          
                      <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>$${this.price}Hell</p>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div class="mt-6">
                          <a href="${this.checkout}"
                            class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
                        </div>
                        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or
                            <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
  }
}