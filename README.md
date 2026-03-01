# Dialysis Dashboard

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the dependencies required by the webapp. Run this right after cloning the repository in the root folder of the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run development`

Runs the backend in the development mode.

- Open Port: [http://localhost:5000](http://localhost:5000).

***This will also run the seeding script required to populate the data with 10 patients.***

You can use Postman to make POST and PATCH requests that are used to create and complete dialysis sessions.

- URL for the POST requests
[http://localhost:5000/api/sessions?unitId=A1](http://localhost:5000/api/sessions?unitId=A1). Replace the unitID code with another number, whichever one you wish to provide the patient.

- URL for the PATCH requests: [http://localhost:5000/api/sessions/:id](http://localhost:5000/api/sessions/:id). Replace :id with the id acquired when making the POST request to send the data for the post-dialysis data. In BODY, use json format to share it in the payload.

```[json]
{
  "postWeight": int,
  "systolicBP": int,
  "diastolicBP": int,
  "endTime": string,
  "notes": string,
}
```

### `npm test`

Launches the test runner.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Critical Assumptions and Tradeoffs

### PMC: PubMed Central Papers (Official sources for the figures used)

- The source for the maximum weight gain interdialysis: PCMID- PMC9584995  
- The source for the maximum systolic BP post-dialysis: PCMID- PMC3320527  
- The source for the minimum dialysis session duration: PCMID- PMC3685306  
- The source for the maximum dialysis session duration: PCMID- PMC5695674

## Tech Stack

### Backend

- Node.js + Express (TypeScript).

- In-memory data store (assignment-allowed simplification).

- Layered architecture (routes → controllers → services).

- Jest + Supertest for testing.

### Frontend

- React (TypeScript).

- React Query for server state management.

- Modular CSS styling (no UI framework).

## Architecture Overview

### Backend Structure

```[markdown]
server/
 ├── controllers/
 ├── routes/
 ├── services/
 ├── config/
 ├── data/
 ├── scripts/

```

### Frontend Structure

```[markdown]
src/
 ├── api/
 ├── components/
 ├── config/
 ├── pages/
 ├── styles/
 ├── types/

```

### Design Principles

Separation of concerns

- Routes → HTTP layer

- Clinical thresholds stored in config (no magic numbers).

- Anomaly detection is a pure function and fully unit tested.

- App/server split for testability.

## Frontend Behavior

### Dashboard

Displays:

- All patients scheduled today

- Status: not_started / in_progress / completed

Key session fields:

- Pre-weight

- Post-weight

- Blood pressure

- Duration

Visual anomaly banner when detected.

## Data Layer

### Trade Offs

Data is saved in memory for assignment purposes.

#### Pros

- Fast setup

- No DB dependency

#### Cons

- No persistence

- No indexing

- Not scalable

In production, MongoDB would be appropriate due to:

- Flexible document schema

- Natural embedding of session data

- Indexing on unitId and scheduledDate

## Seed Data

On server start:

- 10 synthetic patients generated

Mixed session states:

- Not started

- In progress

- Completed

- Randomized vitals and anomaly cases

- Allows instant demo without manual API setup.

## Testing

### Backend Tests

Unit Tests:

- Anomaly detection edge cases

- Weight mismatch

- High BP

- Abnormal duration

### Integration Tests

POST /api/sessions

Verifies:

- 201 response

- Correct session structure

### Frontend Tests

Component Test

- PatientCard

- Verifies anomaly banner renders conditionally
