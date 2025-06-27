const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Contribution = require('../models/Contribution');

// POST: Crear una nueva meta
router.post('/', async (req, res) => {
  try {
    const { title, targetAmount, imageUrl } = req.body;
    const goal = new Goal({ title, targetAmount, imageUrl });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la meta', details: error.message });
  }
});

// GET: Obtener todas las metas
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metas' });
  }
});

// GET: Obtener una meta por ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Meta no encontrada' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la meta' });
  }
});

// PUT: Actualizar una meta
router.put('/:id', async (req, res) => {
  try {
    const { title, targetAmount, imageUrl } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { title, targetAmount, imageUrl },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Meta no encontrada' });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la meta' });
  }
});

// DELETE: Eliminar una meta
router.delete('/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) return res.status(404).json({ error: 'Meta no encontrada' });

    await Contribution.deleteMany({ goalId: req.params.id });

    res.json({ message: 'Meta y aportes eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar meta' });
  }
});

module.exports = router;

