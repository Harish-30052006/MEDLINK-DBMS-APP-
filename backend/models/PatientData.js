const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  condition: String,
  diagnosisDate: String,
  status: { type: String, enum: ['Ongoing', 'Resolved'] },
  doctor: String,
  notes: String,
});

const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  startDate: String,
  endDate: String,
  prescribingDoctor: String,
});

const allergySchema = new mongoose.Schema({
  type: String,
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
  reaction: String,
  notes: String,
});

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String,
  email: String,
});

const appointmentSchema = new mongoose.Schema({
  doctorName: String,
  specialization: String,
  date: String,
  time: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Canceled'] },
});

const vitalSchema = new mongoose.Schema({
  date: String,
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  heartRate: Number,
  sugarLevel: Number,
  temperature: Number,
});

const patientDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicalHistory: [medicalRecordSchema],
  medications: [medicationSchema],
  allergies: [allergySchema],
  emergencyContacts: [emergencyContactSchema],
  appointments: [appointmentSchema],
  vitals: [vitalSchema],
}, { timestamps: true });

module.exports = mongoose.model('PatientData', patientDataSchema);
