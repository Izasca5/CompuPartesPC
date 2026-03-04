<?php
// Simple PHP Index Page





?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        nav {
            margin: 20px 0;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        nav a {
            margin-right: 15px;
            text-decoration: none;
            color: #007bff;
        }
        nav a:hover {
            color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Index</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
        <p>This is the main index page. Ahora Sí, de verdad de la buena</p>
    </div>
</body>
</html>