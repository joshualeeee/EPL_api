const express = require("express");
const connection = require("../connection");
const router = express.Router();

router.get('/', (req, res, next) => {
    let query = 'select * from epl_standings'; 
    connection.query(query, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return res.status(500).json(err);
        }
    });
});

router.get('/:Season', (req, res, next) => {
    const Season = req.params.Season;
    let query = 'select * from epl_standings where Season=?'; 
    connection.query(query, [Season], (err, result) => {
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;