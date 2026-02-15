import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';
// Якщо ти хочеш використовувати стилі модалки з index.css - ок. 
// Якщо ні - можна створити AppointmentModal.css

const AppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const { clients } = useClients();
  const [formData, setFormData] = useState({
    clientId: '',
    appointmentDateTime: '',
    services: [{ serviceName: '', price: '' }], // Початково одна пуста послуга
    adminNote: ''
  });

  if (!isOpen) return null;

  // Зміна даних конкретної послуги у масиві
  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData({ ...formData, services: newServices });
  };

  // Додати рядок послуги
  const addServiceRow = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { serviceName: '', price: '' }]
    });
  };

  // Видалити рядок послуги
  const removeServiceRow = (index) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData({ ...formData, services: newServices });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>📅 Новий запис</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Вибір клієнта */}
          <div className="form-group">
            <label>Клієнт</label>
            <select 
              className="form-control"
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              required
            >
              <option value="">-- Оберіть клієнта --</option>
              {clients?.map(client => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName} ({client.phoneNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Дата */}
          <div className="form-group">
            <label>Дата та час</label>
            <input 
              type="datetime-local" 
              className="form-control"
              value={formData.appointmentDateTime}
              onChange={(e) => setFormData({...formData, appointmentDateTime: e.target.value})}
              required
            />
          </div>

          {/* Динамічні послуги */}
          <div className="form-group">
            <label>Послуги</label>
            {formData.services.map((service, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  placeholder="Назва послуги"
                  className="form-control"
                  style={{ flex: 2 }}
                  value={service.serviceName}
                  onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
                  required
                />
                <input 
                  type="number"
                  placeholder="Ціна"
                  className="form-control"
                  style={{ flex: 1 }}
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                  required
                />
                {formData.services.length > 1 && (
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: '#e74c3c', color: 'white', padding: '0 10px' }}
                    onClick={() => removeServiceRow(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: '12px', width: '100%' }} 
              onClick={addServiceRow}
            >
              + Додати ще послугу
            </button>
          </div>

          <div className="form-group">
            <label>Нотатка (необов'язково)</label>
            <textarea 
              className="form-control"
              value={formData.adminNote}
              onChange={(e) => setFormData({...formData, adminNote: e.target.value})}
            />
          </div>

          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">Створити запис</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;