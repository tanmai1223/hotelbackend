import Table from "../models/table.js";

export const getTable = async (req, res) => {
  try {
    const data = await Table.find();
    res.status(200).json({ message: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch table" });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id); // ✅ single document

    if (!table) {
      return res.status(404).json({
        status: "error",
        message: "Table not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: table,
    });
  } catch (error) {
    console.error("Error fetching table:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch table",
    });
  }
};

export const postTable = async (req, res) => {
  try {
    const { name, number, tableSize } = req.body;

    // Check required fields
    if (!name || !number || !tableSize) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    const data = new Table({
      name,
      number,
      tableSize,
    });

    await data.save();

    res.status(201).json({
      status: "success",
      message: "Table added successfully",
      data,
    });
  } catch (error) {
    console.error(error); // Logs the real error in your console
    if (error.name === "ValidationError") {
      // Handles enum or required field errors
      return res.status(400).json({ status: "error", message: error.message });
    }
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

