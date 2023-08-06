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

    if (allProducts == 0) {
      return res.status(404).send("Not Found")
    } 

    // THIS IS A BONUS FUNCTION I DECIDED TO ADD
    const mappedProduct = allProducts.map((product)=> {
      return {
        ...product.get({ plain: true }), 
          tags: product.tags.map((tag)=>{
            return tag.tag_name
          }),
          category: product.category.category_name
      }
    })

    res.status(200).json(mappedProduct)
  } catch(err){
    console.log(err)
    res.status(500).send("Sever Error")
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id, {
      include: [
        {
          model:Category
        },
        {
        model: Tag, 
        as: 'tags'
      }]
    })

    if (!item) {
      return res.status(404).send("Not Found")
    } 
    
    res.status(200).json({item})
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
      res.status(400).json(err);
    }
  });

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
