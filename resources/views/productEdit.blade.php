<!-- resources/views/products/create.blade.php -->

@extends('layouts.app')

@section('content')
{{-- <div class="container mt-5">
    <form id="updateProductForm">
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
        <button type="button" class="btn btn-primary" onclick="updateProduct({{ $single->id }})">Update Product</button>
    </form>
</div> --}}


{{-- inline --}}
<div class="container mt-5">
    <form id="updateProductForm">
        @csrf
        <div class="form-group">
            <label for="name">Product Name:</label>
            <input type="text" class="form-control" id="name" name="name" value="{{$single->name}}" required>
            {{-- @error('name')
                <span class="text-danger">{{ $message }}</span>
            @enderror --}}
            <span class="text-danger" id="name-error"></span>
        </div>
        <div class="form-group">
            <label for="description">Product Description:</label>
            <textarea class="form-control" id="description" name="description" required>{{$single->description}}</textarea>
            {{-- @error('description')
                <span class="text-danger">{{ $message }}</span>
            @enderror --}}
            <span class="text-danger" id="description-error"></span>
        </div>
        <div class="form-group">
            <label for="price">Product Price:</label>
            <input type="number" class="form-control" id="price" name="price" value="{{$single->price}}" required>
            {{-- @error('price')
                <span class="text-danger">{{ $message }}</span>
            @enderror --}}
            <span class="text-danger" id="price-error"></span>
        </div>
        <button type="button" class="btn btn-primary" onclick="updateProduct({{ $single->id }})">Update Product</button>
    </form>
</div>



<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>


<!-- Add SweetAlert script -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    function updateProduct(productId) {
        var formData = $('#updateProductForm').serialize();

        $.ajax({
            url: '/product/update/' + productId,
            type: 'POST',
            data: formData,
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                });
            },
            error: function(error) {
                // Handle validation errors with SweetAlert
                // var errors = error.responseJSON.errors;
                // var errorMessage = 'hiiiiiiiiiiii';

                // $.each(errors, function(key, value) {
                //     errorMessage += value[0] + '<br>';
                // });

                // Swal.fire({
                //     icon: 'error',
                //     title: 'Validation Failed',
                //     html: errorMessage,
                // });
                var errors = error.responseJSON.errors;

                $.each(errors, function(key, value) {
                    // Display the validation error under the input field
                    $('#' + key + '-error').html(value[0]);
                });
            }
        });
    }
</script>





{{-- 
<script>
    function updateProduct(productId) {
        var formData = $('#updateProductForm').serialize();

        $.ajax({
            url: '/product/update/' + productId,
            type: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
            },
            error: function(error) {
                // Handle validation errors
                var errors = error.responseJSON.errors;
                $.each(errors, function(key, value) {
                    alert(value[0]);
                });
            }
        });
    }
</script> --}}



@endsection
