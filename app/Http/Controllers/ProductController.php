<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $products = Product::all();
        if ($request->ajax()) {
            $data = Product::select('*');
            return Datatables::of($data)
                    ->addIndexColumn()
                    ->addColumn('action', function($row){
                        $viewUrl = route('product.show', $row->id);
                        $editUrl = route('product.edit', $row->id);
                        $reportUrl = route('product.report.create', $row->id);
                        
                        if (auth()->user()->role == 'Employee') {
                            $btn = '<a href="' . $viewUrl . '" name="view" class="edit btn btn-primary btn-sm">View</a>';
                        } 
                        elseif(auth()->user()->role == 'Admin'){
                            $btn = '<a href="' . $viewUrl . '" name="view" class="edit btn btn-primary btn-sm">View</a>
                                    <a href="' . $editUrl . '" name="edit" class="edit btn btn-danger btn-sm">Edit</a>
                                    <a href="' . $reportUrl . '" name="report" class="edit btn btn-success btn-sm">Report</a>';

                        }
                        else {
                            $btn = '<a href="' . $viewUrl . '" name="view" class="edit btn btn-primary btn-sm">View</a>
                                    <a href="' . $editUrl . '" name="edit" class="edit btn btn-danger btn-sm">Edit</a>';
                        }
      
                            return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);
        }
          
          
        return view('productList');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product, Request $request, $id)
    {     
        if($id){
            $single = Product::find($id);
        }
       
        return view('productView', compact('single'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product , $id)
    {   
        if($id){
            $single = Product::find($id);
        }
        return view('productEdit', compact('single'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product ,$id)
    {
        dd($id);
         // Validate the form data
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
        ]);

        // Save the product to the database
        $product = new Product([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
        ]);

        $product->save();

        // Return a response (you can customize this based on your needs)
        return response()->json(['message' => 'Product created successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    public function report(Product $product)
    {
        //
    }
}
