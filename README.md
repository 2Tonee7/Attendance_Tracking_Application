# Attendance_Tracking_Application

Arhitectura Tehnică:

Frontend (SPA)
  -	Framework: React.js
  -	State Management: Context API / Redux Toolkit 
  -	Routing: React Router 
  -	Styling: CSS Vanilla + Tailwind CSS + Material-UI 
  -	HTTP Client: Fetch/Axios
  -	Librării auxiliare:
  -	qrcode.react 
    -	html5-qrcode 
    -	react-hook-form 
    -	date-fns
      
Backend (RESTful API)
  -	Runtime: Node.js
  -	Framework: Express.js
  -	ORM: Sequelize 
  -	Bază de date: PostgreSQL 
  -	Autentificare: JWT 
  -	Criptare: bcrypt
  -	Validare: express-validator
  - Librării auxiliare: 
    -	cors
    -	dotenv
    -	nodemon
    -	jsonwebtoken
    -	papaparse + xlsx
      
API Testing: Postman
Deployment: Azure for Students
Version Control
•	Git: GitHub 
•	Branching: main, develop, feature branches
•	Commits: Conventional Commits format

============================================

Plan implementare:
  - 1. Setup Proiect & Git 
  - 2. Baza de Date Definire tabele ,configurare Sequelize cu PostgreSQL, stabilire relații între tabele
  - 3. Backend API Endpoints pentru autentificare (register, login cu JWT), CRUD evenimente, generare coduri acces unice, check-in cu validare, export CSV/XLSX
  - 4. Frontend SPA Pagini autentificare, dashboard OE (listă evenimente, creare, afișare QR, monitorizare participanți), dashboard participanți (scanare QR, input manual cod, istoric)
  - 5. Integrare Frontend-Backend Conectare completă API cu UI, implementare protecție route-uri cu JWT, testing fluxuri complete, responsive design.
  - 6. Testare & Refinare Testare funcționalități, fixare bug-uri, validări input
  - 7. Deploy Azure Students & Documentație 

