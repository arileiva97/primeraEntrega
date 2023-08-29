import fs from 'fs';

class ProductManager{
    constructor(){
        this.path = 'src/Products.json';
        this.id = 0;
        this.lettersCode = "abc";
        this.numbersCode = 123;
        this.code = this.lettersCode + this.numbersCode;
    }

    async addProduct(title, description, price, stock, category){
        const contentObj = await this.checkProducts();
        this.id = contentObj[contentObj.length - 1].id + 1;

        const newProduct = {
            id: this.id,
            title: title,
            description: description,
            code: this.newCodeSystem(contentObj),
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnail: ""
        };

        try{
            if(!fs.existsSync(this.path)){ 
                const products = [];
                products.push(newProduct);
                this.newCodeSystem();

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            }else{
                const productSearched = contentObj.find((product) => product.title === newProduct.title)
                if(productSearched === undefined){
                    contentObj.push(newProduct);
                }else{
                    console.error(`The product "${productSearched.title}" already exists (Code ${productSearched.code})`);
                }

                await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
            }
        }catch(error){
            console.log(error);
        }
    }
    
    async checkProducts(){
        const content = await fs.promises.readFile(this.path, 'utf-8'); 
        const contentObj = JSON.parse(content);
        return contentObj;
    }

    async getProducts(){
        try{
            if(!fs.existsSync(this.path)){
                const emptyArray = [];
                await fs.promises.writeFile(this.path, JSON.stringify(emptyArray, null, '\t'));
                return emptyArray;
            }else{
                const contentObj = await this.checkProducts();
                return contentObj;
            }
        }catch(error){
            console.log("No products loaded");
            console.log(error);
            return error;
        }
        
    }

    async getProductByCode(code){
        const contentObj = await this.checkProducts();
        const productSearched = contentObj.find((product) => product.code === code)
        if(productSearched){
            return productSearched;
        }else{
            console.error(`Product (Code ${code}) not found`);
        }
    }

    async getProductById(id){
        const contentObj = await this.checkProducts();
        const productSearched = contentObj.find((product) => product.id === id);
        if(productSearched){
            return productSearched;
        }else{
            console.error(`Product (ID ${id}) not found`);
        }
    }

    async updateProduct(id,prop,change){
        const contentObj = await this.checkProducts();
        const productSearched = contentObj.find((product) => product.id === id)
        if(productSearched){
            productSearched[prop] = change;
            await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
        }else{
            console.error(`Product (ID ${id}) not found`);
        }
    }

    async deleteProduct(id){
        const contentObj = await this.checkProducts();
        const indexProductSearched = contentObj.findIndex((product) => product.id === id)
        if(indexProductSearched){
            contentObj.splice(indexProductSearched,1);
            this.id++;
            await fs.promises.writeFile(this.path, JSON.stringify(contentObj, null, '\t'));
        }else{
            console.error(`Product (ID ${id}) not found`);
        }
    }

    newCodeSystem(contentObj){
        let lastCode = contentObj[contentObj.length - 1].code;
        const lastCodeArray = lastCode.split('');
        lastCode = parseInt(lastCodeArray[3] + lastCodeArray[4] + lastCodeArray[5], 10);
        console.log(lastCode);
        this.numbersCode = lastCode + 1;
        const newCode = this.lettersCode + this.numbersCode;
        return newCode;
    }
}

export default ProductManager;


