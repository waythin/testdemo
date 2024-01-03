<?php
  
namespace App\Enums;
 
class StatusEnum
{
    const Active = 'active';
    const Inactive = 'inactive';
    

    public static function getStatus()
    {
        return [
            self::Active,
            self::Inactive,
        ];
    }
}