const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/attendanceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to attendanceDB database");
  })
  .catch((err) => {
    console.error(err);
  });

// Schema for users of app
const LeaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  leaveDays: {
    type: Number,
    required: true,
  },
});

const Leave = mongoose.model("leave", LeaveSchema);
Leave.createIndexes();

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check if the backend is working or not by
  // entering http://localhost:5000

  // If you see "App is working," it means the backend is working properly
});

async function isAlreadyPresent(name, designation) {
  const existingUser = await Leave.findOne({
    name: name,
    designation: designation,
  }).exec();
  return existingUser ? existingUser : null; // Return true if a user with the given name exists, false otherwise
}

async function updateLeaveDays(objectId, newLeaveDays) {
  const result = await Leave.findByIdAndUpdate(
    objectId,
    { leaveDays: newLeaveDays },
    { new: true }
  ).exec();
  return result;
}

app.post("/applyLeave", async (req, resp) => {
  try {
    const max_Leave = 15;
    let result;

    const presentData = await isAlreadyPresent(
      req.body.name,
      req.body.designation
    );

    if (presentData && Object.values(presentData).length > 0) {
      result = await updateLeaveDays(
        presentData._id,
        presentData.leaveDays - req.body.leaveDays
      );
    } else {
      const convertedData = {
        ...req.body,
        leaveDays: max_Leave - req.body.leaveDays,
      };
      const data = new Leave(convertedData);
      result = await data.save();
    }

    result = result.toObject();

    if (result) {
      resp.send(result);
      console.log(result);
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});

app.listen(5000);
