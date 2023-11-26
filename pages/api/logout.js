import { withIronSession } from 'next-iron-session';

export default withIronSession(handler, {
  password: 'your-password-should-be-at-least-32-characters-long',
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
  },
});

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      req.session.destroy();
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
