const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    const {
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
      createBy,
    } = req.body;

    const newMeeting = new MeetingHistory({
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
      createBy,
    });

    await newMeeting.save();

    res.status(201).json({
      message: "Meeting history created successfully",
      meeting: newMeeting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const index = async (req, res) => {
  try {
    const meetings = await MeetingHistory.find({ deleted: false })
      .populate("attendes", "name email")
      .populate("attendesLead", "name company")
      .populate("createBy", "name email");

    res.status(200).json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const view = async (req, res) => {
  try {
    const meeting = await MeetingHistory.findById(req.params.id)
      .populate("attendes", "name email")
      .populate("attendesLead", "name company")
      .populate("createBy", "name email");

    if (!meeting) {
      return res.status(404).json({ message: "Meeting history not found" });
    }

    res.status(200).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const meeting = await MeetingHistory.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting history not found" });
    }

    meeting.deleted = true;
    await meeting.save();

    res
      .status(200)
      .json({ message: "Meeting history deleted successfully", meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs in the request body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No valid meeting IDs provided" });
    }

    const result = await MeetingHistory.updateMany(
      { _id: { $in: ids }, deleted: false },
      { $set: { deleted: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No meetings found to delete" });
    }

    res.status(200).json({
      message: `${result.modifiedCount} meeting(s) deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
