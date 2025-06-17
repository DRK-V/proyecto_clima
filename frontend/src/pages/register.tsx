import React, { useState, useEffect } from 'react';
import { CloudRain } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');

    useEffect(() => {
        if (popupMessage) {
            const timer = setTimeout(() => {
                setPopupMessage('');
                if (popupType === 'success') {
                    window.location.href = '/login';
                }
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [popupMessage, popupType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('https://back-clima-latest.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setPopupType('success');
                setPopupMessage('Usuario registrado exitosamente.');
            } else {
                setPopupType('error');
                setPopupMessage(result.message || 'El correo ya se encuentra registrado.');
            }
        } catch {
            setPopupType('error');
            setPopupMessage('Error al registrar usuario.');
        }
    };

    const handleBackToLogin = () => {
        // Lógica para redirigir al login o navegar de vuelta a la página anterior
        window.location.href = '/login'; // Suponiendo que '/login' es la ruta del login
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Popup encima del contenido */}
            {popupMessage && (
                <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs p-4 text-center rounded-xl shadow-lg animate-fade-in ${popupType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                    {popupMessage}
                </div>
            )}

            {/* Decorative Interactive Clouds */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, index) => (
                    <CloudRain
                        key={index}
                        className={`absolute w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-white/30 animate-float`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 20 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Logo */}
            <div className="text-white text-center mb-8">
                <CloudRain className="w-12 h-12 mx-auto mb-2 animate-spin-slow" />
                <h1 className="text-3xl font-semibold">Weather Watch</h1>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-md">
                <h2 className="text-2xl text-blue-700 font-medium mb-6">Registro</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-blue-700">Nombre de usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-blue-700">Correo electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-blue-700">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="full_name" className="block text-sm font-medium text-blue-700">Nombre completo:</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-medium text-blue-700">Teléfono:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="space-y-4">
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                            Registrar
                        </button>
                        <button type="button" onClick={handleBackToLogin} className="w-full py-2 px-4 border border-blue-500 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                            Regresar al login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
