import { ICar, ICarAttribute } from "@interfaces/Icar";
import { query } from "express";
import puppeteer from "puppeteer";

export const fetchAndConvertLecabData = async (): Promise<ICar[]> => {
  try {
    // Initial request (that gets redirected)
    const response = await fetch(
      "https://store.lecab.se/api/products?limit=999",
      {
        method: "GET",
        headers: {
          Accept: "application/json", // Expecting JSON response
        },
        redirect: "manual", // Handle redirects manually
      }
    );

    // Check if we received a 307 status code
    if (response.status === 307) {
      // Extract the location from the response headers
      const redirectUrl = response.headers.get("Location");

      if (!redirectUrl) {
        throw new Error("[lecaberror] Redirect URL is missing");
      }

      // Extract the cookie from the 'set-cookie' header
      const cookie = response.headers.get("set-cookie");

      // Extract token value from cookie string (if exists)
      const cookieValue = cookie ? cookie.split(";")[0] : "";

      // Make a follow-up request to the redirected URL with the cookie included
      const redirectedResponse = await fetch(
        `https://store.lecab.se${redirectUrl}`,
        {
          method: "GET", // Ensure it's a GET request
          headers: {
            Cookie: cookieValue, // Pass the token cookie
            Accept: "application/json", // Expecting JSON
          },
        }
      );

      if (!redirectedResponse.ok) {
        throw new Error(
          `[lecaberror]Redirected request failed with status: ${redirectedResponse.status}`
        );
      }

      const data = await redirectedResponse.json();
      // Convert the data using your convertData function
      const convertedData = convertData(data.items);
      return convertedData;
    } else if (response.ok) {
      // Handle if no redirect and the initial response was successful
      const data = await response.json();

      // Convert the data using your convertData function
      const convertedData = convertData(data.items);
      return convertedData;
    } else {
      console.error(
        `[lecaberror]Initial request failed with status: ${response.status}`
      );
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("[lecaberror]Error fetching data:", error);
    return []; // Ensure function always returns an empty array in case of failure
  }
};

const reformatPrice = (price: number) => {
  return price / 100;
};

const convertData = async (data: any[]): Promise<ICar[]> => {
  // Collect all car URLs for batch processing
  const carUrls = data.map((car) => car.url);

  // Fetch equipment details for all car URLs in a single request
  const equipmentData = await getEquipment(carUrls);

  // Use Promise.all to handle async operations inside the map
  return await Promise.all(
    data.map(
      async (car: any, index: number): Promise<ICar> => ({
        id: car.id,
        sku: car.sku,
        name: car.name,
        price: reformatPrice(car.price),
        regularPrice: reformatPrice(car.regularPrice),
        campaign: car.campaign,
        monthlyCost: reformatPrice(car.monthlyCost),
        brand: car.brand.name,
        leasingCost: reformatPrice(car.leasingCost),
        quantity: car.quantity,
        image: car.defaultImage?.image || "default-image-url",
        vatValue: reformatPrice(car.vatValue),
        stockStatus: {
          buyable: car.stockStatus?.buyable ?? false,
          name: car.stockStatus?.name ?? "Unknown",
        },
        // Map car URL to equipment data with highlights and equipment
        equipment: equipmentData[carUrls.indexOf(car.url)],
        attributes: (car.attributes || []).map(
          (attribute: any): ICarAttribute => ({
            id: attribute.id,
            name: attribute.name,
            value: attribute.value,
          })
        ),
      })
    )
  );
};

async function getEquipment(carUrls: string[]): Promise<any[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const equipmentResults: any[] = [];

  for (const [index, carUrl] of carUrls.entries()) {
    console.log(
      `[server]: fetching equipment data for ${carUrl}: ${index + 1} of ${
        carUrls.length
      } `
    );
    await page.goto("https://store.lecab.se/" + carUrl, {
      waitUntil: "networkidle2", // Ensure the page is fully loaded
    });

    page.on("console", (msg) => {
      console.log(`[browser console]: ${msg.text()}`);
    });

    // Wait for the body to be loaded (to confirm the page is rendered)
    await page.waitForSelector("body", { visible: true });

    // Simulate interaction to open collapsible div
    await page.evaluate(() => {
      const collapsibleDiv = document.querySelector(
        'section div div h3 [id^="radix"][data-state="closed"]'
      ) as HTMLButtonElement;
      const button = document.querySelector(
        "section div div h3 button"
      ) as HTMLButtonElement;
      if (collapsibleDiv && button) {
        collapsibleDiv.setAttribute("data-state", "open");
        button.click();
        collapsibleDiv.click();
      }
    });

    // Wait for the content inside the collapsible div to be visible
    // You might need to adjust the selector here to match the exact dynamic content that appears
    await page.waitForSelector('section div div [id^="radix"] div.pt-0', {
      visible: true,
    });

    // Extract dynamic data from the collapsible list
    const dynamicData = await page.evaluate(() => {
      const container = document.querySelector(
        'section div div [id^="radix"] div.pt-0'
      ) as HTMLElement;
      const items = Array.from(container.querySelectorAll("ul li.flex"));

      return items
        .map((item: any) => {
          const icon = item.querySelector("svg") ? true : false;

          // Extract the text content before the <p> tag (for 'type')
          let type: string | null = item
            ? item.innerText.trim().split(" ")[0].split("\n")[0]
            : null;
          // Extract text content inside the <p> tag (for 'text')
          const text = item.querySelector("p")
            ? item.querySelector("p")?.textContent?.trim() // Get the content inside the <p> tag
            : null;

          if (!type && !text) {
            return;
          }

          return { type, text, icon }; // Return structured object with type, text, and icon
        })
        .filter((item) => item !== undefined); // Filter out undefined items
    });

    // Filter out unwanted items from dynamic data
    const filteredDynamicData = dynamicData.filter((item: any) => {
      const excludedTexts = [
        "Köp bil",
        "Bilägande",
        "För Företag",
        "Erbjudanden",
        "Sälj bil",
        "Hyr bil",
      ];
      return !excludedTexts.includes(item.text); // Filter out excluded items
    });

    // Wait for and extract static data
    const staticData = await page.evaluate(() => {
      const listItems = document.querySelectorAll("ul.flex li");
      return Array.from(listItems)
        .map((item: any) => {
          const type = item.querySelector("div")?.textContent.trim();
          const text = item
            .querySelector("div")
            ?.nextElementSibling?.textContent.trim();
          const icon = item.querySelector("svg") ? true : false;

          if (!type && !text) {
            return; // Skip if no type or text found
          }

          return { type, text, icon }; // Return structured object with type, text, and icon
        })
        .filter((item) => item !== undefined); // Filter out undefined items
    });

    // Push the results to the results array
    equipmentResults.push({
      equipment: filteredDynamicData,
      highlights: staticData,
    });

    // Optionally, wait before moving to the next car URL if necessary
    // await page.waitForTimeout(2000);  // Uncomment if you want a small delay between requests
  }

  await browser.close();

  return equipmentResults;
}
