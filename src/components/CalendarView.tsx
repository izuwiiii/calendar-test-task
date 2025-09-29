"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Select,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { PickersDay } from "@mui/x-date-pickers";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

import { useAuth } from "../context/AuthContext";
import { EventForm } from "./EventForm";
import { EditEventForm } from "./EditEventForm";
import { EventType } from "@/types/Event";
import { SquarePen, SquareX } from "lucide-react";

export default function CalendarView({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: {
  events: any[];
  onAddEvent: (ev: any) => void;
  onUpdateEvent: (ev: any) => void;
  onDeleteEvent: (id: string) => void;
}) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [formOpen, setFormOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<EventType | null>(null);
  const [importanceFilter, setImportanceFilter] = useState<
    "all" | "normal" | "important" | "critical"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const eventsForSelectedDay = events.filter((e) =>
    dayjs(e.date).isSame(selectedDate, "day")
  );

  const filteredEvents = eventsForSelectedDay.filter((e) => {
    const matchesImportance =
      importanceFilter === "all" ? true : e.importance === importanceFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesImportance && matchesSearch;
  });

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
      prop !== "eventImportance" && prop !== "selected",
  })<{
    eventImportance?: "normal" | "important" | "critical";
    selected?: boolean;
  }>(({ eventImportance, selected }) => ({
    position: "relative",
    ":hover": {
      backgroundColor: "#e9ecef",
      color: "#212529",
    },
    ":focus": { backgroundColor: "#212529", color: "#fff" },
    ...(selected && {
      backgroundColor: "#212529",
      color: "#fff",
      "&:hover": { backgroundColor: "#343a40" },
    }),
    "&::after": {
      content: '""',
      position: "absolute",
      width: 6,
      height: 6,
      borderRadius: "50%",
      bottom: 4,
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor:
        eventImportance === "critical"
          ? "red"
          : eventImportance === "important"
          ? "orange"
          : eventImportance === "normal"
          ? "green"
          : "transparent",
    },
  }));

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#212529" },
      background: { paper: "#212529" },
      text: { primary: "black", secondary: "#ccc" },
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={4} p={2}>
        <Paper sx={{ p: 2, height: "fit-content" }}>
          <ThemeProvider theme={darkTheme}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate!)}
              sx={{
                "& .MuiPickersArrowSwitcher-button": {
                  color: "#212529",
                },
                "& .MuiPickersArrowSwitcher-button:hover": {
                  color: "#6c757d",
                },
              }}
              slots={{
                day: (props) => {
                  const dayEvents = events.filter((e) =>
                    dayjs(e.date).isSame(props.day, "day")
                  );

                  let eventImportance:
                    | "normal"
                    | "important"
                    | "critical"
                    | undefined;
                  if (dayEvents.some((e) => e.importance === "critical"))
                    eventImportance = "critical";
                  else if (dayEvents.some((e) => e.importance === "important"))
                    eventImportance = "important";
                  else if (dayEvents.some((e) => e.importance === "normal"))
                    eventImportance = "normal";

                  return (
                    <CustomPickersDay
                      {...props}
                      selected={props.selected}
                      eventImportance={eventImportance}
                    />
                  );
                },
              }}
            />
          </ThemeProvider>
        </Paper>

        <Box flex={1} display="flex" flexDirection="column">
          <Typography variant="h6" mb={2}>
            Events on {selectedDate.format("DD/MM/YYYY")}
          </Typography>

          <Box display="flex" gap={2} mb={2}>
            <Select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value as any)}
              className="min-w-[120px] h-[40px]"
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#212529",
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="important">Important</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>

            <TextField
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              fullWidth
              sx={{
                "& .MuiInputLabel-root.Mui-focused": { color: "#212529" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#212529" },
                },
              }}
            />
          </Box>

          <Box flex={1} overflow="auto">
            {filteredEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No events for this day.
              </Typography>
            ) : (
              <List>
                {filteredEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      border: "1px solid #dee2e6",
                      borderLeft: `4px solid ${
                        event.importance === "critical"
                          ? "red"
                          : event.importance === "important"
                          ? "orange"
                          : "green"
                      }`,

                      mb: 1,
                      background: "#f9f9f9",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width={"100%"}
                    >
                      <Box>
                        <Typography fontWeight={"semibold"}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {event.description}
                        </Typography>
                      </Box>
                      <Typography
                        display="flex"
                        alignSelf={"flex-end"}
                        fontSize={12}
                        color="text.secondary"
                        mr={2}
                      >
                        {event.time}
                      </Typography>
                    </Box>

                    <Box>
                      <div className="flex gap-1">
                        <SquarePen
                          onClick={() => setEditEvent(event)}
                          className="cursor-pointer"
                          strokeWidth={1}
                        />
                        <SquareX
                          onClick={() => onDeleteEvent(event.id)}
                          className="cursor-pointer"
                          color="red"
                          strokeWidth={1}
                        />
                      </div>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#212529",
              color: "#f8f9fa",
              rounded: "md",
              py: 1,
              px: 2,
              "&:hover": { backgroundColor: "#343a40" },
            }}
            onClick={() => setFormOpen(true)}
          >
            Add Event
          </Button>
        </Box>

        <EventForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onAddEvent={onAddEvent}
          selectedDate={selectedDate}
        />
        <EditEventForm
          open={!!editEvent}
          onClose={() => setEditEvent(null)}
          event={editEvent}
          onUpdateEvent={onUpdateEvent}
        />
      </Box>
    </LocalizationProvider>
  );
}
