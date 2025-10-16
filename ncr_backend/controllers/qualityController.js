const data = require('../data/contract-activities.json');
const ecndata = require('../data/ecn-activities.json');

exports.getActivityData = async (req, res) => {
    try {
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getECNActivityData = async (req, res) => {
    try {
        res.json(ecndata);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};