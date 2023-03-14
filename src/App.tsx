import Invoice from "./components/Invoice";
import { ITableData } from "./types/api_types";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const App = () => {
  // const [dataFromApi, setData] = useState<any>([]);
  // array to hold to data in ITableData format that Invoice component will use
  const [shipperInfo, setShipperInfo] = useState<ITableData[]>([]);
  // string to hold the name of the shipper being searched
  const [shipperName, setShipperName] = useState<string>("");
  // bool to hold the value of a submitted form
  // const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const getData = async (shipperName: string) => {
    // open data/data.json and set it to data
    const BASE_URL = import.meta.env.VITE_APP_URL;
    const API_URL = BASE_URL + shipperName;

		
		let dataFromApi: any = [];
		// make API Call to API_URL
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": import.meta.env.VITE_SubKEY,
        // "key": "b45fca878b9f4c9599313cb223f39227",
        // "clientKey" : "b45fca878b9f4c9599313cb223f39227"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetch Response ", data);
				console.log("Data is set");
				dataFromApi = data;
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

		return dataFromApi;
  };

  // useEffect(() => {
  //   if (isSubmitted) {
  //     const fecthData = async () => {
  //       await getData(shipperName);
  //     };
  //     fecthData().then(() => {
	// 			console.log("Data fetched");
	// 			formatDataIntoITableData();
	// 		});
  //     setIsSubmitted(false);
  //   }
  // }, [isSubmitted]);

  const formatDataIntoITableData = (dataFromApi: any) => {
    console.log("We got: ", dataFromApi);

    // check if data is {}
    if (Object.keys(dataFromApi).length === 0) {
      setShipperInfo([]);
      return;
    }

    let tempData: ITableData[] = [];
    let tableData = dataFromApi.Data[0].Received;
    for (const i in tableData) {
      const date = tableData[i].Date;
      const warehouseID = tableData[i].WarehouseID;
      const shippingPO = tableData[i].ShippingPO;
      const shipmentID = tableData[i].ShipmentID;
      const boxesRcvd = tableData[i].BoxesRcvd;
      tempData.push({
        date,
        warehouseID,
        shippingPO,
        shipmentID,
        boxesRcvd,
      });
    }
    setShipperInfo(tempData);
    return;
  };

  const handleChange = (event: any) => {
    setShipperName(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
		const fecthData = async () => {
			let dataFromApi = await getData(shipperName);
			formatDataIntoITableData(dataFromApi);
		};
		fecthData();
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", flexDirection: "row", padding: "1rem" }}
      >
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h3" gutterBottom>
            Warehouse Invoicing System
          </Typography>
        </Grid>
        <Grid xs={12} md={3}>
          <Typography variant="h5" gutterBottom>
            Select a Shipper Name (Eg - Etsy, Shopify, KashMoney)
          </Typography>
          <div style={{ width: "100%" }}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                value={shipperName}
                onChange={(e) => handleChange(e)}
              />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </Grid>

        <Grid sx={{ width: 1000, marginLeft: 20 }}>
          <Typography variant="h5" gutterBottom sx={{ paddingLeft: "35%" }}>
            Invoicing Table
          </Typography>
          {shipperInfo && shipperInfo.length !== 0 ? (
            <Invoice shipperInfo={shipperInfo} />
          ) : (
            <Typography
              variant="h6"
              gutterBottom
              sx={{ paddingLeft: "35%", paddingTop: "2%" }}
            >
              Enter valid Shipper name
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
