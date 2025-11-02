import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../lib/context/UserContext';
import { useForm, validationRules } from '../lib/hooks/useForm';
import { useNotification } from '../lib/hooks/useNotification';
import { USER_TYPES } from '../lib/constants/userTypes';
import { NOTIFICATION_MESSAGES } from '../lib/constants/notifications';
import CollapsibleSection from '../components/CollapsibleSection/CollapsibleSection';
import { Button, Input } from '../components';
import { Checkbox } from '../components/Checkbox/Checkbox';

export function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, addUser, updateUser } = useUserContext();
  const { showSuccess, showError } = useNotification();
  
  // Buscar usuário por ID se estiver na URL
  const currentUser = id ? users.find(u => u.id === id) : null;
  const [editingId, setEditingId] = useState(currentUser?.id || null);

  const initialValues = {
    name: currentUser?.name || '',
    userTypes: currentUser?.userTypes || [],
    email: currentUser?.email || '',
    password: currentUser?.password || '',
    phone: currentUser?.phone || ''
  };

  const formValidationRules = {
    name: [validationRules.required],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone]
  };

  const {
    values,
    setValue,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
    getFieldProps
  } = useForm(initialValues, formValidationRules);

  const handleUserTypeChange = (type) => {
    const currentTypes = values.userTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setValue('userTypes', newTypes);
  };

  const onSubmit = async (formData) => {
    try {
      const userData = {
        ...formData,
        id: editingId || Date.now().toString()
      };

      if (editingId) {
        updateUser(editingId, userData);
        showSuccess(NOTIFICATION_MESSAGES.USER_UPDATED);
        // Se estamos editando via URL (id presente), voltar à lista
        if (id) {
          navigate('/users');
          return;
        }
      } else {
        addUser(userData);
        showSuccess(NOTIFICATION_MESSAGES.USER_CREATED);
        resetForm();
        setEditingId(null);
      }
    } catch (error) {
      showError(NOTIFICATION_MESSAGES.GENERIC_ERROR);
      console.error('Error saving user:', error);
    }
  };

  const handleCancel = () => {
    if (id) {
      // Se estamos editando via URL, voltar à lista
      navigate('/users');
    } else {
      // Se é criação nova, apenas resetar o formulário
      resetForm();
      setEditingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{editingId ? 'Editar Utilizador' : 'Novo Utilizador'}</h1>
      </div>

      <div className="page-content">
        <form className="user-form" onSubmit={handleSubmit(onSubmit)}>
          <CollapsibleSection title="Informações Básicas" isInitiallyOpen={true}>
            <Input
              label="Nome"
              placeholder="Nome completo"
              required
              {...getFieldProps('name')}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Tipo de utilizador" isInitiallyOpen={true}>
            <div className="flex flex-col gap-2 md:gap-3">
              {USER_TYPES.map(type => (
                <Checkbox
                  key={type.value}
                  label={type.label}
                  checked={(values.userTypes || []).includes(type.value)}
                  onChange={() => handleUserTypeChange(type.value)}
                />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Contacto" isInitiallyOpen={true}>
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              required
              {...getFieldProps('email')}
            />
            
            <Input
              type="password"
              label="Palavra-passe"
              placeholder="••••••••"
              {...getFieldProps('password')}
            />
            
            <Input
              type="tel"
              label="Telefone"
              placeholder="+351"
              required
              {...getFieldProps('phone')}
            />
          </CollapsibleSection>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              GUARDAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
