import fs from "fs"

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async getCarts() {
        try {
            if(fs.existsSync(this.path)) {
                return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            } else return []
        } catch(error) {
            console.error(error)
        }
    }

    async getNextId() {
        try {
            const products = await this.getCarts()
            let nextId = 0
            products.map((product)=>{
                if(product.id > nextId) nextId = product.id
            })
            return nextId
        } catch(error) {
            console.error(error)
        }
    }

    async addCart() {
        try {
            const carts = await this.getCarts()
            const cart = {
                id: (await this.getNextId()) + 1,
                products: [],
            }
            carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        } catch(error) {
            console.error(error)
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts()
            const cartWanted = carts.find((cart) => cart.id === cartId)
            if(cartWanted) {
                return cartWanted
            } else console.log('Cart no encontrado.')
        } catch(error) {
            console.error(error)
        }
    }

    async addToCart(cartId, prodId) {
        try {
            const carts = await this.getCarts()
            const cartExists = await this.getCartById(cartId)
            if(cartExists) {
                const cartProd = cartExists.products.find(product => product.id === prodId)
                if(cartProd) cartProd.products.quantity + 1
                else {
                    const prod = {
                        product: prodId,
                        quantity: 1
                    }
                    cartExists.products.push(prod)
                }
                const cartToUpdate = carts.findIndex((allCarts) => allCarts.id === cartId)
                if(cartToUpdate !== -1) {
                    carts[cartToUpdate] = cartExists
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
                return cartExists
            } else console.log('Cart no encontrado.')
        } catch(error) {
            console.error(error)
        }
    }
}