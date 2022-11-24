
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


import {Parser}  from "json2csv";


 const inventoryCsv = async(req, res) => {
 try{
  const getCsvdata =   await prisma.inventoryManagement.findMany(); 
    console.log(getCsvdata);
    let inventryData = [];
   
    getCsvdata.forEach((obj) => {
      const { Item_ID, Asset_Name,Asset_ID,Vendor_Name,Vendor_ID,Asset_Type,Asset_Sub_Type,Asset_Classificatic,Manufact_Name,QR_Code_Availability,QR_Code_Details,Werrenty_Available,Warrenty_Time_Period,Quantity} = obj;
      inventryData.push({ Item_ID, Asset_Name,Asset_ID, Vendor_Name,Vendor_ID,Asset_Type,Asset_Sub_Type,Asset_Classificatic,Manufact_Name,QR_Code_Availability,QR_Code_Details,Werrenty_Available,Warrenty_Time_Period,Quantity});
    });

    const csvFields = ["Item_ID", "Asset_Name", "Asset_ID", "Vendor_Name","Vendor_ID","Asset_Type","Asset_Sub_Type","Asset_Classificatic","Manufact_Name","QR_Code_Availability","QR_Code_Details","Werrenty_Available","Warrenty_Time_Period","Quantity"];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(inventryData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=inventoryManagement.csv");
         res.status(200).end(csvData);
        // res.status(200).send(csvData);

    } catch (error) {
      res.status(500).send({message: "Could not download the file!" });
    }
  } ;

  const referralOnboardCsv =  async(req, res) => {
    try{
     const getCsvdata =   await prisma.referralOnboard.findMany(); 
       console.log(getCsvdata);
       let inventryData = [];
      
       getCsvdata.forEach((obj) => {
         const  {id,Scheme_ID ,referredBy,onboardingThrough,joiningScheme,joiningfeesRecieved,securityAmountRecieved,total,referralContactNumber} = obj;
         inventryData.push({ id,Scheme_ID ,referredBy,onboardingThrough,joiningScheme,joiningfeesRecieved,securityAmountRecieved,total,referralContactNumber});
       });
   
       const csvFields = ["id","Scheme_ID" ,"referredBy","onboardingThrough","joiningScheme","joiningfeesRecieved","securityAmountRecieved","total","referralContactNumber"];
       const csvParser = new Parser({ csvFields });
       const csvData = csvParser.parse(inventryData);
   
       res.setHeader("Content-Type", "text/csv");
       res.setHeader("Content-Disposition", "attachment; filename=refferalOnboard.csv");
           res.status(200).end(csvData);
          //  res.status(200).send({msg:"CsvDownloaded"});
   
       } catch (error) {
         res.status(500).send({
           message: "Could not download the file!" });
       }
     } ;
     
     //personalDetailCsv
     //documentCsv
      
     //referralOnboardCsv
     ///vehicleDetailsCsv
     ///vehicleOwnerCsv
     //guarantorDetailCsv
     //inventoryCsv
     
     const personalDetailCsv =  async(req, res) => {
      try{
       const getCsvdata =   await prisma.persnoalDetails.findMany(); 
         console.log(getCsvdata);
         let inventryData = [];
        
         getCsvdata.forEach((obj) => {
           const  {id,age,maritalStatus,residence,occupationAsDriver,approxMonthlyIncome,otherMonthlyLiab, workingYears,numberOfMember,numberOfEarning,smartPhoneOwner,bankAccount,bankName,noOfChildren,childrenMale,childrenFemale,childrenOther,driverMasterId} = obj;
           inventryData.push({ id,age,maritalStatus,residence,occupationAsDriver,approxMonthlyIncome,otherMonthlyLiab, workingYears,numberOfMember,numberOfEarning,smartPhoneOwner,bankAccount,bankName,noOfChildren,childrenMale,childrenFemale,childrenOther,driverMasterId});
         });
     
         const csvFields = ["id","age","maritalStatus","residence","occupationAsDriver","approxMonthlyIncome","otherMonthlyLiab", "workingYears","numberOfMember","numberOfEarning","smartPhoneOwner","bankAccount","bankName","noOfChildren","childrenMale","childrenFemale","childrenOther","driverMasterId"];
         const csvParser = new Parser({ csvFields });
         const csvData = csvParser.parse(inventryData);
     
         res.setHeader("Content-Type", "text/csv");
         res.setHeader("Content-Disposition", "attachment; filename=personalDetail.csv");
             res.status(200).end(csvData);

         } catch (error) {
           res.status(500).send({
             message: "Could not download the file!" });
         }
       } ;

       const documentCsv =  async(req, res) => {
        try{
         const getCsvdata =   await prisma.document.findMany(); 
           console.log(getCsvdata);
           let inventryData = [];
          
           getCsvdata.forEach((obj) => {
             const  {id,driverPhoto,currentAddressProf,driverLicence,driverLicencePic,AadharCaredPic,panCard,voterId,voterIdPic,driverMasterId} = obj;
             inventryData.push({ id,driverPhoto,currentAddressProf,driverLicence,driverLicencePic,AadharCaredPic,panCard,voterId,voterIdPic,driverMasterId});
           });
       
           const csvFields = ["id","driverPhoto","currentAddressProf","driverLicence","driverLicencePic","AadharCaredPic","panCard","voterId","voterIdPic",'driverMasterId'];
           const csvParser = new Parser({ csvFields });
           const csvData = csvParser.parse(inventryData);
       
           res.setHeader("Content-Type", "text/csv");
           res.setHeader("Content-Disposition", "attachment; filename=documents.csv");
               res.status(200).end(csvData);
              //  res.status(200).send({msg:"CsvDownloaded"});
       
           } catch (error) {
             res.status(500).send({
               message: "Could not download the file!" });
           }
         } ; 

         const vehicleDetailCsv =  async(req, res) => {
          try{
           const getCsvdata =   await prisma.vehicleDetails.findMany(); 
             console.log(getCsvdata);
             let inventryData = [];
            
             getCsvdata.forEach((obj) => {
               const  { id,vehicleType,vehicleRegNo,regValidity,chasisNo,vehicleMake,vehicleModel,purchaseDate,vehicleFinanced,financerName, financerContactNo,insuranceStatus,insuranceUpto,uploadRCdocument,uploadRCdocument2,registeredUnRegistered,driverMasterId} = obj;
               inventryData.push({  id,vehicleType,vehicleRegNo,regValidity,chasisNo,vehicleMake,vehicleModel,purchaseDate,vehicleFinanced ,financerName, financerContactNo,insuranceStatus,insuranceUpto,uploadRCdocument,uploadRCdocument2,registeredUnRegistered,driverMasterId});
             });
         
             const csvFields = [ "id","vehicleType","vehicleRegNo","regValidity","chasisNo","vehicleMake","vehicleModel","purchaseDate","vehicleFinanced" ,"financerName", "financerContactNo","insuranceStatus","insuranceUpto","uploadRCdocument","uploadRCdocument2","registeredUnRegistered","driverMasterId"];
             const csvParser = new Parser({ csvFields });
             const csvData = csvParser.parse(inventryData);
         
             res.setHeader("Content-Type", "text/csv");
             res.setHeader("Content-Disposition", "attachment; filename=vehicleDetail.csv");
                 res.status(200).end(csvData);
                //  res.status(200).send({msg:"CsvDownloaded"});
         
             } catch (error) {
               res.status(500).send({
                 message: "Could not download the file!" });
             }
           } ;  

           const vehicleOwnerCsv =  async(req, res) => {
            try{
             const getCsvdata =   await prisma.vehicleOwner.findMany(); 
               console.log(getCsvdata);
               let inventryData = [];
              
               getCsvdata.forEach((obj) => {
                 const  { id,name,mobileNo,currentAddress,currentAddressArea,currentAddressPinCode,currentAddressCity,currentAddressState,sameAscurrentaddress,permanentAddress,permanentAddressArea,permanentAddressPinCode,permanentAddressCity,permanentAddressState,AdharId,uploadDocument,driverMasterId} = obj;
                 inventryData.push({ id,name,mobileNo,currentAddress,currentAddressArea,currentAddressPinCode,currentAddressCity,currentAddressState,sameAscurrentaddress,permanentAddress,permanentAddressArea,permanentAddressPinCode,permanentAddressCity,permanentAddressState,AdharId,uploadDocument,driverMasterId});
               });
           
               const csvFields = [ "id","name","mobileNo","currentAddress","currentAddressArea","currentAddressPinCode","currentAddressCity","currentAddressState","sameAscurrentaddress","permanentAddress","permanentAddressArea","permanentAddressPinCode",'permanentAddressCity',"permanentAddressState","AdharId","uploadDocument","driverMasterId"];
               const csvParser = new Parser({ csvFields });
               const csvData = csvParser.parse(inventryData);
           
               res.setHeader("Content-Type", "text/csv");
               res.setHeader("Content-Disposition", "attachment; filename=vehicleOwner.csv");
                   res.status(200).end(csvData);
                  //  res.status(200).send({msg:"CsvDownloaded"});
           
               } catch (error) {
                 res.status(500).send({
                   message: "Could not download the file!" });
               }
             } ;
    const guarantorDetailCsv =  async(req, res) => {
        try{
          const getCsvdata =   await prisma.guarantorDetails.findMany(); 
            console.log(getCsvdata);
                 let inventryData = [];
                
                 getCsvdata.forEach((obj) => {
                   const  {id,name,mobileNo,currentAddress,currentAddressArea,currentAddressPinCode,currentAddressCity,currentAddressState,sameAscurrentaddress,permanentAddress,permanentAddressArea,permanentAddressPinCode,permanentAddressCity,permanentAddressState,AdharId,uploadDocument,driverMasterId} = obj;
                   inventryData.push({id,name,mobileNo,currentAddress,currentAddressArea,currentAddressPinCode,currentAddressCity,currentAddressState,sameAscurrentaddress,permanentAddress,permanentAddressArea,permanentAddressPinCode,permanentAddressCity,permanentAddressState,AdharId,uploadDocument,driverMasterId});
                 });
             
                 const csvFields = ["id","name","mobileNo","currentAddress","currentAddressArea","currentAddressPinCode","currentAddressCity","currentAddressState","sameAscurrentaddress","permanentAddress","permanentAddressArea","permanentAddressPinCode","permanentAddressCity","permanentAddressState","AdharId","uploadDocument","driverMasterId"];
                 const csvParser = new Parser({ csvFields });
                 const csvData = csvParser.parse(inventryData);
             
                 res.setHeader("Content-Type", "text/csv");
                 res.setHeader("Content-Disposition", "attachment; filename=guarantorDetail.csv");
                     res.status(200).end(csvData);
                    //  res.status(200).send({msg:"CsvDownloaded"});
             
                 } catch (error) {
                   res.status(500).send({
                     message: "Could not download the file!" });
                 }
               } ;
  



export { inventoryCsv,referralOnboardCsv,personalDetailCsv,documentCsv,vehicleDetailCsv,vehicleOwnerCsv,guarantorDetailCsv};
