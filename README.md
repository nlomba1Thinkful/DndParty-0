# DndParty

[Live Link](https://dndparty.vercel.app/ 'Live Link')

DndParty is a website for users to create and join parties to experience the greatest roleplaying tabletop game of all time: _Dungeons and Dragons!_

**Frontend:** `HTML CSS JAVASCRIPT JSX REACTJS `

**Server-side:** `NODEJS EXPRESS KNEX`

**Backend: **`POSTGRESQL`

**Testing:** `JEST MOCHA CHAI SUPERTEST`

## **How it Works:**

The User experience involves:

1. Registration \ Login to person Account
2. Personal Profile that keeps track of all games created and parties joined,
   as well as tons of information to help communicate what you are looking for in a group
3. Join parties based on robust listed information
4. Create a Party with Admin access of who you allow to join and as what type of player: Dungeon Master or Player
5. View all Parties on Home page.
6. A11y Accessible for screenreaders
7. Fully media responsive across multiple devices.

## Register to make an Account. Requires only an Email address.

[![Register](https://i.ibb.co/SyMTycj/Ss1.png 'Register')](https://i.ibb.co/SyMTycj/Ss1.png 'Register')

## View Parties created by Users

[![Parties](https://i.ibb.co/hdS6KC9/Ss2.png 'Parties')](https://i.ibb.co/hdS6KC9/Ss2.png 'Parties')

## View and Edit your own personal profile

[![Profile1](https://i.ibb.co/whmwBrK/Ss3.png 'Profile1')](https://i.ibb.co/whmwBrK/Ss3.png 'Profile1')

## View Parties you have joined, created, and users requesting to join your parties

[![Profile2](https://i.ibb.co/KxWrtbD/Ss4.png 'Profile2')](https://i.ibb.co/KxWrtbD/Ss4.png 'Profile2')

## Create your very own Party for roleplayers to join

[![Create](https://i.ibb.co/YW2DnqX/Ss5.png 'Create')](https://i.ibb.co/YW2DnqX/Ss5.png 'Create')

## API Documentation

| path                                     | info                               |
| ---------------------------------------- | ---------------------------------- | --------------------------- |
| api/parties POST                         | Create a new Party                 |
| api/parties GET                          | Retrieve all Parties from Database |
| api/parties/:party_id POST               | Create a Request to Join a Party   | Requires party ID parameter |
| api/parties/joined POST                  | Retrieve Users who Joined a Party  |
| api/parties/joined/:user_id GET          | Retrieve Parties User has Joined   | Requires user ID parameter  |
| api/parties/accept_request POST          | Accept a Request to Join a Party   |
| api/parties/requests GET                 | Retrieve all request for a Party   |
| api/profile/:user_id GET                 | Retrieve User Profile information  | Requires user ID parameter  |
| api/profile/:user_id PATCH               | Update User Profile Information    | Requires user ID parameter  |
| api/profile/created_parties/:user_id GET | Retrieve Parties created by User   | Requires user ID parameter  |
