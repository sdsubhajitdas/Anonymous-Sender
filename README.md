# Anonymous Sender

[![Netlify Status](https://api.netlify.com/api/v1/badges/3a4bf47d-e66c-4e69-aab8-88f768f71c75/deploy-status)](https://anonymous-sender.netlify.app) </br>

This is a simple anonymous message sending application website. Not a direct clone but basic functionalities are implemented.

**Demo User Credentials:**<br>
_Email_ - demo@mail.com<br>
_Password_ - 12345678<br>

## Screenshots of the application
#### Home page
![image](https://user-images.githubusercontent.com/20211573/197622346-ee821690-f35e-49c7-a2c2-e759e5e7f414.png)
Pages are responsive so change layout according to size.[Example for mobile devides]</br>
![image](https://user-images.githubusercontent.com/20211573/197623006-bd8ed33e-1206-45c1-bc20-117278a29090.png)


#### Send a message to a someone on their shared link
![image](https://user-images.githubusercontent.com/20211573/197622520-ff1af7c2-1704-4614-9d47-4d84c858abf7.png)

#### Authentication page
![image](https://user-images.githubusercontent.com/20211573/197622695-b8d5a025-3b42-4aa0-94cb-6db0e2d18da0.png)

#### Register as a new user
![image](https://user-images.githubusercontent.com/20211573/197622767-5c8d90a2-01b1-468e-9f72-4c2d8f2eb448.png)


The project is structured in two separate folders the API and the frontend UI.

### API

The API is hosted on Amazon Web Services. AWS ApiGateway was used and then the individual routes are AWS Lambda function integrations. The database used is from MongoDB Atlas & the details are stored inside a AWS Secrets Manager secret.

### UI

It is a simple React application which interacts with the API using Axios library.
