const Skill = require("../models/skills")

const Joi = require("joi");
const _ = require('lodash');
require('express-async-errors');

//* is working
const skill_create = async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const skills = await new Skill({
    ...req.body,
    person: req.admin._id
  })

  try {
    await skills.save()
    res.status(201).send(skills);
  } catch (ex) {
    console.log(ex)
    for (feild in ex.errors) res.status(400).json(ex.errors[feild].message);
  }
};

//* is working
const view_byId = async (req, res) => {
  const _id = req.params.id
  try {
    const skills = await Skill.findOne({_id, person:req.admin._id});    
    if(!skills) return res.status(404).send('not found any skills for you');

    return res.status(200).send(_.pick(skills, ['name', 'level','about']))
  } catch (ex) {
    for (feild in ex.errors) res.status(400).json(ex.errors[feild].message);
  }
};

//* is working
const view_all = async(req, res) => {
  try{

    await req.admin.populate('myskills')
    if(req.admin.myskills == "") return res.status(200).send('You dosen\'t have any skills')

    res.status(200).send(req.admin.myskills)
  }catch(ex){
    console.log(ex);
    for (feild in ex.errors) res.status(400).json(ex.errors[feild].message);

  }
}

//* is working
const skill_update = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'level','about'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) return res.status(400).send({Error:'Invalid updates.!'})

    try {
    const skill = await Skill.findOne({_id:req.params.id, person: req.admin._id })
    if(!skill) return res.status(404).send('oops Not founded !!')

    updates.forEach((update) => skill[update] = req.body[update])
    await skill.save();
    res.status(200).send(skill) //*updated successfully.
  } catch (ex) {
    console.log(ex)
    for (feild in ex.errors) res.status(400).json(ex.errors[feild].message);
  }
};


//! feature Api's 

//*Search
//*delete







//validation functions.
function validation(skill) {
  const schema = Joi.object({
    name: Joi.string().required(),
    level: Joi.number().integer().required(),
    about: Joi.string().required(),
    person: Joi.string()
  });

  return schema.validate(skill);
}

module.exports = {
  skill_create,
  view_byId,
  view_all,
  skill_update
};
