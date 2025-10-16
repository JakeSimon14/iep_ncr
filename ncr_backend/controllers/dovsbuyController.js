const data = require('../data/do-buy.json');

exports.getDoVsBuyData = async (req, res) => {
    try {
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};