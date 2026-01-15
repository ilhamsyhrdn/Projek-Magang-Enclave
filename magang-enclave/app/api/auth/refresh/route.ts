import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signToken, signRefreshToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token not found' },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = signToken({
      userId: payload.userId,
      email: payload.email,
      tenantName: payload.tenantName,
      role: payload.role,
      employeeId: payload.employeeId,
    });

    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
      email: payload.email,
      tenantName: payload.tenantName,
      role: payload.role,
      employeeId: payload.employeeId,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });

    response.cookies.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1,
      path: '/',
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 3,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    
    const response = NextResponse.json(
      { message: 'Invalid or expired refresh token' },
      { status: 401 }
    );

    response.cookies.set('token', '', { maxAge: 0, path: '/' });
    response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });

    return response;
  }
}
