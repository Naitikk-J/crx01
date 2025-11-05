
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  console.log('--- REGISTRATION API START ---');
  try {
    await dbConnect();
    console.log('Database connected successfully.');

    const { email, walletAddress, role } = await request.json();
    console.log('Request body parsed:', { email, walletAddress, role });

    if (!email || !walletAddress || !role) {
      console.log('Missing required fields.');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const lowercasedEmail = email.toLowerCase();
    const lowercasedWallet = walletAddress.toLowerCase();

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [{ email: lowercasedEmail }, { walletAddress: lowercasedWallet }],
    }).lean();

    if (existingUser) {
      console.log('User already exists.');
      return NextResponse.json({ message: 'Email or wallet address already in use.' }, { status: 409 });
    }
    
    console.log('No existing user found. Creating new user...');
    
    // Using a fixed password for now to debug the registration flow
    const generatedPassword = "password123";
    
    // Storing a placeholder instead of a hash for debugging
    const hashedPassword = "placeholder_password";

    const newUser = new User({
      email: lowercasedEmail,
      walletAddress: lowercasedWallet,
      hashedPassword,
      role,
    });

    await newUser.save();

    console.log('New user saved successfully.');
    console.log(`
      ---- NEW USER PASSWORD (SIMULATED EMAIL) ----
      Email: ${email}
      Wallet: ${walletAddress}
      Password: ${generatedPassword} 
      This is a temporary password. The login is currently configured to accept any password.
      -------------------------------------------
    `);
    
    return NextResponse.json({ message: 'Registration successful! Please check your server console for your temporary password.' }, { status: 201 });

  } catch (error: any) {
    console.error('--- REGISTRATION API CRITICAL ERROR ---');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ message: 'An internal server error occurred during registration.', error: error.message }, { status: 500 });
  }
}
