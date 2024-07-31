var express = require('express');
const mysql = require('mysql');
// var router = express.Router();
const config = require('../config.json')

const pool = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
pool.connect((err) => err && console.log(err));
//cachning 
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// get('/query/songs1'
const songs1 = function(req, res){
    
    const x = req.query.x;
    const y = req.query.y;

    //caching
    //if the same request parameters are used again within this period, 
    //the application will serve the result from the cache instead of querying the database again
    const cacheKey = `songs-${x}-${y}`;

    // Check if data for this request is already in cache
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache');
        return res.json(cachedData);
    }
    

    
    pool.query(
      `WITH RankedSongs AS (
        SELECT DISTINCT r.id, r.Date, r.Ranks, r.Last_Week, r.Peak_Position, r.Weeks_in_Chart, sb.Song, sb.Artist, sb.Image_URL
        FROM Ranks r
        JOIN SongB sb ON r.id = sb.id
        WHERE r.Date > '${x}' AND r.Date < '${y}'
    ),
    SpotRanks AS (
        SELECT p.id, MIN(p.Ranks) AS SpotRanks
        FROM Points p
        WHERE p.Date > '${x}' AND p.Date < '${y}'
        GROUP BY p.id
    ),
    SongCharacteristics AS (
        SELECT c.id, c.Song_URL, c.Title AS Song, c.Artists AS Artist
        FROM Characteristics c
    )
    SELECT hh.id, MIN(hh.Date) AS Date, MIN(hh.Ranks) AS Ranks, 
      MIN(hh.Last_week) AS Last_week, MIN(hh.Peak_Position) AS Peak_Position,
      MIN(hh.Weeks_in_Chart) AS Weeks_in_Chart, MIN(hh.Song) AS Song,
      MIN(hh.Artist) AS Artist, MIN(hh.Image_URL) AS Image_URL,
      MIN(hh.SpotRanks) AS SpotRanks, MIN(hh.Song_URL) AS Song_URL
      FROM (
    SELECT
        rs.id, rs.Date, rs.Ranks, rs.Last_Week, rs.Peak_Position, rs.Weeks_in_Chart, rs.Song, rs.Artist, rs.Image_URL, sr.SpotRanks, sc.Song_URL
    FROM RankedSongs rs
    LEFT JOIN SpotRanks sr ON rs.id = sr.id
    LEFT JOIN SongCharacteristics sc ON rs.id = sc.id
    
    UNION
    
    SELECT
        sr.id, rs.Date, rs.Ranks, rs.Last_Week, rs.Peak_Position, rs.Weeks_in_Chart, sc.Song, sc.Artist, rs.Image_URL, sr.SpotRanks, sc.Song_URL
    FROM SpotRanks sr
    LEFT JOIN RankedSongs rs ON sr.id = rs.id
    LEFT JOIN SongCharacteristics sc ON sr.id = sc.id ) hh
    GROUP BY hh.id
    ;

    `,
      (error, results) => {
        if (error) {
          console.log(error)
          
          return res.status(500).json({ error: 'Database error' });
        }
        console.log("Ran")
        console.log(results)
        myCache.set(cacheKey, results);  // Save the database query results in the cache
        res.json(results);
      }
    );
  };

  // get('/query/songs2'
const songs2 =  function(req, res, next) 
{
    const s1 = req.query.s1;
    const s2 = req.query.s2;
    const s3 = req.query.s3;
    const d1 = req.query.d1;
    const d2 = req.query.d2;
    console.log(d1, d2)

    const cacheKey = `songs2-${s1}-${s2}-${s3}-${d1}-${d2}`;  // Construct a unique cache key based on query parameters
    // Check if the results are already cached
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache');
        return res.json(cachedData);
    }

    
  
    pool.query(
      `SELECT SUM(b.R) AS R, WEEK(b.Date) AS week
    FROM(
      SELECT Ranks.id, (100 - Ranks.Ranks) * 7 AS R, Ranks.Date 
      FROM Ranks
      WHERE Ranks.id = ${s1} OR Ranks.id = ${s2} OR Ranks.id = ${s3}  
      UNION ALL 
      SELECT Points.id, (200 - Points.Ranks) AS R, Points.Date 
      FROM Points
      WHERE Points.id = ${s1} OR Points.id = ${s2} OR Points.id = ${s3}
    ) b
    WHERE b.Date > '${d1}' AND b.Date < '${d2}'
    GROUP BY WEEK(Date)
    ORDER BY Date
     `,
      (error, results) =>
      {
        if (error) {
          console.log(error)
          return res.status(500).json({ error: 'Database error' });
        }
        console.log(results)
        myCache.set(cacheKey, results);  // Cache the results
        res.json(results);
       
      }
    );
  };

  const top10 =  function(req, res, next) 
{

    const d1 = req.query.d1;
    const d2 = req.query.d2;
    //caching 
    const cacheKey = `top10-${d1}-${d2}`;  // Construct a unique cache key

    // Check if data for this request is already in cache
    const cachedData = myCache.get(cacheKey);
    if (cachedData) 
      {
        console.log('Serving from cache');
        return res.json(cachedData);
      }
    
  
    pool.query(
      `SELECT ranking.id, ranking.R AS Score, names.Song
      FROM (SELECT SUM(b.R) AS R, b.id
      FROM (
      SELECT Ranks.id, (100 - Ranks.Ranks) * 7 AS R, Ranks.Date
      FROM Ranks
      UNION ALL
      SELECT Points.id, (200 - Points.Ranks) AS R, Points.Date
      FROM Points
    ) b
    WHERE b.Date > '${d1}' AND b.Date < '${d2}'
    GROUP BY b.id
    ORDER BY SUM(b.R) DESC
    LIMIT 10) ranking JOIN (
      SELECT id, Song
      FROM SongB
      UNION
      SELECT id, Title AS Song
      FROM Characteristics
    ) names ON names.id=ranking.id
    
    `,
      (error, results) =>
      {
        if (error) {
          console.log(error)
          return res.status(500).json({ error: 'Database error' });
        }
        console.log(results)
        myCache.set(cacheKey, results);  // Cache the results
        res.json(results);
       
      }
    );
  };

  const songChars =  function(req, res, next) 
  {
  
      const s1 = req.query.s1;
      const cacheKey = `songChars-${s1}`;  // Unique cache key based on the song ID

      // Check if the data for this song is already in the cache
      const cachedData = myCache.get(cacheKey);
      if (cachedData) {
          console.log('Serving from cache');
          return res.json(cachedData);
      }
  
      
    //Use the exists here! get spotify artist but if not in spotify then do billboard artist 
      pool.query(
        `
        WITH c AS(
          SELECT id,  CONCAT('[', GROUP_CONCAT(CONCAT('["', Artist.Artist, '", "', Artist.Nationality, '", "', Artist.Continent, '"]')), ']') AS ArtistDetails
          FROM(
          SELECT *
          FROM idArtist
          WHERE id = ${s1})  i JOIN Artist ON i.Artist = Artist.Artist
          GROUP BY id
      )
      
      
      SELECT * FROM
      (SELECT *
      FROM SongB
      WHERE id = ${s1}) a
      LEFT JOIN (
          SELECT ll.*, c.ArtistDetails
      FROM
          (
      SELECT *
      FROM Characteristics
      WHERE id = ${s1}
      ) ll JOIN c ON ll.id = c.id  )b ON a.id = b.id
      UNION
      SELECT * FROM
      (SELECT *
      FROM SongB
      WHERE id = ${s1}) a
      RIGHT JOIN (
          SELECT ll.*, c.ArtistDetails
      FROM
          (
      SELECT *
      FROM Characteristics
      WHERE id = ${s1}
      ) ll JOIN c ON ll.id = c.id  )b ON a.id = b.id
      `,
        (error, results) =>
        {
          if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Database error' });
          }
          console.log(results)
          myCache.set(cacheKey, results);  // Cache the results
          res.json(results);
         
        }
      );
    };


  // get('/query/indCharts'
  const indCharts =  function(req, res, next) 
  {
  
    const s1 = req.query.s1;
    const s2 = req.query.s2;
    const s3 = req.query.s3;
    const d1 = req.query.d1;
    const d2 = req.query.d2;
    const cacheKey = `indCharts-${s1}-${s2}-${s3}-${d1}-${d2}`;  // Construct a unique cache key based on query parameters
    // Check if the results are already cached
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache');
        return res.json(cachedData);
    }
    
      
    //The 3 songs in individual charts - ADD THE ID
      pool.query(
        `SELECT ranking.id, ranking.R AS Score, names.Song, ranking.week
        FROM (SELECT SUM(b.R) AS R, b.id, b.week
        FROM (
        SELECT Ranks.id, (100 - Ranks.Ranks) * 7 AS R, WEEK(Ranks.Date) AS week, Date
        FROM Ranks
        WHERE (Ranks.id = ${s1} OR Ranks.id = ${s2} OR Ranks.id = ${s3} ) AND Ranks.Date > '${d1}' AND Ranks.Date < '${d2}'
        UNION ALL
        SELECT Points.id, SUM(200 - Points.Ranks) AS R, WEEK(Points.Date) AS week, MIN(Date) AS Date
        FROM Points
        WHERE (Points.id = ${s1} OR Points.id = ${s2} OR Points.id = ${s3}) AND Points.Date > '${d1}'  AND Points.Date < '${d2}'
        GROUP BY WEEK(Date), Points.id
      ) b
      GROUP BY b.id, week
      ORDER BY MIN(Date)
    ) ranking JOIN (
        SELECT id, Song
        FROM SongB
        UNION
        SELECT id, Title AS Song
        FROM Characteristics
      ) names ON names.id=ranking.id
      
      `,
        (error, results) =>
        {
          if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Database error' });
          }

          const reformat = {
            1: results.filter(item => item.id == s1),
            2: results.filter(item => item.id == s2),
            3: results.filter(item => item.id == s3)
          }
          console.log(reformat)
          myCache.set(cacheKey, results);  // Cache the results
          res.json(reformat);
         
        }
      );
    };

    // get('/getScore')
  const getScore =  function(req, res, next) 
  {
      pool.query(
        `SELECT * 
        FROM UserScore
        ORDER BY score DESC
      
      `,
        (error, results) =>
        {
          if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Database error' });
          }

          console.log(results)
  
          res.json(results);
         
        }
      );
    };

  


module.exports = { songs1, songs2, top10, indCharts, songChars, getScore
};