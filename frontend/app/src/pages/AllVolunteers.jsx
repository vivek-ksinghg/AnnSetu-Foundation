import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";

const AllVolunteers = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/ngo/Allvolunteers`,
        {headers:{token}}
      );
      setVolunteers(res.data?.data || []);
    } catch {
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
   <div className="p-6 max-w-6xl mx-auto mt-28">
  <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
    All Volunteers
  </h2>

  {volunteers.length === 0 ? (
    <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg shadow-sm">
      No volunteers found
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {volunteers.map((v) => (
        <div
          key={v._id}
          className="relative border rounded-xl p-5 bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600 text-lg">
              {v.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-800">
                {v.name}
              </p>
              <p className="text-sm text-gray-500">
                Joined {new Date(v.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-900">Email:</span>{" "}
              {v.email}
            </p>
            <p>
              <span className="font-medium text-gray-900">Phone:</span>{" "}
              {v.number}
            </p>
            <p>
              <span className="font-medium text-gray-900">Address:</span>{" "}
              {v.address}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end">
            <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
              Active Volunteer
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  )
};

export default AllVolunteers;
