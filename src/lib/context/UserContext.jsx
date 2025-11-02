import { createContext, useContext, useReducer, useEffect } from 'react';
import { UserService } from '../services/userService';

const UserContext = createContext();

// Initial state with sample data
const initialState = {
  users: [
    {
      id: '1',
      name: 'Augusto Chagas',
      userTypes: ['Web Developer', 'UI/UX Designer'],
      email: 'augusto.chagas@premium-minds.com',
      password: '••••••••',
      phone: '+351 916 534 613',
      createdAt: new Date('2025-10-03').toISOString()
    },
    {
      id: '2',
      name: 'João Silva',
      userTypes: ['Project Manager'],
      email: 'joao.silva@premium-minds.com',
      password: '••••••••',
      phone: '+351 934 123 456',
      createdAt: new Date('2025-10-03').toISOString()
    }
  ],
  loading: false,
  error: null,
  currentUser: null
};

// Action types
export const USER_ACTIONS = {
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USERS:
      return { ...state, users: action.payload, loading: false };
      
    case USER_ACTIONS.ADD_USER:
      return { 
        ...state, 
        users: [...state.users, action.payload],
        loading: false,
        error: null
      };
      
    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(u => 
          u.id === action.payload.id ? action.payload : u
        ),
        currentUser: null,
        loading: false,
        error: null
      };
      
    case USER_ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
        loading: false,
        error: null
      };
      
    case USER_ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
      
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
      
    default:
      return state;
  }
};

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('premium-minds-users');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        dispatch({ type: USER_ACTIONS.SET_USERS, payload: users });
      } catch (error) {
        console.error('Error loading users from localStorage:', error);
      }
    }
  }, []);

  // Save users to localStorage when users change
  useEffect(() => {
    if (state.users.length > 0) {
      localStorage.setItem('premium-minds-users', JSON.stringify(state.users));
    }
  }, [state.users]);

  // Actions
  const actions = {
    addUser: (userData) => {
      const validation = UserService.validateUser(userData);
      if (!validation.isValid) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: validation.errors });
        throw new Error('Validation failed');
      }
      
      const newUser = {
        ...userData,
        id: UserService.generateId(),
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: USER_ACTIONS.ADD_USER, payload: newUser });
    },
    
    updateUser: (id, userData) => {
      const validation = UserService.validateUser(userData);
      if (!validation.isValid) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: validation.errors });
        throw new Error('Validation failed');
      }
      
      const updatedUser = {
        ...userData,
        id,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: updatedUser });
    },
    
    deleteUser: (id) => {
      dispatch({ type: USER_ACTIONS.DELETE_USER, payload: id });
    },
    
    setCurrentUser: (user) => {
      dispatch({ type: USER_ACTIONS.SET_CURRENT_USER, payload: user });
    },
    
    clearCurrentUser: () => {
      dispatch({ type: USER_ACTIONS.SET_CURRENT_USER, payload: null });
    },
    
    clearError: () => {
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    }
  };

  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};