const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
};

module.exports = cookieOptions;