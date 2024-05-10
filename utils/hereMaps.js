const ErrorHandler = require("./ErrorHandler");
const baseUrl = "https://geocode.search.hereapi.com/v1";
const apiKey = "YdTEzRRe60yEV6rCRxyOoBpyn_rPqSXa_RgD4YrqoK0";

const geocode = async (address) => {
  const url = `${baseUrl}/geocode?q=${encodeURIComponent(
    address
  )}&limit=1&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error("Geocoding failed for address: " + address);
    }
    return data.items[0];
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

const geojson = async (address) => {
  try {
    const { position } = await geocode(address);
    return {
      type: "Point",
      coordinates: [position.lat, position.lng],
    };
  } catch (error) {
    throw new ErrorHandler(error.message, 500);
  }
};

module.exports = { geocode, geojson };
