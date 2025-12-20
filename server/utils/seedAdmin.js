const User = require("../models/User");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Admin";

    if (!email || !password) {
        console.log("Skipping admin seeding: ADMIN_EMAIL or ADMIN_PASSWORD not set.");
        return;
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.role !== "admin") {
                existingUser.role = "admin";
                await existingUser.save();
                console.log(`User ${email} promoted to admin.`);
            } else {
                console.log(`Admin user ${email} already exists.`);
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name,
                email,
                password: hashedPassword,
                role: "admin"
            });
            console.log(`Admin user ${email} created.`);
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};

module.exports = seedAdmin;
