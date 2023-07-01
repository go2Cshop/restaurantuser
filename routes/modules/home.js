const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/Restaurant")


// 瀏覽全部餐廳
router.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})


module.exports = router
