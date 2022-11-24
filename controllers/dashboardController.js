import qrcode from "qrcode";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { BadRequestError } from "../errors/index.js";
import { Console } from "console";

async function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

const qrGenrator = async (req, res, next) => {
  // const {input} = req.body;
  // if(!input){
  //     throw new BadRequestError('Please enter value to generate QR code')
  // }
  const user = await prisma.driver.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }

  console.log(user.driverOldId);
  qrcode.toDataURL(user.driverOldId, (err, src) => {
    if (err) res.send("Something went wrong!!");
    res.status(200).json(src);
    // console.log(src);
    // res.status(200).send(src);
  });
};

const postDealerDataCoordinates = async (req, res) => {
  let { lat2, lon2 } = req.body;

  const user = await prisma.driver.findUnique({
    where: {
      id: 1,
    },
  });

  console.log("User Info >>>", user);
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const dealer = await prisma.DealerData.findMany();

  console.log("dealer >>>>>", dealer);
  let latitude, longitude;
  let allMeeting = [];
  for (let i = 0; i <= dealer.length - 1; i++) {
    //  console.log(dealer.length)
    latitude = dealer[i].coordinates.split(", ")[0];
    longitude = dealer[i].coordinates.split(", ")[1];
    allMeeting.push({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      distance: 0,
      id: dealer[i].id,
      bssCode: dealer[i].bssCode,
      bss: dealer[i].bss,
      address: dealer[i].address,
      city: dealer[i].city,
      state: dealer[i].state,
      countryName: dealer[i].countryName,
      pincode: dealer[i].pincode,
    });
  }
  console.log("allMeeting >>>>", allMeeting);
  for (let i = 0; i <= allMeeting.length - 1; i++) {
    let disBetween = await distance(allMeeting[i].latitude, allMeeting[i].longitude, lat2, lon2, "K");
    allMeeting[i].distance = disBetween;
    console.log("disBetween >>>", disBetween);
  }

  let countShop5km = 0;
  let countShop2km = 0;
  let countShop15km = 0;
  for (let i = 0; i <= allMeeting.length - 1; i++) {
    if (allMeeting[i].distance <= 5) {
      countShop5km++;
    }
    if (allMeeting[i].distance <= 2) {
      countShop2km++;
    }
    if (allMeeting[i].distance <= 15) {
      countShop15km++;
    }
  }
  // countShop15km = 15;
  console.log("countShop5km >>", countShop5km);
  console.log("countShop2km >>", countShop2km);
  console.log("countShop15km >>", countShop15km);
  let shopUnder2km = [];
  let shopUnder5km = [];

  let stations = [];
  if ((countShop2km == 0) & (countShop5km == 0) && countShop15km == 0) {
    res.status(200).json({ stations });
    return;
  }
  if (countShop2km >= 5) {
    for (let i = 0; i <= allMeeting.length - 1; i++) {
      if (allMeeting[i].distance <= 2) {
        stations.push(allMeeting[i]);
      }
    }
    res.status(200).json({ radius: "2km", stations });
    //console.log(shopUnder5km)
  } else if (countShop5km >= 5) {
    for (let i = 0; i <= allMeeting.length - 1; i++) {
      if (allMeeting[i].distance <= 5) {
        stations.push(allMeeting[i]);
      }
    }
    shopUnder5km: stations;
    res.status(200).send({ radius: "5km", stations });
    //console.log(shopUnder5km)
  } else if (countShop15km >= 5) {
    //let shopUnder15km=[]
    for (let i = 0; i <= allMeeting.length - 1; i++) {
      if (allMeeting[i].distance <= 15) {
        stations.push(allMeeting[i]);
      }
    }
    res.status(200).json({ radius: "15km", stations });
  } else {
    for (let i = 0; i <= allMeeting.length - 1; i++) {
      if (allMeeting[i].distance <= 20) {
        stations.push(allMeeting[i]);
      }
    }
    res.status(200).json({ radius: "20km", stations });

    let countShop = 0;
    for (let i = 0; i <= allMeeting.length - 1; i++) {
      if (allMeeting[i].distance <= 5) {
        countShop++;
      }
    }
    let shopUnder5km = [];
    if (countShop > 5) {
      for (let i = 0; i <= allMeeting.length - 1; i++) {
        if (allMeeting[i].distance <= 5) {
          shopUnder5km.push(allMeeting[i]);
        }
      }
      res.status(200).json(shopUnder5km);
      //console.log(shopUnder5km)
    } else {
      let shopUnder15km = [];
      for (let i = 0; i <= allMeeting.length - 1; i++) {
        if (allMeeting[i].distance <= 15) {
          shopUnder15km.push(allMeeting[i]);
        }
      }
      res.status(200).json(shopUnder15km);
    }
    // res.status(200).json(allMeeting);
    // console.log(allMeeting)
  }
};

export { qrGenrator, postDealerDataCoordinates };
