import fs from 'fs';
import ProductManager from './ProductManager.js';
const productManager = new ProductManager();

class CartManager{
    constructor(){
        this.productsPath = 'src/Products.json';
        this.cartsPath = 'src/Carts.json';
        this.cid = 1; // cid: cart id
    }

    async getFirstCart(){
        const firstCart = {
            "cid": this.cid,
            "products": []
        }
        try{
            if(!fs.existsSync(this.cartsPath)){
                const carts = [];
                carts.push(firstCart);
                await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts, null, '\t'));
                return carts;
            }else{
                const contentObj = await this.checkCarts();
                return contentObj;
            }
        }catch(error){
            console.log("No carts loaded");
            console.log(error);
            return error;
        }
    }

    async addNewCart(){
        const contentObj = await this.checkCarts();
        this.cid = contentObj[contentObj.length - 1].cid + 1;
        
        const newCart = {
            "cid": this.cid,
            "products": []
        }

        try{
            if(!fs.existsSync(this.cartsPath)){
                const carts = [];
                carts.push(newCart);
                await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts, null, '\t'));
            }else{
                contentObj.push(newCart);
                await fs.promises.writeFile(this.cartsPath, JSON.stringify(contentObj, null, '\t'));
            }
        }catch(error){
            console.log("No carts loaded");
            console.log(error);
            return error;
        }
    }

    async getCartProducts(cid){
        const contentObj = await this.checkCarts();
        const cartSearched = contentObj.find((cart) => cart.cid === cid);
        if(cartSearched){
            return cartSearched["products"];
        }else{
            console.error(`Cart (ID ${cid}) not found`);
        }
    }

    async getCart(cid){
        const contentObj = await this.checkCarts();
        const cartSearched = contentObj.find((cart) => cart.cid === cid);
        if(cartSearched){
            return cartSearched;
        }else{
            console.error(`Cart (ID ${cid}) not found`);
        }
    }

    async addProductToCart(cid, productId){
        const productSearched = await productManager.getProductById(parseInt(productId, 10));
        if(productSearched){
            const contentObj = await this.checkCarts();
            const cartSearched = contentObj.find((cart) => cart.cid === parseInt(cid, 10));
            console.log(cartSearched);
            if(cartSearched){
                const productSearchedOnCart = cartSearched["products"].find((product) => product.id === productSearched["id"]);
                if(productSearchedOnCart){
                    productSearchedOnCart["quantity"]++;
                }else{
                    const productToAdd = {
                        "id": productSearched["id"],
                        "quantity": 1
                    }
                    cartSearched["products"].push(productToAdd);
                }
                await fs.promises.writeFile(this.cartsPath, JSON.stringify(contentObj, null, '\t'));
            }else{
                console.error(`Cart (ID ${cid}) not found`);
            }
        }
    }

    async checkCarts(){
        const content = await fs.promises.readFile(this.cartsPath, 'utf-8'); 
        const contentObj = JSON.parse(content);
        return contentObj;
    }
}

export default CartManager;