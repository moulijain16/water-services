const Customer = require("../models/Customer");

// @desc  Create a new customer, owned by the logged-in user
// @route POST /api/customers
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, purifierModel, installationDate, lastServiceDate, notes } = req.body;
    const customer = await Customer.create({
      owner: req.userId,
      name,
      phone,
      email,
      address,
      purifierModel,
      installationDate,
      lastServiceDate: lastServiceDate || installationDate || new Date(),
      notes,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Get all customers belonging to the logged-in user
// @route GET /api/customers
exports.getCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = { owner: req.userId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    let customers = await Customer.find(query).sort({ nextServiceDate: 1 });

    if (status === "due") {
      customers = customers.filter((c) => c.isActive && c.nextServiceDate && new Date() >= c.nextServiceDate);
    }

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get a single customer, only if it belongs to the logged-in user
// @route GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, owner: req.userId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a customer, only if it belongs to the logged-in user
// @route PUT /api/customers/:id
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, owner: req.userId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const updatable = ["name", "phone", "email", "address", "purifierModel", "installationDate", "notes", "isActive"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) customer[field] = req.body[field];
    });

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete a customer, only if it belongs to the logged-in user
// @route DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Log a service visit, only if the customer belongs to the logged-in user
// @route POST /api/customers/:id/service
exports.addServiceRecord = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, owner: req.userId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const { date, serviceType, partsReplaced, notes, chargedAmount } = req.body;
    const serviceDate = date || new Date();

    customer.serviceHistory.push({ date: serviceDate, serviceType, partsReplaced, notes, chargedAmount });
    customer.lastServiceDate = serviceDate;

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Dashboard stats scoped to the logged-in user only
// @route GET /api/customers/stats/summary
exports.getDashboardStats = async (req, res) => {
  try {
    const all = await Customer.find({ isActive: true, owner: req.userId });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    const weekFromNow = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdue = all.filter((c) => c.nextServiceDate && c.nextServiceDate < startOfToday);
    const dueToday = all.filter(
      (c) => c.nextServiceDate && c.nextServiceDate >= startOfToday && c.nextServiceDate < endOfToday
    );
    const dueThisWeek = all.filter(
      (c) => c.nextServiceDate && c.nextServiceDate >= endOfToday && c.nextServiceDate < weekFromNow
    );

    const totalCustomers = await Customer.countDocuments({ owner: req.userId });

    res.json({
      totalCustomers,
      activeCustomers: all.length,
      overdueCount: overdue.length,
      dueTodayCount: dueToday.length,
      dueThisWeekCount: dueThisWeek.length,
      overdueList: overdue,
      dueTodayList: dueToday,
      dueThisWeekList: dueThisWeek,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};