
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Seed database with initial data (call this once via POST /api/seed)
app.post('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const PatientData = require('./models/PatientData');

    // Check if already seeded
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Database already seeded' });
    }

    // Create patient user
    const hashedPatientPassword = await bcrypt.hash('password123', 10);
    const patientUser = new User({
      name: 'John Doe',
      dob: '1990-01-01',
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'testpatient@medlink.com',
      address: '123 Main St, Anytown, 12345',
      bloodGroup: 'O+',
      role: 'Patient',
      password: hashedPatientPassword,
    });
    await patientUser.save();

    // Create patient data
    const patientData = new PatientData({
      userId: patientUser._id,
      medicalHistory: [
        {
          id: 'rec1',
          condition: 'Hypertension',
          diagnosisDate: '2023-01-15',
          status: 'Ongoing',
          doctor: 'Dr. Smith',
          notes: 'Managed with medication'
        },
        {
          id: 'rec2',
          condition: 'Diabetes Type 2',
          diagnosisDate: '2022-06-10',
          status: 'Ongoing',
          doctor: 'Dr. Johnson',
          notes: 'Regular monitoring required'
        }
      ],
      medications: [
        {
          id: 'med1',
          name: 'Lisinopril',
          dosage: '10mg daily',
          startDate: '2023-01-20',
          endDate: '',
          prescribingDoctor: 'Dr. Smith'
        },
        {
          id: 'med2',
          name: 'Metformin',
          dosage: '500mg twice daily',
          startDate: '2022-06-15',
          endDate: '',
          prescribingDoctor: 'Dr. Johnson'
        }
      ],
      allergies: [
        {
          id: 'all1',
          type: 'Food',
          severity: 'Moderate',
          reaction: 'Rash and itching',
          notes: 'Peanuts and tree nuts'
        }
      ],
      emergencyContacts: [
        {
          id: 'ec1',
          name: 'Jane Doe',
          relation: 'Spouse',
          phone: '+1 (555) 987-6543',
          email: 'jane.doe@example.com'
        }
      ],
      appointments: [
        {
          id: 'app1',
          doctorName: 'Dr. Smith',
          specialization: 'Cardiology',
          date: '2024-02-15',
          time: '10:00 AM',
          status: 'Scheduled'
        },
        {
          id: 'app2',
          doctorName: 'Dr. Johnson',
          specialization: 'Endocrinology',
          date: '2024-02-20',
          time: '02:00 PM',
          status: 'Scheduled'
        }
      ],
      vitals: [
        {
          date: '2024-01-01',
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          sugarLevel: 95,
          temperature: 98.6
        },
        {
          date: '2024-01-08',
          bloodPressure: { systolic: 118, diastolic: 78 },
          heartRate: 70,
          sugarLevel: 92,
          temperature: 98.4
        }
      ]
    });
    await patientData.save();

    // Create doctor user
    const hashedDoctorPassword = await bcrypt.hash('password123', 10);
    const doctorUser = new User({
      name: 'Dr. Jane Smith',
      dob: '1980-08-20',
      gender: 'Female',
      phone: '+1 (555) 555-5555',
      email: 'doctor@medlink.com',
      address: '456 Health Ave, Med City, 90210',
      bloodGroup: 'A-',
      role: 'Doctor',
      password: hashedDoctorPassword,
    });
    await doctorUser.save();

    res.status(201).json({ message: 'Database seeded successfully with test patient and doctor accounts' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Failed to seed database' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
