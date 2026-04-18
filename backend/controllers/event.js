const Event = require("../models/Event");
const Organization = require("../models/Organization");

// GET /api/v1/events/my-events — user sees their assigned events
const getMyEvents = async (req, res) => {
  const events = await Event.find({ assignedTo: req.user.id })
    .populate("organization", "name")
    .populate("createdBy", "name")
    .sort({ date: 1 });
  return res.status(200).json({ events });
};

// GET /api/v1/events/org-events — admin sees all events in their org
const getOrgEvents = async (req, res) => {
  const org = await Organization.findOne({ admin: req.user.id });
  if (!org) return res.status(404).json({ msg: "No organization found for this admin" });

  const events = await Event.find({ organization: org._id })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name")
    .sort({ date: 1 });

  return res.status(200).json({ events });
};

// POST /api/v1/events — admin creates an event
const createEvent = async (req, res) => {
  const { title, description, date, startTime, endTime, location, assignedTo } = req.body;
  if (!title || !date) return res.status(400).json({ msg: "Title and date are required" });

  const org = await Organization.findOne({ admin: req.user.id });
  if (!org) return res.status(404).json({ msg: "No organization found for this admin" });

  const event = new Event({
    title,
    description: description || "",
    date: new Date(date),
    startTime: startTime || "",
    endTime: endTime || "",
    location: location || "",
    organization: org._id,
    createdBy: req.user.id,
    assignedTo: assignedTo || [],
  });

  await event.save();
  return res.status(201).json({ event });
};

// PUT /api/v1/events/:id — admin updates an event
const updateEvent = async (req, res) => {
  const org = await Organization.findOne({ admin: req.user.id });
  if (!org) return res.status(404).json({ msg: "No organization found" });

  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, organization: org._id },
    { ...req.body, date: req.body.date ? new Date(req.body.date) : undefined },
    { new: true, runValidators: true }
  );

  if (!event) return res.status(404).json({ msg: "Event not found" });
  return res.status(200).json({ event });
};

// DELETE /api/v1/events/:id — admin deletes an event
const deleteEvent = async (req, res) => {
  const org = await Organization.findOne({ admin: req.user.id });
  if (!org) return res.status(404).json({ msg: "No organization found" });

  const event = await Event.findOneAndDelete({ _id: req.params.id, organization: org._id });
  if (!event) return res.status(404).json({ msg: "Event not found" });

  return res.status(200).json({ msg: "Event deleted" });
};

module.exports = { getMyEvents, getOrgEvents, createEvent, updateEvent, deleteEvent };
