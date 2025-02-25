import { ICar, ICarAttribute } from "@interfaces/Icar";

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
  const newPrice = price.toString().slice(0, -2);
  const reformatedPrice = new Intl.NumberFormat("sv-SW", {
    useGrouping: true,
    minimumFractionDigits: 0,
  })
    .format(+newPrice)
    .replace(/,/g, " ");
  console.log(reformatedPrice);

  return reformatedPrice;
};

const convertData = (data: any[]): ICar[] => {
  return data.map(
    (car: any): ICar => ({
      id: car.id,
      sku: car.sku,
      name: car.name,
      price: reformatPrice(car.price),
      regularPrice: car.regularPrice,
      campaign: car.campaign,
      monthlyCost: car.monthlyCost,
      brand: car.brand.name,
      leasingCost: car.leasingCost,
      quantity: car.quantity,
      image: car.defaultImage?.image || "default-image-url",
      vatValue: car.vatValue,
      stockStatus: {
        buyable: car.stockStatus?.buyable ?? false,
        name: car.stockStatus?.name ?? "Unknown",
      },
      attributes: (car.attributes || []).map(
        (attribute: any): ICarAttribute => ({
          id: attribute.id,
          name: attribute.name,
          value: attribute.value,
        })
      ),
    })
  );
};
