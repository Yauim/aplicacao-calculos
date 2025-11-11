# ⚛️ Frontend – Aplicação de Cálculos

> Interface web desenvolvida em **React + Vite**, com gráficos, login via Google e geração de relatórios em PDF.

---

## 🚀 Tecnologias Utilizadas
- React + Vite  
- TailwindCSS  
- jsPDF + autoTable  
- Recharts  
- Axios  
- Google Identity Services (OAuth 2.0)

---

## 🧠 Funcionalidades
- Login com Google  
- Tela de Gestão Financeira  
- Cálculo automático de PMRE, PMRV, PMPF, Ciclo Operacional e Ciclo de Caixa  
- Gráficos de barras coloridos (🟣 comum | 🟢 saudável | 🔴 atenção)  
- Geração de relatório em PDF  
- Histórico de cálculos e exclusão de registros  

---

## ⚙️ Configuração do Ambiente

Crie o arquivo `.env` dentro da pasta `Frontend/`:

```bash
VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com 
```
💡 Importante: nunca suba este arquivo para o GitHub — ele já está ignorado pelo .gitignore.

🧱 Como Rodar
cd Frontend
npm install
npm run dev

📄 Estrutura
src/
├── pages/
│   ├── Gestao.jsx
│   ├── Login.jsx
│   └── Vendas.jsx
├── components/
│   ├── Toast.jsx
│   └── PrivateRoute.jsx
├── services/
│   └── api.js
└── utils/
    └── checkTokenExpiration.js


📄 Licença

Este projeto é de uso acadêmico e livre para estudo e aprimoramento.
Créditos ao autor original: Gabriel Paizante Verli.
