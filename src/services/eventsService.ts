import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const eventsRef = collection(db, "events");

export const addEvent = async (eventData: any) => {
  return await addDoc(eventsRef, eventData);
};

export const getUserEvents = async (userId: string) => {
  const q = query(eventsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateEvent = async (id: string, updatedData: any) => {
  const docRef = doc(db, "events", id);
  await updateDoc(docRef, updatedData);
};

export const deleteEvent = async (id: string) => {
  const docRef = doc(db, "events", id);
  await deleteDoc(docRef);
};
