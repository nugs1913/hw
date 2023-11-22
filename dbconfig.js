module.exports = {
  user          : process.env.DB_USER || 'c##nugs',
  password      : process.env.DB_PASSWORD || 'database',
  connectString : process.env.DB_CONNECTIONSTRING || 'localhost:52036/xe',
};