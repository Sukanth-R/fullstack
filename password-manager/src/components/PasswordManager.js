import React, { useState } from 'react';
import axios from 'axios';
import './PasswordManager.css';

const PasswordManager = () => {
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [website, setWebsite] = useState('');
    const [format, setFormat] = useState('');
    const [email, setEmail] = useState(''); // Add email state

    const generatePassword = () => {
        const digits = "0123456789";
        const specialChars = "!@#$%^&*()";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let password = '';

        for (let char of format) {
            char = char.toUpperCase();  // Convert char to uppercase for case-insensitive comparison
            
            if (char === 'U') password += uppercase[Math.floor(Math.random() * uppercase.length)];
            else if (char === 'L') password += lowercase[Math.floor(Math.random() * lowercase.length)];
            else if (char === 'D') password += digits[Math.floor(Math.random() * digits.length)];
            else if (char === 'S') password += specialChars[Math.floor(Math.random() * specialChars.length)];
            else {
                alert("Invalid format. Use 'U', 'l', 'D', and 'S'.");
                return;
            }
        }
        

        setGeneratedPassword(password);
    };

    const savePassword = async () => {
        if (website && generatedPassword && email) {
            try {
                const response = await axios.post('http://localhost:5001/save-password', {
                    email,        // Include the email in the request
                    website,
                    password: generatedPassword
                });
                alert(response.data.message);
                setWebsite('');
                setGeneratedPassword('');
                setFormat('');
                setEmail('');  // Clear email input
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to save password.');
            }
        } else {
            alert('Please enter a website, email, and generate a password before saving.');
        }
    };

    const handleRedirect = () => {
        window.location.href = 'http://localhost:5001/display'; // Redirect to the desired URL
    };

    const handleLogout = () => alert("Logged out successfully.");

    return (
        <div className="card-content">
            <div className="profile-container">
                <button className="profile-button" onClick={handleRedirect}>
                    <img src="data:image/png;base64,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" alt="Profile" className="profile-image" /> 
                </button>
                <button className="profile-button1" onClick={handleLogout}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAdVBMVEX///8CAgIAAACHh4eNjY2CgoLu7u7KysocHBzx8fHl5eUuLi7Q0NCrq6vz8/P7+/t1dXUPDw+enp5+fn4jIyNfX19HR0daWloYGBg4ODjX19empqa5ublFRUU6OjoRERG1tbUxMTGTk5NRUVHAwMAoKCjg4OAqb2PWAAADN0lEQVR4nO3c2XbaMBhFYVlMhTCYUCAhQCDT+z9i49hScpG0Bv1dPpj93VdLu3bAxrKcAwAAAAAAAAAAAAAAAAAAAAAAAIBgOp50e+fp3A5GTU//n0aL3z7FfDloOuHvusUss/MV/3w9bLriZ/1VUl6MHDcd8pPhPr2vbFRNXNsEvifeaX7gTEJgwgdNGGHZdMx3ZtX8vH/Mu+fp7eMYip+okzC5ScIg4xuvexBX3uJ/f3pfDaP3lTGcl1PrJo4zLk9U/2IyK0ubj5l5308d6LksvLWYlKlBVZg80MLmXLA3KCf2K3mgTjlQz2BOtqpjaFbYMZiTLQpro7AxFNZGYWMorE240PaaRrHw4xjeJQ8kW1je9fhj8kCyhbPi7tz7h+SBZAvdpvixO08fR7fQDbcPFr9zChcaofDyUXj5KLx8eoXTPPOLqd14coWj1+Kp2M4uUa1wXD2uOJiNKFY4CA/87CakVTgJT20N7ikCqcLbGDhPfuQUKRUuYmC2sRtVp3C2jIGvlksnZAqnq7hwYmV3ijqdwtH958oQw697J1PYP4Yz1C9mtkOLFK5j4JP10BqFhxiYsnjmexqFu7g6aNqvrebZLFH4Fq7VTlrDdqx3vCUK4xq9ExfpbesMLlHYPW+Zpb+pM7hEYefMwlrLiSQKn1p/DLet/zvsf941ndB3SZ+lbhkK85Z+H1ZLLT8SzcfWKHz/rAlXNUvjC2+VQpfHo/hsvF5ZpfDLTxg70xtgncLiFafwNWf6/odO4ddf2t4MhxUqfL9LjLeJhi8qKRW6l89EuxNVqtAN5iHR7scMrUK3efTW3/xihcXDtcxmLVSgVuj6++Kq+qa9zw+dm/XmPje8rtErtEbh5aPw8lHYKJPbfeHCw3qXG9xG6RY+Fdc2BneKsoWj8m2E9Ctw2cJreCuIwpoobAyFtVHYGApro7Ax11CYtb7Q9hjK7k/T4j2GzPaJqvYM09snqtzry7d4r69qzWnyfm37ahi9/dquYM+99u+b+OUlqPNlme4hdFewf6kb3tsk6u5B2/59hF31s3BanvRe0O4K9vN27d+THQAAAAAAAAAAAAAAAAAAAAAAAMD/8QeBaiW3TOx1+QAAAABJRU5ErkJggg==" alt="Profile" className="profile-image" /> 
                </button>
            </div>

            <h1>🛡️Password Manager</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <div style={{ display: 'flex', gap: '1px' }}>
                    <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PWM_Header.width-1200.format-webp.webp" alt="Profile" className="left-image" />

                    <div className="feature-list" style={{ flex: 1 }}>
                        <h2>Key Features</h2>
                        <ul>
                        <li>
            <strong>Generate Secure Passwords with Custom Format:</strong> 
            Create complex passwords with a customizable format using uppercase, lowercase, numbers, and special characters, giving you control over security requirements.
        </li>
        <li>
            <strong>Save and Manage Passwords for Multiple Websites:</strong> 
            Securely store unique passwords for various websites, keeping your credentials organized and accessible in one location for easier management.
        </li>
        <li>
            <strong>Quick Access and Easy Password Retrieval:</strong> 
            Retrieve saved passwords in seconds, allowing you to quickly access your accounts without the hassle of remembering different passwords.
        </li>
        <li>
            <strong>Simple Email-Based Login Support:</strong> 
            Log in effortlessly with email, providing a familiar and straightforward authentication process while keeping your data secure.
        </li>
        <li>
            <strong>Seamless Integration with Web and Mobile Applications:</strong>
            Access and manage your passwords on multiple devices, ensuring that your credentials are available whenever you need them.
        </li>
                        </ul>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                {/* Password Format Guide */}
                <div className="password-guide" style={{ flex: '1', textAlign: 'left' }}>
                    <h3>Password Format Guide</h3>
                    <p>Use the following format codes to generate a password:</p>
                    <ul>
    <li><strong>U or u</strong> - Uppercase letter: A capital letter from A to Z. Example: <strong>A</strong>, <strong>B</strong>, <strong>Z</strong></li>
    <li><strong>l or L</strong> - Lowercase letter: A small letter from a to z. Example: <strong>a</strong>, <strong>b</strong>, <strong>z</strong></li>
    <li><strong>D or d</strong> - Digit (number): A numeric value from 0 to 9. Example: <strong>1</strong>, <strong>5</strong>, <strong>9</strong></li>
    <li><strong>S or s</strong> - Special character: A non-alphanumeric character such as punctuation marks, symbols, or whitespace. Example: <strong>@</strong>, <strong>#</strong>, <strong>!</strong></li>
</ul>

                    <p>Example format: <strong>UUllDDSS</strong> generates a password with 2 uppercase letters, 2 lowercase letters, 2 digits, and 2 special characters.</p>
                </div>

                {/* Input Section */}
                <div style={{ flex: '2' }}>
                    <h1 className="t1">Generate Password</h1>
                    <input
                        className="i1"
                        type="text"
                        placeholder="Email or Mobile number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <input
                        className="i2"
                        type="text"
                        placeholder="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <input
                        className="i2"
                        type="text"
                        placeholder="Password Format (e.g., UUllDDSS)"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                    />
                    {generatedPassword && (
                        <div style={{ marginTop: '20px',marginLeft:'170px' }}>
                            <p>Generated Password: <strong>{generatedPassword}</strong></p>
                        </div>
                    )}
                    <button className="b1" onClick={generatePassword}>Generate Password</button>
                    <button className="b2" onClick={savePassword}>Save Password</button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default PasswordManager;
