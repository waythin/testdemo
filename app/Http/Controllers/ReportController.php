<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($id)
    {   
        $id= $id;
        if($id){
            $report = Report::where('product_id', $id)->first();
        }
        // dd($report);

        return view('productReport',compact('id', 'report'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    //    dd($request->all());
        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'description' => 'required|string',
        //     'price' => 'required|numeric',
        // ]);
    
        
        // Report::create([
        //     'product_id' => $request->productId,
        //     'user_id' => $request->userId,
        //     'report'     => $request->report
        // ]);

        Report::updateOrInsert(
            ['product_id' => $request->productId, 'user_id' => $request->userId],
            ['report' => $request->report]
        );
        
        // Return a response (you can customize this based on your needs)
        return response()->json(['message' => 'Report created successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        //
    }
}
