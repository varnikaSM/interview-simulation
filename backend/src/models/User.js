import mongoose from "mongoose";

// ✅ Counter Schema for Auto-Incrementing candidateId
const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 1 } 
});

const Counter = mongoose.model("Counter", CounterSchema);

const UserSchema = new mongoose.Schema(
  {
    candidateId: { type: Number, unique: true },  // ✅ candidateId will be auto-incremented
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["candidate", "interviewer"], required: true }
  },
  { timestamps: true }
);

// ✅ Auto-increment candidateId before saving a new user
UserSchema.pre("save", async function (next) {
    if (!this.candidateId) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: "candidateId" },
                { $inc: { value: 1 } },  // Increment candidateId
                { new: true, upsert: true }
            );
            this.candidateId = counter.value;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model("User", UserSchema);
export default User;