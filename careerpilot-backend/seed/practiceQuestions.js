require("dotenv").config();
const mongoose = require("mongoose");
const PracticeQuestion = require("../models/PracticeQuestion");

const questions = [
  // ================= JAVA =================
  {
    category: "Java",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "The extends keyword is used for class inheritance in Java."
  },
  {
    category: "Java",
    question: "Which method is the entry point of a Java application?",
    options: ["start()", "run()", "main()", "init()"],
    correctAnswer: 2,
    difficulty: "Beginner",
    explanation: "Execution of a standard Java application begins from the main() method."
  },
  {
    category: "Java",
    question: "Which concept allows the same method name to have different implementations?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correctAnswer: 2,
    difficulty: "Intermediate",
    explanation: "Polymorphism allows the same interface or method concept to behave differently."
  },

  // ================= SQL =================
  {
    category: "SQL",
    question: "Which SQL command is used to retrieve data from a table?",
    options: ["GET", "SELECT", "FETCH TABLE", "DISPLAY"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "SELECT retrieves rows and columns from database tables."
  },
  {
    category: "SQL",
    question: "Which clause is used to filter rows in SQL?",
    options: ["ORDER BY", "GROUP BY", "WHERE", "SELECT"],
    correctAnswer: 2,
    difficulty: "Beginner",
    explanation: "The WHERE clause filters rows according to a condition."
  },
  {
    category: "SQL",
    question: "Which JOIN returns only matching rows from both tables?",
    options: ["LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "INNER JOIN"],
    correctAnswer: 3,
    difficulty: "Intermediate",
    explanation: "INNER JOIN returns rows where the join condition matches in both tables."
  },

  // ================= DBMS =================
  {
    category: "DBMS",
    question: "What is a primary key?",
    options: [
      "A duplicate column",
      "A key that uniquely identifies a record",
      "A nullable column",
      "A foreign table"
    ],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "A primary key uniquely identifies each row in a table."
  },
  {
    category: "DBMS",
    question: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: 1,
    difficulty: "Intermediate",
    explanation: "Second Normal Form removes partial dependency on a composite key."
  },

  // ================= APTITUDE =================
  {
    category: "Aptitude",
    question: "What is 20% of 250?",
    options: ["25", "40", "50", "75"],
    correctAnswer: 2,
    difficulty: "Beginner",
    explanation: "20% of 250 = 0.20 × 250 = 50."
  },
  {
    category: "Aptitude",
    question: "A product costs ₹800 and receives a 10% discount. What is the final price?",
    options: ["₹700", "₹720", "₹740", "₹780"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "10% of ₹800 is ₹80, so the final price is ₹720."
  },

  // ================= LOGICAL REASONING =================
  {
    category: "Logical Reasoning",
    question: "Find the next number: 2, 4, 8, 16, ?",
    options: ["18", "24", "30", "32"],
    correctAnswer: 3,
    difficulty: "Beginner",
    explanation: "Each number is multiplied by 2, so the next number is 32."
  },
  {
    category: "Logical Reasoning",
    question: "If all programmers are logical and Ravi is a programmer, what follows?",
    options: [
      "Ravi is not logical",
      "Ravi is logical",
      "All logical people are programmers",
      "Nothing follows"
    ],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "If all programmers are logical and Ravi is a programmer, Ravi must be logical."
  },

  // ================= JAVASCRIPT =================
  {
    category: "JavaScript",
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "define", "static"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "let declares a block-scoped variable."
  },
  {
    category: "JavaScript",
    question: "What does === check in JavaScript?",
    options: [
      "Only value",
      "Only data type",
      "Value and type",
      "Variable name"
    ],
    correctAnswer: 2,
    difficulty: "Intermediate",
    explanation: "Strict equality checks both value and type."
  },

  // ================= REACT =================
  {
    category: "React",
    question: "Which hook is commonly used to manage component state?",
    options: ["useRoute", "useState", "useCSS", "useComponent"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "useState is used to add state to functional React components."
  },
  {
    category: "React",
    question: "Which hook is commonly used for side effects?",
    options: ["useEffect", "useState", "useRefOnly", "useRoute"],
    correctAnswer: 0,
    difficulty: "Intermediate",
    explanation: "useEffect is commonly used for side effects such as fetching data."
  },

  // ================= OPERATING SYSTEMS =================
  {
    category: "Operating Systems",
    question: "Which component manages computer hardware and system resources?",
    options: ["Compiler", "Operating System", "Browser", "Database"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "The operating system manages hardware and system resources."
  },
  {
    category: "Operating Systems",
    question: "Which scheduling algorithm processes jobs in arrival order?",
    options: ["Round Robin", "SJF", "FCFS", "Priority"],
    correctAnswer: 2,
    difficulty: "Intermediate",
    explanation: "FCFS means First Come First Served."
  },

  // ================= COMPUTER NETWORKS =================
  {
    category: "Computer Networks",
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Process",
      "Hyper Transfer Technology Protocol",
      "Host Text Transfer Protocol"
    ],
    correctAnswer: 0,
    difficulty: "Beginner",
    explanation: "HTTP stands for HyperText Transfer Protocol."
  },
  {
    category: "Computer Networks",
    question: "Which protocol is primarily used to securely browse websites?",
    options: ["FTP", "HTTP", "HTTPS", "SMTP"],
    correctAnswer: 2,
    difficulty: "Beginner",
    explanation: "HTTPS provides encrypted HTTP communication."
  },

  // ================= VERBAL =================
  {
    category: "Verbal Ability",
    question: "Choose the synonym of 'Rapid'.",
    options: ["Slow", "Fast", "Weak", "Quiet"],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "Rapid means fast or quick."
  },
  {
    category: "Verbal Ability",
    question: "Choose the grammatically correct sentence.",
    options: [
      "She have a laptop.",
      "She has a laptop.",
      "She having a laptop.",
      "She are having a laptop."
    ],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "With 'she', the correct present-tense form is 'has'."
  },

  // ================= HR =================
  {
    category: "HR Questions",
    question: "What is the best approach when answering 'Tell me about yourself'?",
    options: [
      "Discuss unrelated personal information",
      "Give a concise professional introduction",
      "Only state your name",
      "Avoid mentioning skills"
    ],
    correctAnswer: 1,
    difficulty: "Beginner",
    explanation: "A concise introduction covering education, skills, projects and career goals is generally appropriate."
  },
  {
    category: "HR Questions",
    question: "When asked about a weakness, what is a good approach?",
    options: [
      "Say you have no weaknesses",
      "Give an irrelevant answer",
      "Mention a genuine area of improvement and how you are working on it",
      "Refuse to answer"
    ],
    correctAnswer: 2,
    difficulty: "Beginner",
    explanation: "A useful answer demonstrates self-awareness and improvement."
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await PracticeQuestion.deleteMany({});

    console.log("Old practice questions removed");

    await PracticeQuestion.insertMany(questions);

    console.log(
      `${questions.length} practice questions inserted successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error(
      "Practice question seed error:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedQuestions();
