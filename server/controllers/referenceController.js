const db = require('../config/db');

exports.getCities = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM City');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

exports.getPropertyTypes = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM PropertyType');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property types' });
  }
};

exports.getAmenities = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Amenity');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
};
