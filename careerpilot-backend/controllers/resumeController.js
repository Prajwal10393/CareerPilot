const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const Resume = require("../models/Resume");
const Skill = require("../models/Skill");
const companyProfiles = require("../utils/companyProfiles");

// =========================================================
// GENERAL ATS SCORE
// =========================================================

const calculateATSScore = async (resumeText, userId) => {
  const text = resumeText.toLowerCase();

  const skills = await Skill.find({
    user: userId
  });

  const studentSkills = skills.map(
    (skill) => skill.name
  );

  const matchedSkills = [];
  const missingSkills = [];

  studentSkills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  let score = 0;

  // Education - 10
  if (text.includes("education")) {
    score += 10;
  }

  // Technical Skills - 20
  if (text.includes("skills")) {
    score += 5;
  }

  if (studentSkills.length > 0) {
    const skillRatio =
      matchedSkills.length /
      studentSkills.length;

    score += skillRatio * 15;
  }

  // Projects - 15
  if (
    text.includes("project") ||
    text.includes("projects")
  ) {
    score += 8;

    const projectKeywords = [
      "developed",
      "built",
      "implemented",
      "designed",
      "created",
      "integrated",
      "deployed"
    ];

    const hasProjectAction =
      projectKeywords.some((keyword) =>
        text.includes(keyword)
      );

    if (hasProjectAction) {
      score += 7;
    }
  }

  // Experience / Internship - 15
  if (
    text.includes("experience") ||
    text.includes("internship") ||
    text.includes("intern")
  ) {
    score += 10;

    const experienceKeywords = [
      "worked",
      "developed",
      "implemented",
      "managed",
      "collaborated",
      "designed"
    ];

    const hasExperienceAction =
      experienceKeywords.some((keyword) =>
        text.includes(keyword)
      );

    if (hasExperienceAction) {
      score += 5;
    }
  }

  // Contact / Professional links - 10
  if (
    text.includes("@") ||
    text.includes("email")
  ) {
    score += 3;
  }

  if (text.includes("linkedin")) {
    score += 3;
  }

  if (text.includes("github")) {
    score += 4;
  }

  // Certifications - 5
  if (
    text.includes("certification") ||
    text.includes("certifications") ||
    text.includes("certified")
  ) {
    score += 5;
  }

  // Resume content quality - 15
  const wordCount = resumeText
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

  if (
    wordCount >= 250 &&
    wordCount <= 800
  ) {
    score += 8;
  } else if (
    wordCount >= 150 &&
    wordCount < 250
  ) {
    score += 5;
  } else if (
    wordCount > 800 &&
    wordCount <= 1000
  ) {
    score += 4;
  }

  const measurablePattern =
    /\b\d+(\.\d+)?\s*(%|\+|users|projects|clients|days|hours|months|years)?\b/gi;

  const measurableMatches =
    resumeText.match(measurablePattern) || [];

  if (measurableMatches.length >= 3) {
    score += 7;
  } else if (
    measurableMatches.length >= 1
  ) {
    score += 3;
  }

  // Important sections - 10
  const importantSections = [
    "summary",
    "objective",
    "education",
    "skills",
    "project"
  ];

  const sectionCount =
    importantSections.filter(
      (section) =>
        text.includes(section)
    ).length;

  score +=
    (sectionCount /
      importantSections.length) *
    10;

  // Final score
  score = Math.min(score, 100);

  const finalScore =
    Math.round(
      (score / 10) * 10
    ) / 10;

  // Suggestions
  const suggestions = [];

  if (!text.includes("education")) {
    suggestions.push(
      "Add a clear education section."
    );
  }

  if (!text.includes("skills")) {
    suggestions.push(
      "Add a dedicated technical skills section."
    );
  }

  if (
    !text.includes("project") &&
    !text.includes("projects")
  ) {
    suggestions.push(
      "Add projects with technologies, responsibilities and measurable outcomes."
    );
  }

  if (
    !text.includes("experience") &&
    !text.includes("internship") &&
    !text.includes("intern")
  ) {
    suggestions.push(
      "Add internship, academic, freelance or practical experience if available."
    );
  }

  if (
    !text.includes("certification") &&
    !text.includes("certifications") &&
    !text.includes("certified")
  ) {
    suggestions.push(
      "Add relevant certifications if available."
    );
  }

  if (!text.includes("linkedin")) {
    suggestions.push(
      "Add your LinkedIn profile link."
    );
  }

  if (!text.includes("github")) {
    suggestions.push(
      "Add your GitHub profile link."
    );
  }

  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider highlighting these skills if you genuinely have them: ${missingSkills.join(
        ", "
      )}`
    );
  }

  if (wordCount < 150) {
    suggestions.push(
      "Your resume has very little text. Add more relevant details about skills, projects and education."
    );
  }

  if (wordCount > 1000) {
    suggestions.push(
      "Your resume may be too long. Keep the content concise and focused on relevant information."
    );
  }

  if (measurableMatches.length < 1) {
    suggestions.push(
      "Add measurable achievements where appropriate."
    );
  }

  return {
    score: finalScore,
    matchedSkills,
    missingSkills,
    suggestions
  };
};

// =========================================================
// COMPANY MATCH ANALYSIS
// =========================================================

const calculateCompanyMatch = (
  resumeText,
  targetCompany,
  targetRole
) => {
  const text =
    resumeText.toLowerCase();

  if (!targetCompany || !targetRole) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      suggestions: []
    };
  }

  const companyProfile =
    companyProfiles[targetCompany];

  if (!companyProfile) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      suggestions: [
        "Selected company profile is not available."
      ]
    };
  }

  const roleSkills =
    companyProfile.roles[targetRole];

  if (!roleSkills) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      suggestions: [
        "Selected role profile is not available for this company."
      ]
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  roleSkills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  let score = 0;

  // Skill match = max 6
  if (roleSkills.length > 0) {
    score +=
      (matchedSkills.length /
        roleSkills.length) *
      6;
  }

  // Projects
  if (text.includes("project")) {
    score += 1;
  }

  // Experience
  if (
    text.includes("experience") ||
    text.includes("internship")
  ) {
    score += 1;
  }

  // Education
  if (text.includes("education")) {
    score += 1;
  }

  // GitHub / LinkedIn
  if (
    text.includes("github") ||
    text.includes("linkedin")
  ) {
    score += 0.5;
  }

  // Certifications
  if (
    text.includes("certification") ||
    text.includes("certifications")
  ) {
    score += 0.5;
  }

  score = Math.min(score, 10);

  score =
    Math.round(score * 10) / 10;

  const suggestions = [];

  if (missingSkills.length > 0) {
    suggestions.push(
      `For ${targetCompany} ${targetRole}, consider improving or highlighting: ${missingSkills.join(
        ", "
      )}`
    );
  }

  if (!text.includes("project")) {
    suggestions.push(
      `Add projects relevant to the ${targetRole} role.`
    );
  }

  if (
    !text.includes("experience") &&
    !text.includes("internship")
  ) {
    suggestions.push(
      "Add internship, freelance, academic, or practical development experience."
    );
  }

  if (
    !text.includes("github") &&
    !text.includes("linkedin")
  ) {
    suggestions.push(
      "Add GitHub or LinkedIn links to strengthen your professional profile."
    );
  }

  if (
    matchedSkills.length ===
    roleSkills.length
  ) {
    suggestions.push(
      `Excellent technical keyword coverage for the ${targetCompany} ${targetRole} profile.`
    );
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    suggestions
  };
};

// =========================================================
// UPLOAD + ANALYZE RESUME
// =========================================================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required"
      });
    }

    const {
      targetCompany,
      targetRole
    } = req.body;

    const fileBuffer =
      fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: fileBuffer
    });

    const parsed =
      await parser.getText();

    const extractedText =
      parsed.text || "";

    await parser.destroy();

    const atsResult =
      await calculateATSScore(
        extractedText,
        req.user._id
      );

    const companyResult =
      calculateCompanyMatch(
        extractedText,
        targetCompany,
        targetRole
      );

    await Resume.deleteMany({
      user: req.user._id
    });

    const resume =
      await Resume.create({
        user: req.user._id,

        fileName:
          req.file.originalname,

        filePath:
          req.file.path,

        extractedText,

        atsScore:
          atsResult.score,

        matchedSkills:
          atsResult.matchedSkills,

        missingSkills:
          atsResult.missingSkills,

        suggestions:
          atsResult.suggestions,

        targetCompany:
          targetCompany || "",

        targetRole:
          targetRole || "",

        companyMatchScore:
          companyResult.score,

        companyMatchedSkills:
          companyResult.matchedSkills,

        companyMissingSkills:
          companyResult.missingSkills,

        companySuggestions:
          companyResult.suggestions
      });

    return res.status(201).json({
      success: true,

      message:
        "Resume uploaded and analyzed successfully",

      resume: {
        id: resume._id,

        fileName:
          resume.fileName,

        atsScore:
          resume.atsScore,

        matchedSkills:
          resume.matchedSkills,

        missingSkills:
          resume.missingSkills,

        suggestions:
          resume.suggestions,

        targetCompany:
          resume.targetCompany,

        targetRole:
          resume.targetRole,

        companyMatchScore:
          resume.companyMatchScore,

        companyMatchedSkills:
          resume.companyMatchedSkills,

        companyMissingSkills:
          resume.companyMissingSkills,

        companySuggestions:
          resume.companySuggestions
      }
    });
  } catch (error) {
    console.error(
      "Resume upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Resume upload or analysis failed"
    });
  }
};

// =========================================================
// GET CURRENT RESUME ANALYSIS
// =========================================================

const getMyResumeAnalysis =
  async (req, res) => {
    try {
      const resume =
        await Resume.findOne({
          user: req.user._id
        }).sort({
          createdAt: -1
        });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume analysis not found"
        });
      }

      return res.status(200).json({
        success: true,

        resume: {
          id: resume._id,

          fileName:
            resume.fileName,

          atsScore:
            resume.atsScore,

          matchedSkills:
            resume.matchedSkills,

          missingSkills:
            resume.missingSkills,

          suggestions:
            resume.suggestions,

          targetCompany:
            resume.targetCompany,

          targetRole:
            resume.targetRole,

          companyMatchScore:
            resume.companyMatchScore,

          companyMatchedSkills:
            resume.companyMatchedSkills,

          companyMissingSkills:
            resume.companyMissingSkills,

          companySuggestions:
            resume.companySuggestions,

          createdAt:
            resume.createdAt,

          updatedAt:
            resume.updatedAt
        }
      });
    } catch (error) {
      console.error(
        "Get resume analysis error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  uploadResume,
  getMyResumeAnalysis
};
