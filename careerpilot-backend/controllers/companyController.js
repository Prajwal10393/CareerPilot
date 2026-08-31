const Company = require("../models/Company");

const createCompany = async (req, res) => {
  try {
    const {
      name,
      industry,
      location,
      website,
      contactEmail,
      description,
      status
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }

    const existingCompany = await Company.findOne({
      name
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists"
      });
    }

    const company = await Company.create({
      name,
      industry,
      location,
      website,
      contactEmail,
      description,
      status,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email role"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    const allowedFields = [
      "name",
      "industry",
      "location",
      "website",
      "contactEmail",
      "description",
      "status"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};
