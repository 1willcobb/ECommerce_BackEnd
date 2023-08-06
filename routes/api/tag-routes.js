const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

  // find all tags w/ product info
router.get('/', async (req, res) => {

  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product
        }
      ]
    })

    res.status(200).json(tags)
  }catch(err){
    console.log(err)
    res.status(500).send("sever error")
  }
});

// find a single tag by its `id` with product info
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product
        }
      ]
    })

    res.status(200).json(tag)
  }catch(err){
    console.log(err)
    res.status(500).send(err)
  }
  

// create a new tag
router.post('/', async (req, res) => {
    try {
      await Tag.create(req.body)

      res.status(200).send(`Successfully created "${req.body.tag_name}" tag`)
    }catch(err){
      console.log(err)
      res.status(500).send("sever error")
    }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).send("Tag not found");
    }

    const [affectedTags] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affectedTags > 0) {
      return res.status(200).send(`Successfully updated tag with the id of ${req.params.id}`);
    } else {
      return res.status(404).send("No changes were made to the tag.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tag) {
      res.status(404).send("Tag not found");
    } else {
      res.status(200).send(`Tag with id of ${req.params.id} deleted`)
    }


    
  }catch(err){
    console.log(err);
    res.status(500).send("server error");
  }
});

module.exports = router;
