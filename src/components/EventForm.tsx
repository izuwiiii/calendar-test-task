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
import { addEvent } from "../services/eventsService";
import { Dayjs } from "dayjs";
import { toast } from "react-toastify";

type EventFormProps = {
  open: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: any) => void;
  selectedDate: Dayjs;
};

export const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onAddEvent,
  selectedDate,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [importance, setImportance] = useState<
    "normal" | "important" | "critical"
  >("normal");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user)
      return toast.error("Login is required to add an event", {
        position: "bottom-center",
      });

    const eventData = {
      userId: user.uid,
      title,
      description,
      date: selectedDate.format("YYYY-MM-DD"),
      time,
      importance,
      createdAt: Date.now(),
    };

    try {
      setIsLoading(true);
      const docRef = await addEvent(eventData).finally(() =>
        setIsLoading(false)
      );
      onAddEvent({ id: docRef.id, ...eventData });
      onClose();
      setTitle("");
      setDescription("");
      setTime("");
      setImportance("normal");
    } catch (err) {
      console.error(err);
      toast.error("Error adding event", { position: "bottom-center" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { minWidth: "700px" } }}
    >
      <DialogTitle>Add Event</DialogTitle>
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
              disabled={isLoading}
            >
              Add
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
