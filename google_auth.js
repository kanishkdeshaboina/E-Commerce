// Handle Google Sign-In/Sign-Up response
function handleGoogleSignIn(response) {
    // This is the ID token that can be sent to your backend
    const id_token = response.credential;
    
    // Send this token to your backend for verification
    verifyGoogleToken(id_token)
        .then(userData => {
            // Handle successful authentication
            console.log("Google authentication successful:", userData);
            
            // Store user data in localStorage or session
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Redirect to home page or dashboard
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Google authentication failed:", error);
            alert("Google authentication failed. Please try again.");
        });
}

// Function to verify the token with your backend
async function verifyGoogleToken(id_token) {
    try {
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token })
        });
        
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Initialize Google auth
function initializeGoogleAuth() {
    // You can add any initialization code here if needed
    console.log("Google auth initialized");
}

// Call initialization when the script loads
initializeGoogleAuth();