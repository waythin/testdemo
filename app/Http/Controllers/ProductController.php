<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Enums\StatusEnum;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {   
        // $productId = request('id');
        // if($productId){
        //     $single = Product::find($productId);
        // }
        $products = Product::all();
        if ($request->ajax()) {
            $data = Product::select('*');
            return Datatables::of($data)
                    ->addIndexColumn()
                    ->addColumn('action', function($row){
                        $viewUrl = route('product.show', $row->id);
                        $editUrl = route('product.edit', $row->id);
                        $reportUrl = route('product.report.create', $row->id);
                        
                        if(auth()->user()->role == 'Admin'){
                            $statusEnumValues = StatusEnum::getStatus();
                            $statusOptions = '';
                            
                            $btn = '
                                    <a href="' . $editUrl . '" name="edit" class="edit btn btn-danger btn-sm">Edit</a>
                                    <a href="' . $reportUrl . '" name="report" class="edit btn btn-success btn-sm">Report</a>
                                    <button class="btn btn-info btn-sm" onclick="showProductDetails(' . $row->id . ')">View</button>
                                    ';

                        }
                        else {
                            $btn = '<button class="btn btn-info btn-sm" onclick="showProductDetails(' . $row->id . ')">View</button>';
                        }
      
                            return $btn;
                    })

                    ->rawColumns(['action'])
                    ->make(true);
        }
          
        // if ($productId) {
           
        //     return view('productList',compact('single'));
        // }
        return view('productList');
        
    }

    // <div class="btn-group">
    //     <select id="status" name="status" class="custom-select" onchange="window.location.href = this.value;">
    //     foreach ($statusEnumValues as $statusValue) {
    //         $statusOptions .= '<option value="' . $statusValue . '">' . $statusValue . '</option>';
    //     }
            
            
            
    //     </select>
    // </div>

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
        $product = Product::find($id);

        if ($product) {
            return response()->json($product);
        }
    
        return response()->json(['error' => 'Product not found'], 404);
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
