"use client";
import { useEffect, useState } from "react";
import { deleteEvent, getUserEvents } from "../../services/eventsService";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import CalendarView from "../../components/CalendarView";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { EventsList } from "@/components/EventsList";
import { EditEventForm } from "@/components/EditEventForm";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function EventsPage() {
  const { user, loading, logout } = useAuth();
  const [userName, setUserName] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [editEvent, setEditEvent] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [manualLogout, setManualLogout] = useState(false);

  const router = useRouter();

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const handleChangeView = (event: React.SyntheticEvent, newValue: string) => {
    setViewMode(newValue as "calendar" | "list");
  };

  useEffect(() => {
    if (!loading && !user && !manualLogout) {
      router.push("/login");
      toast.info("Please log in to access your events", {
        position: "bottom-center",
      });
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getUserEvents(user.uid).then(setEvents);

      const loadUserName = async () => {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserName(snap.data().name);
        }
      };
      loadUserName();
    }
  }, [user]);

  if (loading)
    return (
      <div className="flex align-middle items-center">
        <CircularProgress />
      </div>
    );

  const handleAddEvent = (newEvent: any) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteEvent(deleteId);
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    }
    handleCloseDeleteDialog();
  };

  return (
    <div className="min-w-[775px] min-h-[500px] mt-20 flex flex-col items-center align-top">
      <div className="w-full flex justify-between items-center mb-4 px-4">
        <h1>Welcome, {userName || user?.email}</h1>
        <Button
          sx={{
            color: "#212529",
            background: "#e9ecef",
            ":hover": { background: "#ced4da" },
          }}
          onClick={async () => {
            setManualLogout(true);
            await logout();
            router.push("/login");
            toast.success("Logged out successfully", {
              position: "bottom-center",
            });
          }}
        >
          Log out
        </Button>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={viewMode}
          onChange={handleChangeView}
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#212529" },
          }}
        >
          <Tab
            label="Calendar"
            value="calendar"
            sx={{
              "&.Mui-selected": { color: "#212529", fontWeight: "semibold" },
              ":hover": { color: "#343a40" },
            }}
          />
          <Tab
            label="List"
            value="list"
            sx={{
              "&.Mui-selected": { color: "#212529", fontWeight: "semibold" },
              ":hover": { color: "#343a40" },
            }}
          />
        </Tabs>
      </Box>

      {viewMode === "calendar" && (
        <CalendarView
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={(id) => handleOpenDeleteDialog(id)}
        />
      )}
      {viewMode === "list" && (
        <EventsList
          events={events}
          onEdit={(ev) => {
            setEditEvent(ev);
            setFormOpen(true);
          }}
          onDelete={(id) => handleOpenDeleteDialog(id)}
        />
      )}

      {editEvent && (
        <EditEventForm
          open={!!editEvent && formOpen}
          onClose={() => setEditEvent(null)}
          event={editEvent}
          onUpdateEvent={(updatedEvent) =>
            setEvents((prev) =>
              prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            )
          }
        />
      )}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
