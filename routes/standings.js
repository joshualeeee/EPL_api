const express = require("express");
const connection = require("../connection");
const router = express.Router();

function validateNonNegativeInteger(value, paramName) {
    const intValue = parseInt(value);
    if (Number.isNaN(intValue) || intValue < 0) {
        throw new Error(`Invalid ${paramName} parameter. Please provide a non-negative integer.`);
    }
    return intValue;
}

router.get('/', (req, res, next) => {
    const season = req.query.season;
    const searchTeam = req.query.searchTeam;
    const ordering = req.query.ordering;
    const minWins = req.query.wins_gte;
    const maxWins = req.query.wins_lte;
    const minLoss = req.query.loss_gte;
    const maxLoss = req.query.loss_lte;
    const minPos = req.query.pos_gte;
    const maxPos = req.query.pos_lte;

    let query = 'SELECT * FROM epl_standings';

    let conditions = [];
    let queryConditions = []

    if (season) {
        if (!/^\d{4}-\d{2}$/.test(season)) {
            return res.status(400).json({ error: "Invalid season format. Use the format 'YYYY-YY', e.g., '2019-20'." });
        }
        queryConditions.push('Season=?');
        conditions.push(season);
    }

    if(searchTeam) {
        if (!/^[A-Za-z]+$/.test(searchTeam)) {
            return res.status(400).json({ error: "Invalid searchTeam parameter. Use letters only." });
        }
        queryConditions.push('Team LIKE ?');
        conditions.push(`%${searchTeam}%`);
    }

    if (minWins) {
        try {
            const winsInt = validateNonNegativeInteger(minWins, 'wins[gte]');
            queryConditions.push('W >= ?');
            conditions.push(winsInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (maxWins) {
        try {
            const winsInt = validateNonNegativeInteger(maxWins, 'wins[lte]');
            queryConditions.push('W <= ?');
            conditions.push(winsInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (minLoss) {
        try {
            const lossInt = validateNonNegativeInteger(minLoss, 'loss[gte]');
            queryConditions.push('L >= ?');
            conditions.push(lossInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (maxLoss) {
        try {
            const lossInt = validateNonNegativeInteger(maxLoss, 'loss[lte]');
            queryConditions.push('L <= ?');
            conditions.push(lossInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (minPos) {
        try {
            const possInt = validateNonNegativeInteger(minPos, 'pos[gte]');
            queryConditions.push('Pos >= ?');
            conditions.push(possInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (maxPos) {
        try {
            const possInt = validateNonNegativeInteger(maxPos, 'pos[gte]');
            queryConditions.push('Pos <= ?');
            conditions.push(possInt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + queryConditions.join(' AND ');
    }


    if (ordering) {
        if (ordering.startsWith('-')) {
            if (ordering !== 'W' && ordering !== 'L' && ordering !== 'Pts' && ordering !== 'Team') {
                return res.status(400).json({ error: "Invalid ordering parameter. Use 'W', 'L', 'Pts', or 'Team'." });
            }
            query += ` ORDER BY ${ordering} ASC`;
        }
        else{
            if (ordering !== 'W' && ordering !== 'L' && ordering !== 'Pts' && ordering !== 'Team') {
                return res.status(400).json({ error: "Invalid ordering parameter. Use 'W', 'L', 'Pts', or 'Team'." });
            }
            query += ` ORDER BY ${ordering} DESC`;
        }
    }
    
    connection.query(query, conditions, (err, result) => {
        if(!err){
            if (result.length === 0) {
                return res.status(404).json({ message: "No data found for the given search criteria." });
            }
            return res.status(200).json(result);
        }
        else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;