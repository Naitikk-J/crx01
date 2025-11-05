import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, walletAddress, role } = await request.json();

    if (!email || !walletAddress || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { walletAddress: walletAddress.toLowerCase() }],
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email or wallet address already in use.' }, { status: 409 });
    }

    const generatedPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      hashedPassword,
      role,
    });

    await newUser.save();

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

    return NextResponse.json({ message: 'Registration successful! Please check your email for your password.' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
