<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Enums\UserRoleEnum;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{

    protected function _registerOrLoginUser($data)
    {
        $user = User::where('email',$data->email)->first();
          if(!$user){
             $user = new User();
             $user->name = $data->name;
             $user->email = $data->email;
             $user->role = UserRoleEnum::R1;
             $user->password = null;
             $user->save();
          }
        Auth::login($user);
    }

    
    //Google Login
    public function redirectToGoogle(){
        return Socialite::driver('google')->stateless()->redirect();
        }
        
        //Google callback  
    public function handleGoogleCallback(){
    
        $user = Socialite::driver('google')->stateless()->user();
        
        $this->_registerorLoginUser($user);
        return redirect()->route('home');
    }
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
}
