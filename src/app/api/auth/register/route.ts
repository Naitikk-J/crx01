
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, walletAddress, role } = await request.json();

    if (!email || !walletAddress || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { walletAddress: walletAddress.toLowerCase() }],
    }).lean();

    if (existingUser) {
      return NextResponse.json({ message: 'Email or wallet address already in use.' }, { status: 409 });
    }
    
    // Using a fixed password for now to debug the registration flow
    const generatedPassword = "password123";
    
    // Storing a placeholder instead of a hash for debugging
    const hashedPassword = "placeholder_password";

    const newUser = new User({
      email: email.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      hashedPassword,
      role,
    });

    await newUser.save();

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
    console.error('--- REGISTRATION API ERROR ---');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ message: 'An internal server error occurred during registration.', error: error.message }, { status: 500 });
  }
}
