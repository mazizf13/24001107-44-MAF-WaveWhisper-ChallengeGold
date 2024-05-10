const ErrorHandler = require("./ErrorHandler");
const baseUrl = "https://geocode.search.hereapi.com/v1/geocode?";
const apiKey = "YdTEzRRe60yEV6rCRxyOoBpyn_rPqSXa_RgD4YrqoK0";

module.exports.geocode = async (address) => {
  const url = `${baseUrl}q=${address}&limit=1&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items || !data.items[0]) {
      throw new Error("Geocoding failed for address: " + address);
    }
    return data.items[0];
  } catch (error) {
    throw new ErrorHandler(error.message + " - Address: " + address, 500);
  }
};
