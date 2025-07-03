const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_API_URL = "https://m.kbchachacha.com/public/web/search/infinitySearch.json";
const DATA_FILE = path.join(__dirname, "felixCars.json");
const PAGES_TO_FETCH = 3;
const PAGE_SIZE = 30;

// Helper to build full image URLs
function buildImageUrls(fileNameArray) {
  if (!Array.isArray(fileNameArray)) return [];
  return fileNameArray.map(fileName => {
    const [carSeq] = fileName.split("_");
    const first4 = carSeq.slice(0, 4);
    const lastDigit = first4.slice(-1);
    let folder1 = `img0${lastDigit}`;
    const folder2 = `img${first4}`;
    // If folder2 ends with '0', use img10 instead of img00
    if (folder2.endsWith('0')) {
      folder1 = 'img10';
    }
    return `https://img.kbchachacha.com/IMG/carimg/l/${folder1}/${folder2}/${fileName}`;
  });
}

// Main function to fetch and save cars from multiple pages
async function updateCarData() {
  try {
    let allCars = [];
    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      const url = `${BASE_API_URL}?page=${page}&pageSize=${PAGE_SIZE}`;
      console.log(`🚗 Fetching car data from page ${page}...`);
      const response = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      // Get the car list
      const list = response.data?.result?.hits;
      if (!Array.isArray(list) || list.length === 0) {
        console.warn(`⚠️ No car data found on page ${page}.`);
        continue;
      }

      // Show a sample car object for debugging (only for first page)
      if (page === 1) {
        console.log("DEBUG: First car object:", list[0]);
      }

      const cars = list.map(item => ({
        carSeq: item.carSeq || '',
        manufacturer: item.makerName || '',
        model: item.modelName || '',
        className: item.className || '',
        carName: item.carName || '',
        year: item.yymm || '',
        price: item.sellAmt || '',
        mileage: item.km || '',
        fuelType: item.gasName || '',
        transmission: item.gearType || '',
        color: item.colorCodeName || '',
        carStatus: item.adState || '',
        vin: item.vin || '',
        options: item.optionCodeArray || [],
        optionNames: item.optionNameArray || [],
        description: `${item.modelName || ''} ${item.className || ''}`.trim(),
        images: buildImageUrls(item.fileNameArray),
        carDesc: item.carDesc || '',
        shopName: item.shopName || '',
        tbShopCityCodeName2: item.tbShopCityCodeName2 || '',
        tbDanjiInfoZipAddr: item.tbDanjiInfoZipAddr || '',
        tbShopAddr: item.tbShopAddr || '',
      }));

      allCars = allCars.concat(cars);
    }

    if (allCars.length === 0) {
      console.error("❌ No car data found in all pages.");
      return;
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(allCars, null, 2), "utf-8");
    console.log(`✅ Saved ${allCars.length} cars to ${DATA_FILE}`);
  } catch (error) {
    console.error("❌ Error updating car data:", error.message);
  }
}

// If run directly, update the data
if (require.main === module) {
  updateCarData();
}

// Export for use in an Express route or elsewhere
module.exports = { updateCarData, DATA_FILE };