import React, { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import AppointmentModal from './AppointmentModal';
// Якщо хочеш стилі таблиці локально - підключи тут: import './Appointments.css';
// (але вони вже є у index.css або ClientList.css, якщо ти їх переніс глобально)

const Appointments = () => {
  const { appointments, isLoading, createAppointment, deleteAppointment } = useAppointments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (data) => {
    try {
      await createAppointment(data);
      setIsModalOpen(false);
    } catch (error) {
      alert('Помилка: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Видалити цей запис?')) {
      await deleteAppointment(id);
    }
  };

  if (isLoading) return <div className="container">Завантаження...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Історія Записів</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Новий запис</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клієнт</th>
              <th>Послуги</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map(app => (
              <tr key={app._id}>
                <td>
                  {new Date(app.appointmentDateTime).toLocaleDateString()} <br/>
                  <small style={{color: '#7f8c8d'}}>
                    {new Date(app.appointmentDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </small>
                </td>
                <td>
                    {app.client ? (
                        <>
                            <strong>{app.client.firstName} {app.client.lastName}</strong><br/>
                            <small>{app.client.phoneNumber}</small>
                        </>
                    ) : <span style={{color: 'red'}}>Клієнт видалений</span>}
                </td>
                <td>
                  {app.services.map((s, i) => (
                    <div key={i}>• {s.serviceName}</div>
                  ))}
                  {app.adminNote && <small style={{color:'orange'}}>Note: {app.adminNote}</small>}
                </td>
                <td><strong>{app.totalPrice} грн</strong></td>
                <td>
                  <span style={{
                    padding: '5px 10px', 
                    borderRadius: '15px',
                    fontSize: '12px',
                    background: app.status === 'completed' ? '#2ecc71' : '#f1c40f',
                    color: app.status === 'completed' ? 'white' : 'black'
                  }}>
                    {app.status === 'scheduled' ? 'Заплановано' : app.status}
                  </span>
                </td>
                <td>
                  <button className="btn" style={{color: '#e74c3c'}} onClick={() => handleDelete(app._id)}>🗑</button>
                </td>
              </tr>
            ))}
            {appointments?.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Записів поки немає</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Appointments;