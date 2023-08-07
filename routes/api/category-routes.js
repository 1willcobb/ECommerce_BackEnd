const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories including its associated Products
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: {
        model: Product
      }
    })

    if (!allCategories) {
      res.status(404).send("No Categories Found")
    }

    res.status(200).json(allCategories)
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// find one category by its `id` value including its associated Products
router.get('/:id', async (req, res) => {
  try {
    const singleCategory = await Category.findByPk(req.params.id, {
      include: {
        model: Product
      }
    })

    if (!singleCategory) {
      res.status(404).send("No Category Found")
    }

    res.status(200).json(singleCategory)
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const previousCategory = await Category.findAll({
      where: {
        category_name: req.body.category_name
      }
    })

    if (previousCategory.length > 0) {
      res.status(400).send("Category Exists Already")
    } else {
      await Category.create(req.body)
      res.status(200).send(`Successfully created new Category ${req.body.category_name}`)
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)

    if (!category) {
      res.status(404).send("Category not found")
    } else {
      await Category.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.status(200).json({message: "Success", category })
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)

    if (!category) {
      res.status(404).send("Category not found")
    } else {
      await Category.destroy({
        where: {
          id: req.params.id
        }
      })
      res.status(200).json({message: "Successfully deleted", category})
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

module.exports = router;
