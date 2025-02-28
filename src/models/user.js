import { connection } from "../core/database.js";
import { encryptPassword } from '../utils/hash.js';


class User{
    constructor() {
        this.thread = connection
    }

    async create(username, email, password ){
        try{
            const [existingUser] = await connection.execute(
                'SELECT username, email FROM users WHERE username = ? OR email = ?',
                [username, email]
            )
            if (existingUser.length > 0){
                if (existingUser[0].username === username){
                    throw new Error('username')
                } else if (existingUser[0].email === email){
                    throw new Error('email')
                }
            }

            const emailRegex = /^[^\s@]+@[^\s@\d]+\.[^\d\s@]+/;
            if  (!emailRegex.test(email)) {
                throw new Error('Invalid email')}
            const passwords = 'yow';
            const ass = encryptPassword(passwords)
            console.log(ass)
            const hashPassword = encryptPassword(password)
            const [result,] = await connection.execute(
                'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
                [username,email,hashPassword],
            );
            return result;
        } catch (err) {
            console.error('<error> user.create', err)
            throw err
        }
    }

    async verify(username,password){
        try{
            const hashPassword = encryptPassword(password)
            const [result,] = await connection.execute(
                'SELECT user_id, username, email FROM users WHERE username = ? AND password = ?',
                [username, hashPassword],
            );

            return result?.[0];
        } catch (err){
            console.error('<error> user.verify', err)
            throw err
        }
    }

    async getUser(username){
        try{
            const [result,] = await connection.execute(
                'SELECT user_id, username, email, balance FROM users WHERE username = ?',
                [username]
            )
            return result?.[0];
        } catch (err){
            console.error('<error> user.getInformation', err)
            throw err
        }
    }


    async addBalance(username, amount) {
        try {
            if (!username || !amount) {
                throw new Error("Username or amount is missing");
            }
    
            const [result] = await connection.execute(
                'UPDATE users SET balance = balance + ? WHERE username = ?',
                [amount, username]
            );
    
            if (result.affectedRows > 0) {
           
                const [rows] = await connection.execute(
                    'SELECT username, email, balance FROM users WHERE username = ?',
                    [username]
                );
                return rows[0]; 
            } else {
                return null; 
            }
        } catch (err) {
            console.error('<error> user.addBalance', err);
            throw err;
        }
    }
    
    
    
    


    async getProfileAccountPost(userId){
        try{
            const [result,] = await connection.execute(
                `SELECT 
                    u.user_id, 
                    u.username, 
                    p.content,
                    p.post_id,
                    p.parent_repost_id,
                    u.profile_image,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(r.replies_count, 0) AS replies_count,
                    (SELECT COUNT(*) FROM posts WHERE parent_repost_id = p.post_id) AS repost_count
                FROM posts p 
                JOIN users u ON p.user_id = u.user_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l 
                ON p.post_id = l.post_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) r 
                ON p.post_id = r.post_id
                WHERE u.user_id = ?
                ORDER BY p.created_at DESC;`,
                [userId]
            )

            return result
        } catch (err){
            console.error('<error> user.getProfileAccountPost', err);
            throw err;
        }
    }

    async updateUser(currentUsername, newUsername, currentPass, newPassword, bio, profile_img){
        try {
            if (currentPass){
                const [user] = await connection.execute(
                    'SELECT password FROM users WHERE username = ?',
                    [currentUsername]
                );
    
                if (user.length === 0 || encryptPassword(currentPass) !== user[0].password){
                    throw new Error('Current Password is incorrect.')
                }
            }

            const fieldsToUpdate = [];
            const values = []

            if (newUsername) {
                fieldsToUpdate.push('username = ?');
                values.push(newUsername);
            }

            if (newPassword) {
                const hashPassword = encryptPassword(newPassword);
                fieldsToUpdate.push('password = ?');
                values.push(hashPassword);
            }

            if (bio){
                fieldsToUpdate.push('bio = ?');
                values.push(bio);
            }

            if (profile_img) {
                fieldsToUpdate.push('profile_image = ?');
                values.push(profile_img);
            }

            console.log('field', fieldsToUpdate)
            console.log('value', values)
            console.log('current', currentUsername)

            values.push(currentUsername);

            const [result, ] = await connection.execute(
                `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE username = ?`,
                values,
            )

            return result;
        } catch (err){
            console.error('<error> user.updateUser', err);
            throw err;
        }
    }

    async deleteUser(username){
        try{
            const [result] = await connection.execute(
                'DELETE FROM users WHERE username = ?',
                [username]
            )

            return result;
        } catch (err){
            console.error('<error> user.deleteUser', err);
            throw err;
        }
    }

    async requestPasswordReset(email) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000);
            //const otpHash = encryptPassword(otp.toString());

            const otpExpier = new Date();
            otpExpier.setMinutes(otpExpier.getMinutes() + 5);
            
            console.log("OTP:", otp); 
            //console.log("Hashed OTP:", otpHash);
            console.log("Reset expiration:", otpExpier); 
            
            const [result] = await connection.execute(
                'UPDATE users SET reset_otp = ?, reset_expr = ? WHERE email = ?',
                [otp, otpExpier, email]
            );    
            if (result.affectedRows === 0) {
                throw new Error('No user found with that email address.');
            }

        
            await transporter.sendMail({
                to: email,
                subject: 'Password Reset',
                text: `You requested a password reset: ${otp}`
            });

            return { message: 'Password reset token sent to your email.' };
        } catch (err) {
            console.error('<error> user.requestPasswordReset', err);
            throw err;
        }
    }

    async resetPassword(otp, newPassword) {
        try {
    
            //const hashedotp = encryptPassword(otp.toString());

           
            const [result,] = await connection.execute(
                'SELECT * FROM users WHERE reset_otp = ? AND reset_expr > ?',
                [otp, new Date()]
            );

            if (!result.length) {
                throw new Error('Invalid or expired token');
            }

            const user = result[0];
            const hashPassword = encryptPassword(newPassword);

    
            await connection.execute(
                'UPDATE users SET password = ?, reset_otp = NULL, reset_expr = NULL WHERE user_id = ?',
                [hashPassword, user.user_id]
            );

            return { message: 'Password has been reset successfully.' };
        } catch (err) {
            console.error('<error> user.resetPassword', err);
            throw err;
        }
    }
}

export default User;