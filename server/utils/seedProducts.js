const Product = require("../models/Product");

const demoProducts = [
    {
        title: "Classic White Tee",
        description: "A timeless essential crafted from 100% organic combed cotton. Pre-shrunk, breathable, and cut for a clean modern fit that works on any occasion.",
        price: 19.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        stock: 42,
        tags: ["cotton", "essential", "tshirt"],
    },
    {
        title: "Slim Fit Denim Jeans",
        description: "Stretch-denim jeans with a tapered slim fit. Durable stitching, five-pocket styling, and a finish that only gets better with every wash.",
        price: 54.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
        stock: 25,
        tags: ["denim", "jeans", "casual"],
    },
    {
        title: "Oversized Cotton Hoodie",
        description: "Heavyweight brushed-fleece hoodie with a relaxed drop-shoulder cut. Ribbed cuffs, kangaroo pocket, and all-day comfort.",
        price: 49.99,
        category: "Men",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        stock: 30,
        tags: ["hoodie", "streetwear", "fleece"],
    },
    {
        title: "Summer Floral Midi Dress",
        description: "Flowing midi dress in a soft floral print. Lightweight viscose, adjustable waist tie, and a silhouette made for golden hours.",
        price: 64.99,
        category: "Women",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
        stock: 18,
        tags: ["dress", "floral", "summer"],
    },
    {
        title: "Tailored Blazer",
        description: "Sharp single-breasted blazer with structured shoulders and a satin lining. Dresses up denim or finishes a full suit look.",
        price: 89.99,
        category: "Women",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        stock: 12,
        tags: ["blazer", "formal", "office"],
    },
    {
        title: "Knit Wool Cardigan",
        description: "Chunky-knit cardigan spun from a soft wool blend. Open front, patch pockets, and the kind of warmth you want on slow mornings.",
        price: 72.5,
        category: "Women",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
        stock: 20,
        tags: ["knitwear", "wool", "cozy"],
    },
    {
        title: "Retro Court Sneakers",
        description: "Low-top leather sneakers with a vintage court silhouette. Cushioned insole, gum sole, and a look that pairs with everything.",
        price: 79.99,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
        stock: 35,
        tags: ["sneakers", "leather", "retro"],
    },
    {
        title: "All-Terrain Runners",
        description: "Lightweight running shoes with responsive foam midsole and breathable mesh upper. Grippy outsole built for pavement and trail alike.",
        price: 94.99,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        stock: 28,
        tags: ["running", "sport", "mesh"],
    },
    {
        title: "Chelsea Leather Boots",
        description: "Hand-finished leather Chelsea boots with elastic side panels and a stacked heel. Built to age beautifully.",
        price: 129.99,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop",
        stock: 10,
        tags: ["boots", "leather", "chelsea"],
    },
    {
        title: "Minimalist Leather Tote",
        description: "Structured full-grain leather tote with interior zip pocket and laptop sleeve. Carries work, gym, and weekend without breaking stride.",
        price: 119.0,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
        stock: 15,
        tags: ["bag", "leather", "tote"],
    },
    {
        title: "Polarized Aviator Sunglasses",
        description: "Timeless aviator frame with polarized UV400 lenses. Lightweight metal build, spring hinges, and a hard case included.",
        price: 39.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
        stock: 40,
        tags: ["sunglasses", "polarized", "summer"],
    },
    {
        title: "Classic Field Watch",
        description: "40mm field watch with sapphire crystal, Japanese quartz movement, and quick-release leather strap. Water resistant to 100m.",
        price: 149.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
        stock: 8,
        tags: ["watch", "leather", "classic"],
    },
];

// Seeds a realistic starter catalog once - only runs when the collection is empty
const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log(`Products collection not empty (${count} docs) - skipping catalog seeding.`);
            return;
        }

        await Product.insertMany(demoProducts);
        console.log(`Seeded ${demoProducts.length} demo products.`);
    } catch (error) {
        console.error("Error seeding products:", error.message);
    }
};

module.exports = seedProducts;
