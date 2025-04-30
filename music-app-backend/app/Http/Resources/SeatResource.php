<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeatResource extends JsonResource
{
    public function toArray($request)
    {
        $isReserved = $this->is_reserved;
        
        // If the reservations relationship is loaded, use it to determine if the seat is reserved
        if ($this->relationLoaded('reservations')) {
            $isReserved = $this->reservations->isNotEmpty();
        }
        
        return [
            'id'           => $this->id,
            'position'     => $this->position,
            'event_id'     => $this->event_id,
            'is_reserved'  => $isReserved,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
