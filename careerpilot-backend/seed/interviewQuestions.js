const mongoose = require("mongoose");
const dotenv = require("dotenv");

const InterviewQuestion =
  require("../models/InterviewQuestion");

dotenv.config();


const questions = [

  // ========================================================
  // GOOGLE
  // ========================================================

  {
    company: "Google",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is the difference between a process and a thread?",
    suggestedAnswer:
      "A process is an independent program with its own memory space, while threads are smaller execution units within a process that share the same memory.",
    skills: ["Operating Systems"]
  },

  {
    company: "Google",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "Explain object-oriented programming and its four main principles.",
    suggestedAnswer:
      "Object-oriented programming organizes software around objects. Its four main principles are encapsulation, inheritance, polymorphism and abstraction.",
    skills: ["Java", "OOP"]
  },

  {
    company: "Google",
    role: "Software Engineer",
    interviewType: "Coding",
    difficulty: "Medium",
    question:
      "How would you find duplicate elements in an array efficiently?",
    suggestedAnswer:
      "A common approach is to use a HashSet. Traverse the array and check whether each element already exists in the set. This provides average O(n) time complexity.",
    skills: ["DSA", "Java"]
  },


  // ========================================================
  // AMAZON
  // ========================================================

  {
    company: "Amazon",
    role: "SDE",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "Explain the difference between an ArrayList and LinkedList in Java.",
    suggestedAnswer:
      "ArrayList uses a dynamic array and provides fast random access. LinkedList uses nodes and is generally better for frequent insertions or deletions when the position is already known.",
    skills: ["Java", "Collections"]
  },

  {
    company: "Amazon",
    role: "SDE",
    interviewType: "Coding",
    difficulty: "Medium",
    question:
      "How would you check whether a string is a palindrome?",
    suggestedAnswer:
      "Use two pointers, one from the beginning and one from the end. Compare characters while moving both pointers toward the center. The solution takes O(n) time.",
    skills: ["DSA", "Strings"]
  },

  {
    company: "Amazon",
    role: "SDE",
    interviewType: "HR",
    difficulty: "Medium",
    question:
      "Tell me about a time you solved a difficult problem.",
    suggestedAnswer:
      "Use the STAR method: explain the Situation, Task, Action and Result. Focus on your contribution, reasoning and measurable outcome.",
    skills: ["Communication"]
  },


  // ========================================================
  // MICROSOFT
  // ========================================================

  {
    company: "Microsoft",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is the difference between SQL and NoSQL databases?",
    suggestedAnswer:
      "SQL databases generally use relational tables and structured schemas, while NoSQL databases use models such as documents or key-value stores and often provide greater schema flexibility.",
    skills: ["SQL", "DBMS"]
  },

  {
    company: "Microsoft",
    role: "Software Engineer",
    interviewType: "Coding",
    difficulty: "Medium",
    question:
      "How would you reverse a linked list?",
    suggestedAnswer:
      "Maintain previous, current and next references. Iterate through the list and reverse each next pointer. The iterative solution takes O(n) time and O(1) additional space.",
    skills: ["DSA", "Linked List"]
  },


  // ========================================================
  // TCS
  // ========================================================

  {
    company: "TCS",
    role: "Graduate Engineer",
    interviewType: "Technical",
    difficulty: "Easy",
    question:
      "What is inheritance in Java?",
    suggestedAnswer:
      "Inheritance allows one class to acquire fields and methods from another class. In Java, class inheritance is implemented using the extends keyword.",
    skills: ["Java", "OOP"]
  },

  {
    company: "TCS",
    role: "Graduate Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is the difference between WHERE and HAVING in SQL?",
    suggestedAnswer:
      "WHERE filters rows before grouping, while HAVING filters grouped results after GROUP BY.",
    skills: ["SQL"]
  },

  {
    company: "TCS",
    role: "Graduate Engineer",
    interviewType: "HR",
    difficulty: "Easy",
    question:
      "Why do you want to join TCS?",
    suggestedAnswer:
      "A strong answer can mention learning opportunities, large-scale technology projects, professional growth and how your technical skills align with the role.",
    skills: ["Communication"]
  },


  // ========================================================
  // INFOSYS
  // ========================================================

  {
    company: "Infosys",
    role: "System Engineer",
    interviewType: "Technical",
    difficulty: "Easy",
    question:
      "What is method overloading in Java?",
    suggestedAnswer:
      "Method overloading means defining multiple methods with the same name but different parameter lists within a class.",
    skills: ["Java"]
  },

  {
    company: "Infosys",
    role: "System Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "Explain primary key and foreign key.",
    suggestedAnswer:
      "A primary key uniquely identifies a row in a table. A foreign key references a key in another table and helps establish relationships between tables.",
    skills: ["SQL", "DBMS"]
  },


  // ========================================================
  // COGNIZANT
  // ========================================================

  {
    company: "Cognizant",
    role: "GenC",
    interviewType: "Technical",
    difficulty: "Easy",
    question:
      "What is encapsulation in Java?",
    suggestedAnswer:
      "Encapsulation combines data and methods inside a class and restricts direct access to internal data, commonly using private fields with public methods.",
    skills: ["Java", "OOP"]
  },

  {
    company: "Cognizant",
    role: "GenC",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What are SQL joins?",
    suggestedAnswer:
      "SQL joins combine rows from two or more tables using related columns. Common joins include INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL OUTER JOIN.",
    skills: ["SQL"]
  },


  // ========================================================
  // IBM
  // ========================================================

  {
    company: "IBM",
    role: "Associate Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is a REST API?",
    suggestedAnswer:
      "A REST API is an HTTP-based interface that follows REST principles and typically operates on resources using methods such as GET, POST, PUT, PATCH and DELETE.",
    skills: ["REST API", "Backend"]
  },

  {
    company: "IBM",
    role: "Associate Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "Explain exception handling in Java.",
    suggestedAnswer:
      "Java exception handling uses constructs such as try, catch, finally, throw and throws to detect and handle runtime problems while maintaining controlled program flow.",
    skills: ["Java"]
  },


  // ========================================================
  // CAPGEMINI
  // ========================================================

  {
    company: "Capgemini",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Easy",
    question:
      "What is polymorphism?",
    suggestedAnswer:
      "Polymorphism allows the same interface or method name to represent different behaviors. In Java it commonly appears through method overloading and method overriding.",
    skills: ["Java", "OOP"]
  },

  {
    company: "Capgemini",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is normalization in DBMS?",
    suggestedAnswer:
      "Normalization organizes database tables to reduce redundancy and improve data integrity. Common normal forms include 1NF, 2NF and 3NF.",
    skills: ["DBMS"]
  },


  // ========================================================
  // PHONEPE
  // ========================================================

  {
    company: "PhonePe",
    role: "Backend Developer",
    interviewType: "Technical",
    difficulty: "Medium",
    question:
      "What is JWT authentication?",
    suggestedAnswer:
      "JWT authentication uses a signed token containing claims about the user. After login, the client sends the token with protected requests and the server verifies its signature.",
    skills: ["JWT", "Backend"]
  },

  {
    company: "PhonePe",
    role: "Backend Developer",
    interviewType: "Technical",
    difficulty: "Hard",
    question:
      "How would you design a scalable payment API?",
    suggestedAnswer:
      "A scalable payment API should consider authentication, idempotency, transaction consistency, validation, retries, asynchronous processing, secure storage, logging, monitoring and horizontal scaling.",
    skills: ["Backend", "System Design"]
  },


  // ========================================================
  // FLIPKART
  // ========================================================

  {
    company: "Flipkart",
    role: "SDE",
    interviewType: "Coding",
    difficulty: "Medium",
    question:
      "How would you find the second largest element in an array?",
    suggestedAnswer:
      "Traverse the array once while maintaining the largest and second-largest distinct values. This can be solved in O(n) time with O(1) extra space.",
    skills: ["DSA", "Arrays"]
  },

  {
    company: "Flipkart",
    role: "SDE",
    interviewType: "Technical",
    difficulty: "Hard",
    question:
      "How would you improve the performance of a high-traffic e-commerce backend?",
    suggestedAnswer:
      "Possible techniques include caching, database indexing, query optimization, load balancing, asynchronous processing, horizontal scaling, CDN usage and careful service decomposition.",
    skills: ["Backend", "System Design"]
  },


  // ========================================================
  // GENERAL HR FALLBACK QUESTIONS
  // ========================================================

  {
    company: "General",
    role: "Software Engineer",
    interviewType: "HR",
    difficulty: "Easy",
    question:
      "Tell me about yourself.",
    suggestedAnswer:
      "Give a concise introduction covering your education, important technical skills, relevant projects and the type of software role you are seeking.",
    skills: ["Communication"]
  },

  {
    company: "General",
    role: "Software Engineer",
    interviewType: "HR",
    difficulty: "Medium",
    question:
      "What are your strengths and weaknesses?",
    suggestedAnswer:
      "Choose strengths relevant to the job and support them with examples. For a weakness, mention a genuine improvement area and explain what you are doing to improve it.",
    skills: ["Communication"]
  },

  {
    company: "General",
    role: "Software Engineer",
    interviewType: "HR",
    difficulty: "Medium",
    question:
      "Where do you see yourself in five years?",
    suggestedAnswer:
      "Focus on developing strong technical expertise, taking greater responsibility, contributing to meaningful projects and growing within the organization.",
    skills: ["Communication"]
  }

];


// ==========================================================
// SEED DATABASE
// ==========================================================

const seedInterviewQuestions =
  async () => {

    try {

      if (!process.env.MONGO_URI) {

        throw new Error(
          "MONGO_URI is missing from .env"
        );

      }


      await mongoose.connect(
        process.env.MONGO_URI
      );


      console.log(
        "MongoDB connected"
      );


      // Remove previous interview question seed data
      await InterviewQuestion.deleteMany(
        {}
      );


      // Insert fresh questions
      const inserted =
        await InterviewQuestion.insertMany(
          questions
        );


      console.log(
        `${inserted.length} interview questions inserted successfully`
      );


    } catch (error) {

      console.error(
        "Interview question seed error:",
        error
      );


    } finally {

      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed"
      );

    }

  };


seedInterviewQuestions();
