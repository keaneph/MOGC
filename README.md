# MOGC - MSU-IIT Office of Guidance and Counseling

### Prerequisites
- Node.js 20+ 
- Python 3.13
- Pipenv

### Development and Current Project Flow

run both frontend and backend simultaneously in separate terminals.
for devs: you can opt to open a third terminal for git

for syncing purposes only, do: pipenv requirements > requirements.txt

**Frontend:**
```bash
cd client
npm install
npm run dev
```
-> runs on http://localhost:3000

**Backend:**
```bash
cd server
pipenv install          # first time only
pipenv shell
flask run
exit                    # if done
```
-> runs on http://localhost:5000

**Env:**
make sure to create one in server/ directory

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Project Structure

```
mogc/
├── client/          # Next.js 15 + React 19 + TypeScript
├── server/          # Flask + Python 3.13
└── supabase/        # Database migrations & seeds
```

### Tech Stack

**Frontend:**
- Next.js 15.5.6 (App Router)
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

**Backend:**
- Flask
- Python 3.13
- Flask-CORS
- python-dotenv

**Database:**
- Supabase (PostgreSQL)