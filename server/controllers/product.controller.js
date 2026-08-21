const Product = require("../models/Product");
const { z } = require("zod");
const { emitProductsChanged } = require("../utils/socket");

const productSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    price: z.number().positive(),
    category: z.string().min(1).max(100),
    image: z.string().url(),
    stock: z.number().int().nonnegative(),
});

// Escape user input before using it in $regex to prevent ReDoS / regex injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.createProduct = async (req, res) => {
    try {
        const productData = productSchema.parse(req.body);
        const product = await Product.create(productData);
        emitProductsChanged();
        res.status(201).json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { name: 1 } },
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, page, limit } = req.query;
        let query = {};

        if (search) {
            const safeSearch = escapeRegex(String(search));
            query.$or = [
                { title: { $regex: safeSearch, $options: "i" } },
                { description: { $regex: safeSearch, $options: "i" } },
                { tags: { $regex: safeSearch, $options: "i" } }
            ];
        }

        if (category && category !== "all") {
            query.category = { $regex: `^${escapeRegex(String(category))}$`, $options: "i" };
        }

        // Pagination is opt-in via query params; default keeps the full list
        const pageNum = Math.max(1, parseInt(page) || 1);
        const parsedLimit = parseInt(limit);
        const limitNum = Number.isFinite(parsedLimit) ? Math.min(100, Math.max(1, parsedLimit)) : 0;

        let productsQuery = Product.find(query);
        if (limitNum > 0) {
            productsQuery = productsQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
        }

        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = productSchema.partial().parse(req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        emitProductsChanged();
        res.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        emitProductsChanged();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
