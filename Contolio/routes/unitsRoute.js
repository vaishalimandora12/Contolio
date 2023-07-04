const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/unitsController');
const middleware = require('../middleware/middlewareUser');
const upload = require('../upload/upload');


router.post('/addUnits', middleware, unitsController.addUnits);
router.get('/viewAvUnitDetails', middleware, unitsController.viewAvUnitDetails);
router.get('/showAvUnits', middleware,unitsController.showAvUnits);
router.patch('/editUnit', middleware, unitsController.editUnit);
router.delete('/deleteUnit', middleware, unitsController.deleteUnit);
router.post('/addAvUnits', middleware, upload.single('upload_image'), unitsController.addAvUnits);

module.exports = router;


