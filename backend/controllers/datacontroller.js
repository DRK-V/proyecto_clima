const supabase = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para registrar un usuario
const registerUser = async (req, res) => {
    const { username, email, password, full_name, phone } = req.body;

    // Validar que los campos obligatorios están presentes
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Los campos username, email y password son requeridos.' });
    }

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la tabla 'usuarios'
        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    username,
                    email,
                    password: hashedPassword, // Guardar contraseña encriptada
                    full_name,
                    phone,
                }
            ]);

        // Manejar errores de Supabase
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Responder con éxito
        res.status(201).json({ message: 'Usuario registrado exitosamente.', data });
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validar que los campos obligatorios están presentes
    if (!email || !password) {
        return res.status(400).json({ message: 'Los campos email y password son requeridos.' });
    }

    try {
        // Buscar usuario por email en la tabla 'usuarios'
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        // Manejar errores de Supabase
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Validar la contraseña
        if (data && await bcrypt.compare(password, data.password)) {
            res.status(200).json({ message: 'Inicio de sesión exitoso.', user: data });
        } else {
            res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
        }
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// Función para verificar email
const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        // Si el correo existe, retornamos el id y correo
        res.json({ id: data.id, email: data.email });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar el correo' });
    }
};


// Solicitar restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    console.log('Solicitud de restablecimiento de contraseña recibida para:', req.body.email);
    
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El campo email es requerido.' });
    }

    try {
        // Buscar al usuario por email
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(400).json({ message: 'El correo no está registrado.' });
        }

        // Generar el token de JWT
        const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Crear el enlace de restablecimiento
        const resetLink = `${process.env.RESET_PASSWORD_URL}?id=${data.id}&email=${data.email}&token=${token}`;

        // Configuración del correo electrónico
        const userMsg = {
            to: email,
            from: 'flv3dsc@gmail.com', // Cambia por tu correo verificado
            subject: 'Restablecimiento de contraseña',
            text: `Estimado usuario,

            Para restablecer tu contraseña, haz clic en el siguiente enlace:
            ${resetLink}

            Este enlace es válido por 15 minutos. Si no solicitaste este cambio, por favor ignora este mensaje.
            `,
        };

        // Enviar el correo
        await sgMail.send(userMsg);

        res.json({ message: 'Correo de restablecimiento enviado.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al solicitar restablecimiento de contraseña.' });
    }
};

// Procesar el enlace de restablecimiento (GET)
const handleResetLink = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token es requerido.' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Responder con el email y el token para usarse en el frontend
        res.json({
            id: decoded.id,
            email: decoded.email,
            token,
        });
    } catch (err) {
        console.error('Error al procesar el enlace:', err);
        res.status(400).json({ message: 'El enlace es inválido o ha expirado.' });
    }
};
// Cambiar la contraseña
const resetPassword = async (req, res) => {
    const { id, email, password } = req.body;

    if (!id || !email || !password) {
        return res.status(400).json({ message: 'Los campos id, email y password son requeridos.' });
    }

    try {
        // Buscar al usuario por ID y email
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('id', id)
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar la contraseña del usuario
        const { error: updateError } = await supabase
            .from('usuarios')
            .update({ password: hashedPassword }) // Asegúrate de que el campo en la base de datos es `password`
            .eq('id', id)
            .eq('email', email);

        if (updateError) {
            return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
        }

        res.json({ message: 'Contraseña cambiada con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};
exports.addProduct = async (req, res) => {
    const { nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio } = req.body;

    try {
        // Validar que los campos obligatorios estén presentes
        if (!nombre_producto || stock_disponible === undefined || !precio) {
            return res.status(400).json({ error: "Los campos nombre_producto, stock_disponible y precio son obligatorios" });
        }

        // Insertar el producto en Supabase
        const { data, error } = await supabase
            .from("producto")
            .insert([{ nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Producto agregado exitosamente", product: data[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = { 
    registerUser,
    loginUser,
    checkEmail,
    requestPasswordReset,
    handleResetLink,
    resetPassword
};
