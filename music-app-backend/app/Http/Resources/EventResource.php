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
            // Ukljuciti i veze
            'venue'             => $this->whenLoaded('venue', function() {
                return new VenueResource($this->venue);
            }),
            'manager'           => $this->whenLoaded('manager', function() {
                return new UserResource($this->manager);
            }),
            'author'            => $this->whenLoaded('author', function() {
                return new AuthorResource($this->author);
            }),
            'seats'             => $this->whenLoaded('seats', function() {
                return SeatResource::collection($this->seats);
            }),
            'attendees'         => $this->whenLoaded('attendees', function() {
                return UserResource::collection($this->attendees);
            }),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
