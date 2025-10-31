import Order from "../models/orders.js";
import Table from "../models/table.js";
import Chef from "../models/chef.js";

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("chef")
      .populate("table")
      .sort({ time: -1 });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Could not fetch orders" });
  }
};

export const putOrder = async (req, res) => {
  try {
    const {
      name,
      numberOfPeople,
      address,
      phoneNumber,
      orderItem,
      dineIn,
      averageTime,
    } = req.body;

    // ✅ Dine-in validation
    if (dineIn && (!numberOfPeople || numberOfPeople <= 0)) {
      return res.status(400).json({
        status: "fail",
        message: "At least 1 person should be there for Dine-In orders",
      });
    }

    let bookedTable = null;

    // =====================================================
    // 🪑 Table allocation logic based on number of people
    // =====================================================
    if (dineIn) {
      const tableRanges = [
        { min: 1, max: 2, size: 2 },
        { min: 3, max: 4, size: 4 },
        { min: 5, max: 6, size: 6 },
        { min: 7, max: 8, size: 8 },
      ];

      const range = tableRanges.find(
        (r) => numberOfPeople >= r.min && numberOfPeople <= r.max
      );

      if (!range) {
        return res.status(400).json({
          status: "fail",
          message:
            "We cannot accommodate more than 8 people at a single table",
        });
      }

      // ✅ Find exact or next larger available table
      bookedTable = await Table.findOne({ tableSize: range.size, flag: false });

      if (!bookedTable) {
        const largerSizes = [2, 4, 6, 8].filter((s) => s > range.size);
        for (const size of largerSizes) {
          bookedTable = await Table.findOne({ tableSize: size, flag: false });
          if (bookedTable) break;
        }
      }

      // ❌ No table found
      if (!bookedTable) {
        return res.status(400).json({
          status: "fail",
          message: `No table available for ${numberOfPeople} people`,
        });
      }

      // ✅ Mark table as occupied
      bookedTable.flag = true;
      await bookedTable.save();
    }

    // =====================================================
    // 👨‍🍳 Assign chef with least activeOrders
    // =====================================================
    const chefs = await Chef.find();

    if (chefs.length === 0) {
      return res.status(500).json({
        status: "fail",
        message: "No chefs available. Please initialize chefs first.",
      });
    }

    const minOrders = Math.min(...chefs.map((c) => c.activeOrders));
    const availableChefs = chefs.filter((c) => c.activeOrders === minOrders);

    // Pick randomly if multiple chefs have same load
    const assignedChef =
      availableChefs[Math.floor(Math.random() * availableChefs.length)];

    // =====================================================
    // 🧾 Create new order
    // =====================================================
    const newOrder = new Order({
      name,
      numberOfPeople,
      address,
      phoneNumber,
      orderItem,
      dineIn,
      table: bookedTable ? bookedTable._id : null,
      averageTime: averageTime || 15,
      time: new Date(),
      status: "processing",
      chef: assignedChef._id,
    });

    await newOrder.save();

    // =====================================================
    // 🔢 Increment chef’s activeOrders safely
    // =====================================================
    const chef = await Chef.findById(assignedChef._id);
    if (chef) {
      chef.activeOrders = (chef.activeOrders || 0) + 1;
      await chef.save();
    }

    // =====================================================
    // ✅ Populate order for response
    // =====================================================
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("chef")
      .populate("table");

    res.status(201).json({
      status: "success",
      message: `Order created successfully and assigned to ${assignedChef.name}`,
      data: populatedOrder,
    });
  } catch (error) {
    console.error("❌ Create Order Error:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to create order",
      error: error.message,
    });
  }
};


export const putOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { averageTime, status } = req.body;

    const existing = await Order.findById(id)
      .populate("chef")
      .populate("table");

    if (!existing) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    const previousStatus = existing.status;
    console.log("➡️ PUT /order/" + id);
    console.log("   🧾 Old status:", previousStatus);
    console.log("   🧾 New status:", status);
    console.log("   👨‍🍳 Chef ID:", existing.chef?._id);
    console.log("   👨‍🍳 Chef type:", typeof existing.chef);
    console.log("   🧮 Current chef load:", existing.chef?.activeOrders);

    if (averageTime !== undefined) existing.averageTime = averageTime;
    if (status !== undefined) existing.status = status;

    // =====================================================
    // 🍽️ If status changes to "served"
    // =====================================================
    if (previousStatus !== "served" && status === "served") {
      console.log("🟢 Status is being changed to served...");

      // Free the table
      if (existing.table) {
        await Table.findByIdAndUpdate(existing.table._id, { flag: false });
        console.log(`🪑 Table ${existing.table._id} freed`);
      }

      // Decrement chef load safely
      if (existing.chef && existing.chef._id) {
        const before = await Chef.findById(existing.chef._id);
        console.log("Before decrement chef load:", before.activeOrders);

        const after = await Chef.findOneAndUpdate(
          { _id: existing.chef._id, activeOrders: { $gt: 0 } },
          { $inc: { activeOrders: -1 } },
          { new: true }
        );

        console.log("After decrement chef load:", after?.activeOrders);
      } else {
        console.log("⚠️ Skipping chef update — invalid or old reference");
      }
    } else {
      console.log("⚪ No change in chef or table (status unchanged)");
    }

    await existing.save();
    const updated = await Order.findById(id).populate("chef").populate("table");

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};







export const totals = async (req, res) => {
  try {
    // 🧑‍🍳 Count all chefs
    const chefCount = await Chef.countDocuments();

    // 🧾 Count all orders
    const orderCount = await Order.countDocuments();

    // 📱 Count unique clients by distinct phone numbers
    const uniqueClients = await Order.distinct("phoneNumber");
    const clientCount = uniqueClients.length;

    // 💰 Calculate total revenue
    // Assuming each order has an `orderItem` array like [{ name, price, quantity }]
    const orders = await Order.find({}, "orderItem");
    let totalRevenue = 0;

    orders.forEach((order) => {
      if (Array.isArray(order.orderItem)) {
        order.orderItem.forEach((item) => {
          const price = item.price || 0;
          const qty = item.quantity || 1;
          totalRevenue += price * qty;
        });
      }
    });

    // ✅ Respond with totals
    res.status(200).json({
      status: "success",
      data: {
        chefs: chefCount,
        orders: orderCount,
        clients: clientCount,
        revenue: totalRevenue,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching totals:", err);
    res.status(500).json({
      status: "fail",
      message: "Couldn't fetch total details",
    });
  }
};

export const orderSummary = async (req, res) => {
  try {
    const { range } = req.query; // "daily", "weekly", "monthly"

    // 🕒 Determine date range
    const now = new Date();
    let startDate;

    switch (range) {
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default: // "daily" or no query
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    // 🧮 Build date filter
    const dateFilter = { time: { $gte: startDate } };

    // 🧠 Run all queries in parallel for speed
    const [takeawayOrders, dineInOrders, servedOrders] = await Promise.all([
      Order.find({ dineIn: false, ...dateFilter }),
      Order.find({ dineIn: true, ...dateFilter }),
      Order.find({ status: "served", ...dateFilter }),
    ]);

    const summary = {
      takeaway: takeawayOrders.length,
      dineIn: dineInOrders.length,
      served: servedOrders.length,
      range: range || "daily",
    };

    res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (err) {
    console.error("❌ Order Summary Error:", err);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch order summary",
    });
  }
};

export const weeklyRevenue = async (req, res) => {
  try {
    const now = new Date();

    // Get start of current week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday as start
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // ✅ Fetch all orders placed this week
    const orders = await Order.find({
      time: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // Initialize day-wise revenue map
    const revenueByDay = new Map();

    for (const order of orders) {
      const orderDate = new Date(order.time);
      const dayIndex = orderDate.getDay(); // 0 = Sun, 1 = Mon, etc.

      // Calculate total for this order
      const orderTotal = order.orderItem.reduce((sum, item) => {
        const price = item.price || 0;
        const qty = item.quantity || 1;
        return sum + price * qty;
      }, 0);

      revenueByDay.set(
        dayIndex,
        (revenueByDay.get(dayIndex) || 0) + orderTotal
      );
    }

    // Map day index to weekday name
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weekData = dayMap.map((day, i) => ({
      day,
      revenue: revenueByDay.get(i) || 0,
    }));

    res.status(200).json({
      status: "success",
      data: weekData,
    });
  } catch (error) {
    console.error("Error calculating weekly revenue:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to calculate weekly revenue",
    });
  }
};
