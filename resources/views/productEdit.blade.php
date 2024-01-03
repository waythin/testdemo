<!-- resources/views/products/create.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <form id="productForm">
        @csrf
        <div class="form-group">
            <label for="name">Product Name:</label>
            <input type="text" class="form-control" id="name" name="name" value="{{$single->name}}" required>
        </div>
        <div class="form-group">
            <label for="description">Product Description:</label>
            <textarea class="form-control" id="description" name="description"  required>{{$single->description}}</textarea>
        </div>
        <div class="form-group">
            <label for="price">Product Price:</label>
            <input type="number" class="form-control" id="price" name="price" value="{{$single->price}}" required>
        </div>
        <button type="button" class="btn btn-primary" onclick="submitForm()">Submit</button>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
    function submitForm() {
        $.ajax({
            url: '{{ route('product.update') }}', // Assuming you have a route named 'products.store'
            type: 'POST',
            data: $('#productForm').serialize(),
            success: function(response) {
                console.log(response);
                // Handle success response here (e.g., show a success message)
            },
            error: function(error) {
                console.log(error);
                // Handle error response here (e.g., show an error message)
            }
        });
    }
</script>
@endsection
