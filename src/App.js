import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const initialData = [
  { name: 'John Doe', date: '1990-01-01', note: 'Team lead, loves dark chocolate 🍫' },
  { name: 'Jane Smith', date: '1992-02-14', note: 'College friend 💬' },
  { name: 'Alice Johnson', date: '1993-03-10', note: 'Send flowers 🌸' },
  { name: 'Bob Brown', date: '1989-04-22', note: 'Gamer buddy 🎮' },
  { name: 'Charlie Davis', date: '1991-05-05', note: 'Neighbor, likes cookies 🍪' }
];

function getNextBirthdayInfo(dateString) {
  const today = new Date();
  const birthday = new Date(dateString);
  let next = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  return { nextDate: next.toDateString(), daysLeft: diff };
}

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', date: '', note: '' });

  useEffect(() => {
    const processed = initialData.map(p => {
      const { nextDate, daysLeft } = getNextBirthdayInfo(p.date);
      return { ...p, nextDate, daysLeft };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
    setBirthdays(processed);
  }, []);

  const handleAddBirthday = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;
    const { nextDate, daysLeft } = getNextBirthdayInfo(formData.date);
    const newEntry = { ...formData, nextDate, daysLeft };
    const updatedList = [...birthdays, newEntry].sort((a, b) => a.daysLeft - b.daysLeft);
    setBirthdays(updatedList);
    setFormData({ name: '', date: '', note: '' });
    setShowForm(false);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <section className="birthday-list">
          <h2>Upcoming Birthdays</h2>
          <table className="birthday-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Next Birthday</th>
                <th>Days Left</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {birthdays.map((p, i) => (
                <tr key={i}>
                  <td><img src={`https://i.pravatar.cc/30?u=${p.name}`} alt={p.name} className="avatar" /> {p.name}</td>
                  <td>{p.nextDate}</td>
                  <td>{p.daysLeft}</td>
                  <td>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {birthdays.length > 0 && (
          <footer className="footer-info">
            <p><strong>Total Birthdays:</strong> {birthdays.length}</p>
            <p><strong>Next Birthday:</strong> 🎈 {birthdays[0].name}</p>
            <p><strong>Days Left:</strong> {birthdays[0].daysLeft}</p>
          </footer>
        )}

        <div className="button-container">
          <button onClick={() => setShowForm(true)} className="btn add-btn">➕ Add Birthday</button>
          <button onClick={() => setBirthdays([])} className="btn clear-btn">🗑 Clear All</button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add a Birthday</h3>
              <form onSubmit={handleAddBirthday}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Note (optional)"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn add-btn">✅ Add</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn clear-btn">❌ Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="birthday-message">
          <p className="default-msg-label">✨ Default Message You Can Send:</p>
          <blockquote>
            🎉 Happy Birthday, <strong>{`{Name}`}</strong>! 🎂<br />
            Wishing you a day filled with love, laughter, and everything that brings a smile to your face.
            May this year bring you closer to your dreams and bless you with unforgettable moments.
            <br /><br />
            Enjoy your special day to the fullest! 💫<br />
            With warm wishes,<br />
            <em>{`{YourName}`}</em>
          </blockquote>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
