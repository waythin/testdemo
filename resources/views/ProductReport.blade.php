<!-- resources/views/products/create.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <form id="productForm">
        @csrf
        <div class="form-group">
            <label for="report">Product Report:</label>
            <textarea class="form-control" id="report" name="report"  required>{{$report->report ?? null}}</textarea>
        </div>
    
        <button type="button" class="btn btn-primary" onclick="submitForm()">Submit</button>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>



<script>
    function submitForm() {
        var productId = {{ $id }}; // Assuming $id is passed from the controller
        var userId = {{ Auth()->user()->id }};

        // Serialize form data
        var formData = $('#productForm').serialize();

        // Append productId and userId to the serialized form data
        formData += '&productId=' + productId + '&userId=' + userId;

        $.ajax({
            url: '{{ route('product.report.store') }}',
            type: 'POST',
            data: formData,
            success: function(response) {
                console.log(response);
                alert('Success');
            },
            error: function(error) {
                console.log(error);
                alert('Error');
            }
        });
    }
</script>

@endsection
