const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const PatientData = require('../models/PatientData');

const router = express.Router();

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient data
router.get('/:id/data', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments CRUD
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    res.json(data ? data.appointments : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/appointments', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newAppointment = { ...req.body, id: Date.now().toString() };
    data.appointments.push(newAppointment);
    await data.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/appointments/:appointmentId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      const index = data.appointments.findIndex(a => a.id === req.params.appointmentId);
      if (index !== -1) {
        data.appointments[index] = { ...data.appointments[index], ...req.body };
        await data.save();
        res.json(data.appointments[index]);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/appointments/:appointmentId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      data.appointments = data.appointments.filter(a => a.id !== req.params.appointmentId);
      await data.save();
      res.json({ message: 'Appointment deleted' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Similar for medicalHistory, medications, allergies, emergencyContacts, vitals
// For brevity, I'll add one more example: medical records

router.get('/:id/records', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    res.json(data ? data.medicalHistory : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/records', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newRecord = { ...req.body, id: Date.now().toString() };
    data.medicalHistory.push(newRecord);
    await data.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/records/:recordId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      const index = data.medicalHistory.findIndex(r => r.id === req.params.recordId);
      if (index !== -1) {
        data.medicalHistory[index] = { ...data.medicalHistory[index], ...req.body };
        await data.save();
        res.json(data.medicalHistory[index]);
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/records/:recordId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      data.medicalHistory = data.medicalHistory.filter(r => r.id !== req.params.recordId);
      await data.save();
      res.json({ message: 'Record deleted' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// For doctors: get all patients
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const patients = await User.find({ role: 'Patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Medications CRUD
router.get('/:id/medications', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    res.json(data ? data.medications : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/medications', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newMedication = { ...req.body, id: Date.now().toString() };
    data.medications.push(newMedication);
    await data.save();
    res.status(201).json(newMedication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/medications/:medicationId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      const index = data.medications.findIndex(m => m.id === req.params.medicationId);
      if (index !== -1) {
        data.medications[index] = { ...data.medications[index], ...req.body };
        await data.save();
        res.json(data.medications[index]);
      } else {
        res.status(404).json({ message: 'Medication not found' });
      }
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/medications/:medicationId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      data.medications = data.medications.filter(m => m.id !== req.params.medicationId);
      await data.save();
      res.json({ message: 'Medication deleted' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Allergies CRUD
router.get('/:id/allergies', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    res.json(data ? data.allergies : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/allergies', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newAllergy = { ...req.body, id: Date.now().toString() };
    data.allergies.push(newAllergy);
    await data.save();
    res.status(201).json(newAllergy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/allergies/:allergyId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      const index = data.allergies.findIndex(a => a.id === req.params.allergyId);
      if (index !== -1) {
        data.allergies[index] = { ...data.allergies[index], ...req.body };
        await data.save();
        res.json(data.allergies[index]);
      } else {
        res.status(404).json({ message: 'Allergy not found' });
      }
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/allergies/:allergyId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      data.allergies = data.allergies.filter(a => a.id !== req.params.allergyId);
      await data.save();
      res.json({ message: 'Allergy deleted' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Emergency Contacts CRUD
router.get('/:id/emergencyContacts', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    res.json(data ? data.emergencyContacts : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/emergencyContacts', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newContact = { ...req.body, id: Date.now().toString() };
    data.emergencyContacts.push(newContact);
    await data.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/emergencyContacts/:contactId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      const index = data.emergencyContacts.findIndex(c => c.id === req.params.contactId);
      if (index !== -1) {
        data.emergencyContacts[index] = { ...data.emergencyContacts[index], ...req.body };
        await data.save();
        res.json(data.emergencyContacts[index]);
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/emergencyContacts/:contactId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    if (data) {
      data.emergencyContacts = data.emergencyContacts.filter(c => c.id !== req.params.contactId);
      await data.save();
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Vitals - only add (sorted by date)
router.get('/:id/vitals', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = await PatientData.findOne({ userId: req.params.id });
    const vitals = data ? data.vitals.sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/vitals', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    let data = await PatientData.findOne({ userId: req.params.id });
    if (!data) {
      data = new PatientData({ userId: req.params.id, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
    const newVital = { ...req.body, date: new Date().toISOString().split('T')[0] };
    data.vitals.push(newVital);
    data.vitals.sort((a, b) => new Date(a.date) - new Date(b.date));
    await data.save();
    res.status(201).json(newVital);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
