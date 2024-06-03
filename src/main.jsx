import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ContractProvider } from './Context/ContractContext.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './client'; // Import your Apollo Client instance


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContractProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </ContractProvider>
  </React.StrictMode>
)
