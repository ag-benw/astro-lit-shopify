import { publish } from "pubsub-js";
import {
    getCart,
    addCartLines,
    createCart,
    removeCartLines,
} from "../utils/shopify";

const emptyCart = {
    id: "",
    checkoutUrl: "",
    totalQuantity: 0,
    lines: { nodes: [] },
    cost: { totalAmount: { amount: "", currencyCode: "" } },
};

export async function initCart() {
    if (localStorage.getItem('cart') !== null) {

        const id = JSON.parse(localStorage.getItem('cart') as string).id

        const data = await getCart(id);

        if (data) {
            localStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        }
    } else {
        localStorage.setItem('cart', JSON.stringify(emptyCart));
    }
}


export async function addCartItem(item: { id: string; quantity: number }) {
    if (localStorage.getItem('cart') !== null) {

        const cartObj = JSON.parse(localStorage.getItem('cart') || "");

        const id = cartObj.id

        if (!id) {
            const data = await createCart(item.id, item.quantity);

            if (data) {
                localStorage.setItem('cart', JSON.stringify({
                    id: data.id,
                    cost: data.cost,
                    checkoutUrl: data.checkoutUrl,
                    totalQuantity: data.totalQuantity,
                    lines: data.lines,
                }));

                publish('cart-drawer:toggle', true)
            }
        } else {
            const data = await addCartLines(id, item.id, item.quantity);

            if (data) {
                localStorage.setItem('cart', JSON.stringify({
                    id: data.id,
                    cost: data.cost,
                    checkoutUrl: data.checkoutUrl,
                    totalQuantity: data.totalQuantity,
                    lines: data.lines,
                }));

                publish('cart-drawer:toggle', true)
            }
        }
    }
}

export async function removeCartItems(lineIds: string[]) {
    const id = JSON.parse(localStorage.getItem('cart') as string).id

    if (id) {
        const data = await removeCartLines(id, lineIds);

        if (data) {
            localStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        }
    }
}