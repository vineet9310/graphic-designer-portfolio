import jwt from 'jsonwebtoken';

/**
 * Validates the JWT token from the Request headers.
 * Returns decoded payload if valid and email matches the configured admin email; otherwise null.
 */
export async function verifyAdmin(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_designer_portfolio_key_987654321');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'designer@example.com';
    if (decoded.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Admin verification failed:', error.message);
    return null;
  }
}
