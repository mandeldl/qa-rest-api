# Q&A REST API

A Node.js Express REST API for a Question & Answer application with voting functionality, backed by MongoDB using Mongoose ODM.

## Features

- **Questions Management**: Create, read questions
- **Answers Management**: Add, update, delete answers to questions
- **Voting System**: Upvote/downvote answers with automatic sorting
- **RESTful API**: Complete CRUD operations with proper HTTP methods
- **CORS Support**: Cross-origin resource sharing enabled
- **Data Validation**: Mongoose schema validation
- **Automatic Sorting**: Answers sorted by vote count and update time

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB Object Data Modeling (ODM)
- **Morgan** - HTTP request logger
- **Body-parser** - JSON request parsing

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Make sure MongoDB is running on `localhost:27017`
4. Start the server:
```bash
node app.js
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Questions

#### GET /questions
Retrieve all questions, sorted by newest first.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "text": "What is Node.js?",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "answers": []
  }
]
```

#### POST /questions
Create a new question.

**Request:**
```json
{
  "text": "How does Express.js work?"
}
```

**Response:** (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "text": "How does Express.js work?",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "answers": []
}
```

#### GET /questions/:qID
Retrieve a specific question by ID.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "text": "What is Node.js?",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "answers": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "text": "Node.js is a JavaScript runtime",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "votes": 5
    }
  ]
}
```

### Answers

#### POST /questions/:qID/answers
Add an answer to a specific question.

**Request:**
```json
{
  "text": "Node.js allows JavaScript to run on the server-side."
}
```

**Response:** (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "text": "What is Node.js?",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "answers": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "text": "Node.js allows JavaScript to run on the server-side.",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "votes": 0
    }
  ]
}
```

#### PUT /questions/:qID/answers/:aID
Update a specific answer.

**Request:**
```json
{
  "text": "Node.js is a server-side JavaScript runtime built on Chrome's V8 engine."
}
```

#### DELETE /questions/:qID/answers/:aID
Delete a specific answer.

**Response:** Returns the updated question without the deleted answer.

### Voting

#### POST /questions/:qID/answers/:aID/vote-up
Vote up an answer.

#### POST /questions/:qID/answers/:aID/vote-down
Vote down an answer.

**Response:** Returns the updated question with answers re-sorted by vote count.

## Data Models

### Question Schema
```javascript
{
  text: String,
  createdAt: Date,
  answers: [AnswerSchema]
}
```

### Answer Schema
```javascript
{
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 }
}
```

## Behavior & Features

### Automatic Answer Sorting
Answers are automatically sorted before saving:
1. Primary sort: Vote count (descending)
2. Secondary sort: Update time (descending, for ties)

### CORS Configuration
- Allows requests from any origin (`*`)
- Supports headers: Origin, X-Requested-With, Content-Type, Accept
- Supports methods: PUT, POST, DELETE (via OPTIONS preflight)

### Error Handling
- 404 errors for missing questions/answers
- 500 errors for server issues
- JSON-formatted error responses

### Database Connection
- Connects to MongoDB at `mongodb://localhost:27017/qa`
- Database name: `qa`
- Collection name: `questions` (inferred from model name)

## File Structure

```
qa-rest-api/
├── app.js              # Main Express server
├── models.js           # Mongoose schemas and models
├── routes.js           # API route definitions
├── mongoose_sandbox.js # Learning/examples file (not used in production)
├── package.json        # Dependencies and project metadata
└── README.md          # This documentation
```

## Development

The project includes a `mongoose_sandbox.js` file that demonstrates various Mongoose features including:
- Schema definitions with defaults
- Pre-save hooks
- Custom static and instance methods
- Query operations

This file is for learning purposes and can be safely ignored in production usage.

## Environment Variables

- `PORT`: Server port (defaults to 3000)

## Dependencies

- **express**: ^4.13.4 - Web framework
- **mongoose**: ^4.4.20 - MongoDB ODM
- **body-parser**: ^1.15.2 - Request parsing
- **morgan**: ^1.7.0 - HTTP logger

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License