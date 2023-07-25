const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/unitsController');
const middleware = require('../middleware/middlewareUser');
const upload = require('../upload/upload');


router.post('/addUnits', middleware, unitsController.addUnits);
router.get('/viewAvUnitDetails', middleware, unitsController.viewAvUnitDetails);
router.get('/showAvUnits', middleware,unitsController.showAvUnits);
router.patch('/editAvUnit', middleware, upload.single('upload_image'),unitsController.editAvUnit);
router.delete('/deleteUnit', middleware, unitsController.deleteUnit);
router.post('/addAvUnits', middleware, upload.single('upload_image'), unitsController.addAvUnits);
router.get('/showUnits',middleware,unitsController.showUnits);
router.put('/editShowUnits',middleware,unitsController.editShowUnits);
router.delete('/deleteShowUnit',middleware,unitsController.deleteShowUnit);
router.get('/searchAvUnits',middleware,unitsController.searchAvUnits);

module.exports = router;


