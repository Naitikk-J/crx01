
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    console.log('--- REGISTRATION ATTEMPT START ---');
    
    try {
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected successfully.');
    } catch (dbError: any) {
        console.error('--- DATABASE CONNECTION ERROR ---');
        console.error(dbError);
        return NextResponse.json({ message: 'Database connection failed.', error: dbError.message }, { status: 500 });
    }

    const { email, walletAddress, role } = await request.json();
    console.log('Request body parsed:', { email, walletAddress, role });

    if (!email || !walletAddress || !role) {
      console.error('Validation Error: Missing required fields.');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Validation Error: Invalid email format.');
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { walletAddress: walletAddress.toLowerCase() }],
    }).lean();

    if (existingUser) {
      console.error('Conflict Error: User already exists.');
      return NextResponse.json({ message: 'Email or wallet address already in use.' }, { status: 409 });
    }
    console.log('User does not exist, proceeding with registration.');

    const generatedPassword = crypto.randomBytes(8).toString('hex');
    console.log('Generated password.');
    
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt.');

    const hashedPassword = await bcrypt.hash(generatedPassword, salt);
    console.log('Password hashed.');

    const newUser = new User({
      email: email.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      hashedPassword,
      role,
    });

    console.log('Saving new user to database...');
    await newUser.save();
    console.log('User saved successfully.');

    // Simulate sending an email with the password
    console.log(`
      ---- NEW USER EMAIL (SIMULATED) ----
      To: ${email}
      Subject: Welcome to EcoTrust Exchange!

      Your account has been created.
      Wallet: ${walletAddress}
      Password: ${generatedPassword} 

      Please save this password securely and delete this email.
      ------------------------------------
    `);
    
    console.log('--- REGISTRATION ATTEMPT SUCCESS ---');
    return NextResponse.json({ message: 'Registration successful! Please check your email for your password.' }, { status: 201 });
  } catch (error: any) {
    console.error('--- UNCAUGHT REGISTRATION API ERROR ---');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    return NextResponse.json({ message: 'An internal server error occurred during registration.', error: error.message }, { status: 500 });
  }
}
