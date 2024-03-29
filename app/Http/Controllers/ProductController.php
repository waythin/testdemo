<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Enums\StatusEnum;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use PDF;



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
                        $pdfUrl = route('product.pdf', $row->id);
                        
                        if(auth()->user()->role == 'Admin'){
                            $statusEnumValues = StatusEnum::getStatus();
                            $statusOptions = '';
                            
                            $btn = '
                                    <a href="' . $editUrl . '" name="edit" class="edit btn btn-danger btn-sm">Edit</a>
                                    <a href="' . $reportUrl . '" name="report" class="edit btn btn-success btn-sm">Report</a>
                                    <button class="btn btn-info btn-sm" onclick="showProductDetails(' . $row->id . ')">View</button>
                                    <a target="blank" href="' . $pdfUrl . '" name="report" class="edit btn btn-dark btn-sm">PDF</a>
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
    public function update(Request $request, $id)
    {
        // Validate the form data
        $request->validate([
            'name'        => 'required|string',
            'description' => 'required|string',
            'price'       => 'required|numeric',
        ]);

        // Update the product
        $product = Product::find($id);
        $product->update([
            'name'        => $request->input('name'),
            'description' => $request->input('description'),
            'price'       => $request->input('price'),
        ]);

        return response()->json(['message' => 'Product updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    public function pdf(Product $product, $id)
    {
        $data= [];
        if($id){
            $data = Product::find($id);
            // dd($data);
        }
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4-P',
            'default_font_size' => 12,
            'default_font' => 'nikosh'
          ]);


          $mpdf->WriteHTML(view("productPDF", compact('data')));
            return $mpdf->Output();

        
    }
}
