import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// const API_URL = "https://fuzzy-space-couscous-wrj7wqqqpwpv3rgr-5000.app.github.dev/api/employees";
const API_URL = "https://api.nikhilaapp.com/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Name and Email required");
      return;
    }
    try {
      await axios.post(API_URL, form);
      setForm({ name: "", email: "" });
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  return (
    <div className="container">
      <h2>React + MongoDB Employee UI</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th width="80">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  <button onClick={() => handleDelete(emp._id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
