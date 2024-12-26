import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    interface UserData {
        id: string;
        email: string;
    }

    const [userData, setUserData] = useState<UserData | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fetchLinkData = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const id = urlParams.get('id');

            if (token && id) {
                const response = await fetch(`https://back-clima-latest.onrender.com/api/users/link?token=${token}&id=${id}`);
                if (response.ok) {
                    const result = await response.json();
                    setEmail(result.email);
                    setUserData({ id: result.id, email: result.email });
                } else {
                    setShowErrorModal(true);
                }
            }
        } catch (error) {
            console.error('Error al obtener los datos del enlace:', error);
            setShowErrorModal(true);
        }
    };

    useEffect(() => {
        fetchLinkData();
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setError('');
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        navigate('/forgot');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!userData?.id || !userData?.email) {
            setError('Datos de usuario incompletos.');
            return;
        }

        try {
            const response = await fetch('https://back-clima-latest.onrender.com/api/users/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userData.id,
                    email: userData.email,
                    password: password
                }),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setShowErrorModal(true);
        }
    };

    // Modal de Éxito
    const SuccessModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">¡Restablecimiento Exitoso!</h3>
                    <p className="text-sm text-gray-500 mb-6">Tu contraseña ha sido actualizada correctamente.</p>
                    <button
                        onClick={handleSuccessModalClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );

    // Modal de Error
    const ErrorModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Error al Restablecer</h3>
                    <p className="text-sm text-gray-500 mb-6">Por favor, inténtelo nuevamente.</p>
                    <button
                        onClick={handleErrorModalClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-violet-500 to-violet-700 overflow-hidden">
            {/* Nubes decorativas */}
            <div className="absolute top-10 left-10 w-44 h-24 bg-white rounded-full opacity-70 blur-sm"></div>
            <div className="absolute top-20 right-20 w-72 h-36 bg-white rounded-full opacity-60 blur-sm"></div>
            <div className="absolute bottom-16 left-1/3 w-56 h-28 bg-white rounded-full opacity-65 blur-md"></div>
            <div className="absolute bottom-10 right-1/4 w-64 h-32 bg-white rounded-full opacity-60 blur-md"></div>
            <div className="absolute top-1/3 left-5 w-80 h-40 bg-white rounded-full opacity-75 blur-sm"></div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="relative z-10 max-w-md w-full p-8 bg-white shadow-md rounded-3xl">
                <h2 className="text-2xl font-semibold text-center text-violet-700 mb-6">Cambiar Contraseña</h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Ingresa tu nueva contraseña para actualizar tu cuenta.
                </p>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-violet-700">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm bg-gray-100"
                    />
                </div>
                <div className="mb-6 relative">
                    <label htmlFor="password" className="block text-sm font-medium text-violet-700">Nueva Contraseña:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="mb-6 relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-violet-700">Confirmar Contraseña:</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                    Cambiar Contraseña
                </button>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-violet-600 hover:text-violet-800">
                        Volver al Inicio de Sesión
                    </a>
                </div>
            </form>

            {/* Modales */}
            {showSuccessModal && <SuccessModal />}
            {showErrorModal && <ErrorModal />}
        </div>
    );
}