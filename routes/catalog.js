var express = require('express');
var router = express.Router();
var phoneController = require("../controllers/phoneController")
var categoryController = require("../controllers/categoryController")


router.get("/", (req,res) => {
    res.render("index", {title: "index"})
})
/* GET home page. */
router.get('/phones', phoneController.phoneList);
router.get('/phone/:id', phoneController.phoneDetail);

router.get('/phones/create', phoneController.createPhoneGet);
router.post('/phones/create', phoneController.createPhonePost);


router.get('/phone/:id/delete', phoneController.deletePhoneGet);
router.post('/phone/:id/delete', phoneController.deletePhonePost);


router.get('/phone/:id/update', phoneController.updatePhoneGet);
router.post('/phone/:id/update', phoneController.updatePhonePost);


//categories routes
router.get('/categories', categoryController.categoryList);
router.get('/category/:name', categoryController.categoryDetail);

router.get('/categories/create', categoryController.createCategoryGet);
router.post('/categories/create', categoryController.createCategoryPost);


router.get('/category/:name/delete', categoryController.deleteCategoryGet);
router.post('/category/:name/delete', categoryController.deleteCategoryPost);


router.get('/category/:name/update', categoryController.updateCategoryGet);
router.post('/category/:name/update', categoryController.updateCategoryPost);



module.exports = router;
