
// import { time } from "console";
import multer from "multer";
// var time=new time();
var date = new Date();
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();
  var hh=date.getHours().toString();
  var min=date.getMinutes().toString();
  var sec=date.getSeconds().toString()

  var mmChars = mm.split('');
  var ddChars = dd.split('');
  var hhChars = hh.split('');
  var minChars = min.split('');
  var secChars = sec.split('');
  

  date = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-'
   + (ddChars[1]?dd:"0"+ddChars[0])+ '_' 
   +(hhChars[1]?hh:"0"+hhChars[0])+ '-'
   +(minChars[1]?min:"0"+minChars[0])+ '-'
   +(secChars[1]?sec:"0"+secChars[0])
//!for uploding csv
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};
var storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    // console.log(file)
    cb(null,file.fieldname+"/uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    // cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
    cb(null, `${file.originalname}_${date}`);

  },
});
var uploadFile = multer({ storage: storage, fileFilter: csvFilter });

export {uploadFile}
