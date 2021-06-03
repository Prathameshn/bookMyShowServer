# Bookmyshow

Store Management System Project for building RESTful APIs and microservices using Node.js, Express and MongoDB

## Features
ssignment: Software Development Engineer - NodeJs/Python/NET/Java
Problem Description
You have been selected to work on the backend of a new movie ticketing website (like
https://bookmyshow.com).
At a minimum, the website is expected to have the following features -
1. Ability to view all the movies playing in your city
2. Ability to check all cinemas in which a movie is playing along with all the showtimes
3. For each showtime, check the availability of seats
4. User Sign up and login
5. Ability to book a ticket. (No payment gateway integration is required. Assume tickets can be
booked for free)
Your task is to build the APIs in Nodejs/Python/NET/Java which covers the above functionalities including
the database.
We have no requirements for which frameworks/libraries and database to use, choose whichever seem
best suited for the task!
Mandatory Deliverables for all positions
1.
The API to book a ticket should be protected i.e. only a logged-in user should be allowed to access
that API. Rest, all other APIs are public endpoints
2. All the code should be well-styled with proper namings. We pay a lot of attention to code-styling.
3. Include unit tests
4. Use Git for version control, and host the project in a public Github repository. Share the Github link
with us.
5. If you are applying for SDE 2, all the deliverables listed below are optional and if you do then, you
get bonus points
Mandatory Deliverables if you are applying for Sr. SDE position
6.
7.
8.
9.
10.
11.
12.
All the above deliverables
Design the APIs as stateless microservices
Use Dependency Injection
Implement CICD using Jenkins/Azure DevOps/CircleCI or any other CICD service
Host the service in a Public Cloud (Eg AWS or Azure or similar).
Write the instructions on how to build and run the application in the readme file in the repository.
If you are applying for Sr. SDE, all the deliverables listed below are optional and if you do then, you
get bonus points
Earn extra brownie points by doing the following -
13. All the above deliverables
14. Dockerize all the micro-services and host them using Kubernetes or similar.
15. Use a logging frameworkAssignment: Software Development Engineer - NodeJs/Python/NET/Java
16. Articulate the architecture and the rationale behind your design choice in the readme file in the
repository.
How to submit your works?
●
●
●
Put all the code in a Github public repo and share the repo URL in reply to the assignment email
Commit the pipeline/build config you have used for CICD in the same repo.
Share a postman file in the email with links to the APIs hosted in the public cloud.



#### Install dependencies:

```bash
npm i
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
npm run dev
```
