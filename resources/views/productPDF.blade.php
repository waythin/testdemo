<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Product Details</div>
    
                    <div class="card-body">
                        <h2>{{ $data->name }}</h2>
                        <p><strong>Details:</strong> {{ $data->description }}</p>
                        <p><strong>Price:</strong> ${{ $data->price }}</p>
    
                        <!-- You can add more information here based on your product model -->
    
                        <!-- Back button -->
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</body>
</html>





