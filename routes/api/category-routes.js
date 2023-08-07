const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories including its associated Products
router.get('/', async (req, res) => {
  try {
    

    res.status(200).send("Success")
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// find one category by its `id` value including its associated Products
router.get('/:id', (req, res) => {

  try {
    res.status(200).send("Success")
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// create a new category
router.post('/', (req, res) => {
  try {
    res.status(200).send("Success")
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  try {
    res.status(200).send("Success")
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// delete a category by its `id` value
router.delete('/:id', (req, res) => {
  try {
    res.status(200).send("Success")
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

module.exports = router;
