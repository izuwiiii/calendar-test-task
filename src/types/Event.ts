import { Timestamp } from "firebase/firestore";

export type EventType = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  importance: "normal" | "important" | "critical";
  createdAt: Timestamp;
};
