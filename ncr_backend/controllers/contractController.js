const data = require('../data/contracts.json');

exports.getContractTree = async (req, res) => {
    try {
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};