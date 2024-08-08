import mysql from 'mysql2/promise';

// MySQL database configuration
const dbConfig = {
  host: 'localhost',    
  user: 'root',          
  password: '',         
  database: 'auctionwave'
};

// MySQL connection pool
const pool = mysql.createPool(dbConfig);

export const getPool = () => pool;
