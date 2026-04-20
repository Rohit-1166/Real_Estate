const db = require('../config/db');

exports.getAdminDashboard = async (req, res) => {
  try {
    const [salesSum] = await db.query('SELECT SUM(price) as totalSales FROM Sale');
    const [rentSum] = await db.query('SELECT SUM(rent_amount) as totalRent FROM Rental');
    const [agentCount] = await db.query('SELECT COUNT(*) as totalAgents FROM Agent');
    const [clientCount] = await db.query('SELECT COUNT(*) as totalClients FROM Client');
    
    // Explicitly getting rows
    const [agentRows] = await db.query('SELECT agent_id, name, email, phone, joining_date FROM Agent');
    const [clientRows] = await db.query('SELECT client_id, name, email, type FROM Client');
    const [propRows] = await db.query('SELECT p.property_id, p.status, c.city_name, p.selling_price, p.rent_price FROM Property p JOIN City c ON p.city_id = c.city_id');

    res.json({
      financials: {
        totalSales: salesSum[0]?.totalSales || 0,
        totalRent: rentSum[0]?.totalRent || 0,
      },
      oversight: {
        totalAgents: agentCount[0]?.totalAgents || 0,
        totalClients: clientCount[0]?.totalClients || 0
      },
      agents: agentRows,   // Clean array of rows
      clients: clientRows, // Clean array of rows
      properties: propRows // Clean array of rows
    });
  } catch(err) {
    console.error("ADMIN DB ERROR:", err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
};

exports.executeCustomQuery = async (req, res) => {
  try {
    const { query } = req.body;
    // VERY INSECURE: Do not do this in actual production without constraints.
    // However, it fulfills project requirement Step 4.
    const [results] = await db.query(query);
    res.json({ data: results });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user.id;
    // Workaround: We'll count properties associated with this agent through sales and rentals until property mapping is updated
    const [managedProps] = await db.query(`
        SELECT p.*, c.city_name 
        FROM Property p 
        JOIN City c ON p.city_id = c.city_id 
        WHERE p.property_id IN (
            SELECT property_id FROM Sale WHERE agent_id = ?
            UNION 
            SELECT property_id FROM Rental WHERE agent_id = ?
        )
    `, [agentId, agentId]);
    
    const [sales] = await db.query('SELECT s.*, p.city_id FROM Sale s JOIN Property p ON s.property_id=p.property_id WHERE s.agent_id = ?', [agentId]);
    const [rentals] = await db.query('SELECT r.*, p.city_id FROM Rental r JOIN Property p ON r.property_id=p.property_id WHERE r.agent_id = ?', [agentId]);
    const [reviews] = await db.query(`
        SELECT rv.*, c.name as client_name 
        FROM Review rv 
        JOIN Client c ON rv.client_id = c.client_id
        WHERE rv.property_id IN (
            SELECT property_id FROM Sale WHERE agent_id = ?
            UNION 
            SELECT property_id FROM Rental WHERE agent_id = ?
        )
    `, [agentId, agentId]);

    res.json({
      metrics: {
         totalProperties: managedProps.length,
         activeSales: sales.length,
         activeRentals: rentals.length
      },
      managedPortfolio: managedProps,
      transactions: [...sales.map(s => ({...s, type: 'Sale'})), ...rentals.map(r => ({...r, type: 'Rental'}))],
      reviews: reviews
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
};

exports.getClientDashboard = async (req, res) => {
  try {
    const clientId = req.user.id;
    // Clients can be buyers or renters, so we fetch both activities just in case
    const [purchases] = await db.query(`
       SELECT s.sale_id, p.property_id, c.city_name, s.price, s.sale_date
       FROM Sale s
       JOIN Property p ON s.property_id = p.property_id
       JOIN City c ON p.city_id = c.city_id
       WHERE s.buyer_id = ?
    `, [clientId]);

    const [rentals] = await db.query(`
       SELECT r.rental_id, p.property_id, c.city_name, r.rent_amount, r.start_date, r.end_date
       FROM Rental r
       JOIN Property p ON r.property_id = p.property_id
       JOIN City c ON p.city_id = c.city_id
       WHERE r.client_id = ? 
    `, [clientId]);

    const [reviews] = await db.query(`
       SELECT rv.*, p.city_id 
       FROM Review rv
       JOIN Property p ON rv.property_id = p.property_id
       WHERE rv.client_id = ?
    `, [clientId]);

    res.json({
      purchases,
      rentals,
      reviews,
      totalSpent: purchases.reduce((sum, p) => sum + p.price, 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch client dashboard metrics' });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [portfolio] = await db.query(`
       SELECT p.property_id, c.city_name, pt.type_name, p.status, p.selling_price, p.rent_price, p.bedrooms
       FROM Property p
       JOIN City c ON p.city_id = c.city_id
       JOIN PropertyType pt ON p.type_id = pt.type_id
       WHERE p.owner_id = ?
    `, [ownerId]);

    const activeAssets = portfolio.filter(p => p.status === 'available').length;
    const leasedAssets = portfolio.filter(p => p.status === 'rent').length;
    const totalValue = portfolio.reduce((sum, p) => sum + (p.selling_price || 0), 0);

    res.json({
      portfolio,
      activeAssets,
      leasedAssets,
      totalValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch owner dashboard metrics' });
  }
};
