var express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// connect to mysql
const mysql = require('mysql2/promise');
const config = require('../config.json')
const dbConfig = {
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
};

//______________________________store user score__________________________________

const userScore =  async (req, res) => 
    {
      var score = req.body.score;
      var username = req.session.user.username
      
      if (!username || !score) 
      {
        return res.status(400).send('Username and password are required');
      }
    
      score=parseFloat(score)
      try{
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query('SELECT * FROM User WHERE username = ?', [username]);
      if (rows.length <= 0) 
      {
          res.status(500).send('Username does not exist');
          return
      }
      const result = await connection.query(
        'INSERT INTO UserScore (username, score) VALUES (?, ?)',
        [username, score]
        );
      await connection.end();
      res.status(200).send(`User ${username}  score stored successfully`);
      }
      catch (err) 
        {
            console.error('Database error:', err);
            res.status(500).send('Server error');
        
        }
    
      };
    
    
    
    //______________________________register__________________________________
    // parse user username and password passed by frontned and then stroe into db
    
    async function hashPassword(password) 
    {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    }
    // user register
  const register =  async (req, res) => 
    {
      console.log("here!")
      var { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      }
      username = String(username);
      password = String(password);
      // check if username or password too long
      if (username.length > 255 || password.length > 255 ) 
      {
        return res.status(400).send('Invalid input: Data too long for VARCHAR(255)');
      }
    
      // encrypt the password
      const hashedPassword = await hashPassword(password);
    
      try 
      {   
          const connection = await mysql.createConnection(dbConfig);
          const [rows] = await connection.query('SELECT * FROM User WHERE username = ?', [username]);
          // 如果存在相同的用户名，抛出错误
          if (rows.length > 0) {
            res.status(500).send('Username already exists');
            return
          }
    
          const result = await connection.query(
            'INSERT INTO User (username, password) VALUES (?, ?)',
            [username, hashedPassword]
            );
          await connection.end();
          req.session.user = { username: username };
          req.session.isLoggedIn = true;
          res.status(200).send(`User ${username} created successfully`);
        } catch (err) 
        {
            console.error('Database error:', err);
            res.status(500).send('Server error');
        
        }
    };
    
    //______________________________login__________________________________
    //user login
    // generate sessionID
    function generateUserId(username) {
        return crypto.createHash('sha256').update(username).digest('hex');
    }
    
    const login = async(req, res) => {
      const { username, password } = req.body;
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
          'SELECT * FROM User a WHERE EXISTS (SELECT 1 FROM User b WHERE b.username = ? AND a.username = b.username)', 
         [username]
        );
    
        if (rows.length > 0) 
        {
          const user = rows[0];
          console.log(user.password)
          const match = await bcrypt.compare(password, user.password);
    
          if (match) 
          {
            const userId = generateUserId(username); 
            req.session.user = { id: userId, username: username };
            req.session.isLoggedIn = true;
            res.status(200).send('You are logged in!');
          } else 
          {
            res.status(401).send('Login failed: Incorrect password');
          }
        } else 
        {
          res.status(401).send('Login failed: Incorrect username');
        }
      } catch (err) 
      {
        console.error('Database error:', err);
        res.status(500).send('Server error');
      }
    };
    
    //______________________________reset password__________________________________
    
    const resetPassword =  async (req, res) => {

      console.log("HERE!")
      var { username, password } = req.body;
     
      if (!username || !password) {
          return res.status(400).send('Username and new password are required');
      }
      if(username != req.session.user.username){
        return res.status(400).send('Incorrect username inputted');
      }
      username = String(username);
      password = String(password);
    
      try {
          
          const hashedPassword = await hashPassword(password);
          const connection = await mysql.createConnection(dbConfig);
          const [result] = await connection.query(
              'UPDATE User SET password = ? WHERE username = ?',
              [hashedPassword, username]
          );
          console.log(hashedPassword)
    
          if (result.affectedRows > 0) {
            console.log("Success!")
              res.status(200).send('Password reset successfully');
          } else {
              res.status(404).send('User not found');
          }
      } catch (err) {
          console.error('Database error:', err);
          res.status(500).send('Server error');
      }
    };
    
    
    //______________________________delete user__________________________________
    
    const deleteUser =  async (req, res) => {
      const username = req.session.user.username
      if (!username) {
          return res.status(400).send('Username is required');
      }
    
      console.log("DELETING USER ...")
    
      try {
          // will also delete user's score and rank in leaderboard; 
          //CASCADE delete
          const connection = await mysql.createConnection(dbConfig);
          const [result] = await connection.query(
              'DELETE FROM User WHERE username = ?',
              [username]
          );
    
          if (result.affectedRows > 0) {
              res.status(200).send('User deleted successfully');
          } else {
              res.status(404).send('User not found');
          }
      } catch (err) {
          console.error('Database error:', err);
          res.status(500).send('Server error');
      }
    };
    
    //______________________________logout__________________________________
    const logOut =  (req, res) => {
      req.session.destroy(err => {
          if (err) {
              return res.status(500).send('Failed to log out.');
          }
          res.status(200).send('You are logged out!');
      });
    };

module.exports = {userScore, register, login, resetPassword, deleteUser, logOut};
