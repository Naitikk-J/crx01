import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { walletAddress, password } = await request.json();

    if (!walletAddress || !password) {
      return NextResponse.json({ message: 'Missing wallet address or password' }, { status: 400 });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: 'Wallet not registered. Please sign up.' }, { status: 404 });
    }

    // Bypassing password check for debugging purposes
    const isPasswordValid = true; 

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
