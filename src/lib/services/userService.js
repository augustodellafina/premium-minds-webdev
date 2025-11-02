export class UserService {
  static validateUser(userData) {
    const errors = {};
    
    if (!userData.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!userData.email?.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!this.isValidEmail(userData.email)) {
      errors.email = 'Email deve ter formato válido';
    }
    
    if (!userData.phone?.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (!this.isValidPhone(userData.phone)) {
      errors.phone = 'Telefone deve ter formato válido';
    }
    
    if (!userData.userTypes?.length) {
      errors.userTypes = 'Selecione pelo menos um tipo de utilizador';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidPhone(phone) {
    // Portuguese phone format validation
    const phoneRegex = /^(\+351)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  
  static formatUserForDisplay(user) {
    return {
      ...user,
      userTypesDisplay: user.userTypes.join(', '),
      phoneDisplay: this.formatPhone(user.phone)
    };
  }
  
  static formatPhone(phone) {
    // Format: +351 xxx xxx xxx
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('351')) {
      const number = cleaned.slice(3);
      return `+351 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
    return phone;
  }
  
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  }
}