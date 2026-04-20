const db = require('../config/db');

exports.createSale = async (req, res) => {
  try {
    const { property_id, buyer_id, agent_id, price, days_on_market } = req.body;
    const [{ insertId }] = await db.execute(`
      INSERT INTO Sale (property_id, buyer_id, agent_id, sale_date, price, days_on_market)
      VALUES (?, ?, ?, CURDATE(), ?, ?)
    `, [property_id, buyer_id, agent_id, price, days_on_market]);
    // Triggers in DB will automatically mark Property as 'sold'
    res.status(201).json({ sale_id: insertId, message: 'Sale recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record sale' });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { property_id, client_id, agent_id, rent_amount, start_date, end_date, days_on_market } = req.body;
    const [{ insertId }] = await db.execute(`
      INSERT INTO Rental (property_id, client_id, agent_id, rent_amount, start_date, end_date, days_on_market)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [property_id, client_id, agent_id, rent_amount, start_date, end_date, days_on_market]);
    // Triggers in DB will automatically mark Property as 'rent'
    res.status(201).json({ rental_id: insertId, message: 'Rental recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record rental' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { client_id, property_id, rating, comment } = req.body;
    const [{ insertId }] = await db.execute(`
      INSERT INTO Review (client_id, property_id, rating, comment, review_date)
      VALUES (?, ?, ?, ?, CURDATE())
    `, [client_id, property_id, rating, comment]);
    res.status(201).json({ review_id: insertId, message: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Client has already reviewed this property' });
    res.status(500).json({ error: 'Failed to add review' });
  }
};

exports.getReviewsByProperty = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, c.name as client_name 
      FROM Review r
      JOIN Client c ON r.client_id = c.client_id
      WHERE r.property_id = ?
    `, [req.params.property_id]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
}
