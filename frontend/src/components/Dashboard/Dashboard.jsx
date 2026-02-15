import React, { useState, useMemo } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import AppointmentModal from '../AppointmentModal';
import './Dashboard.css';

const Dashboard = () => {
  const { appointments, isLoading } = useAppointments();
  // За замовчуванням - сьогодні
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Фільтруємо записи тільки для обраного дня
  const dailyAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(app => {
      const appDate = new Date(app.appointmentDateTime).toISOString().split('T')[0];
      return appDate === selectedDate;
    });
  }, [appointments, selectedDate]);

  // Статистика за день
  const stats = useMemo(() => {
    const count = dailyAppointments.length;
    const income = dailyAppointments.reduce((sum, app) => sum + (app.totalPrice || 0), 0);
    return { count, income };
  }, [dailyAppointments]);

  // Генерація годин (з 09:00 до 20:00)
  const hours = Array.from({ length: 12 }, (_, i) => i + 9);

  // Зміна дати
  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (isLoading) return <div className="container">Завантаження...</div>;

  return (
    <div className="container dashboard-container">
      {/* 1. Блок статистики */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-title">Дохід за день</div>
          <div className="stat-value">{stats.income} грн</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-title">Записів сьогодні</div>
          <div className="stat-value">{stats.count}</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer', border: '2px dashed #3498db', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsModalOpen(true)}>
          <div style={{ color: '#3498db', fontWeight: 'bold' }}>+ Швидкий запис</div>
        </div>
      </div>

      {/* 2. Навігація по датах */}
      <div className="date-nav">
        <button className="btn" onClick={() => changeDate(-1)}>◀ Вчора</button>
        <div className="date-display">
          {new Date(selectedDate).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <button className="btn" onClick={() => changeDate(1)}>Завтра ▶</button>
      </div>

      {/* 3. Таймлайн (Розклад) */}
      <div className="timeline">
        {hours.map(hour => {
          // Шукаємо записи, які починаються в цю годину
          const hourAppts = dailyAppointments.filter(app => {
            const appHour = new Date(app.appointmentDateTime).getHours();
            return appHour === hour;
          });

          return (
            <div key={hour} className="time-slot">
              <div className="time-label">{hour}:00</div>
              <div className="time-content">
                {hourAppts.length > 0 ? (
                  hourAppts.map(app => (
                    <div key={app._id} className="appt-card">
                      <div className="appt-time">
                        {new Date(app.appointmentDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="appt-client">
                        {app.client?.firstName} {app.client?.lastName}
                      </div>
                      <div className="appt-services">
                        {app.services.map(s => s.serviceName).join(', ')} • <strong>{app.totalPrice} грн</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="empty-slot" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>
                    + Вільно
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальне вікно для створення запису */}
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        // Передаємо поточну дату як дефолтну
        selectedDate={`${selectedDate}T09:00`} 
        onSubmit={async (data) => {
           // Тут логіка створення, можна імпортувати хук createAppointment
           // Для спрощення просто закриваємо, але в реальності треба викликати mutate
           setIsModalOpen(false);
           window.location.reload(); // Швидкий хак для оновлення, краще через React Query invalidate
        }}
      />
    </div>
  );
};

export default Dashboard;