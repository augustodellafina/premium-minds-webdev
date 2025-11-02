import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../lib/context/UserContext';
import { useNotification } from '../lib/hooks/useNotification';
import { NOTIFICATION_MESSAGES } from '../lib/constants/notifications';
import { Button, Input, Modal } from '../components';
import './UsersListPage.scss';

export function UsersListPage() {
  const navigate = useNavigate();
  const { users, deleteUser } = useUserContext();
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userTypes?.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleDeleteClick = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteModal.user) {
        deleteUser(deleteModal.user.id);
        showSuccess(NOTIFICATION_MESSAGES.USER_DELETED);
      }
    } catch (error) {
      showError(NOTIFICATION_MESSAGES.GENERIC_ERROR);
      console.error('Error deleting user:', error);
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleEdit = (user) => {
    navigate(`/user/${user.id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Lista de Utilizadores</h1>
      </div>

      <div className="page-content">
        <div className="search-bar">
          <Input
            type="text"
            placeholder="Pesquisar utilizadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="medium"
            fullWidth
          />
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.userTypes?.join(', ')}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              {users.length === 0 
                ? 'Nenhum utilizador cadastrado ainda.'
                : 'Nenhum utilizador encontrado com os critérios de busca.'
              }
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        title="Confirmar exclusão"
        size="small"
      >
        <div className="delete-confirmation">
          <p>
            Tem certeza que deseja excluir o usuário <strong>{deleteModal.user?.name}</strong>?
          </p>
          <p className="warning-text">
            Esta ação não pode ser desfeita.
          </p>
          
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={handleDeleteCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
