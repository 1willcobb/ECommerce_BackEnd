const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        {
          model: Category
        },
        {
          model: Tag, 
          as: 'tags'
        },
      ]
    });

    if (!allProducts) {
      return res.status(404).send("No Products Found")
    } 

    res.status(200).json({message: "Success", allProducts})
  } catch(err){
    console.log(err)
    res.status(500).send("Sever Error")
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model:Category
        },
        {
        model: Tag, 
        as: 'tags'
      }]
    })

    if (!product) {
      return res.status(404).send("No Product Found")
    } 

    res.status(200).json({message: "Success", product})
  }catch(err){
    console.log(err)
    res.status(500).send("Sever Error")
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const product = await Product.create(req.body)

      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          console.log(tag_id)
          return {
            product_id: product.dataValues.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }

      res.status(200).send("Successfully added new Product")
    } catch(err) {
      console.log(err)
      res.status(400).send("Server Err");
    }
  });

// update product
router.put('/:id', async (req, res) => {
  try {
    const productUpdate = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    const product = req.body

    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({Message: "Success", product});
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const destroyedProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    })

    if (destroyedProduct === 0) {
      res.status(404).send("Product Not Found")
    } 

    res.status(200).send(`Successfully deleted product`)
  } catch(err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});



module.exports = router;
