const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Goal = require('../models/Goal');

// POST: Crear un aporte
router.post('/', async (req, res) => {
  try {
    const { goalId, amount, note } = req.body;

    // Validar que la meta exista
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ error: 'Meta no encontrada' });

    // Crear y guardar el aporte
    const contribution = new Contribution({ goalId, amount, note });
    await contribution.save();

    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el aporte', details: error.message });
  }
});

// GET: Obtener aportes de una meta
router.get('/goal/:goalId', async (req, res) => {
  try {
    const contributions = await Contribution.find({ goalId: req.params.goalId });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener aportes' });
  }
});

// DELETE: Eliminar un aporte
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contribution.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Aporte no encontrado' });
    res.json({ message: 'Aporte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el aporte' });
  }
});

router.get('/progress/:goalId', async (req, res) => {
  try {
    const goalId = req.params.goalId;

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ error: 'Meta no encontrada' });

    const contributions = await Contribution.find({ goalId });
    const total = contributions.reduce((sum, c) => sum + c.amount, 0);

    const progress = Math.min((total / goal.targetAmount) * 100, 100).toFixed(2); // Máx 100%

    res.json({
      goalId,
      titulo: goal.title,
      totalAportado: total,
      montoObjetivo: goal.targetAmount,
      porcentajeAvance: progress
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el progreso', details: error.message });
  }
});


module.exports = router;
