<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      font-family: sans-serif;
      background-color: #ddedea;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
    }
    .header {
      color: white;
      padding: 20px;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: auto;
    }
    .main-content {
      padding: 20px;
    }
    .main-content img {
      max-width: 100%;
      height: auto;
    }
    .welcome-message {
      text-align: center;
      margin: 20px 0;
    }
    .welcome-message p {
      font-size: 1.2em;
      line-height: 1.5;
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      padding: 20px 0;
    }
    .feature-item {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      text-align: center;
      width: 300px;
    }
    .feature-item img {
      border-radius: 8px;
      margin-bottom: 10px;
      width: 100%;
      height: auto;
    }
    .call-to-action {
      text-align: center;
      padding: 20px;
    }
    .call-to-action a {
      background-color: #f06292;
      color: white;
      padding: 15px 30px;
      border-radius: 5px;
      text-decoration: none;
      font-size: 1.1em;
    }
    .footer {
      color: white;
      padding: 20px;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <header class="header">
    <img class="logo" src="https://firebasestorage.googleapis.com/v0/b/animal-dating-app-12de9.appspot.com/o/images%2Flogo.jpg?alt=media&amp;token=ee3301c8-8d09-49d1-a23e-6f927d735f8b" alt="[Your Website Name] Logo">
    <h1>Welcome, {{firstName}}!</h1>
  </header>
  <div class="main-content">
    <div class="welcome-message">
      <img src="https://firebasestorage.googleapis.com/v0/b/animal-dating-app-12de9.appspot.com/o/images%2Fdogs-lined-up.png?alt=media&amp;token=7860fad9-662e-4977-8434-974781c991b5" alt="Happy Dogs">
      <p>Hi {{firstName}},</p>
      <p>We're delighted to have your shelter join the Take Me Home community! Together, we can find loving homes for wonderful animals.</p>
      <p>Your shelter's participation is crucial in connecting these amazing pets with compassionate families looking for a new member to love.</p>
      <p>Let's get started by adding your pets to our platform!</p>
    </div>
    <div class="features">
      <div class="feature-item">
        <img src="https://firebasestorage.googleapis.com/v0/b/animal-dating-app-12de9.appspot.com/o/images%2Fheader-krista-mangulsone.jpg?alt=media&amp;token=ce50a778-36ee-4659-883d-895ab28aa096" alt="Feature Image">
        <p>Feature 1</p>
      </div>
      <div class="feature-item">
        <img src="https://firebasestorage.googleapis.com/v0/b/animal-dating-app-12de9.appspot.com/o/images%2Fheader-krista-mangulsone.jpg?alt=media&amp;token=ce50a778-36ee-4659-883d-895ab28aa096" alt="Feature Image">
        <p>Feature 2</p>
      </div>
      <div class="feature-item">
        <img src="https://firebasestorage.googleapis.com/v0/b/animal-dating-app-12de9.appspot.com/o/images%2Fheader-krista-mangulsone.jpg?alt=media&amp;token=ce50a778-36ee-4659-883d-895ab28aa096" alt="Feature Image">
        <p>Feature 3</p>
      </div>
    </div>
    <div class="call-to-action">
      <a href="https://animaladoption.pages.dev/">Get Started!</a>
    </div>
    <div class="main-content">
      <p>We're here to support you every step of the way. If you have any questions, feel free to reach out to us at email@gmail.com.</p>
      <p>Thank you for joining us in this mission!</p>
      <p>Warm regards,</p>
      <p>The Take Me Home Team</p>
    </div>
  </div>
  <footer class="footer">
    <p>&copy; 2023 Take Me Home. All Rights Reserved. Privacy Policy</p>
  </footer>
</body>
</html>
