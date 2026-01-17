// // src/pages/Login.js
// import { useState } from "react";
// import { useNavigate, useOutletContext } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { setUser, setToken } = useOutletContext(); // Outlet context se setUser aur setToken le lo
//   const navigate = useNavigate();
// const handleLogin = async (e) => {
//   e.preventDefault();
//   const res = await fetch("http://localhost:8000/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await res.json();

//   if (!res.ok) { 
//     // Agar response status 400/500 hai
//     alert(data.message || "Login failed");
//     return;
//   }

//   // Success case me hi token save karo
//   if (data.token) {
//     localStorage.setItem("token", data.token);
//     setToken(data.token); // App.js me token update kar do
//     setUser(data.user); // App.js me user update kar do
//     navigate("/");
//   } else {
//     alert("Something went wrong: No token received");
//   }
// };

//  return (
//   <div className="flex justify-center items-center min-h-screen bg-gray-50">
//     <form
//       onSubmit={handleLogin}
//       className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
//     >
//       {/* Heading */}
//       <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
//         Login
//       </h2>

//       {/* Email */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
//       />

//       {/* Password */}
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
//       />

//       {/* Login Button */}
//       <button
//         type="submit"
//         className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md font-medium transition-colors"
//       >
//         Login
//       </button>

//       {/* Footer Link */}
//       <p className="text-gray-500 text-sm text-center mt-4">
//         Don't have an account?{" "}
//         <a href="/signup" className="text-teal-500 hover:underline font-medium">
//           Sign Up
//         </a>
//       </p>
//     </form>
//   </div>
// );
// }