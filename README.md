# Dialysis Dashboard

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run development`

Runs the backend in the development mode.

- Open Port: [http://localhost:5000](http://localhost:5000).

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

## Source for the Critical Thresholds

### PMC: PubMed Central Papers

The source for the maximum weight gain interdialysis: PCMID- PMC9584995  
The source for the maximum systolic BP post-dialysis: PCMID- PMC3320527  
The source for the minimum dialysis session duration: PCMID- PMC3685306  
The source for the maximum dialysis session duration: PCMID- PMC5695674

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

## Architecture Structure

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

### Design Principles

Separation of concerns

- Routes → HTTP layer

- Controllers → orchestration

- Services → pure business logic

- Clinical thresholds stored in config (no magic numbers)

- Anomaly detection is a pure function and fully unit tested

- App/server split for testability
