const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize Express app
const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Mongoose Password Schema
const passwordSchema = new mongoose.Schema({
  website: { type: String, required: true },
  password: { type: String, required: true },
  userEmail: { type: String, required: true } // Add userEmail field
});

const Password = mongoose.model('Password', passwordSchema);

// In-memory OTP store (for demo purposes)
let otpStore = {};

// Global variable to store logged email
let loggedEmail = null;

// Nodemailer transporter setup (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sukanth93605@gmail.com',
    pass: 'bjyo ztfv wpsm sptc', // Use the app password if 2FA is enabled
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Route to generate and send OTP for login
app.post('/generate-otp', async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const otp = generateOTP();
  otpStore[email] = otp; // Store OTP temporarily
  console.log(`OTP for ${email}: ${otp}`); // For debugging, remove in production

  const mailOptions = {
    from: '"PasswordManager" <sukanth93605@gmail.com>',
    to: email,
    subject: 'Your OTP for Login',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email OTP</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          max-width: 500px;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1 {
          color: #3b82f6; /* Blue color for the header */
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .divider {
          width: 100%;
          height: 1px;
          background-color: #ddd;
          margin: 20px 0;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          color: #28a745; /* Green color for OTP */
          margin: 20px 0;
        }
        p {
          color: #555;
          font-size: 16px;
          margin: 10px 0;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email OTP</h1>
        <div class="divider"></div>
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div class="otp">${otp}</div>
        <p>Please use this OTP to complete your login process. Do not share this code with anyone.</p>
        <p>Thank you for using Email OTP!</p>
        <div class="footer">
          <p>&copy; 2024 PasswordManager. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    res.status(200).json({ message: 'OTP sent successfully!' });
  });
});
const adminEmail = 'admin0021@gmail.com';
const adminPassword = 'admin@0021';

// Admin login route
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    // Successful login, fetch user details
    try {
      const users = await User.find({});  // Get all users from the database
      
      // Generate HTML content
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                padding: 20px;
                max-width: 1200px;
                margin: auto;
              }
              h1 {
                text-align: center;
                color: #333;
              }
              .user-list {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
              }
              .user-item {
                padding: 10px;
                border-bottom: 1px solid #ddd;
              }
              .user-item:last-child {
                border-bottom: none;
              }
              .user-info {
                display: flex;
                justify-content: space-between;
              }
              .user-info span {
                font-weight: bold;
                color: #555;
              }
              .user-info p {
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
            <h1>Password Manager</h1>
              <h1>User Details</h1>
              <div class="user-list">
                ${users.map(user => `
                  <div class="user-item">
                    <div class="user-info">
                      <span>Username:</span>
                      <p>${user.username}</p>
                    </div>
                    <div class="user-info">
                      <span>Email:</span>
                      <p>${user.email}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </body>
        </html>
      `;

      // Send HTML content as response
      res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);

  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).send('<h1>Failed to fetch passwords</h1>');
  }
  } else {
    // Invalid credentials
    res.status(401).json({ error: 'Invalid email or password' });
  }
});



// Login route with OTP verification
app.post('/login', async (req, res) => {
  const { email, password, otp } = req.body;

  // Check if email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Verify OTP
  if (otpStore[email] !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Clear OTP after successful login
  delete otpStore[email];

  // Store the logged email in a global variable
  loggedEmail = email;

  // Return logged email in response
  res.status(200).json({ 
    message: 'Login successful', 
    user: { username: user.username, email: user.email },
    loggedEmail // Send the logged email back to the client
  });
});

// Route to save passwords
app.post('/save-password', async (req, res) => {
  const { website, password, email } = req.body; // Include email in the request body

  // Validate input
  if (!website || !password || !email) {
    return res.status(400).json({ error: 'Website, password, and email are required' });
  }

  try {
    // Create a new password record and associate it with the provided email
    const newPassword = new Password({
      website,
      password,
      userEmail: email  // Use the provided email
    });

    // Save password to the database
    await newPassword.save();
    res.status(201).json({ message: 'Password saved successfully!' });
  } catch (error) {
    console.error('Error saving password:', error);
    res.status(500).json({ error: 'Failed to save password.' });
  }
});

app.delete('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await Password.deleteOne({ _id: id }); // Adjust this line to match your database logic
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting password:", error);
    res.sendStatus(500);
  }
});
// Update password endpoint
app.post('/update', async (req, res) => {
  const { id, newPassword } = req.body; // Expecting 'id' and 'newPassword' in request body
  try {
    await Password.updateOne({ _id: id }, { $set: { password: newPassword } }); // Updating the password field
    res.sendStatus(200); // Success response
  } catch (error) {
    console.error("Error updating password:", error);
    res.sendStatus(500); // Error response
  }
});



app.get('/display', async (req, res) => {
  if (!loggedEmail) {
    return res.status(401).json({ error: 'User is not logged in' });
  }

  try {
    // Fetch all passwords associated with the logged-in user
    const users = await User.find({ email: loggedEmail });
    const passwords=await Password.find({userEmail:loggedEmail});

    // Generate HTML content
    let htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile & Passwords</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f8fb;
      color: #333;
      padding: 20px;
    }

    .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(45deg, #ff0000, #2530ff);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}


    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .header button {
      background-color: white;
      color: #003366;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }

    .container {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }

    .profile-card{
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      flex: 1;
      height:400px;
    }
    .passwords-card{
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      flex: 1;
    }

    .profile-card {
      text-align: center;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: 15px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .profile-info h2 {
      color: #003366;
      margin-top: 10px;
      font-size: 20px;
    }

    .profile-info p {
      margin: 5px 0;
      color: #555;
      font-size: 14px;
    }

    .passwords-card h2 {
      color: #003366;
      margin-bottom: 20px;
    }

    .password-card {
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      margin-bottom: 10px;
    }

    .password-info p {
      margin: 5px 0;
      color: #555;
    }

    .password-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .button.update {
      background:linear-gradient(45deg, #ff0000, #2530ff);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      border: none;
    }

    .button.delete {
      background:linear-gradient(45deg, #ff0000, #2530ff);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      border: none;
    }
      /* Centered modal form */
.update-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: none; /* Hidden by default */
}

/* Header and labels */
.update-form h3 {
  margin: 0 0 10px;
  font-size: 1.2em;
  text-align: center;
}

.update-form label {
  margin-bottom: 5px;
  font-size: 0.9em;
}

/* Input and buttons */
.update-form input[type="password"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.update-form button {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.update-form button[type="submit"] {
  background:linear-gradient(45deg, #ff0000, #2530ff);
  color: white;
}

.update-form button[type="button"] {
  background:linear-gradient(45deg, #ff0000, #2530ff);
  color: white;
}

/* Background overlay */
#updateFormOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: none; /* Hidden by default */
}

  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <h1>Password Manager</h1>
    <button onclick="window.history.back()">Back</button>
  </div>

  <!-- Content Container -->
  <div class="container">
    <!-- Profile Section -->
    <div class="profile-card">
      <h2>User Profile</h2>
      <img src="data:image/png;base64,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" alt="Profile Image" class="profile-image">
      <div class="profile-info">
        
        ${users.length > 0 
          ? `<ul>${users.map(user => `
              <li>
                <strong>User ID:</strong> ${user._id} <br>
                <strong>User Name:</strong> ${user.username} <br>
                <strong>Email:</strong> ${user.email}
              </li>
            `).join('')}</ul>`
          : `<p>No profile found.</p>`
        }
      </div>
    </div>

    <div class="passwords-card">
  <h2>My Passwords</h2>
  ${passwords.length > 0
    ? passwords.map(password => `
      <div class="password-card">
        <div class="password-info">
          <p><strong>Website:</strong> ${password.website}</p>
          <p><strong>Email:</strong> ${password.userEmail}</p>
          <p><strong>Password:</strong> ${password.password}</p>
        </div>
        <div class="password-buttons">
          <button class="button update" onclick="openUpdateForm('${password._id}')">Update</button>
          <button class="button delete" onclick="deletePassword('${password._id}')">Delete</button>
        </div>
      </div>
    `).join('')
    : '<p>No passwords stored.</p>'}
      <div id="updateForm" class="update-form" style="display: none;">
  <form id="updatePasswordForm">
    <h3>Update Password</h3>
    <input type="hidden" id="updatePasswordId" name="id" />
    <label for="newPassword">New Password:</label>
    <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" required />
    <button type="submit">Save</button>
    <button type="button" onclick="closeUpdateForm()">Cancel</button>
  </form>
</div>
</div>

<!-- Hidden Update Form -->
<script>
  // Handle form submission with fetch
  document.getElementById('updatePasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting traditionally

    // Ask for confirmation before proceeding
    const userConfirmed = confirm("Are you sure you want to update the password?");
    
    if (!userConfirmed) {
      alert("Password update canceled.");
      return; // Exit if the user cancels
    }
    
    const id = document.getElementById('updatePasswordId').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
      const response = await fetch('http://localhost:5001/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Use JSON content type
        },
        body: JSON.stringify({ id, newPassword }) // Send JSON stringified body
      });

      if (response.ok) {
        alert('Password updated successfully!');
        closeUpdateForm(); // Close the modal form after successful update
        window.location.reload(); // Refresh the page to reflect the update
      } else {
        alert('Error updating password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the password.');
    }
  });

  // Function to close the form
  function closeUpdateForm() {
    document.getElementById('updateForm').style.display = 'none';
  }
  
  // Open the update form and set the ID
  function openUpdateForm(id) {
    document.getElementById('updatePasswordId').value = id;
    document.getElementById('updateForm').style.display = 'block';
  }
</script>
<script>
  function deletePassword(id) {
    // Ask for confirmation before proceeding
    const userConfirmed = confirm("Are you sure you want to delete this password?");
    
    if (userConfirmed) {
      fetch('http://localhost:5001/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }) // Pass the specific password value
      })
      .then(response => {
        if (response.ok) {
          alert("Password deleted successfully");
          window.location.reload();
        } else {
          alert("Error deleting password");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Failed to connect to the server");
      });
    } else {
      // User canceled the deletion
      alert("Deletion canceled");
    }
  }
</script>


</div>

  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>




    `;

    // Set Content-Type to text/html
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);

  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).send('<h1>Failed to fetch passwords</h1>');
  }
});


// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
