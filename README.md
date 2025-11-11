# 💼 Aplicação de Cálculos – Sistema de Gestão Financeira

> **Autor:** Gabriel Paizante Verli  
> **Tecnologias:** React (Vite) + Spring Boot + MySQL  
> **Status:** ✅ Projeto Finalizado e 100% Funcional  

---

## 🧾 Sobre o Projeto

A **Aplicação de Cálculos** é um sistema completo para **gestão financeira empresarial**, com integração entre **Frontend (React)** e **Backend (Spring Boot)**.  
Ela realiza automaticamente cálculos de indicadores de gestão, gera relatórios, e oferece login via **Google OAuth 2.0**.

O projeto tem como objetivo **automatizar análises financeiras**, oferecendo relatórios visuais e PDF profissionais.

---

## 📂 Estrutura do Projeto

aplicacao-calculos/
├── Backend/ ← API em Java (Spring Boot)
├── Frontend/ ← Interface em React + Vite
└── README.md ← Este arquivo

---

## ⚙️ Funcionalidades Principais

- 🧮 Cálculos de PMRE, PMRV, PMPF, Ciclo Operacional e Ciclo de Caixa  
- 💰 Cálculo de Saldo Mínimo de Caixa com base em previsão de gastos  
- 📊 Gráficos dinâmicos com indicadores coloridos  
- 🧾 Geração automática de PDF profissional  
- 🧠 Análise automatizada (indicando fluxo saudável ou negativo)  
- 🔐 Login via Google (OAuth 2.0)  
- 🗄️ Histórico de indicadores e remoção de registros  
- ⚙️ Integração total entre Frontend e Backend  

---

## 🧰 Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| **Frontend** | React, Vite, Recharts, jsPDF, TailwindCSS |
| **Backend** | Spring Boot, Maven, MySQL, JWT, dotenv-java |
| **Infraestrutura** | REST API, Axios, JSON, OAuth 2.0 |

---

## 🚀 Como Rodar o Projeto Completo

### 🧱 Requisitos
- Java 17+
- Node.js 18+
- MySQL rodando localmente

### 📦 1️⃣ Clonar o projeto
```bash
git clone https://github.com/Yauim/aplicacao-calculos.git
cd aplicacao-calculos
```

⚛️ 2️⃣ Rodar o Frontend
cd Frontend
npm install
npm run dev

☕ 3️⃣ Rodar o Backend
cd Backend
mvn spring-boot:run

---

## 📄 Licença

Este projeto é de uso acadêmico e livre para estudo e aprimoramento.
Créditos ao autor original: Gabriel Paizante Verli.
