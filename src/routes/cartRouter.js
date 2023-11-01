import { Router } from "express"
const router = Router()

import { CartManager } from "../managers/cartManager.js"
import { ProductManager } from "../managers/productManager.js"

const cartManager = new CartManager("./src/data/carts.json")
const productManager = new ProductManager("./src/data/products.json")

router.post("/", async(req, res) => {
    try {
        const newCart = await cartManager.addCart()
        res.status(200).json(newCart)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get("/:cid", async(req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartManager.getCartById(Number(cid))
        if(!cart) res.status(404).json({ message: "Cart no encontrado." })
        else res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post("/:cid/products/:pid", async(req, res) => {
    try {
        const { cid } = req.params
        const { pid } = req.params
        const prodWanted = await productManager.getProductById(Number(pid))
        if(!prodWanted) res.status(404).json({ message: "Producto no encontrado." })
        else await cartManager.addToCart(Number(cid), Number(pid))
        res.status(200).json({ message: "Producto agregado con éxito." })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

export default router