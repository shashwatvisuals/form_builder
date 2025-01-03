import mongoose from "mongoose";

// const filledFormSchema = new mongoose.Schema(
//   {
//     prototypeFormId: { type: mongoose.Schema.Types.ObjectId, ref: "file", required: false },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
//     formData: { type: Object },
//     responses: [{ elementId: String, response: String }],
//   },
//   { timestamps: true }
// );

// filledFormSchema.index({ prototypeFormId: 1, userId: 1 });

// const filledFormModel = mongoose.models.filledForm || mongoose.model("filledForm", filledFormSchema);


const filledFormSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  sessionId: { type: String, required: true },
  responses: [
    {
      elementId: { type: String, required: true },
      response: { type: String, required: true },
    },
  ],
});

const filledFormModel = mongoose.model("FilledForm", filledFormSchema);
export default filledFormModel;




