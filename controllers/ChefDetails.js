import Chef from "../models/chef.js";

export const getChef = async (req, res) => {
  try {
    const data = await Chef.find();
    res.status(200).json({ status: "sucess", data });
  } catch (err) {
    res
      .status(500)
      .json({ status: "fail", message: "Couldnt fetch chef details" });
  }
};
