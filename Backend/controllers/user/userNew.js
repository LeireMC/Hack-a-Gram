const getDB = require('../../db/getDB');
const bcrypt = require('bcrypt');
const { generateError } = require('../../helpers');

const userNew = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            throw generateError(
                '¿Seguro que has puesto todos los datos necesarios? Hacen falta campos obligatorios',
                400
            );
        }

        const [usersWithSameEmail] = await connection.query(
            `select id from user where email = ?`,
            [email]
        );
        if (usersWithSameEmail.length > 0) {
            throw generateError(
                'Ya hay un usuario registrado con ese email.',
                409
            );
        }

        const [usersWithSameUsername] = await connection.query(
            `select id from user where username = ?`,
            [username]
        );
        if (usersWithSameUsername.length > 0) {
            throw generateError(
                'Ya hay un usuario registrado con ese nombre de usuario. Por favor elige otro.',
                409
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            `
   insert into user (name, username, email, password, privacy, createdAt) values (?,?,?,?,?,?)`,
            [name, username, email, hashedPassword, 'public', new Date()]
        );

        res.send({
            status: 'Ok',
            message: 'Usuario registrado con éxito. ¡Bienvenid@ a Hack a Gram!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userNew;
