<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeatResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'number_of_seats' => $this->number_of_seats,
            'position'        => $this->position,
            'event_id'        => $this->event_id,
            'reserved'        => $this->whenLoaded('reservations', fn() => $this->reservations->isNotEmpty()),
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
