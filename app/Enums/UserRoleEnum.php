<?php
  
namespace App\Enums;
 
// enum UserRoleEnum:string {
//     case R1 = 'R1';
//     case R2 = 'R2';
//     case R3 = 'R3';
// }

class UserRoleEnum
{
    const R1 = 'User';
    const R2 = 'Employee';
    const R3 = 'Admin';
    const R4 = 'Manager';

    public static function getRoles()
    {
        return [
            self::R1,
            self::R2,
            self::R3,
            self::R4,
        ];
    }
}