


import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";

const VolunteerPickedUpFoods = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPickedUpFoods = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/volunteer/my-picked-up-foods`,
        { headers: { token } }
      );
      setFoods(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch foods ❌");
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (foodId) => {
    try {
      setUpdatingId(foodId);

      await axios.put(
        `${backendUrl}/api/volunteer/update-task-status/${foodId}`,
        { status: "Delivered" },
        { headers: { token } }
      );

      setFoods((prev) => prev.filter((f) => f._id !== foodId));
      toast.success("Food delivered successfully 🚚✅");
    } catch {
      toast.error("Failed to mark as delivered ❌");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchPickedUpFoods();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-lg font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto mt-25">
      <h2 className="text-3xl font-bold mb-8 text-center">
        🚚 My Picked Up Foods
      </h2>

      {foods.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No picked up food found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {foods.map((food) => (
            <div
              key={food._id}
              className="border rounded-2xl p-6 shadow-lg bg-white min-h-[260px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-1">
                  {food.foodName}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Picked on {new Date(food.createdAt).toLocaleString()}
                </p>

                <div className="space-y-2 text-sm">
                  <p><b>Quantity:</b> {food.quantity} {food.unit}</p>
                  <p><b>Address:</b> {food.address}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span className="text-orange-600 font-semibold">
                      {food.status}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => markAsDelivered(food._id)}
                disabled={updatingId === food._id}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-white transition
                  ${
                    updatingId === food._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }
                `}
              >
                {updatingId === food._id ? "Updating..." : "Delivered ✅"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerPickedUpFoods;
