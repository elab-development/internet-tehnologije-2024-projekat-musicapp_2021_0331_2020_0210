<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VenueResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'city'            => $this->city,
            'country'         => $this->country,
            'address'         => $this->address,
            'capacity_people' => $this->capacity_people,
            'image_url'       => $this->image_url,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
