import React from 'react'
import './LoginWithGoogle.css'

/**
 * קומפוננטה של כפתור התחברות עם Google.
 * מקבלת prop בשם `onLogin` שהוא פונקציה שמופעלת בלחיצה.
 */
export default function LoginWithGoogle({ onLogin }) {
return (
<button  type="button" className="custom-google-btn" onClick={onLogin}>
<img
  src="https://developers.google.com/identity/images/g-logo.png"
  alt="Google"
  className="google-icon"
/>
Sign in with Google
</button>
)
}
