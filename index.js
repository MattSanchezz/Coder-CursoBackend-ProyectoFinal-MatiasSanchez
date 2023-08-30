class ProductManager {
    constructor() {
        this.prducts = [];
    }
    addProducts(title, description, price, thumbnail, code, stock) {
        const product = {
            id: this.prducts.length ? this.prducts[this.product.length-1].id + 1 : 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.prducts.push(product);
            console.log(product);
            console.log(this.prducts);
    };
    static getProducts(){
        return (this.product);
    };
    getProductsById(idProduct){
        const product = this.product.find(e=>e.id === idProduct)
        if(!product){
            return 'Not Found'
        }
        product.push(idProduct)
    }
};

let product1 = new ProductManager();
let product2 = new ProductManager();
product1.addProducts("Camiseta", "Camiseta titular del equipo Independiente", 25000, "Imagen not found", "IND0001", 30);
product2.addProducts("Pantalon", "Pantalon del equipo Independiente", 30000, "Imagen not found", "IND0002", 30);
console.log(products.getProducts());