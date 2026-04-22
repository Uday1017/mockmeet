import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const SKILLS_SUGGESTIONS = [
  "DSA",
  "System Design",
  "React",
  "Node.js",
  "Python",
  "Machine Learning",
  "DevOps",
  "Docker",
  "AWS",
  "MongoDB",
  "SQL",
  "Java",
  "Spring Boot",
  "TypeScript",
  "GraphQL",
  "Redis",
  "Kubernetes",
  "C++",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "OOP",
  "Low Level Design",
  "High Level Design",
];

const ROLE_SUGGESTIONS = [
  "SDE-1",
  "SDE-2",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "ML Engineer",
  "Data Engineer",
  "Mobile Developer",
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    college: user?.college || "",
    city: user?.city || "",
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    targetRoles: user?.targetRoles || [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState({ offered: "", wanted: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Skill tag handlers ──
  const addSkill = (type, skill) => {
    const key = type === "offered" ? "skillsOffered" : "skillsWanted";
    const trimmed = skill.trim();
    if (!trimmed || form[key].includes(trimmed)) return;
    setForm({ ...form, [key]: [...form[key], trimmed] });
    setSkillInput({ ...skillInput, [type]: "" });
  };

  const removeSkill = (type, skill) => {
    const key = type === "offered" ? "skillsOffered" : "skillsWanted";
    setForm({ ...form, [key]: form[key].filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(type, skillInput[type]);
    }
  };

  // ── Role tag handlers ──
  const toggleRole = (role) => {
    if (form.targetRoles.includes(role)) {
      setForm({
        ...form,
        targetRoles: form.targetRoles.filter((r) => r !== role),
      });
    } else {
      setForm({ ...form, targetRoles: [...form.targetRoles, role] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.put("/users/me", form);
      setUser(response.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-lg sm:text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill your skills carefully — this powers the matching algorithm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <Section title="Basic Info">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Uday Gundu"
              />
              <InputField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Hyderabad"
              />
            </div>
            <InputField
              label="College"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="JNTU Hyderabad"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio{" "}
                <span className="text-gray-400 font-normal">
                  (max 200 chars)
                </span>
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Final year CS student targeting SDE-1 roles..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {form.bio.length}/200
              </p>
            </div>
          </Section>

          {/* Target roles */}
          <Section
            title="Target Roles"
            description="What roles are you interviewing for?"
          >
            <div className="flex flex-wrap gap-2">
              {ROLE_SUGGESTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    form.targetRoles.includes(role)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </Section>

          {/* Skills offered */}
          <Section
            title="Skills You Can Teach"
            description="What can you teach others? These show up in matches."
          >
            <SkillInput
              type="offered"
              skills={form.skillsOffered}
              input={skillInput.offered}
              suggestions={SKILLS_SUGGESTIONS}
              onInputChange={(v) =>
                setSkillInput({ ...skillInput, offered: v })
              }
              onAdd={(s) => addSkill("offered", s)}
              onRemove={(s) => removeSkill("offered", s)}
              onKeyDown={(e) => handleSkillKeyDown(e, "offered")}
              color="green"
            />
          </Section>

          {/* Skills wanted */}
          <Section
            title="Skills You Want to Learn"
            description="What do you want others to teach you?"
          >
            <SkillInput
              type="wanted"
              skills={form.skillsWanted}
              input={skillInput.wanted}
              suggestions={SKILLS_SUGGESTIONS}
              onInputChange={(v) => setSkillInput({ ...skillInput, wanted: v })}
              onAdd={(s) => addSkill("wanted", s)}
              onRemove={(s) => removeSkill("wanted", s)}
              onKeyDown={(e) => handleSkillKeyDown(e, "wanted")}
              color="blue"
            />
          </Section>

          {/* Error / success */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl">
              Profile updated successfully!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Reusable components ──

const Section = ({ title, description, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-400 mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const SkillInput = ({
  type,
  skills,
  input,
  suggestions,
  onInputChange,
  onAdd,
  onRemove,
  onKeyDown,
  color,
}) => {
  const tagColors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
  };
  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s),
  );

  return (
    <div className="space-y-3">
      {/* Added skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tagColors[color]}`}
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemove(skill)}
                className="hover:opacity-60 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a skill and press Enter..."
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Suggestions */}
      {input && filtered.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtered.slice(0, 6).map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAdd(s)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
