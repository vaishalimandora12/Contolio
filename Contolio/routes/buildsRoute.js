const buildingController=require('../controllers/buildingsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router()

// console.log('hiiiii');
router.post('/addBuildings', middleware,buildingController.addBuildings);
router.get('/getBuildingDetails',middleware,buildingController.getBuildingDetails);
router.get('/getBuildings',middleware,buildingController.getBuildings);
router.delete('/deleteBuilding',middleware,buildingController.deleteBuilding);
router.patch('/editBuilding',middleware,buildingController.editBuilding);
router.patch('/updateStatus',middleware,buildingController.updateStatus);
router.get('/searchBuildings',middleware,buildingController.searchBuildings);

module.exports = router;