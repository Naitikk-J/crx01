
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, walletAddress, role } = await request.json();

    if (!email || !walletAddress || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { walletAddress: walletAddress.toLowerCase() }],
    }).lean();

    if (existingUser) {
      return NextResponse.json({ message: 'Email or wallet address already in use.' }, { status: 409 });
    }

    const generatedPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      hashedPassword,
      role,
    });

    await newUser.save();

    // In a real application, you would email this password.
    // For this simulation, we log it to the server console.
    console.log(`
      ---- NEW USER PASSWORD (SIMULATED EMAIL) ----
      Email: ${email}
      Wallet: ${walletAddress}
      Password: ${generatedPassword} 
      -------------------------------------------
    `);
    
    return NextResponse.json({ message: 'Registration successful! Please check your email for your password.' }, { status: 201 });

  } catch (error: any) {
    console.error('--- REGISTRATION API ERROR ---');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ message: 'An internal server error occurred during registration.', error: error.message }, { status: 500 });
  }
}
