## URL Shortener 🌐🔗

### Phase I: Overview 📋

URL shortening is a technique used to create shorter, more manageable aliases for long URLs. These shortened URLs, or "short links," redirect users to the original, longer URL when accessed. This functionality is beneficial for saving space in various contexts such as display, print, messages, or tweets. Short links also reduce the likelihood of user errors due to mistyped URLs.

For example, a long URL like:

```
https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143
```

can be shortened to:

```
https://tinyurl.com/y4ned4ep
```

The shortened URL is significantly more concise and easier to handle.

### Key Points ⚙️

1. **Database Setup** 🗃️: Create a group database named `groupXDatabase`. If necessary, clean the previously used database and reuse it. Each group should have a single git branch, and coordination among team members is crucial to ensure code consistency. The branch name should follow the format `project/urlShortenerGroupX`. Adhere strictly to the naming conventions provided.

2. **API Endpoints** 🌟:

   - **POST /url/shorten**: Create a short URL for an original URL provided in the request body. The shortened URL should use the application's base URL. For example, if the original URL is `http://abc.com/user/images/name/2`, the shortened URL should be `http://localhost:3000/xyz`. Return the shortened unique URL and ensure the same response is returned for the same original URL every time. Return HTTP status 400 for invalid requests.

   - **GET /:urlCode**: Redirect to the original URL corresponding to the given `urlCode`. Use an appropriate HTTP status code for redirection scenarios and return a suitable error if the URL is not found. Return HTTP status 400 for invalid requests.

3. **Testing** 🧪: Create a new collection in Postman named "URL Shortener." Include separate requests for each API endpoint in this collection, clearly named (e.g., "URL Shorten," "Get URL"). Ensure all team members have their tests in a running state.

### Phase II: Caching 💾

Implement caching to minimize database calls when creating shortened URLs and, if applicable, while redirecting from shortened URLs. Utilize caching strategies that enhance performance and efficiency.

### Response Structure 📑

- **Successful Response**:

  ```json
  {
    "status": true,
    "data": {
      // Response data here
    }
  }
  ```

- **Error Response**:

  ```json
  {
    "status": false,
    "message": "Error message here"
  }
  ```

- **URL Shorten Response Example**:

  ```json
  {
    "data": {
      "longUrl": "http://www.abc.com/oneofthelongesturlseverseenbyhumans.com",
      "shortUrl": "http://localhost:3000/ghfgfg",
      "urlCode": "ghfgfg"
    }
  }
