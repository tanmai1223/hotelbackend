import path from "path";
import { fileURLToPath } from "url";
import readXlsxFile from "read-excel-file/node";
import cloudinary from "./config/cloudinary.js";
import Product from "./models/menu.js";
import db from "./config/db.js";

db();

// Required for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    // 1️⃣ Read Excel file
    const rows = await readXlsxFile(path.join(__dirname, "products.xlsx"));
    const headers = rows[0];
    const products = rows.slice(1).map((row) => {
      const product = {};
      headers.forEach((header, i) => {
        product[header] = row[i];
      });
      return product;
    });

    console.log(`📄 Found ${products.length} products in Excel`);

    // 2️⃣ Loop through and upload each image to Cloudinary
    for (const product of products) {
      const imagePath = path.join(__dirname, "images", product.Image); // Excel column: "Image"
      try {
        const uploadRes = await cloudinary.uploader.upload(imagePath, {
          folder: "products",
        });

        // 3️⃣ Save to MongoDB
        const newProduct = new Product({
          name: product.Name,
          description: product.Description,
          price: product.Price,
          averageTime: product.AverageTime,
          category: product.Category,
          image: uploadRes.secure_url, // Cloudinary URL
        });

        await newProduct.save();
        console.log(`✅ Uploaded: ${product.Name}`);
      } catch (err) {
        console.log(`⚠️ Failed to upload image for ${product.Name}:`, err.message);
      }
    }

    console.log("🎉 All products imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
