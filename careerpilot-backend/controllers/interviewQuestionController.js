const InterviewQuestion = require("../models/InterviewQuestion");


// ==========================================================
// GENERATE / GET INTERVIEW QUESTIONS
// ==========================================================

const generateInterviewQuestions = async (req, res) => {

  try {

    const {
      company,
      role,
      interviewType,
      difficulty
    } = req.body;


    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (
      !company ||
      !role ||
      !interviewType ||
      !difficulty
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Company, role, interview type and difficulty are required."
      });

    }


    // -------------------------------------------------------
    // SEARCH EXACT MATCH
    // -------------------------------------------------------

    let questions =
      await InterviewQuestion.find({
        company: {
          $regex: `^${escapeRegex(company)}$`,
          $options: "i"
        },

        role: {
          $regex: `^${escapeRegex(role)}$`,
          $options: "i"
        },

        interviewType,

        difficulty,

        active: true
      })
        .limit(10)
        .lean();


    // -------------------------------------------------------
    // FALLBACK 1
    // Same company + interview type + difficulty
    // -------------------------------------------------------

    if (questions.length === 0) {

      questions =
        await InterviewQuestion.find({
          company: {
            $regex: `^${escapeRegex(company)}$`,
            $options: "i"
          },

          interviewType,

          difficulty,

          active: true
        })
          .limit(10)
          .lean();

    }


    // -------------------------------------------------------
    // FALLBACK 2
    // Same role + interview type + difficulty
    // -------------------------------------------------------

    if (questions.length === 0) {

      questions =
        await InterviewQuestion.find({
          role: {
            $regex: `^${escapeRegex(role)}$`,
            $options: "i"
          },

          interviewType,

          difficulty,

          active: true
        })
          .limit(10)
          .lean();

    }


    // -------------------------------------------------------
    // FALLBACK 3
    // Same interview type + difficulty
    // -------------------------------------------------------

    if (questions.length === 0) {

      questions =
        await InterviewQuestion.find({
          interviewType,
          difficulty,
          active: true
        })
          .limit(10)
          .lean();

    }


    // -------------------------------------------------------
    // NO QUESTIONS FOUND
    // -------------------------------------------------------

    if (questions.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          "No interview questions found for the selected criteria.",
        count: 0,
        questions: []
      });

    }


    // -------------------------------------------------------
    // RANDOMIZE
    // -------------------------------------------------------

    questions = shuffleArray(questions)
      .slice(0, 5);


    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(200).json({

      success: true,

      filters: {
        company,
        role,
        interviewType,
        difficulty
      },

      count: questions.length,

      questions

    });


  } catch (error) {

    console.error(
      "Generate interview questions error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Server error while generating interview questions."
    });

  }

};


// ==========================================================
// GET AVAILABLE OPTIONS
// ==========================================================

const getInterviewQuestionOptions =
  async (req, res) => {

    try {

      const companies =
        await InterviewQuestion.distinct(
          "company",
          { active: true }
        );


      const roles =
        await InterviewQuestion.distinct(
          "role",
          { active: true }
        );


      return res.status(200).json({

        success: true,

        companies:
          companies.sort(),

        roles:
          roles.sort(),

        interviewTypes: [
          "Technical",
          "Coding",
          "HR",
          "Managerial"
        ],

        difficulties: [
          "Easy",
          "Medium",
          "Hard"
        ]

      });


    } catch (error) {

      console.error(
        "Get interview options error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          "Server error while loading interview options."
      });

    }

  };


// ==========================================================
// ESCAPE REGEX
// Prevent special characters in company/role from breaking
// MongoDB regular-expression matching.
// ==========================================================

const escapeRegex = (value) => {

  return String(value)
    .replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

};


// ==========================================================
// SHUFFLE QUESTIONS
// ==========================================================

const shuffleArray = (items) => {

  const array = [...items];


  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      array[i],
      array[j]
    ] = [
      array[j],
      array[i]
    ];

  }


  return array;

};


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {
  generateInterviewQuestions,
  getInterviewQuestionOptions
};
