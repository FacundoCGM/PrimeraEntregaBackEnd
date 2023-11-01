import { Router } from "express"
const router = Router()

import { ProductManager } from "../managers/productManager.js"
import { productValidation } from "../middlewares/productVaildation.js"

const productManager = new ProductManager("./src/data/products.json")

router.post("/", productValidation, async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body)
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get("/", async(req, res) => {
    try {
        const { limit } = req.query
        const products = await productManager.getProducts()
        if (!limit) res.status(200).json(products)
        else {
          const limitedProducts = await productManager.getProductsByLimit(limit)
          res.status(200).json(limitedProducts)}
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get("/:pid", async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(Number(pid))
        if (!product) res.status(404).json({ message: "Producto no encontrado." })
        else res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.put("/:pid", productValidation, async (req, res) => {
    try {
        const newProduct = { ...req.body }
        const { pid } = req.params
        const oldProduct = await productManager.getProductById(Number(pid))
        if (!oldProduct) res.status(404).json({ message: "Producto no encontrado." })
        else await productManager.updateProduct(Number(pid), newProduct)
        res.status(200).json({ message: "Producto actualizado con éxito." })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.delete("/:pid", async(req, res) => {
    try {
        const { pid } = req.params
        await productManager.deleteProduct(Number(pid))
        res.status(200).json({ message: "Producto eliminado con éxito." })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

export default router