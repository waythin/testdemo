@extends('layouts.app')

@section('content')

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <title>Product Details</title>
</head>
<body>

<div class="container mt-5">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Name :<span class="text-success">{{$single->name}}</span></h5>
            <p class="card-text"> Description : <span class="text-success">{{$single->description}}</span> </p>
            <p class="card-text"><strong>Price:</strong> <span class="text-success">{{$single->price}}</span></p>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>


@endsection





