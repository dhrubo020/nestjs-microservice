import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
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
const PostModel = model('posts', PostSchema);
export { PostModel };
