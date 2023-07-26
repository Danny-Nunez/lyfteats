## Description

This capstone project represents the culmination of the MIT - Full Stack Development with MERN Course, showcasing my skills and expertise in creating a comprehensive web application. The project revolves around a Food Ordering platform that offers a seamless user experience, allowing individuals to easily sign up, browse a wide selection of dishes, and conveniently checkout using secure credit card transactions.

One unique aspect of this project is the inclusion of a dual user functionality. In addition to regular user accounts, the platform also accommodates restaurant entities. As a restaurant, users have the ability to create and customize their own dedicated restaurant space. This includes adding a compelling description and incorporating a distinct logo that represents their brand. Furthermore, restaurant owners can effortlessly manage their menu by creating, deleting, and editing dishes to effectively cater to their target audience.

By offering this added functionality, users are empowered to experience the dynamics of running a business within the digital realm. The platform provides an interactive environment for both users and restaurants, fostering a seamless and engaging food ordering experience.

## Fully Responsive

![responsive](https://github.com/Danny-Nunez/lyfteats/assets/114783191/1d1e6352-56b0-4669-b3e5-697c02dc4d04)

## Restaurant Admin View

<img width="1408" alt="restaurant profile page" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/d98d8412-b692-4275-bb3c-96bea9874a35">

<img width="1402" alt="restaurant logged in menu" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/f7b602cf-2d05-459f-a250-8f490f2d2b61">
<img width="1407" alt="restaurant admin orders page" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/ce9bddd8-3f0f-4c3b-8f7d-38849998b0e0">

## User View

<img width="1397" alt="home page" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/31c5a9ad-82b4-4f46-9a9a-5371b0434e05">
<img width="1403" alt="front end restaurant list" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/ffc1f122-08a7-49f8-8d17-b2288ca10121">


<img width="1394" alt="strip payment page" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/bb8f0778-8e70-4c17-b9a1-ff6281cb9f2d">
<img width="1409" alt="restaurant search page results" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/b65b6639-ad53-4e33-9e97-409087b9a042">
<img width="1405" alt="user order page" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/873d0e0e-5d76-4f81-98d0-03d0eaa9c4f3">
<img width="1409" alt="user shopping cart" src="https://github.com/Danny-Nunez/lyfteats/assets/114783191/7fedad7d-ad56-4a48-b64b-9544109dee43">


## Functionalities

- Sign Up as a user or restaurant with email and password
- Sign In
- Search for restaurants
- Search for dishes in a restaurant
- Add dishes to your cart by selecting a quantity
- Modify quantity of dishes on cart
- Price and quantity shown in cart updates automatically
- Check out with stripe
- Create your Restaurant by signing up as a restaurant
- Upload or edit your restaurant picture
- Create, Edit and Delete Dishes. Including pictures and prices
- Auto populate restaurant address when creating a restaurant.


## How to Run

Fork this repository and follow the next steps

```bash
git clone 
npm install
```

Before running `npm run dev`, you will need the following environment variables:

```
DB_URI=<This is your MongoDb URI>
ACCESS_TOKEN_SECRET=<This is your access token secret>
REFRESH_TOKEN_SECRET=<This is your refresh token secret>
STRIPE_PUBLIC_KEY=<Your stripe public key>
STRIPE_SECRET_KEY=<Your stripe secret key>
S3_UPLOAD_KEY=<Your S3 key>
S3_UPLOAD_SECRET=<Your S3 secret>
S3_UPLOAD_BUCKET=<Your S3 bucket>
S3_UPLOAD_REGION=<Your S3 bucket region>
REACT_APP_GOOGLE=<Your Google maps API>
```

Once you have set up the environment variables, you can safely run the application in your computer by running `npm run dev`. Then open [localhost:3000](http//localhost:3000) in your browser.

## Tech Specifications

- Framework: [NextJS](https://nextjs.org/)
- Hosting Service: [Vercel](https://vercel.com/)
- API Approach: [REST](https://aws.amazon.com/what-is/restful-api/)
- API Documentation: Swagger. Visit [Lyfteats API Docs](https://lyfteats.vercel.app/api-doc)
- Database: [MongoDB](https://www.mongodb.com/)
- Secondary Storage: [AWS S3](https://aws.amazon.com/s3/)
- Payment Getaway: [Stripe](https://stripe.com/)
- Authorization and Authentication: [JSON Web Tokens](https://jwt.io/)
- Material UI: [MaterialUI](https://materialui/)
- Important libraries: [@aws-sdk/client-s3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html), [stripe](https://stripe.com/docs/api), [mongoose](https://mongoosejs.com/), [cookies-next](https://www.npmjs.com/package/cookies-next), [next-swagger-doc](https://www.npmjs.com/package/next-swagger-doc), [general-formatter](https://www.npmjs.com/package/general-formatter), [NextJS-ProgressBar](https://www.npmjs.com/package/nextjs-progressbar)


