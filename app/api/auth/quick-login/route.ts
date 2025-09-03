import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { createServerClient } from "@/lib/neon/database";

export async function POST(request: NextRequest) {
  // Only allow quick login in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Quick login is only available in development mode' },
      { status: 403 }
    );
  }

  const db = await createServerClient();

  try {
    const { userType } = await request.json();
    
    let email: string;
    
    // Determine email based on user type
    switch (userType) {
      case 'admin':
        email = 'admin@test.com';
        break;
      case 'user':
        email = 'user@test.com';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
    }

    // Get user from database
    const { data: user, error } = await db
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Use the existing signIn function with test password
    const result = await signIn(email, 'password123');
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || 'Quick login failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Quick login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}