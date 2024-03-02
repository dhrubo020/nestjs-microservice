import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const NoteModel = model('posts', PostSchema);
export { NoteModel };
