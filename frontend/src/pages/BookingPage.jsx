import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}


export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const expert = location.state?.expert;
  const slot = location.state?.slot;

  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!expert || !slot) {
    return (
      <div className="page-container">
        <div className="alert alert-error">No slot selected.</div>
        <button className="btn btn-outline mt-4" onClick={() => navigate(`/expert/${id}`)}>
          Go back
        </button>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
     const payload = {
    expertID: expert._id,
    clientName: form.name.trim(),
    clientEmail: form.email.trim().toLowerCase(),
    clientPhoneNumber: form.phone.trim(),
    date: slot.date,
    timeSlot: slot.time,
    notes: form.notes.trim(),
    };
    await createBooking(payload);
      setBookingId(res.data._id || res.data.bookingId || '');
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Booking failed; slot may be taken.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: 520, margin: '3rem auto', textAlign: 'center' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1.5rem',
            }}
          >
            
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Booking confirmed</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Your session with <strong>{expert.name}</strong> has been booked.
          </p>

          <div className="card p-3 mb-6" style={{ textAlign: 'left' }}>
            <h4 className="section-title">Booking details</h4>
            <div className="flex flex-col gap-2">
              {[
                ['Expert', expert.name],
                ['Date', formatDate(slot.date)],
                ['Time', `${slot.startTime} – ${slot.endTime}`],
                ['Name', form.name],
                ['Email', form.email],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between" style={{ fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/my-bookings')}
            >
              View bookings
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Find experts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn btn-outline btn-sm mb-6" onClick={() => navigate(`/expert/${expert._id}`)}>
        Back
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '.25rem' }}>Complete your booking</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Fill in your details.
            </p>

            {apiError && (
              <div className="alert alert-error mb-4">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="form-group">
                  <label className="form-label">Full name *</label>
                  <input
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    type="number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Email *</label>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Used to retrieve bookings later.
                </span>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-input"
                  name="notes"
                  placeholder="Any specific topics?"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Confirm'}
              </button>
            </form>
          </div>
        </div>

        <div className="sticky">
          <div className="card">
            <div className="card-body">
              <h3 className="section-title">Summary</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="avatar avatar-sm"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  {expert.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{expert.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{expert.category} expert</p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="flex flex-col gap-2">
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>DATE</p>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{formatDate(slot.date)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>TIME</p>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{slot.startTime} – {slot.endTime}</p>
                </div>
              </div>

              <div className="mt-4 p-2" style={{ background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                <p style={{ fontSize: '0.78rem', color: '#92400e' }}>
                  This slot will be reserved once confirmed; slots fill quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}