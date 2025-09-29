"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { updateEvent } from "../services/eventsService";
import { EventType } from "@/types/Event";
import { toast } from "react-toastify";

type EditEventFormProps = {
  open: boolean;
  onClose: () => void;
  event: EventType | null;
  onUpdateEvent: (updatedEvent: EventType) => void;
};

export const EditEventForm: React.FC<EditEventFormProps> = ({
  open,
  onClose,
  event,
  onUpdateEvent,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [time, setTime] = useState(event?.time || "");
  const [importance, setImportance] = useState<EventType["importance"]>(
    event?.importance || "normal"
  );

  const styledTextField = {
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#212529",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#212529",
      },
    },
  };

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setTime(event.time);
      setImportance(event.importance);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      await updateEvent(event.id, { title, description, time, importance });
      onUpdateEvent({ ...event, title, description, time, importance });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error updating event", { position: "bottom-center" });
    }
  };

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="min-w-[500px]"
      sx={{ "& .MuiDialog-paper": { minWidth: "700px" } }}
    >
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={styledTextField}
          />
          <TextField
            label="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={styledTextField}
          />
          <TextField
            label="Event Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={styledTextField}
          />
          <Select
            value={importance}
            onChange={(e) => setImportance(e.target.value as any)}
            sx={{
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#212529",
              },
            }}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="important">Important</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
          <DialogActions>
            <Button sx={{ color: "#212529" }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              sx={{
                bgcolor: "#212529",
                color: "#fff",
                "&:hover": { bgcolor: "#343a40" },
              }}
              type="submit"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
