import React, { useState, useContext, useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { Heart, Gift, DollarSign } from "lucide-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function DonationPage() {
  const { addDonation, backendUrl, token } = useContext(AppContext);

  const [donationType, setDonationType] = useState("money");
  const [amount, setAmount] = useState("");
  const [ngoList, setNgoList] = useState([]);
  const [ngoLoading, setNgoLoading] = useState(false);
  const [ngoLoadError, setNgoLoadError] = useState("");
  const [selectedNgoId, setSelectedNgoId] = useState("");
  const [paying, setPaying] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [foodState, setFoodState] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Packets");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [addressStatus, setAddressStatus] = useState("idle");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocodeTimerRef = useRef(null);
  const abortRef = useRef(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };



  const moneyOptions = [
    { meals: 10, amount: 501 },
    { meals: 20, amount: 1000 },
    { meals: 40, amount: 2000 },
    { meals: 100, amount: 5000 },
    { meals: 200, amount: 10000 },
    { meals: 400, amount: 20000 },
    { meals: 1000, amount: 50000 },
    { meals: 2000, amount: 100000 },
    { meals: 10000, amount: 500000 },
  ];

  // Geocode address (Nominatim) with debounce and privacy headers
  useEffect(() => {
    if (!address || address.trim().length < 5) {
      setCoords(null);
      setAddressStatus("idle");
      return;
    }

    setAddressStatus("searching");

    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const encoded = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "AnnSetu-NGO-App/1.0",
            "Accept-Language": "en",
          },
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const { lat, lon } = data[0];
          const newCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };
          setCoords(newCoords);
          setAddressStatus("ok");
        } else {
          setCoords(null);
          setAddressStatus("not_found");
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          setCoords(null);
          setAddressStatus("error");
        }
      }
    }, 500);

    return () => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [address]);

  // Initialize/update Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    if (coords) {
      const { lat, lon } = coords;
      mapInstanceRef.current.setView([lat, lon], 15);
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lon]).addTo(mapInstanceRef.current);
      } else {
        markerRef.current.setLatLng([lat, lon]);
      }
    }
  }, [coords]);

  // ✅ Donation function
  const handleDonation = async () => {
    try {
      if (donationType === "food") {
        if (!foodName || !foodType || !foodState || !quantity) {
          return alert("🍲 Please fill all food details.");
        }

        const donationData = {
          donationType: "Food",
          foodName,
          foodType,
          state: foodState,
          quantity,
          unit,
          address,
        };

        await addDonation(donationData);
      }

     

      // ✅ Reset form
      setAmount("");
      setSelectedNgoId("");
      setFoodName("");
      setFoodType("");
      setFoodState("");
      setQuantity("");
      setUnit("Packets");
      setAddress("");


    } catch (error) {
      console.error("Donation failed:", error);
      alert("❌ Donation failed. Please try again.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setNgoLoading(true);
        setNgoLoadError("");
        const urls = [`${backendUrl}/api/ngo/public-ngos`, `${backendUrl}/api/donor/public-ngos`, `${backendUrl}/api/donor/ngos`];
        let loaded = false;
        for (const url of urls) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            const list = Array.isArray(data?.data) ? data.data : [];
            console.log(list);
            
            setNgoList(list);
            loaded = true;
            break;
          } catch {
            // try next
          }
        }
        if (!loaded) {
          setNgoList([]);
          setNgoLoadError("Failed to load NGOs");
        }
      } catch {
        setNgoList([]);
        setNgoLoadError("Failed to load NGOs");
      } finally {
        setNgoLoading(false);
      }
    };
    if (donationType === "money" && backendUrl) {
      load();
    }
  }, [donationType, backendUrl]);

  const handlePayWithRazorpay = async () => {
    try {
      if (!token) {
        return alert("Please login first to donate!");
      }
      const amt = Number(amount);
      if (!isFinite(amt) || amt <= 0) {
        return alert("💰 Enter a valid amount.");
      }
      if (!selectedNgoId) {
        return alert("Please select an NGO.");
      }

      setPaying(true);
      const ok = await loadRazorpayScript();
      if (!ok) {
        setPaying(false);
        return alert("Razorpay SDK failed to load.");
      }

      const orderRes = await fetch(`${backendUrl}/api/donor/razorpay/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ amount: amt, ngoId: selectedNgoId }),
      });
      let orderData = null;
      let rawText = "";
      try {
        orderData = await orderRes.json();
      } catch {
        rawText = await orderRes.text().catch(() => "");
      }

      if (!orderRes.ok || !orderData?.success) {
        setPaying(false);
        const msg =
          orderData?.message ||
          orderData?.error ||
          rawText ||
          `Failed to create order (HTTP ${orderRes.status})`;
        return alert(msg);
      }

      const { keyId, order } = orderData;
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "AnnSetu Foundation",
        description: "Donation",
        method: { upi: true, card: true, netbanking: true, wallet: true },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${backendUrl}/api/donor/razorpay/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token,
              },
              body: JSON.stringify({
                amount: amt,
                ngoId: selectedNgoId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json().catch(() => null);
            if (verifyData?.success) {
              alert("🎉 Payment successful. Thank you for your donation!");
              setAmount("");
              setSelectedNgoId("");
            } else {
              const msg = verifyData?.message || verifyData?.error || `Payment verification failed (HTTP ${verifyRes.status})`;
              alert(msg);
            }
          } catch {
            alert("Payment verification failed");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await fetch(`${backendUrl}/api/donor/razorpay/fail`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token,
                },
                body: JSON.stringify({ amount: amt, ngoId: selectedNgoId, razorpay_order_id: order.id }),
              });
            } catch {
              // ignore
            } finally {
              setPaying(false);
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async () => {
        try {
          await fetch(`${backendUrl}/api/donor/razorpay/fail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token,
            },
            body: JSON.stringify({ amount: amt, ngoId: selectedNgoId, razorpay_order_id: order.id }),
          });
        } catch {
          // ignore
        }
      });
      rzp.open();
    } catch (e) {
      setPaying(false);
      alert(e?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-200 via-emerald-300 to-green-500 flex flex-col items-center p-6 mt-22">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-12 text-center"
      >
        <Heart className="w-24 h-24 text-red-500 animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 mt-4">
          Support Our Cause
        </h1>
        <p className="text-gray-700 mt-3 text-lg md:text-xl max-w-3xl">
          Donate money or food to help those in need. Every contribution brings
          a smile. 🌍💚
        </p>
      </Motion.div>

      {/* Toggle Buttons */}
      <div className="flex gap-6 mb-12">
        <Motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setDonationType("money")}
          className={`flex items-center gap-3 px-10 py-4 rounded-3xl text-xl font-bold shadow-lg transition ${
            donationType === "money"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-green-100"
          }`}
        >
          <DollarSign className="w-6 h-6" /> Money
        </Motion.button>
        <Motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setDonationType("food")}
          className={`flex items-center gap-3 px-10 py-4 rounded-3xl text-xl font-bold shadow-lg transition ${
            donationType === "food"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-green-100"
          }`}
        >
          <Gift className="w-6 h-6" /> Food
        </Motion.button>
      </div>

      {/* Main Content */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10"
      >
        {donationType === "money" ? (
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
              Donate Money 💰
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
              {moneyOptions.map((item, index) => (
                <Motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center bg-white rounded-3xl shadow-xl p-5 transition hover:shadow-2xl"
                >
                  <img
                    src={assets.food}
                    alt={`${item.meals} Meals`}
                    className="w-full h-36 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">
                    Donate {item.meals} Meals
                  </h3>
                  <p className="text-lg md:text-xl font-bold mb-4">
                    ₹{item.amount.toLocaleString()}
                  </p>
                  <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(item.amount)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold shadow-md transition"
                  >
                    Add Donation
                  </Motion.button>
                </Motion.div>
              ))}
            </div>

<input
  type="number"
  placeholder="Enter custom amount (minimum ₹500)"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className={`w-full border-2 rounded-2xl px-5 py-4 text-lg focus:outline-none mt-6 ${
    amount && Number(amount) < 500
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-green-500"
  }`}
/>

{/* 🔴 Warning Message */}
{amount && Number(amount) < 500 && (
  <p className="mt-2 text-red-600 font-semibold">
    ❌ Amount less than ₹500 is not acceptable
  </p>
)}

            <div className="w-full">
              <label className="block mb-2 font-semibold text-green-800">Select NGO</label>
              <select
                value={selectedNgoId}
                onChange={(e) => setSelectedNgoId(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-green-500"
              >
                <option value="">Choose NGO</option>
                {ngoList.map((n) => {
                  const label = n.organizationName || n.name || n.email || "NGO";
                  return (
                    <option key={n._id} value={n._id}>
                      {label}
                    </option>
                  );
                })}
              </select>
              {ngoLoading && <div className="mt-2 text-sm text-gray-600">Loading NGOs…</div>}
              {!ngoLoading && ngoLoadError && (
                <div className="mt-2 text-sm text-red-600">{ngoLoadError}</div>
              )}
              {!ngoLoading && !ngoLoadError && ngoList.length === 0 && (
                <div className="mt-2 text-sm text-gray-600">No NGOs available (ask admin to approve an NGO).</div>
              )}
            </div>

            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayWithRazorpay}
              disabled={paying}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 rounded-3xl text-2xl md:text-3xl font-bold shadow-xl transition-all mt-4"
            >
              {paying ? "Processing…" : "Pay with Razorpay"}
            </Motion.button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">
                Donate Food 🍲
              </h2>

              <label className="block mb-2 font-semibold text-green-800">
                Food Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rice, Dal, Sandwiches"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full border-2 border-green-300 rounded-2xl px-4 py-4 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg placeholder-green-400 shadow-md"
              />

              <label className="block mb-2 font-semibold text-green-800">
                Food Type
              </label>
              <div className="flex gap-4 mb-6">
                {["Veg", "Non-Veg"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFoodType(type)}
                    className={`flex-1 py-3 rounded-xl border-2 text-lg font-semibold transition ${
                      foodType === type
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400 text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <label className="block mb-2 font-semibold text-green-800">
                State
              </label>
              <div className="flex gap-4 mb-6">
                {["Cooked", "Raw"].map((state) => (
                  <button
                    key={state}
                    onClick={() => setFoodState(state)}
                    className={`flex-1 py-3 rounded-xl border-2 text-lg font-semibold transition ${
                      foodState === state
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400 text-gray-700"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>

              <label className="block mb-2 font-semibold text-green-800">
                Quantity
              </label>
              <div className="flex gap-4 mb-6">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 border-2 border-green-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg shadow-md"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="border-2 border-green-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg shadow-md"
                >
                  <option value="Packets">Packets</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>

                {/* 🟢 Address Field */}
              <label className="block mb-2 font-semibold text-green-800">
                Pickup Address / Location 📍
              </label>
              <input
                type="text"
                placeholder="e.g. Sector 62, Noida, Uttar Pradesh, India"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-2 border-green-300 rounded-2xl px-4 py-4 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg placeholder-green-400 shadow-md"
              />
              <p className="text-gray-600 text-sm mb-6">
                🗺️ Please enter a full and detailed address — this helps nearby NGOs find your location easily.
              </p>
              {/* 🟢 End Address Field */}

              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDonation}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 rounded-3xl text-2xl md:text-3xl font-bold shadow-xl transition-all"
              >
                Donate Food
              </Motion.button>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  {addressStatus === "idle" && "Start typing your pickup address to preview it on the map."}
                  {addressStatus === "searching" && "Validating address…"}
                  {addressStatus === "ok" && "Address found. Pin shows the pickup location."}
                  {addressStatus === "not_found" && "Address not found. Please refine."}
                  {addressStatus === "error" && "Geocoding error. Please try again."}
                </p>
              </div>
              <div
                id="donation-map"
                ref={mapRef}
                style={{ height: "360px", width: "100%", borderRadius: "1.5rem" }}
                className="shadow-xl"
              />
            </div>
          </div>
        )}
      </Motion.div>

      {/* Footer */}
      <p className="text-center text-gray-500 mt-10 text-sm md:text-base">
        💯 100% of your donation directly supports the cause. Thank you for
        making a difference! 🌱
      </p>
    </div>
  );
}

export default DonationPage;
