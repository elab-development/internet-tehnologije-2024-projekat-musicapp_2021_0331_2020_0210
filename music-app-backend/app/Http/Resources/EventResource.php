<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'description'       => $this->description,
            'starts_at'         => $this->starts_at,
            'ends_at'           => $this->ends_at,
            'tickets_capacity'  => $this->tickets_capacity,
            'tickets_reserved'  => $this->tickets_reserved,
            'image_url'         => $this->image_url,
            'venue'             => new VenueResource($this->whenLoaded('venue')),
            'manager'           => new UserResource($this->whenLoaded('manager')),
            'author'            => new AuthorResource($this->whenLoaded('author')),
            'seats'             => SeatResource::collection($this->whenLoaded('seats')),
            'attendees'         => UserResource::collection($this->whenLoaded('attendees')),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
