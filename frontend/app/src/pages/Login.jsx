import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("sign up");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  

  
  
  return (
    <form  className=" mt-20 min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold ">
          {state === "Sign Up" ? "Create Account" : "Login"} to be an Army
        </p>
        <p>
          Please {state === "Sign Up" ? "Create Account" : "Log in"} 
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            ></input>
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
        </div>

        <button className="bg-green-500 text-white w-full py-2 rounded-md text-base">{state=== 'Sign Up' ? "Create Account" : "Login"}</button>
        {
          state=== "Sign Up"
          ? <p>Already have an account ? <span onClick={()=>setState('Login')} className=" text-green-500 underline cursor-pointer">  Login Here </span></p>
          : <p>Create a new account ?  <span onClick={()=>setState('Sign Up')} className=" text-green-500 underline cursor-pointer"> click here</span></p>
        }
        </div>

    </form>
  )
}

export default Login;
