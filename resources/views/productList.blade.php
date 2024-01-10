@extends('layouts.app')

@section('content')
    <!DOCTYPE html>
    <html>

    <head>
        <title>Products</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.datatables.net/1.11.4/css/dataTables.bootstrap5.min.css" rel="stylesheet">
        <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.0/jquery.validate.js"></script>
        <script src="https://cdn.datatables.net/1.11.4/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
        </script>
        <script src="https://cdn.datatables.net/1.11.4/js/dataTables.bootstrap5.min.js"></script>
    </head>

    <body>

        <div class="container">
            <h1>Products</h1>
            <table class="table table-bordered data-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Description</th>
                        {{-- <th>Price</th> --}}
                        <th>Status</th>
                        <th width="250px">Action</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>


        {{-- modal --}}
        <!-- Modal -->
        <div class="modal fade" id="productDetailsModal" tabindex="-1" role="dialog"
            aria-labelledby="productDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productDetailsModalLabel">Product Details</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <h4>Name</h4>
                            <p id="productName"></p>
                        </div>
                        <div>
                            <h4>Description:</h4>
                            <p id="productDescription"></p>
                        </div>
                        <div>
                            <h4>Price:</h4>
                            <p id="productPrice"></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        {{-- modal end --}}

    </body>

    <script type="text/javascript">
        $(function() {

            var table = $('.data-table').DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('product.list') }}",
                columns: 
                [
                    {
                        data: 'id',
                        name: 'id'
                    },
                    // {data: 'name', name: 'name'},
                    {
                        data: 'name',
                        name: 'name',
                        render: function(data, type, row) {
                            return row.name + ' | $' + row.price;
                        },
                        searchable: true,
                        search: function (data, _, __) {
                            // Customize the search behavior for the "name" column here
                            var searchString = $('.data-table input').val().toLowerCase();
                            return data.toLowerCase().includes(searchString);
                        }

                    },
                    {
                        data: 'description',
                        name: 'description'
                    },
                    // {data: 'price', name: 'price'},
                    {
                        data: 'status',
                        name: 'status'
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false
                    },
                ]
            });

        });
    </script>



    {{-- single product view --}}
    <script>
        function showProductDetails(productId) {
            $.ajax({
                url: '/product/show/' + productId,
                type: 'GET',
                success: function(response) {
                    // Update modal content with product details
                    $('#productName').text(response.name);
                    $('#productDescription').text(response.description);
                    $('#productPrice').text(response.price);
                    $('#productDetailsModal').modal('show');
                },
                error: function(error) {
                    console.error('Error fetching product details:', error);
                }
            });
        }
    </script>

    </html>
@endsection
