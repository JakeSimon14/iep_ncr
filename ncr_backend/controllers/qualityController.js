const data = require('../data/contract-activities.json');

exports.getActivityData = async (req, res) => {
    try {
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};