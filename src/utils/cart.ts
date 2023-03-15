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
    if (sessionStorage.getItem('cart')) {

        const id = JSON.parse(sessionStorage.getItem('cart') as string).id

        const data = await getCart(id);

        if (data) {
            sessionStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        } else {
            sessionStorage.setItem('cart', JSON.stringify(emptyCart));
        }
    }
}


export async function addCartItem(item: { id: string; quantity: number }) {
    const id = JSON.parse(sessionStorage.getItem('cart') as string).id

    if (!id) {
        const data = await createCart(item.id, item.quantity);

        if (data) {
            sessionStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        }
    } else {
        const data = await addCartLines(id, item.id, item.quantity);

        if (data) {
            sessionStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        }
    }
}

export async function removeCartItems(lineIds: string[]) {
    const id = JSON.parse(sessionStorage.getItem('cart') as string).id

    if (id) {
        const data = await removeCartLines(id, lineIds);

        if (data) {
            sessionStorage.setItem('cart', JSON.stringify({
                id: data.id,
                cost: data.cost,
                checkoutUrl: data.checkoutUrl,
                totalQuantity: data.totalQuantity,
                lines: data.lines,
            }));
        }
    }
}