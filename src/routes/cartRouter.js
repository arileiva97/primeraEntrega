import { Router } from "express";
import CartManager from "../CartManager.js";
const cartManager = new CartManager();

const router = Router();

router.get('/', async (req, res) => {
    const firstCart = await cartManager.getFirstCart();
    res.send(firstCart);
});

router.post('', async (req, res) => {
    await cartManager.addNewCart();
    res.send();
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cartProductsSearched = await cartManager.getCartProducts(parseInt(cartId, 10));
    if(cartProductsSearched === undefined){
        return res.status(404).send();
    }

    res.send(cartProductsSearched);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cartManager.addProductToCart(cartId, productId);
    res.send();
});

export default router;