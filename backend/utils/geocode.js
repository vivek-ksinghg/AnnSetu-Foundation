// backend/utils/geocode.js
import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

export const getCoordinatesFromAddress = async (address) => {
  try {
    if (!address) return null;

    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const encodedAddress = encodeURIComponent(address);

    if (apiKey) {
      const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodedAddress}&format=json`;
      const response = await axios.get(url);
      if (!response.data || response.data.length === 0) return null;
      const { lat, lon } = response.data[0];
      return [parseFloat(lon), parseFloat(lat)];
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    const response = await axios.get(nominatimUrl, {
      headers: {
        'User-Agent': 'AnnSetu-NGO-App/1.0 (contact@example.com)',
        'Accept-Language': 'en',
      },
    });
    if (!response.data || response.data.length === 0) return null;
    const { lat, lon } = response.data[0];
    return [parseFloat(lon), parseFloat(lat)];
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    return null;
  }
};


// // backend/utils/geocode.js
// import axios from "axios";
// // import dotenv from "dotenv";
// // dotenv.config();

// export const getCoordinatesFromAddress = async (address) => {
//   try {
//     const apiKey = process.env.LOCATIONIQ_API_KEY;
//     if (!address) return null;

//     // --- Fallback queries: full address, city only, state+country, country only ---
//     const fallbackQueries = [
//       address,                             // full address
//       address.split(",")[0],               // city only
//       address.split(",").slice(-2).join(","), // state + country
//       address.split(",").slice(-1)[0]      // country only
//     ];

//     // Try each query until we get a valid result
//     for (const query of fallbackQueries) {
//       const encodedQuery = encodeURIComponent(query);
//       const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodedQuery}&format=json`;

//       try {
//         const response = await axios.get(url);

//         // If we got results, return the first one
//         if (response.data && response.data.length > 0) {
//           const { lat, lon } = response.data[0];
//           return [parseFloat(lon), parseFloat(lat)]; // [lng, lat] for MongoDB
//         }
//       } catch (innerError) {
//         console.warn(`Geocoding failed for "${query}": ${innerError.message}`);
//         // continue to next fallback
//       }
//     }

//     // If all fallbacks fail
//     console.warn(`All geocoding attempts failed for address: ${address}`);
//     return null;

//   } catch (error) {
//     console.error("Error fetching coordinates:", error.message);
//     return null;
//   }
// };
