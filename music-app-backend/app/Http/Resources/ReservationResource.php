<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'               => $this->id,
            'user'             => new UserResource($this->whenLoaded('user')),
            'event'            => new EventResource($this->whenLoaded('event')),
            'status'           => $this->status,
            'number_of_seats'  => $this->number_of_seats,
            'seats'            => SeatResource::collection($this->whenLoaded('seats')),
            'created_at'       => $this->created_at,
            'updated_at'       => $this->updated_at,
        ];
    }
}
