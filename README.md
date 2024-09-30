# Dictionary API Project

This project is a **Dictionary API** built with **Node.js**, **Express**, and **SQLite**. The API provides features such as word search, word of the day, word recommendations, and detailed information about a specific word, including part of speech, examples, and CEFR (Common European Framework of Reference for Languages) details.

## Features

- **Word Recommendations**: Get word recommendations for autocomplete.
- **Word of the Day**: Retrieve a random word with its information.
- **Detailed Word Information**: Get information about a word, including its part of speech, examples, and CEFR level.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **SQLite**: Lightweight database engine used to store the dictionary data.
- **Swagger**: API documentation generator.
- **Sequelize**: ORM used for interacting with the SQLite database.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/dictionary-api.git
    cd dictionary-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the SQLite database:

    - You will need to configure your SQLite database in the `db.js` file located in the `models` folder.
    - Import your dictionary data into the SQLite database.

4. Run the application:

    ```bash
    npm start
    ```

   The API will be running on `http://localhost:3000`.

## API Endpoints

The following are the available API endpoints:

### 1. Get Word Recommendations

- **Endpoint**: `/recommendations/{word}`
- **Method**: `GET`
- **Description**: Fetches a list of word recommendations that start with the given word.
- **Example**: `/recommendations/pri`
- **Response**: A list of word recommendations.

### 2. Get Word Details

- **Endpoint**: `/wordInfo/{word}`
- **Method**: `GET`
- **Description**: Fetch detailed information about a specific word, including parts of speech, examples, and CEFR information.
- **Example**: `/wordInfo/primary`
- **Response**: An object containing the word details (part of speech, definition, examples, CEFR level).

### 3. Get Random Word (Word of the Day)

- **Endpoint**: `/randomWord`
- **Method**: `GET`
- **Description**: Fetches a random word and its details.
- **Response**: A random word with part of speech and CEFR details.

## Database Models

- **Word**: Stores the dictionary words.
- **WordInfo**: Contains parts of speech and definitions for each word.
- **Example**: Contains example sentences for each word.
- **CEFR**: Stores CEFR details (Level, Phonetics, and Voice) for words.

## Swagger API Documentation

This project uses Swagger for API documentation. After running the server, you can access the documentation at `http://localhost:3000/api-docs`.

## Future Improvements

- Add authentication for securing certain API endpoints.
- Implement caching to improve performance for frequent requests.
- Support for additional languages.

## License

This project is licensed under the MIT License.
