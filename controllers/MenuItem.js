import Product from "../models/menu.js";

// ✅ 1️⃣ Get all menu items (no pagination)
export const getMenu = async (req, res) => {
  try {
    const data = await Product.find().sort({ _id: 1 });
    res.status(200).json({
      success: true,
      message: "Fetched all menu items",
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
    });
  }
};

// ✅ 2️⃣ Get paginated menu (for lazy loading)
export const getMenuLazy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    // 🧩 Added sort to ensure consistent paging
    const data = await Product.find()
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalCount,
      data,
    });
  } catch (error) {
    console.error("Error fetching paginated menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch paginated menu",
    });
  }
};

// ✅ 3️⃣ Get category-wise menu (with pagination)
export const getMenuCat = async (req, res) => {
  try {
    const { cat } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = cat ? { category: { $regex: new RegExp(cat, "i") } } : {};

    const totalCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // 🧩 Also added sort here
    const data = await Product.find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      category: cat || "all",
      currentPage: page,
      totalPages,
      totalCount,
      data,
    });
  } catch (error) {
    console.error("Error fetching category menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu by category",
    });
  }
};

export const getsearch=async(req,res)=>{
  try {
    const query = req.query.query || "";

    // case-insensitive partial match + limit results
    const items = await Product.find({
      name: { $regex: query, $options: "i" },
    }).limit(50);

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
