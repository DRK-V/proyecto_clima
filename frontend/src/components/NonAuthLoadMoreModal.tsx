interface LoadMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    darkMode: boolean;
  }
  
  // Modal for non-authenticated users
  export const NonAuthLoadMoreModal: React.FC<LoadMoreModalProps> = ({ isOpen, onClose, onConfirm, darkMode }) => {
    const navigate = useNavigate();
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl`}>
          <h3 className="text-xl font-semibold mb-4">Iniciar sesión requerido</h3>
          <p className="mb-6">Para cargar más datos del pronóstico, debe iniciar sesión primero.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Modal for authenticated users
  export const AuthLoadMoreModal: React.FC<LoadMoreModalProps> = ({ isOpen, onClose, onConfirm, darkMode }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl`}>
          <h3 className="text-xl font-semibold mb-4">Cargar más datos</h3>
          <p className="mb-6">¿Está seguro que desea cargar más datos del pronóstico?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  };