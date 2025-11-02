import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form values
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  }, [setValue]);

  // Handle input blur (mark field as touched)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur if validation rules exist
    if (validationRules[name]) {
      validateField(name, values[name]);
    }
  }, [values, validationRules]);

  // Validate single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
        return error;
      }
    }

    // Clear error if validation passes
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
    return null;
  }, [values, validationRules]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = values[fieldName];
      const rules = validationRules[fieldName];

      for (const rule of rules) {
        const error = rule(fieldValue, values);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validate form
      const isValid = validateForm();
      
      if (!isValid) {
        return;
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm, validationRules]);

  // Get field props for easy binding
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : null
  }), [values, handleChange, handleBlur, errors, touched]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    handleSubmit,
    getFieldProps,
    // Computed values
    hasErrors: Object.values(errors).some(error => error !== null),
    isValid: Object.keys(validationRules).length === 0 || 
             Object.keys(validationRules).every(key => !errors[key])
  };
};

// Common validation rules
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Este campo é obrigatório';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email inválido';
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const cleanPhone = value.replace(/\D/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(value) ? null : 'Telefone inválido';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Mínimo de ${min} caracteres`;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Máximo de ${max} caracteres`;
  }
};