# ☕ Backend – Aplicação de Cálculos

> API desenvolvida em **Spring Boot**, responsável pelos cálculos financeiros, autenticação e persistência de dados.

---

## 🧠 Funcionalidades
- Cálculo de indicadores financeiros (PMRE, PMRV, PMPF, Ciclo Operacional, Ciclo de Caixa, Saldo Mínimo)  
- Integração com banco MySQL  
- Login e autenticação via **Google OAuth 2.0 + JWT**  
- Armazenamento de histórico de indicadores  
- Exportação de relatórios  
- Configuração com variáveis de ambiente seguras  

---

## ⚙️ Tecnologias Utilizadas
- Java 17  
- Spring Boot 3  
- Maven  
- MySQL  
- JWT (JSON Web Token)  
- Dotenv (para carregar o `.env`)  

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` dentro da pasta `Backend/` com o conteúdo:

```bash
DB_URL=jdbc:mysql://localhost:3306/comercio?useSSL=false&serverTimezone=UTC
DB_USER=root
DB_PASS=admin123

GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret

JWT_SECRET=chave_super_segura
JWT_EXPIRATION=86400000
```
⚠️ Nunca suba o .env para o GitHub — ele já está no .gitignore.


🧩 application.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}

google.clientId=${GOOGLE_CLIENT_ID}
google.client.secret=${GOOGLE_CLIENT_SECRET}

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

🧱 Como Rodar
cd Backend
mvn spring-boot:run

🗄️ Estrutura
src/
├── main/java/com/empresa/aplicacao/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── repositories/
│   └── security/
└── resources/
    ├── application.properties
    └── static/

    📄 Licença

Este projeto é de uso acadêmico e livre para estudo e aprimoramento.
Créditos ao autor original: Gabriel Paizante Verli.
