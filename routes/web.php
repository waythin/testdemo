<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


//query test
Route::get('/test', [HomeController::class, 'home']);



Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');



//google
Route::get('/login/google', [App\Http\Controllers\Auth\LoginController::class, 'redirectToGoogle'])->name('login.google');
Route::get('/login/google/callback', [App\Http\Controllers\Auth\LoginController::class, 'handleGoogleCallback']);



//product

Route::get('/product/list', [ProductController::class, 'index'])->name('product.list');
Route::get('/product/show/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/product/edit/{id}', [ProductController::class, 'edit'])->name('product.edit');
Route::post('/product/update/{id}', [ProductController::class, 'update'])->name('product.update');
Route::get('/product/pdf/{id}', [ProductController::class, 'pdf'])->name('product.pdf');

Route::get('/product/report/create/{id}', [ReportController::class, 'create'])->name('product.report.create');
Route::post('/product/report/store', [ReportController::class, 'store'])->name('product.report.store');



