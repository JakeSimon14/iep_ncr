const data = require('../data/offices.json');

exports.getOfficesTree = async (req, res) => {
    try {
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};