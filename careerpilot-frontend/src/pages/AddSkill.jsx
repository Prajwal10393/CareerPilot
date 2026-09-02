import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://careerpilot-wxja.onrender.com";

function AddSkill() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const editId = params.get("edit");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    score: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (editId) {
      loadSkill();
    }
  }, [editId]);

  const loadSkill = async () => {
    try {
      setFetching(true);

      const response = await fetch(
        `${API_URL}/api/student/skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load skill"
        );
      }

      const skills = data.skills || data.data || [];

      const skill = skills.find(
        (item) => item._id === editId
      );

      if (!skill) {
        throw new Error("Skill not found");
      }

      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        level: skill.level || "",
        score:
          skill.score ??
          skill.proficiency ??
          "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.level) {
      setError("Please select proficiency level.");
      return;
    }

    const score = Number(formData.score);

    if (
      formData.score === "" ||
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      setError(
        "Proficiency score must be between 0 and 100."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        level: formData.level,
        score,
        proficiency: score,
      };

      const url = editId
        ? `${API_URL}/api/student/skills/${editId}`
        : `${API_URL}/api/student/skills`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${editId ? "update" : "add"} skill`
        );
      }

      navigate("/skills");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="add-skill-page">
        <div className="add-skill-loading">
          Loading skill...
        </div>
      </div>
    );
  }

  return (
    <div className="add-skill-page">
      {/* NO SEARCH BAR */}

      <div className="add-skill-header">
        <h1>
          {editId ? "Edit Skill" : "Add Skill"}
        </h1>

        <p>
          {editId
            ? "Update your skill information and proficiency."
            : "Add a technical or professional skill to your CareerPilot profile."}
        </p>
      </div>

      <form
        className="add-skill-form"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="add-skill-error">
            {error}
          </div>
        )}

        <div className="add-skill-field">
          <label htmlFor="name">
            Skill Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter skill name (e.g. Java, Python, React)"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-skill-field">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select category
            </option>

            <option value="Programming">
              Programming
            </option>

            <option value="Database">
              Database
            </option>

            <option value="Web Development">
              Web Development
            </option>

            <option value="Framework">
              Framework
            </option>

            <option value="Cloud">
              Cloud
            </option>

            <option value="DevOps">
              DevOps
            </option>

            <option value="Data Science">
              Data Science
            </option>

            <option value="AI / ML">
              AI / ML
            </option>

            <option value="Soft Skill">
              Soft Skill
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="add-skill-field">
          <label htmlFor="level">
            Proficiency Level
          </label>

          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">
              Select proficiency level
            </option>

            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>
          </select>
        </div>

        <div className="add-skill-field">
          <label htmlFor="score">
            Proficiency Score (%)
          </label>

          <input
            id="score"
            type="number"
            name="score"
            min="0"
            max="100"
            placeholder="Enter score (0 to 100)"
            value={formData.score}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-skill-actions">
          <button
            type="submit"
            className="add-skill-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Skill"
              : "Save Skill"}
          </button>

          <button
            type="button"
            className="add-skill-cancel-btn"
            onClick={() => navigate("/skills")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSkill;
