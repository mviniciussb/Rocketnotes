import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../service/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({});

  async function signIn({ email, password }) {

    try {
      const response = await api.post("/sessions", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("@Rocketnotes: user", JSON.stringify(user))
      localStorage.setItem("@Rocketnotes: token", token)


      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({token, user});

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível entrar.");
      }
    }
  }

  function signOut(){
    const token = localStorage.removeItem("@Rocketnotes: token")
    const user = localStorage.removeItem("@Rocketnotes: user")

    setData({})
  }


  
  useEffect(() => {
    const token = localStorage.getItem("@Rocketnotes: token")
    const user = localStorage.getItem("@Rocketnotes: user")

    if(token && user){
      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({token, user: JSON.parse(user)})
    }
    
  }, [])

  return (
    <AuthContext.Provider value={{ 
      signIn,
      signOut,
      user: data.user 
      }}
      >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
