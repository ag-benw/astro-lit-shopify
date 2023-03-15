import { z } from "zod";
import { CartResult, ProductResult } from "./schemas";
import { config } from "./config";
import {
    ProductsQuery,
    ProductByHandleQuery,
    CreateCartMutation,
    AddCartLinesMutation,
    GetCartQuery,
    RemoveCartLinesMutation,
    ProductRecommendationsQuery,
} from "./graphql";

const makeShopifyRequest = async (
    query: string,
    variables: Record<string, unknown> = {},
) => {
    const apiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;

    function getOptions() {
        const { publicShopifyAccessToken } = config;
        const options = {
            method: "POST",
            headers: {},
            body: JSON.stringify({ query, variables }),
        };
        options.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": publicShopifyAccessToken,
        };

        return options;
    }

    const response = await fetch(apiUrl, getOptions());

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`${response.status} ${body}`);
    }

    const json = await response.json();
    if (json.errors) {
        throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
    }

    return json.data;
};

export const getProducts = async (options: {
    limit?: number;
}) => {
    const { limit = 10 } = options;

    const data = await makeShopifyRequest(
        ProductsQuery,
        { first: limit },
    );
    const { products } = data;

    if (!products) {
        throw new Error("No products found");
    }

    const productsList: [] = products.edges.map((edge: any) => edge.node);
    const ProductsResult = z.array(ProductResult);
    const parsedProducts = ProductsResult.parse(productsList);

    return parsedProducts;
};

export const getProductByHandle = async (options: {
    handle: string;
}) => {
    const { handle } = options;

    const data = await makeShopifyRequest(
        ProductByHandleQuery,
        { handle },
    );
    const { productByHandle } = data;

    const parsedProduct = ProductResult.parse(productByHandle);

    return parsedProduct;
};

export const getProductRecommendations = async (options: {
    productId: string;
}) => {
    const { productId } = options;
    const data = await makeShopifyRequest(
        ProductRecommendationsQuery,
        {
            productId,
        },
    );
    const { productRecommendations } = data;

    const ProductsResult = z.array(ProductResult);
    const parsedProducts = ProductsResult.parse(productRecommendations);

    return parsedProducts;
};

export const createCart = async (id: string, quantity: number) => {
    const data = await makeShopifyRequest(CreateCartMutation, { id, quantity });
    const { cartCreate } = data;
    const { cart } = cartCreate;
    const parsedCart = CartResult.parse(cart);

    return parsedCart;
};

export const addCartLines = async (
    id: string,
    merchandiseId: string,
    quantity: number
) => {
    const data = await makeShopifyRequest(AddCartLinesMutation, {
        cartId: id,
        merchandiseId,
        quantity,
    });
    const { cartLinesAdd } = data;
    const { cart } = cartLinesAdd;

    const parsedCart = CartResult.parse(cart);

    return parsedCart;
};

export const removeCartLines = async (id: string, lineIds: string[]) => {
    const data = await makeShopifyRequest(RemoveCartLinesMutation, {
        cartId: id,
        lineIds,
    });
    const { cartLinesRemove } = data;
    const { cart } = cartLinesRemove;
    const parsedCart = CartResult.parse(cart);

    return parsedCart;
};

export const getCart = async (id: string) => {
    const data = await makeShopifyRequest(GetCartQuery, { id });

    const { cart } = data;
    const parsedCart = CartResult.parse(cart);

    return parsedCart;
};