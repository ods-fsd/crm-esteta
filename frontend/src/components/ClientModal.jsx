import React, { useState, useEffect } from 'react';

const ClientModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    socialMediaLink: ''
  });

  // Якщо є initialData - ми в режимі редагування, заповнюємо форму
  useEffect(() => {
    if (initialData) {
      // Форматуємо дату для input type="date"
      let formattedDate = '';
      if (initialData.birthDate) {
        formattedDate = new Date(initialData.birthDate).toISOString().split('T')[0];
      }
      
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phoneNumber: initialData.phoneNumber,
        birthDate: formattedDate,
        socialMediaLink: initialData.socialMediaLink || ''
      });
    } else {
      // Очищаємо форму для нового клієнта
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthDate: '',
        socialMediaLink: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{initialData ? 'Редагувати клієнта' : 'Новий клієнт'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ім'я</label>
            <input name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Прізвище</label>
            <input name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} placeholder="0501234567" required />
          </div>
          <div className="form-group">
            <label>Дата народження</label>
            <input type="date" name="birthDate" className="form-control" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Соцмережі (посилання)</label>
            <input name="socialMediaLink" className="form-control" value={formData.socialMediaLink} onChange={handleChange} />
          </div>

          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">Зберегти</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;