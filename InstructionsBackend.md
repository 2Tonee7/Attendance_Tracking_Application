Flux principal:
1. Un organizator creeaza un grup de evenimente (ex: "Curs Tehnologii Web")
2. In cadrul grupului, organizatorul adaugă evenimente individuale (ex: "NextLab 1", "NextLab 2")
3. Fiecare eveniment primeste automat un cod unic de acces
4. Participantii scaneaza codul QR sau introduc codul manual pentru a se inregistra
5. Organizatorul vede in timp real cine este prezent

    Serverul va porni pe: http://localhost:3001

    Rolurile in aplicatie:
Exista 3 tipuri de utilizatori:

    1.Organizator: 
     - poate gestiona si creea evenimente;
    2.Participant:
     - se inregistreaza la evenimente prin scanarea codurilor QR sau  introducerea manuala a unui cod
     - poate doar sa se inregistreze la evenimente;
    3.Administrator: 
     - monitorizeaza toate evenimentele din sistem


    Endpoins disponibile:
1.Autentificare (Authentication)

 -> inregistrare utilizator nou: POST `/api/auth/register`
{
  "full_name": "Ion Popescu",
  "email": "ion.popescu@stud.ase.ro",
  "password": "parola123",
  "role": "participant"
}

Raspuns asteptat(succes):
{
  "message": "User created successfully.",
  "user": {
    "id": 1,
    "full_name": "Ion Popescu",
    "email": "ion.popescu@stud.ase.ro",
    "role": "participant"
  }
}

- Rolul poate fi: `"participant"`, `"organizer"` sau `"admin"`;
- Daca rolul nu e specificat, implicit va fi `"organizer"`;
- Email-ul trebuie sa fie unic;

-------------------------------

    -> login utilizator: POST `/api/auth/login`

{
  "email": "ion.popescu@stud.ase.ro",
  "password": "parola123"
}

 Raspuns asteptat(succes):
{
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "Ion Popescu",
    "email": "ion.popescu@stud.ase.ro",
    "role": "participant"
  }
}


! Important ! TOKENUL TREBUIE SALVAT ; VA FI FOLOSIT PENTRU TOATE CERERILE URMATOARE

-------------------------------

    -> obtinere profil propriu: GET `/api/auth/profile`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Raspuns:
{
  "user": {
    "id": 1,
    "full_name": "Ion Popescu",
    "email": "ion.popescu@stud.ase.ro",
    "role": "participant"
  }
}

-------------------------------

    ->obtinere toti utilizatorii: GET `/api/auth/users`

Raspuns:
{
  "users": [
    {
      "id": 1,
      "full_name": "Ion Popescu",
      "email": "ion.popescu@stud.ase.ro",
      "role": "participant"
    },
    {
      "id": 2,
      "full_name": "Maria Ionescu",
      "email": "maria.ionescu@ase.ro",
      "role": "organizer"
    }
  ]
}

-------------------------------

2. Grupuri de evenimente (Event Groups)
  !Atentie! 
  Toate aceste endpoint-uri necesita auth

    -> creare grup de evenimente: POST `/api/event-groups`
Authorization: Bearer TOKENUL_TAU
{
  "title": "Curs Tehnologii Web",
  "description": "Laborator săptămânal pentru TW"
}

    sau cu recurenta:

{
  "title": "Curs Tehnologii Web",
  "description": "Laborator săptămânal pentru TW",
  "recurrence_type": "weekly",
  "start_date": "2025-10-01",
  "end_date": "2025-12-20"
}

Raspuns:
{
  "message": "Event group created successfully.",
  "eventGroup": {
    "id": 1,
    "title": "Curs Tehnologii Web",
    "description": "Laborator saptamanal pentru TW",
    "recurrence_type": "weekly",
    "start_date": "2025-10-01",
    "end_date": "2025-12-20",
    "organizer_id": 2
  }
}

        !Atentie!
    Doar utilizatorii cu rol `"organizer"` sau `"admin"` pot crea grupuri
    `recurrence_type` poate fi: `"none"`, `"daily"`, `"weekly"`, `"monthly"`

-------------------------------

    -> obtine toate grupurile: GET `/api/event-groups`
Authorization: Bearer TOKENUL_TAU

Raspuns:
{
  "eventGroups": [
    {
      "id": 1,
      "title": "Curs Tehnologii Web",
      "description": "Laborator saptamanal pentru TW",
      "recurrence_type": "weekly",
      "start_date": "2025-10-01",
      "end_date": "2025-12-20",
      "organizer_id": 2,
      "events": [
        {
          "id": 1,
          "title": "NextLab 1 - Introducere HTML",
          "status": "CLOSED",
          "start_time": "2025-10-05T10:00:00.000Z",
          "end_time": "2025-10-05T12:00:00.000Z"
        }
      ]
    }
  ]
}

        !Atentie!
    `"organizer"` -> vede DOAR grupurile SALE
    `"admin"` -> vede toate grupurile

-------------------------------

    -> obtine un grup specific: GET `/api/event-groups/:id`

ex: `GET /api/event-groups/1`
Authorization: Bearer TOKENUL_TAU
Raspuns:
{
  "eventGroup": {
    "id": 1,
    "title": "Curs Tehnologii Web",
    "description": "Laborator saptamanal pentru TW",
    "recurrence_type": "weekly",
    "organizer_id": 2,
    "events": [
      {
        "id": 1,
        "title": "NextLab 1 - Introducere HTML",
        "description": null,
        "status": "CLOSED",
        "start_time": "2025-10-05T10:00:00.000Z",
        "end_time": "2025-10-05T12:00:00.000Z"
      }
    ]
  }
}

-------------------------------

 -> actualizare grup: PUT `/api/event-groups/:id`
ex: `PUT /api/event-groups/1`
Authorization: Bearer TOKENUL_TAU
{
  "title": "Curs Tehnologii Web - Actualizat",
  "description": "Descriere noua"
}

    !Atentie! 
    Poti actualiza doar grupurile tale sau toate DOAR daca esti admin

-------------------------------

    -> stergere grup: DELETE `/api/event-groups/:id`
ex: `DELETE /api/event-groups/1`
Authorization: Bearer TOKENUL_TAU
Raspuns:
{
  "message": "Event group deleted successfully."
}

    !Atentie! 
    Stergerea unui grup va sterge si toate evenimentele din el!

-------------------------------

3. Evenimente (Events)

    !Important!
Toate aceste endpoints necesita auth

    -> creare eveniment: POST `/api/events`
Authorization: Bearer TOKENUL_TAU
{
  "group_id": 1,
  "title": "Lab 1 - Introducere HTML",
  "start_time": "2025-12-05T10:00:00Z",
  "end_time": "2025-12-05T12:00:00Z"
}
Raspuns:
{
  "event": {
    "id": 1,
    "group_id": 1,
    "title": "Lab 1 - Introducere HTML",
    "description": null,
    "start_time": "2025-12-05T10:00:00.000Z",
    "end_time": "2025-12-05T12:00:00.000Z",
    "status": "CLOSED",
    "accessCode": {
      "id": 1,
      "code": "ABC123",
      "event_id": 1,
      "is_active": true
    }
  }
}

    !Atentie!
    Codul de acces (`ABC123`) se genereaza automat
    Status-ul implicit este `"CLOSED"` - trebuie deschis manual    cand începe evenimentul
    Trebuie sa fii proprietarul grupului sau admin

-------------------------------

	->obtine toate evenimentele: GET `/api/events`
Authorization: Bearer TOKENUL_TAU

Raspuns:
{
  "events": [
    {
      "id": 1,
      "title": "Lab 1 - Introducere HTML",
      "description": null,
      "start_time": "2025-12-05T10:00:00.000Z",
      "end_time": "2025-12-05T12:00:00.000Z",
      "status": "CLOSED",
      "group": {
        "id": 1,
        "title": "Curs Tehnologii Web"
      },
      "accessCode": {
        "code": "ABC123"
      }
    }
  ]
}

-------------------------------

	-> obtine un eveniment specific: GET `/api/events/:id`
ex: `GET /api/events/1`

Authorization: Bearer TOKENUL_TAU

Raspuns:
{
  "event": {
    "id": 1,
    "title": "Lab 1 - Introducere HTML",
    "start_time": "2025-12-05T10:00:00.000Z",
    "end_time": "2025-12-05T12:00:00.000Z",
    "status": "OPEN",
    "group": {
      "id": 1,
      "title": "Curs Tehnologii Web",
      "organizer_id": 2
    },
    "accessCode": {
      "code": "ABC123",
      "is_active": true
    },
    "participants": [
      {
        "id": 1,
        "full_name": "Ion Popescu",
        "email": "ion.popescu@stud.ase.ro",
        "Attendance": {
          "checked_in_at": "2025-12-05T10:15:00.000Z"
        }
      }
    ]
  }
}

-------------------------------

	-> actualizare eveniment: PUT `/api/events/:id`
ex: `PUT /api/events/1`

Authorization: Bearer TOKENUL_TAU
{
  "title": "Lab 1 - Introducere HTML și CSS",
  "start_time": "2025-12-05T11:00:00Z",
  "end_time": "2025-12-05T13:00:00Z"
}

-------------------------------

	-> schimbare status eveniment: PATCH `/api/events/:id/status`
ex: `PATCH /api/events/1/status`

Authorization: Bearer TOKENUL_TAU
{
  "status": "OPEN"
}

	!Atentie!
	Statusuri posibile: "OPEN" (deschis pentru check-in), "CLOSED" (inchis),"CANCELLED" (anulat)

	!Important! 
	Participantii pot face check-in DOAR cand statusul este "OPEN"

-------------------------------

	-> actualizare automata statusuri: POST `/api/events/update-statuses`

Authorization: Bearer TOKENUL_TAU

- Deschide automat evenimentele care au inceput
- Inchide automat evenimentele care s-au terminat

Raspuns:
{
  "message": "Statuses updated."
}

-------------------------------

	-> stergere event: DELETE `/api/events/:id`
ex: `DELETE /api/events/1`

Authorization: Bearer TOKENUL_TAU

Raspuns:
{
  "message": "Event deleted."
}

-------------------------------

4. Prezenta (Attendance)

	!Important!
	Toate aceste endpoints necesita auth

	-> check-in la eveniment: POST `/api/attendance/check-in`

Authorization: Bearer TOKENUL_TAU
{
  "code": "ABC123"
}

Raspuns succes:
{
  "message": "Check-in successful.",
  "attendance": {
    "id": 1,
    "user_id": 1,
    "event_id": 1,
    "checked_in_at": "2025-12-05T10:15:23.000Z",
    "device_info": "Mozilla/5.0..."
  }
}

	!Atentie!
	- Functioneaza DOAR daca evenimentul are status "OPEN"
	- Nu te poti inregistra de 2 ori la acelasi eveniment
	- Se salveaza automat informatii despre dispozitivul folosit

-------------------------------

	-> vezi participantii la un eveniment: GET `/api/attendance/events/:id/attendees`
ex: `GET /api/attendance/events/1/attendees`

Authorization: Bearer TOKENUL_TAU

Raspuns:
{
  "attendances": [
    {
      "id": 1,
      "user_id": 1,
      "event_id": 1,
      "checked_in_at": "2025-12-05T10:15:23.000Z",
      "device_info": "Mozilla/5.0...",
      "User": {
        "id": 1,
        "full_name": "Ion Popescu",
        "email": "ion.popescu@stud.ase.ro"
      }
    },
    {
      "id": 2,
      "user_id": 3,
      "event_id": 1,
      "checked_in_at": "2025-12-05T10:18:45.000Z",
      "device_info": "Mozilla/5.0...",
      "User": {
        "id": 3,
        "full_name": "Ana Maria",
        "email": "ana.maria@stud.ase.ro"
      }
    }
  ]
}

-------------------------------

Exemple de scenarii complete

	-> Scenariu 1: Profesorul creeaza si gestioneaza un laborator

Pasul 1: inregistrare ca organizator: POST /api/auth/register
	Content-Type: application/json
{
  "full_name": "Prof. Maria Ionescu",
  "email": "maria.ionescu@ase.ro",
  "password": "parola123",
  "role": "organizer"
}

Pasul 2: login: POST /api/auth/login
	Content-Type: application/json

{
  "email": "maria.ionescu@ase.ro",
  "password": "parola123"
}

  !Atentie!
Salveaza token-ul primit

Pasul 3: creare grup: POST /api/event-groups
		      Authorization: Bearer TOKENUL_PRIMIT
		      Content-Type: application/json
{
  "title": "Laborator Tehnologii Web - Grupa 341",
  "description": "Laboratoare saptamanale pentru grupa 341"
}

!Salvează id-ul grupului (ex: 1)!

Pasul 4: creare eveniment: POST /api/events
	Authorization: Bearer TOKENUL_PRIMIT
	Content-Type: application/json
{
  "group_id": 1,
  "title": "Lab 1 - Introducere HTML",
  "start_time": "2025-12-10T10:00:00Z",
  "end_time": "2025-12-10T12:00:00Z"
}
!Salveaza accessCode.code (ex: "ABC123")!

Pasul 5: deschide evenimentul cand incepe: PATCH /api/events/1/status
	Authorization: Bearer TOKENUL_PRIMIT
	Content-Type: application/json
{
  "status": "OPEN"
}

Pasul 6: verifica cine s-a inregistrat: GET /api/attendance/events/1/attendees
	Authorization: Bearer TOKENUL_PRIMIT


-------------------------------

-> Scenariu 2: Studentul se inregistreaza la laborator

Pasul 1: inregistrare ca participant: POST /api/auth/register
  Content-Type: application/json
{
  "full_name": "Ion Popescu",
  "email": "ion.popescu@stud.ase.ro",
  "password": "parola123",
  "role": "participant"
}

Pasul 2: login: POST /api/auth/login
		Content-Type: application/json
{
  "email": "ion.popescu@stud.ase.ro",
  "password": "parola123"
}
  !Atentie!
Salvează token-ul

Pasul 3: check-in cu codul de la profesor: POST /api/attendance/check-in
  Authorization: Bearer TOKENUL_PRIMIT
  Content-Type: application/json
{
  "code": "ABC123"
}



REGULI SI RESTRICTII IMPORTANTE:

        Auth
    Login si Register sunt publice (fara token), toate celelalte endpoint-uri necesită JWT token in header-ul `Authorization: Bearer TOKEN`

        Permisiuni
    -participant: poate doar sa faca check-in
    -organizer: poate crea si gestiona propriile grupuri si evenimente
    -admin: are acces la toate resursele din sistem

        Validari
    Nu poti crea evenimente in grupuri care nu iti apartin
    Nu te poti inregistra de 2 ori la acelasi eveniment
    Poti face check-in doar la evenimente cu status `"OPEN"`
    Email-ul trebuie sa fie unic in sistem

        Status-uri evenimente
    - CLOSED: nu se accepta check-in (status implicit la creare)
    - OPEN: se accepta check-in
    - CANCELLED: eveniment anulat


SCHEMA BAZEI DE DATE: Vezi /docs/images


