<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            DB::table('products')->insert([
                'name' => 'Product' . $i,
                'description' => 'Description for Product' . $i,
                'price' => rand(10, 100), 
            ]);
        }
    }
}
