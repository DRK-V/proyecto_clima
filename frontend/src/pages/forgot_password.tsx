import React, { useState } from 'react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const checkEmailExists = async (email: string) => {
        try {
            const response = await fetch('https://back-clima-latest.onrender.com/api/users/checkEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const result = await response.json();
                return result; // Devuelve el id si el correo existe
            } else {
                return null; // Si el correo no existe o hay un error
            }
        } catch (error) {
            console.error('Error al verificar el correo:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const emailExists = await checkEmailExists(email);

            if (emailExists) {
                // Si el correo existe, enviar el correo de restablecimiento
                const response = await fetch('https://back-clima-latest.onrender.com/api/users/reques', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    setModalMessage('Correo de restablecimiento enviado.');
                    setModalOpen(true);
                } else {
                    setModalMessage('Error al enviar el correo, inténtelo más tarde.');
                    setModalOpen(true);
                }
            } else {
                setModalMessage('Correo no válido.');
                setModalOpen(true);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setModalMessage('Error al enviar el correo, inténtelo más tarde.');
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        window.location.href = '/login'; // Redireccionar a la página de login
    };

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
                <h2 className="text-2xl font-semibold text-center text-violet-700 mb-6">Recuperar Contraseña</h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-violet-700">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                    Enviar Enlace de Restablecimiento
                </button>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-violet-600 hover:text-violet-800">
                        Volver al Inicio de Sesión
                    </a>
                </div>
            </form>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-violet-700 mb-4 text-center">{modalMessage}</h3>
                        <button
                            onClick={closeModal}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
