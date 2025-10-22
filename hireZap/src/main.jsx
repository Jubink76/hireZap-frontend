import { StrictMode } from 'react' // removed the strict mode, because it intentionally run useEffect twice in dev
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js' 
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(

    <Provider store = {store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
      </GoogleOAuthProvider>
    </Provider>

)
