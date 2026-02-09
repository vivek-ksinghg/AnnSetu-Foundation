import Donation from "../models/donor/donation.js";
import Donor from "../models/donor/donor.js";
import Volunteer from "../models/volunteer/volunteer.js";

const getTotalFoodKg = async () => {
  const rows = await Donation.aggregate([
    { $match: { donationType: "Food", unit: "Kg", quantity: { $type: "number" } } },
    { $group: { _id: null, totalKg: { $sum: "$quantity" } } },
  ]);
  const total = rows?.[0]?.totalKg ?? 0;
  return Number.isFinite(total) ? total : 0;
};

export const getImpactStats = async (req, res) => {
  try {
    const [foodDonations, donors, volunteers, totalFoodKg] = await Promise.all([
      Donation.countDocuments({ donationType: "Food" }),
      Donor.countDocuments({}),
      Volunteer.countDocuments({}),
      getTotalFoodKg(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        foodDonations,
        donors,
        volunteers,
        robinsEnlisted: donors + volunteers,
        totalFoodKg,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getImpactOverview = async (req, res) => {
  try {
    const totalFoodKg = await getTotalFoodKg();

    const co2KgPerKgFoodWaste = 2.5;
    const co2ReducedKg = totalFoodKg * co2KgPerKgFoodWaste;

    const co2KgPerTreePerYear = 21.77;
    const treesEquivalent = co2ReducedKg / co2KgPerTreePerYear;

    const kgPerPersonFed = 0.5;
    const peopleFedEstimate = totalFoodKg / kgPerPersonFed;

    return res.status(200).json({
      success: true,
      data: {
        totalFoodKg,
        foodWastePreventedKg: totalFoodKg,
        co2ReducedKg,
        treesEquivalent,
        peopleFedEstimate,
        assumptions: {
          co2KgPerKgFoodWaste,
          co2KgPerTreePerYear,
          kgPerPersonFed,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
