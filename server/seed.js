const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Expense = require('./models/Expense');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to database.');

    const demoEmail = 'demo@spendtrack.com';
    const demoPasswordPlain = 'Demo@123';

    // Remove existing demo user and their expenses if already present
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Expense.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('[Seed] Cleaned up existing demo user and past expenses.');
    }

    // Hash the password for the demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(demoPasswordPlain, salt);

    // Create the demo user
    const demoUser = await User.create({
      name: 'Demo Student',
      email: demoEmail,
      password: hashedPassword,
    });
    console.log(`[Seed] Demo user created: ${demoUser.email} (Password: ${demoPasswordPlain})`);

    // Sample expenses data across different categories
    const sampleExpenses = [
      {
        user: demoUser._id,
        title: 'College Semester Textbooks',
        amount: 1450.00,
        category: 'Education',
        date: new Date('2026-11-02'),
        notes: 'Full Stack Development and Cloud Computing reference books',
      },
      {
        user: demoUser._id,
        title: 'Campus Cafeteria Lunch',
        amount: 180.00,
        category: 'Food',
        date: new Date('2026-11-04'),
        notes: 'Lunch with study group members',
      },
      {
        user: demoUser._id,
        title: 'Monthly Metro Pass Recharge',
        amount: 850.00,
        category: 'Travel',
        date: new Date('2026-11-05'),
        notes: 'Bengaluru Metro smart card recharge for daily college commute',
      },
      {
        user: demoUser._id,
        title: 'High-Speed Broadband Bill',
        amount: 799.00,
        category: 'Bills',
        date: new Date('2026-11-08'),
        notes: 'Fiber internet bill for online coding labs and assignments',
      },
      {
        user: demoUser._id,
        title: 'Wireless Ergonomic Mouse',
        amount: 699.00,
        category: 'Shopping',
        date: new Date('2026-11-10'),
        notes: 'Logitech wireless mouse for laptop programming sessions',
      },
      {
        user: demoUser._id,
        title: 'Weekend Pizza with Friends',
        amount: 520.00,
        category: 'Food',
        date: new Date('2026-11-12'),
        notes: 'Celebrated completing project milestone',
      },
      {
        user: demoUser._id,
        title: 'Udemy React & Node.js Masterclass',
        amount: 499.00,
        category: 'Education',
        date: new Date('2026-11-14'),
        notes: 'Course on advanced MERN stack architecture and testing',
      },
      {
        user: demoUser._id,
        title: 'Notebooks and Stationery',
        amount: 220.00,
        category: 'Other',
        date: new Date('2026-11-15'),
        notes: 'Spiral notebooks, pens and sticky notes for revision',
      },
    ];

    await Expense.insertMany(sampleExpenses);
    console.log(`[Seed] Successfully inserted ${sampleExpenses.length} sample expenses.`);

    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('=============================================');
    console.log(`Demo Email   : ${demoEmail}`);
    console.log(`Demo Password: ${demoPasswordPlain}`);
    console.log('=============================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
