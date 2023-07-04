const express = require('express')
const multer = require('multer');
const path = require("path");


// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "../storeImage");
//     },
//     filename: function (req, file, callback) {
//         callback(null, Date.now() + "-" + file.data);
//     },
// });
// const upload = multer({ storage });
// console.log(upload,"=======upload")
// module.exports = upload;

const multerLocalConfig = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'storeImage/images')
    },

    filename: (req, file, cb) => {
        // console.log('heyyyyyyy',req.files);  //test
        // const name = file.originalname;
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: multerLocalConfig, limits: 100000 });

module.exports = upload;


