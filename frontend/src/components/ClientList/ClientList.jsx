import React, { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import ClientModal from '../ClientModal';
import './ClientList.css';

const ClientList = () => {
  const { clients, isLoading, error, addClient, updateClient, deleteClient } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Обробка пошуку
  const filteredClients = clients?.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm)
  );

  const handleAddClick = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient({ id: editingClient._id, data: formData });
      } else {
        await addClient(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка збереження');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цього клієнта?')) {
      await deleteClient(id);
    }
  };

  if (isLoading) return <div className="container">Завантаження бази...</div>;
  if (error) return <div className="container error-msg">Помилка: {error.message}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>База Клієнтів ({clients?.length})</h2>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Додати клієнта</button>
      </div>

      <div className="form-group">
        <input 
          type="text" 
          className="form-control" 
          placeholder="🔍 Пошук за ім'ям або телефоном..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>Телефон</th>
              <th>Останній візит</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients?.map(client => (
              <tr key={client._id}>
                <td>
                  <strong>{client.firstName} {client.lastName}</strong>
                  {client.birthDate && <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>🎂 {new Date(client.birthDate).toLocaleDateString()}</div>}
                </td>
                <td>
                    <a href={`tel:${client.phoneNumber}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {client.phoneNumber}
                    </a>
                </td>
                <td>
                  {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : '-'}
                </td>
                <td>
                  <button className="btn" style={{ color: '#f39c12', marginRight: '10px' }} onClick={() => handleEditClick(client)}>✎</button>
                  <button className="btn" style={{ color: '#e74c3c' }} onClick={() => handleDelete(client._id)}>🗑</button>
                </td>
              </tr>
            ))}
            {filteredClients?.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Клієнтів не знайдено</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
        initialData={editingClient}
      />
    </div>
  );
};

export default ClientList;