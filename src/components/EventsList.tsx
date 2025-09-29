import { Box, Button } from "@mui/material";
import { SquarePen, SquareX } from "lucide-react";
import React from "react";

export const EventsList = ({
  events,
  onDelete,
  onEdit,
}: {
  events: any[];
  onDelete: (id: string) => void;
  onEdit: (event: any) => void;
}) => {
  return (
    <Box className="w-full p-4">
      <ul>
        {events.length > 0 ? (
          events.map((ev) => (
            <li
              key={ev.id}
              className="mb-2 p-2 pl-4 border border-[#dee2e6] rounded-lg border-l-4 flex justify-between items-center"
              style={{
                borderLeft: `4px solid ${
                  ev.importance === "critical"
                    ? "red"
                    : ev.importance === "important"
                    ? "orange"
                    : "green"
                }`,
              }}
            >
              <div>
                <h1 className="text-lg font-semibold">{ev.title}</h1>
                <p>{ev.description}</p>
                <small>
                  ({ev.date} {ev.time})
                </small>
              </div>

              <div className="flex gap-1">
                <SquarePen
                  onClick={() => onEdit(ev)}
                  className="cursor-pointer"
                  strokeWidth={1}
                />
                <SquareX
                  onClick={() => onDelete(ev.id)}
                  className="cursor-pointer"
                  color="red"
                  strokeWidth={1}
                />
              </div>
            </li>
          ))
        ) : (
          <h1 className="text-center">Here must be your events</h1>
        )}
      </ul>
    </Box>
  );
};
