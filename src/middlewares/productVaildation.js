export const productValidation = (req, res, next) => {
    if (
        req.body.title === undefined ||
        req.body.description === undefined ||
        req.body.price === undefined ||
        req.body.thumbnail === undefined ||
        req.body.code === undefined ||
        req.body.stock === undefined
    ) {
        res.status(404).json({ msg: 'Información faltante.' })
    } else {
        next()
    }
}