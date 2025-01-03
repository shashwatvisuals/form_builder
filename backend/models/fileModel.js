import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true },
    type: { type: String, default: "file" },
    content: { type: [Object], default: [] },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "file", default: null },
  },
  { timestamps: true }
);

fileSchema.index({ userId: 1, parentId: 1 });

const fileModel = mongoose.models.file || mongoose.model("file", fileSchema);

export default fileModel;



